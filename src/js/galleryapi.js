import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';

export class pixabayApi {
  searchQuery;
  currentPage;
  perPage = 40;

  async getPictures(query) {
    if (query === '') {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (query) {
      this.searchQuery = query;
    }

    const config = {
      params: {
        key: '30371757-a5b40e590621142e63a85b7cd',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.currentPage,
        per_page: this.perPage,
      },
    };

    const response = await axios.get(`${BASE_URL}`, config);
    return response.data;
  }
}
