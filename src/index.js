import './css/styles.css';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 1000;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  clearResultQuery();
  const trimValueOnInput = e.target.value.trim();
  fetchCountries(trimValueOnInput)
    .then(response => {
      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
        );
      }
      if (response.length >= 2 && response.length <= 10) {
        renderSearchMoreCountry(response);
      }
      if (response.length === 1) {
        renderSearchOneCountry(response);
      }
    })
    .catch(error => console.log(error));
}

function renderSearchOneCountry(response) {
  const markup = response
    .map(r => {
      return `<ul>
        <li class="flag_name"><img
  src="${r.flags.svg}"
  alt=""
  width="50"
  height="30"/><h1>${r.name.official}</h1></li>
  <li>
    <p><b>Capital:</b>${r.capital} </p>
    <p><b>Population:</b>${r.population} </p>
    <p><b>Languages:</b>${Object.values(r.languages)} </p> </li>
    </ul>`;
    })
    .join('');
  refs.info.innerHTML = markup;
}

function renderSearchMoreCountry(response) {
  const markup = response
    .map(r => {
      return `<ul>
        <li class="flag_name"><img
  src="${r.flags.svg}"
  alt=""
  width="60"
  height="40"/>
<p class="official_name">${r.name.official} </p> </li>
</ul>`;
    })
    .join('');
  refs.list.innerHTML = markup;
}

function clearResultQuery() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}