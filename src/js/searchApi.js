import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const API_KEY = '32847344-7085d60a6553e128e93a9b9f1';
const URL = `https://pixabay.com/api/`;
export const perPage = 30;

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const axiosParams = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: perPage,
      page: this.page,
    };

      try {
      const response = await axios.get(URL, {
        params: axiosParams,
      });
           
          this.incrementPage();
          return { hits: response.data.hits, totalHits: response.data.totalHits };
    } catch (error) {
      console.log('Error', error.message);
      return Notify.failure(`${error.message}`);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}