let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const sliderInner = document.querySelector('.slider-inner');

function showNextSlide() {
    currentIndex++;
    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    const offset = -currentIndex * document.querySelector('.slide').offsetWidth;;
    sliderInner.style.transform = `translateX(${offset}px)`;
}


setInterval(showNextSlide, 3500);