import axios from 'axios'
import { APP_ID, APP_KEY } from '../config';
// import { Fraction } from 'fractional';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const query_string = `https://api.edamam.com/search?r=http://www.edamam.com/ontologies/edamam.owl%23${this.id}&app_id=${APP_ID}&app_key=${APP_KEY}`

            const res = await axios(query_string);
            const data = res.data[0];
            
            // taking 5 parameters from returned data.
            this.title = data.label;
            this.publisher = data.source;
            this.img = data.image;
            this.source_url = data.url;
            this.ingredients = data.ingredients;
        } catch(error) {
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming we need 15 mins to cook 3 ingredients.
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.serving = 4;
    }

    // change some details in ingredient's name... making it more uniform...
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'tbs', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'cans', 'can', 'c'];
        const unitsShort = ['tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'can', 'can', 'c'];

        const newIngredients = this.ingredients.map(el => {
            // el contains three parameters-> image, text, weight

            // 1) Make units uniform

            let ingredient = el.text.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace('.', '');
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // 2) Remove brackets
            ingredient = ingredient.replace(/[\])}[{(]/g, ''); 

            // 3) Parse ingredients into count, unit and ingredient 
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            // make an object to store the count, unit and ingredients.
            let objIng;

            let count;
            if (unitIndex > -1) {
                // There is a unit
                // arrCount will contains the count before unit Index.
                // eg. 4 1/2 cups => arrCount = [4, 1/2] --> eval("4+1/2")-> 4.5
                const arrCount = arrIng.slice(0, unitIndex);
                
                if (arrCount.length === 1) {
                    if (arrCount[0].length > 1) {
                    // There are some formats that are 1(joined)1/2, therefore, to deal with that we need to add this method.                        
                        count = parseInt(arrIng[0], 10) + 0.5;
                    } else {
                        count = eval(arrIng[0].replace('-', '+'));
                    }
                } else {
                    // this evaluates the provided string with given option
                    try {
                        count = eval(arrIng.slice(0, unitIndex).join('+'));
                    } catch(err) {
                        count = 1;
                    }
                }

                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' '),
                    weight: Math.ceil(el.weight)
                };
            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st element is number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // remove the first element and join rest of ingredients.
                    ingredient: arrIng.slice(1).join(' '),
                    weight: Math.ceil(el.weight)
                }
            } else if (unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: '',
                    // ingredient: ingredient
                    // or just
                    ingredient,
                    weight: Math.ceil(el.weight)
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }


    // if we increase of decrease the servings then quanitity of ing must change.
    updateServings (type) {
        // Servings
        const newServing = type === 'dec' ? this.serving-1: this.serving+1;

        console.log(type)
        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServing / this.serving);
            ing.weight = Math.ceil(ing.weight * (newServing / this.serving));
        });

        console.log(this.ingredients);
        this.serving = newServing;
    }
}