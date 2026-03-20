// Movie data array with at least 8 movies
const movies = [
    {
        title: "The Shawshank Redemption",
        year: 1994,
        rating: "9.3/10",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://tse1.mm.bing.net/th/id/OIP.4VaSguF9FOJxPIKHUM1HaQHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        title: "The Godfather",
        year: 1972,
        rating: "9.2/10",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster: "https://tse2.mm.bing.net/th/id/OIP.BV6gCt1rwqEmjRnWZ-sdPAHaLK?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        title: "The Dark Knight",
        year: 2008,
        rating: "9.0/10",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        poster: "https://tse1.explicit.bing.net/th/id/OIP.LDEPxqWgLlrq9DlAVrfXkwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        title: "Pulp Fiction",
        year: 1994,
        rating: "8.9/10",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        poster: "https://posterspy.com/wp-content/uploads/2018/12/poster.jpg"
    },
    {
        title: "Forrest Gump",
        year: 1994,
        rating: "8.8/10",
        description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
        poster: "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/2928612/5938074/MOVCJ2095__34631.1679584529.jpg?c=2"
    },
    {
        title: "Inception",
        year: 2010,
        rating: "8.8/10",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster: "https://th.bing.com/th/id/R.be7248985232d46128041023c99fad7d?rik=m%2fYm13OWgvgEMQ&riu=http%3a%2f%2fwww.nolanfans.com%2fimages%2fposters%2finception%2fp4xfull.jpg&ehk=fTBnrxgKiU4dJQxZMWXrFmdjr5dpguBG6osjjkLxxPA%3d&risl=1&pid=ImgRaw&r=0"
    },
    {
        title: "The Matrix",
        year: 1999,
        rating: "8.7/10",
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        poster: "https://tse1.explicit.bing.net/th/id/OIP.pv0qJxNou6CvQEHWRIBMSwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        title: "Interstellar",
        year: 2014,
        rating: "8.6/10",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "https://tse2.mm.bing.net/th/id/OIP.VdRRVmYvv-At_vISVHm4_wHaKi?rs=1&pid=ImgDetMain&o=7&rm=3"
    }
];

// DOM elements
const gallery = document.getElementById('gallery');
const searchBar = document.getElementById('search-bar');
const modal = document.getElementById('movie-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalYear = document.getElementById('modal-year');
const modalRating = document.getElementById('modal-rating');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close');

// Function to render the movie gallery
function renderGallery(moviesToShow) {
    gallery.innerHTML = ''; // Clear existing content
    moviesToShow.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-poster';
        movieDiv.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster">
            <div class="movie-title">${movie.title}</div>
        `;
        movieDiv.addEventListener('click', () => openModal(movie));
        gallery.appendChild(movieDiv);
    });
}

// Function to open the modal with movie details
function openModal(movie) {
    modalPoster.src = movie.poster;
    modalTitle.textContent = movie.title;
    modalYear.textContent = `Year: ${movie.year}`;
    modalRating.textContent = `Rating: ${movie.rating}`;
    modalDescription.textContent = movie.description;
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Function to filter movies based on search input
function filterMovies() {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
    );
    renderGallery(filteredMovies);
}

// Event listeners
searchBar.addEventListener('input', filterMovies);
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Initial render of all movies
renderGallery(movies);