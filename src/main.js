import './style.css';

const app = document.querySelector('#app');

app.innerHTML = '<h1>Loading the universe...</h1>';

async function loadAPOD() {
  try {
    const response = await fetch(
      'https://science.nasa.gov/wp-json/wp/v2/apod-basic/'
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    const data = Array.isArray(result) ? result[0] : result;

    if (!data || !data.title) {
      console.log('Unexpected NASA response:', result);
      throw new Error('NASA returned an unexpected data format.');
    }

    const imageUrl = data.hdurl;

    app.innerHTML = `
      <h1>${data.title}</h1>
      <p>${data.date ?? ''}</p>

      ${
        imageUrl
          ? `<img
               src="${imageUrl}"
               alt="${data.alt || data.title}"
               style="max-width:100%; height:auto;"
             >`
          : `<p>Image unavailable for this entry.</p>`
      }

      <p>${data.explanation || ''}</p>
      <a href="${data.permalink}" target="_blank" rel="noopener">
        View on NASA
      </a>
    `;
  } catch (error) {
    console.error(error);
    app.innerHTML = `<h2>Unable to load APOD</h2>
      <p>${error.message}</p>`;
  }
}

loadAPOD();