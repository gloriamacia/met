// Function to trigger the search
async function triggerSearch() {
    await fetchArtworks();
}

// Function to fetch artworks based on the search input
async function fetchArtworks() {
    const inputElement = document.getElementById('searchInput');
    const searchValue = inputElement.value.trim() || inputElement.placeholder;
    console.log(searchValue);
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchValue}`;
    
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        console.log(data.objectIDs);
        
        // Ensure objectIDs is an array
        const objectIDs = Array.isArray(data.objectIDs) ? data.objectIDs : [data.objectIDs];
        
        // Clear previous artworks
        const artworksDiv = document.querySelector('#artworks');
        if (artworksDiv) {
            artworksDiv.innerHTML = '';
        } else {
            console.error('Artworks container not found.');
            return;
        }
        
        // Fetch and display artworks one by one
        for (const objectID of objectIDs) {
            const artwork = await fetchObject(objectID);
            if (artwork && artwork.primaryImageSmall) {
                displayArtworks(artwork);
            }
        }
        
    } catch (error) {
        console.error('There was an error!', error);
    }
}

// Function to fetch a single artwork by its ID
async function fetchObject(objectID) {
    const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    try {
        const response = await fetch(objectUrl);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('The object could not be retrieved!', error);
        return null; // Return null if there's an error
    }
}

// Function to display an artwork
function displayArtworks(artwork) {
    const artworksDiv = document.querySelector('#artworks');
    if (!artworksDiv) return;

    const artworkDiv = document.createElement('div');
    artworkDiv.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'mb-4', 'card'); // Bootstrap classes
    
    // Create and append the image to the artworkDiv
    if (artwork.primaryImageSmall) {
        const image = document.createElement('img');
        image.src = artwork.primaryImageSmall;
        image.alt = artwork.title;
        image.classList.add('card-img-top'); // Bootstrap class for responsive images
        artworkDiv.appendChild(image);
    }
    
    const artworkBodyDiv = document.createElement('div');
    artworkBodyDiv.classList.add('card-body');
    artworkDiv.appendChild(artworkBodyDiv);
    
    // Create and append a headline to the artworkDiv
    const title = document.createElement('h6');
    title.textContent = artwork.title;
    title.classList.add('card-title');
    artworkBodyDiv.appendChild(title);
    
    // Create and append the author to the artworkDiv
    if (artwork.artistDisplayName) {
        const author = document.createElement('p');
        author.textContent = `By: ${artwork.artistDisplayName}`;
        author.classList.add('card-text');
        artworkBodyDiv.appendChild(author);
    }
    
    // Create and append the URL to the source to the artworkDiv
    if (artwork.objectURL) {
        const link = document.createElement('a');
        link.classList.add('btn', 'btn-primary', 'btn-custom', 'mt-2');
        link.href = artwork.objectURL;
        link.textContent = 'Read more';
        link.target = '_blank';
        artworkBodyDiv.appendChild(link);
    }
    
    // Append the artworkDiv to the artworksDiv container
    artworksDiv.appendChild(artworkDiv);
}

// Event listener for the search button click
document.getElementById('searchButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    triggerSearch();
});

// Trigger the search on initial page load
window.addEventListener('load', () => {
    triggerSearch();
});
