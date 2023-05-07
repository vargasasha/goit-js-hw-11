import axios from 'axios';
import Notiflix from 'notiflix';

const refs = {
    form: document.querySelector(".search-form"),
    input: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    btn: document.querySelector(".js-load-more"),
};

let page = 1;

refs.btn.style.display = "none";
refs.form.addEventListener("submit", onSearch);
refs.btn.addEventListener('click', onLoadMore);

function onSearch(evt) {
    evt.preventDefault();

    page = 1;
    refs.gallery.innerHTML = "";

    const name = refs.input.value.trim();

    if (name !== "") {
        pixabay(name);
    } else {
        refs.btn.style.display = "none";

        return Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        );
    }
}

function onLoadMore() {
  const name = refs.input.value.trim();
  page += 1;
  pixabay(name, page);
}

async function pixabay(name, page) {
    const BASE_URL = "https://pixabay.com/api/";

    const options = {
      params: {
        key: '35974006-9154e8a7bbd4a82b458bacded', 
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
      },
    };

    try {
        const response = await axios.get(BASE_URL, options);

        message(
            response.data.hits.length,
            response.data.total
        );

        createMarkup(response.data);
    } catch (error) {
        console.log(error);
    }
}

function createMarkup(arr) {
    const markup = arr.hits
        .map(
            (item) =>
                `<a class="photo-link" href="${item.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
            </div>
        </a>`
        )
        .join("");
    refs.gallery.insertAdjacentHTML("beforeend", markup);
}

function message(length, totalHits) {
    if (length === 0) {
        Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        );
        return;
    }

    if (page === 1) {
        refs.btn.style.display = "flex";

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (length < 40) {
        refs.btn.style.display = "none";

        Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
        );
    }
}