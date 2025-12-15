const searchBox = document.getElementById('searchBox');
const categorySelect = document.getElementById('categorySelect');
const resetFilters = document.getElementById('resetFilters');
const activeFiltersEl = document.getElementById('activeFilters');
const categories = document.querySelectorAll('.category');

const categoryLabels = {
    all: 'All categories',
    whisky: 'Whisky Glasses',
    beer: 'Beer Mugs/Glasses',
    vodka: 'Vodka Glasses',
    wine: 'Wine/Cocktail Glasses',
    water: 'Water Glasses',
    cup: 'Cup Glasses',
    decanters: 'Decanters',
    accessories: 'Bar Accessories',
    sippers: 'Sippers'
};

function handleFilterChange() {
    const searchTerm = searchBox.value.trim().toLowerCase();
    const categoryFilter = categorySelect.value;
    filterProducts(searchTerm, categoryFilter);
    updateStats();
    updateActiveFilters(searchTerm, categoryFilter);
}

searchBox.addEventListener('input', handleFilterChange);
categorySelect.addEventListener('change', handleFilterChange);

if (resetFilters) {
    resetFilters.addEventListener('click', () => {
        searchBox.value = '';
        categorySelect.value = 'all';
        handleFilterChange();
        searchBox.focus();
    });
}

function filterProducts(searchTerm, categoryFilter) {
    categories.forEach(category => {
        const categoryName = category.dataset.category;
        const cards = category.querySelectorAll('.product-card');
        let hasVisibleProducts = false;

        const categoryMatch = categoryFilter === 'all' || categoryName === categoryFilter;
        category.style.display = categoryMatch ? 'block' : 'none';

        if (!categoryMatch) {
            return;
        }

        cards.forEach(card => {
            const nameEl = card.querySelector('.product-name');
            if (!nameEl.dataset.rawName) {
                nameEl.dataset.rawName = nameEl.textContent.trim();
            }

            const rawName = nameEl.dataset.rawName;
            const matchesSearch = !searchTerm || rawName.toLowerCase().includes(searchTerm);

            if (matchesSearch) {
                card.style.display = 'block';
                hasVisibleProducts = true;
                highlightMatch(nameEl, searchTerm);
            } else {
                card.style.display = 'none';
                highlightMatch(nameEl, '');
            }
        });

        category.style.display = hasVisibleProducts ? 'block' : 'none';
    });
}

function highlightMatch(nameEl, term) {
    const raw = nameEl.dataset.rawName || nameEl.textContent;
    if (!term) {
        nameEl.innerHTML = raw;
        return;
    }
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    nameEl.innerHTML = raw.replace(regex, '<mark>$1</mark>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateActiveFilters(searchTerm, categoryFilter) {
    if (!activeFiltersEl) return;

    const filters = [];
    if (categoryFilter && categoryFilter !== 'all') {
        filters.push(categoryLabels[categoryFilter] || categoryFilter);
    }
    if (searchTerm) {
        filters.push(`“${searchTerm}”`);
    }

    activeFiltersEl.textContent = filters.length
        ? `Filtering by ${filters.join(' · ')}`
        : 'Showing all products';
}

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

document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    handleFilterChange();
});

function lazyLoadImages() {
    document.querySelectorAll('.product-card img').forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
    });
}

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
