export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector(".search__field"),
    searchRes: document.querySelector(".results"),
    searchResultList: document.querySelector(".results__list"),
    searchResPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

// render the spinner loader
export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
};


// clear the spinner loader
export const clearLoader = () => {
    const loader = document.querySelector(".loader");
    if (loader)
        loader.parentElement.removeChild(loader);
};