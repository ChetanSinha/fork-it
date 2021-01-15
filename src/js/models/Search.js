import axios from 'axios';
import {APP_ID, APP_KEY } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const query_string = `https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&to=30`;

            const result = await axios(query_string);
            // console.log(result);
            this.recipes = result.data.hits;
            // console.log(this.recipes);
        } catch (error) {
            alert(error);
        }
    }

}
