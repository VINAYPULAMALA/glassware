// Search functionality
const searchBox = document.getElementById('searchBox');
const categorySelect = document.getElementById('categorySelect');
const productCards = document.querySelectorAll('.product-card');
const categories = document.querySelectorAll('.category');

// Search input handler
searchBox.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterProducts(searchTerm, categorySelect.value);
    updateStats();
});

// Dropdown filter handler
categorySelect.addEventListener('change', function() {
    const categoryFilter = this.value;
    filterProducts(searchBox.value.toLowerCase(), categoryFilter);
    updateStats();
});

// Filter products based on search and category
function filterProducts(searchTerm, categoryFilter) {
    categories.forEach(category => {
        const categoryName = category.dataset.category;
        let hasVisibleProducts = false;
        const cards = category.querySelectorAll('.product-card');

        // Check if category should be shown
        const categoryMatch = categoryFilter === 'all' || categoryName === categoryFilter;

        if (!categoryMatch) {
            category.style.display = 'none';
            return;
        }

        cards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'block';
                hasVisibleProducts = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide category if no products match
        category.style.display = hasVisibleProducts ? 'block' : 'none';
    });
}

// Update statistics
function updateStats() {
    let visibleProducts = 0;
    let visibleCategories = 0;

    categories.forEach(category => {
        const isVisible = category.style.display !== 'none';
        if (isVisible) {
            visibleCategories++;
            const cards = category.querySelectorAll('.product-card');
            cards.forEach(card => {
                if (card.style.display !== 'none') {
                    visibleProducts++;
                }
            });
        }
    });

    const productCountEl = document.getElementById('productCount');
    const categoryCountEl = document.getElementById('categoryCount');

    if (productCountEl) productCountEl.textContent = visibleProducts;
    if (categoryCountEl) categoryCountEl.textContent = visibleCategories;
}

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize stats on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
});

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
