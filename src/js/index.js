import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { pixabayApi } from './galleryapi';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.is-hidden'),
};
const galleryApi = new pixabayApi();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  const query = evt.target.elements.searchQuery.value;

  galleryApi.currentPage = 1;
  galleryApi
    .getPictures(query)
    .then(data => {
      if (data.hits.length === 0) {
        clearGallery(refs.gallery);
        hiddenBtn();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      clearGallery(refs.gallery);
      hiddenBtn();

      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      addMarkupToGallery(data.hits);
      new SimpleLightbox('.gallery__largephoto');
    })
    .catch(evt => Notify.failure(evt.message));
}

function onLoadMoreBtnClick() {
  galleryApi.currentPage += 1;
  galleryApi.getPictures().then(data => {
    addMarkupToGallery(data.hits);
    initScroll();

    if (galleryApi.currentPage * galleryApi.perPage > data.totalHits) {
      hiddenBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function addMarkupToGallery(obj) {
  const markup = obj
    .map(it => {
      return createMarkup(
        it.webformatURL,
        it.largeImageURL,
        it.tags,
        it.likes,
        it.views,
        it.comments,
        it.downloads
      );
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  showBtn();
  return;
}

function createMarkup(imgSmall, imgLarge, tag, like, view, comment, download) {
  return `<div class="gallery__card">
  <a class="gallery__largephoto" href="${imgLarge}">
  <div class="gallery__box">
  <img class="gallery__img"src="${imgSmall}" alt="${tag}" loading="lazy"/>
</div>
      </a>
      <div class="gallery__info">
        <p class="gallery__item">
          <b>Likes</b> ${like}
        </p>
        <p class="gallery__item">
          <b>Views</b> ${view}
        </p>
        <p class="gallery__item">
          <b>Comments</b> ${comment}
        </p>
        <p class="gallery__item">
          <b>Downloads</b> ${download}
        </p>
      </div>
    </div>`;
}

function clearGallery(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function hiddenBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.loadMoreBtn.classList.remove('load-more');
}

function showBtn() {
  refs.loadMoreBtn.classList.add('load-more');
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function initScroll() {
  const rect = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: rect.height * 2.4,
    behavior: 'smooth',
  });
}
