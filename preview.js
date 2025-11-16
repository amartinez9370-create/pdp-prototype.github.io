// Collect all gallery images into an array
const galleryImages = Array.from(document.querySelectorAll('.gallery img'));

galleryImages.forEach(img => {
  img.addEventListener('click', () => openPreview(img.getAttribute('src')));
});

// Create overlay with next/prev controls
const previewOverlay = document.createElement('div');
previewOverlay.id = 'previewOverlay';
previewOverlay.innerHTML = `
  <div class="preview-content">
    <span class="close-btn">&times;</span>
    <span class="prev-btn">&#10094;</span>
    <img src="" alt="Preview Image" id="previewImage">
    <span class="next-btn">&#10095;</span>
  </div>
`;
document.body.appendChild(previewOverlay);

const previewImage = document.getElementById('previewImage');
const closeBtn = previewOverlay.querySelector('.close-btn');
const prevBtn = previewOverlay.querySelector('.prev-btn');
const nextBtn = previewOverlay.querySelector('.next-btn');

let currentIndex = 0;

// Open preview
function openPreview(src) {
  // currentIndex = galleryImages.findIndex(img => img.src === src);
  currentIndex = galleryImages.findIndex(img => img.getAttribute('src') === src);

  previewImage.src = src;
  previewOverlay.style.display = 'flex';
}

// Close preview
function closePreview() {
  previewOverlay.style.display = 'none';
}

closeBtn.addEventListener('click', closePreview);
previewOverlay.addEventListener('click', (e) => {
  if (e.target === previewOverlay) closePreview();
});

// Navigate next/prev
function showImage(index) {
  if (index < 0) index = galleryImages.length - 1; // wrap to last
  if (index >= galleryImages.length) index = 0; // wrap to first
  currentIndex = index;
  previewImage.src = galleryImages[currentIndex].src;
}

nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
prevBtn.addEventListener('click', () => showImage(currentIndex - 1));

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (previewOverlay.style.display === 'flex') {
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'Escape') closePreview();
  }
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Auto-close hamburger menu when clicking outside
document.addEventListener('click', (event) => {
  const isClickInside = hamburger.contains(event.target) || navLinks.contains(event.target);
  if (!isClickInside && navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
  }
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});



// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});




// === TESTIMONIAL CAROUSEL (Google Sheets Connected) ===

const carouselContainer = document.querySelector(".carousel-container");
if (carouselContainer) {

  // Google Sheet published CSV link
  // const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNwE-_eZj9WP_pphSHsxKzyQwbFUny6-u3hWTCeYE-nYFkPq3-X3XF4h7QQY0qjurOK95iHLhqiBla/pub?output=csv";
  const sheetURL = "assets/site/Service Review for Paciente Dental Pod.csv";

  let testimonials = [];
  const container = document.getElementById("carousel-container");
  let index = 0;
  let interval;

  // Load data from Google Sheets
  fetch(sheetURL)
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split("\n").slice(1); // skip headers
      testimonials = rows
        .map(row => {
          const [name, service, review, rating] = row.split(",");
          return { name, service, review, rating: parseInt(rating || 0) };
        })
        .filter(t => t.review && t.name); // ignore empty rows

      initCarousel();
    })
    .catch(error => console.error("Error loading testimonials:", error));

  // Initialize carousel
  function initCarousel() {
    if (!testimonials.length) {
      container.innerHTML = "<p>No testimonials available at the moment.</p>";
      return;
    }

    container.innerHTML = testimonials
      .map(
        t => `
      <div class="testimonial">
        <p>"${t.review.trim()}"</p>
        <h3 class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</h3>
        <br>
        <p><strong>${t.name.trim()}</strong> &nbsp ${t.service.trim()}</p>
      </div>
    `
      )
      .join("");

    startAutoSlide();
  }

  // Slide control
  function showSlide(i) {
    if (i < 0) index = testimonials.length - 1;
    else if (i >= testimonials.length) index = 0;
    else index = i;

    container.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    showSlide(index + 1);
  }
  function prevSlide() {
    showSlide(index - 1);
  }

  // Auto-slide setup
  function startAutoSlide() {
    stopAutoSlide();
    interval = setInterval(nextSlide, 8000);
  }
  function stopAutoSlide() {
    if (interval) clearInterval(interval);
  }

  // Pause auto-slide when hovering over the carousel
  const carousel = document.querySelector("#testimonials .carousel");

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);


  // Navigation buttons
  document
    .querySelector("#testimonials .next-btn")
    .addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  document
    .querySelector("#testimonials .prev-btn")
    .addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });

}

// === FAQ TOGGLE INTERACTION ===
document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  // only run if FAQ questions exist on the page
  if (faqQuestions.length > 0) {
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        question.classList.toggle("active");
        answer.classList.toggle("open");
      });
    });
  }
});



// // === ABOUT IMAGE SLIDES (CLINIC)===
// document.addEventListener("DOMContentLoaded", function () {
//   // Select the image element
//   const aboutImage = document.getElementById("aboutImage");

//   // List of image file paths to cycle through
//   const aboutImages = [
//     "assets/images/clinic_02.png",
//     "assets/images/clinic_03.png",
//     "assets/images/clinic_reception.png"
//   ];

//   let currentIndex = 0;

//   // Function to change the image with fade effect
//   function changeAboutImage() {
//     aboutImage.classList.add("fade-out");

//     // Wait for fade-out to complete
//     setTimeout(() => {
//       currentIndex = (currentIndex + 1) % aboutImages.length;
//       aboutImage.src = aboutImages[currentIndex];

//       aboutImage.classList.remove("fade-out");
//       aboutImage.classList.add("fade-in");

//       // Remove fade-in class after animation
//       setTimeout(() => aboutImage.classList.remove("fade-in"), 500);
//     }, 500);
//   }

//   // Change image every 6 seconds
//   setInterval(changeAboutImage, 8000);
// });


// // === ABOUT IMAGE SLIDES (DENTIST)===
// document.addEventListener("DOMContentLoaded", function () {
//   // Select the image element
//   const aboutImageD = document.getElementById("aboutImageDentist");

//   // List of image file paths to cycle through
//   const aboutImages2 = [
//     "assets/images/bernadette-paciente-2.png",
//     "assets/images/bernadette-paciente-1.png"
//   ];

//   let currentIndex2 = 0;

//   // Function to change the image with fade effect
//   function changeAboutImageDentist() {
//     aboutImageD.classList.add("fade-out");

//     // Wait for fade-out to complete
//     setTimeout(() => {
//       currentIndex2 = (currentIndex2 + 1) % aboutImages2.length;
//       aboutImageD.src = aboutImages2[currentIndex2];

//       aboutImageD.classList.remove("fade-out");
//       aboutImageD.classList.add("fade-in");

//       // Remove fade-in class after animation
//       setTimeout(() => aboutImageD.classList.remove("fade-in"), 500);
//     }, 500);
//   }

//   // Change image every 6 seconds
//   setInterval(changeAboutImageDentist, 3000);
// });

document.addEventListener("DOMContentLoaded", function () {
  const slides = [
    {
      el: document.getElementById("aboutImageClinic"),
      images: [
        "assets/images/clinic_02.png",
        "assets/images/clinic_03.png",
        "assets/images/clinic_reception.png"
      ],
      interval: 8000,
      currentIndex: 0
    },
    {
      el: document.getElementById("aboutImageDentist"),
      images: [
        "assets/images/bernadette-paciente-2.png",
        "assets/images/bernadette-paciente-1.png"
      ],
      interval: 8000,
      currentIndex: 0
    }
  ];

  slides.forEach(slide => {
    setInterval(() => {
      slide.el.classList.add("fade-out");
      setTimeout(() => {
        slide.currentIndex = (slide.currentIndex + 1) % slide.images.length;
        slide.el.src = slide.images[slide.currentIndex];
        slide.el.classList.remove("fade-out");
        slide.el.classList.add("fade-in");
        setTimeout(() => slide.el.classList.remove("fade-in"), 500);
      }, 500);
    }, slide.interval);
  });
});
