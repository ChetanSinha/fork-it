import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

// Global state of the app
//  -> search object
//  -> current recipe object
//  -> shopping list object
//  liked recipes

const state = {};

// =================== SEARCH CONTROLLER =========================
const controlSearch = async () => {
    // 1) Get the query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        // -> (i) clear the search input bar
        // -> (ii) clear the result area.
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipies
            await state.search.getResults();
            
            // clear the spinning loader after result has been fetched.
            clearLoader();

            // 5) Render results on UI
            searchView.renderResults(state.search.recipes);
        } catch (err) {
            alert('Something went wrong :(');
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// ============= HANDLE SEARCH RESULT PAGES ======================
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        // get page number to go next using dataset method
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        // now pass on the page number to go to render in display
        searchView.renderResults(state.search.recipes, goToPage);
    }
}); 


// =================== RECIPE CONTROLLER ======================
const controlRecipe = async () => {
    // 1.) GET ID FROM URL
    
    // get the ID part from the hash change object
    // replace '#' with nothing so that we just have the numerical part.
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 2.) PREPARE UI FOR CHANGES
        recipeView.clearRecipeResults();
        renderLoader(elements.recipe);

        // 3.) CREATE NEW RECIPE OBJECT
        state.recipe = new Recipe(id);

        if (state.search)
            searchView.highlightSelected(id);
        
            try {
            // 4.) GET RECIPE DATA
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // 5.) CALC SERVING AND TIME
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 6.) CLEAR THE LOADER AND RESULT
            clearLoader();
            // console.log(state.recipe);
            // 7. RENDER RECIPE
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            console.log(err);
            alert('error in processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe); 
// window.addEventListener('load', controlRecipe);

// OR

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER ======================================================
const controlList = () => {
    // Create a new list if none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from list
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        // handle the count update.
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});
// ========================================================================


// RESTORE LIKED RECIPE ON PAGE LOAD
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like display button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    // state dict. has "likes" key and this key has "likes" list
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// LIKE CONTROLLER =========================================================
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );

        // toggle the button    
        likesView.toggleLikes(true);
        // add like to UI list
        likesView.renderLike(newLike);
    } else {
        // user has liked the current recipe
        // remove like from the state
        state.likes.deleteLike(currentId);

        // toggle the like button
        likesView.toggleLikes(false);
        // remove like from UI list and list
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Handling recipe button clicks...
// since there is no button before selecting a recipe, therefore, 
// we need to add event listner to recipe which is present initially.
// once the selected recipe is loaded we can add explicit listners to each of the events we want.
elements.recipe.addEventListener('click', e => {
    // if the target matches decrease servings button
    // * <-- sign after a class name denotes, either given class or its children
    // therefore, here it will either select btn-decrease or its childeren
    if (e.target.matches('.btn--decrease, .btn--decrease *')) {
        // decrease serving button is clicked

        if (state.recipe.serving > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn--increase, .btn--increase *')) {
        // increase serving button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Adds ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

