import { elements, renderLoader } from './base';

export const getInput = () => elements.searchInput.value;


// clear the search input bar, after every result.
export const clearInput = () => {
    elements.searchInput.value = '';
};

// clear the result list so that new search result can be displayed now.
export const clearResults = () => {
    // this makes the HTML there to null
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

// removes highlight for selected item and adds to the newly selected item.
export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    
    let ResultIdMatched = false;
    resultArr.forEach(el => {
        // console.log(el);
        el.classList.remove('results__link--active');
        if (el.href.split('/')[3] === '#'+id) {
            ResultIdMatched = true;
        }
    });

    // This selects results__link class of given id.
    // We'll add active if and only if the result is matched with any result link.
    if (ResultIdMatched) {
        document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
    }

    ResultIdMatched = false;
};

// puts limit to the size of the tile of a dish
const limitRecipeTitle = (title, limit = 20) => {
    if (title.length > limit) {
        const newTitle = [];
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
}

// get ID from given URI(uniform resource identifier)
const getID = (uri) => {
    const el1 = uri.split("/");
    const el2 = el1[el1.length-1].split("#");
    return el2[el2.length-1];
}


// renders the recipe to display
const renderRecipe = recipe_el => {

    const dish = recipe_el.recipe;
    const ID = getID(dish.uri);

    // console.log(ID);
    // console.log(recipe_el);

    // add this HTML to the result list
    const markup = `
        <li>
            <a class="results__link" href="#${ID}">
                <figure class="results__fig">
                    <img src="${dish.image}" alt="${dish.label}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(dish.label)}</h4>
                    <p class="results__author">${dish.source}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left':'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
    </button>
    `;

// adds the page button based on the page number using createButton func.
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // only one button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // two buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // only one button to go prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// Driver function of this file.
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;

    // passes each recipe to the renderRecipe function
    recipes.slice(start, end).forEach(renderRecipe);

    // render the page buttons 
    renderButtons(page, recipes.length, resPerPage);
};
