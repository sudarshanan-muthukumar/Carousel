
const carousel = document.querySelector('.carousel');
const slidesContainer = carousel.querySelector('.slides');
const paginationContainer = carousel.querySelector('.pagination');
const pageSize = 1; // Number of slides per page
let currentPage = 0;
let carouselData = [];

async function buildCarousel() {
  try {
    const response = await fetch('https://reqres.in/api/users');
    const apiData = await response.json();
    carouselData = apiData.data;

    // Build slides
    const slides = carouselData.map((slide) =>  `
      <div class="slide">
        <div class="image-container">
          <img src="${slide.avatar}" alt="${slide.first_name}">
          <div class="image-overlay"><br><br>First name: ${slide.first_name}<br><br>Last name: ${slide.last_name}<br><br>Email: ${slide.email}</div>
        </div>
      </div>
    `);
    
    slidesContainer.innerHTML = slides.join('');

    // Build pagination dots
    const totalPages = Math.ceil(carouselData.length / pageSize);
    const dots = Array.from({ length: totalPages }, (_, index) => `
      <div class="dot${index === 0 ? ' active' : ''}" data-page="${index}"></div>
    `);

    paginationContainer.innerHTML = dots.join('');

    // Add event listeners to dots
    const paginationDots = Array.from(paginationContainer.children);
    paginationDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const page = parseInt(dot.getAttribute('data-page'));
        goToPage(page);
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function goToPage(page) {
  const slideWidth = carousel.offsetWidth;
  slidesContainer.style.transform = `translateX(-${slideWidth * page}px)`;

  const paginationDots = Array.from(paginationContainer.children);
  paginationDots.forEach((dot) => dot.classList.remove('active'));
  paginationDots[page].classList.add('active');

  currentPage = page;
}

function goToNextPage() {
  const totalPages = Math.ceil(carouselData.length / pageSize);
  const nextPage = (currentPage + 1) % totalPages;
  goToPage(nextPage);
}

function goToPreviousPage() {
  const totalPages = Math.ceil(carouselData.length / pageSize);
  const previousPage = (currentPage - 1 + totalPages) % totalPages;
  goToPage(previousPage);
}

(async () => {
  await buildCarousel();

  // Event listeners for arrow navigation
  const leftArrow = carousel.querySelector('.arrow.left');
  const rightArrow = carousel.querySelector('.arrow.right');
  leftArrow.addEventListener('click', goToPreviousPage);
  rightArrow.addEventListener('click', goToNextPage);
})();