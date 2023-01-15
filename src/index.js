// 32847344-7085d60a6553e128e93a9b9f1
import { NotifyMessage, errorMessage } from './js/notify';
import { ImagesApiService, perPage } from './js/searchApi';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/markup';
import { up } from './js/page-scroll';

refs.searchForm.addEventListener('submit', onSearch);
refs.btnUp.addEventListener('click', up);

const imagesServise = new ImagesApiService(); 
let gallery = new SimpleLightbox('.gallery a'); 
const notify = new NotifyMessage(); 

const optionsObserver = {
  root: null,
  rootMargin: '350px',
  threshold: 1,
};

const observer = new IntersectionObserver(handleIntersect, optionsObserver); 
const observerLastElem = new IntersectionObserver(
  handleIntersectLastElem,
  optionsObserver
);

observer.observe(refs.loading);

function onSearch(e) {
  e.preventDefault();

  imagesServise.query = e.currentTarget.elements.searchQuery.value;

  if (!imagesServise.query) {
    return notify.showFailureMessage(errorMessage);
  }

  imagesServise.resetPage();
  
  imagesServise.fetchImages().then(handleSearchResult);
}

function handleSearchResult(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  clearImagesContainer();
  if (hits.length === 0) {
    return notify.showFailureMessage(errorMessage);
  }
  showImagesList(hits);
  notify.showSuccessMessage(`Found ${totalHits} images.`);

  isEndOfPage(totalHits); 

  gallery.refresh(); 
}

function onLoadMore() {
  imagesServise.fetchImages().then(handleLoadMore);
}

function handleLoadMore(data) {
  if (!data) return;
  const { hits, totalHits } = data;

  showImagesList(hits);
  gallery.refresh(); 

  const isLastPage = imagesServise.page - 1 === Math.ceil(totalHits / perPage);
  if (isLastPage) {
    observerLastElem.observe(refs.galleryContainer.lastElementChild); 
  }
}

function showImagesList(images) {
  const markup = createMarkup(images);
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function isEndOfPage(totalHits) {
  const isLastPage = imagesServise.page - 1 === Math.ceil(totalHits / perPage);
  if (isLastPage) {
    notify.showInfoMessage();
  }
}

function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesServise.query) {
      onLoadMore();
    }
  });
}
function handleIntersectLastElem(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      notify.showInfoMessage();
      observer.unobserve(refs.loader);
    }
  });
}