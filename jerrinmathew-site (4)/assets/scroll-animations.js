// Fade in elements on scroll
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation completes
        setTimeout(() => observer.unobserve(entry.target), 600);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all .card and .fade-in elements
  document.querySelectorAll('.card, .pricing-card, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Count up animation for numbers
function countUp(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  observeElements();
  
  // Find all elements with data-count-up and animate them
  const countUpElements = document.querySelectorAll('[data-count-up]');
  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const target = parseInt(entry.target.dataset.countUp);
        countUp(entry.target, target);
        entry.target.dataset.counted = 'true';
        countUpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  countUpElements.forEach(el => countUpObserver.observe(el));
});
