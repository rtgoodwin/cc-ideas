'use strict';

import storage from './modules/storage.js';

// Application State
const App = {
    collection: [],
    themes: [],
    popularSets: [],
    currentView: 'welcome',
    filters: {
        search: '',
        theme: 'all',
        status: 'all',
        sort: 'date-desc'
    },
    selectedSet: null
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        // Initialize IndexedDB
        await storage.init();

        // Load data
        await loadStaticData();
        await loadCollection();

        // Setup event listeners
        setupEventListeners();

        // Initial render
        render();
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Failed to initialize app', 'error');
    }
}

async function loadStaticData() {
    try {
        const response = await fetch('./data/sets.json');
        const data = await response.json();
        App.themes = data.themes;
        App.popularSets = data.popularSets;

        // Populate theme filter
        populateThemeFilter();
    } catch (error) {
        console.error('Failed to load static data:', error);
    }
}

async function loadCollection() {
    try {
        App.collection = await storage.getCollection();
    } catch (error) {
        console.error('Failed to load collection:', error);
    }
}

function populateThemeFilter() {
    const themeFilter = document.getElementById('themeFilter');
    App.themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeFilter.appendChild(option);
    });
}

function setupEventListeners() {
    // Navigation
    document.getElementById('statsBtn').addEventListener('click', showStats);
    document.getElementById('addFirstSetBtn').addEventListener('click', openAddSetModal);
    document.getElementById('addSetBtn').addEventListener('click', openAddSetModal);

    // Add Set Modal
    document.getElementById('scanBarcodeBtn').addEventListener('click', openScanner);
    document.getElementById('manualEntryBtn').addEventListener('click', openManualEntry);
    document.getElementById('browsePopularBtn').addEventListener('click', openBrowsePopular);

    // Scanner Modal
    document.getElementById('manualCodeBtn').addEventListener('click', () => {
        closeModal('scannerModal');
        openManualEntry();
    });

    // Forms
    document.getElementById('manualEntryForm').addEventListener('submit', handleManualEntry);
    document.getElementById('purchaseInfoForm').addEventListener('submit', handlePurchaseInfo);

    // Filters and Search
    document.getElementById('searchInput').addEventListener('input', Utils.debounce(handleSearch, 300));
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('themeFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

function render() {
    if (App.collection.length === 0) {
        showWelcomeScreen();
    } else {
        showCollectionView();
    }
}

function showWelcomeScreen() {
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('collectionView').style.display = 'none';
    document.getElementById('addSetBtn').style.display = 'none';
    App.currentView = 'welcome';
}

function showCollectionView() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('collectionView').style.display = 'block';
    document.getElementById('addSetBtn').style.display = 'flex';
    App.currentView = 'collection';

    updateSummaryCards();
    renderSetsGrid();
}

function updateSummaryCards() {
    const totalSets = App.collection.length;
    const totalValue = App.collection.reduce((sum, item) => {
        const currentValue = item.currentValue || item.retailPrice;
        return sum + currentValue;
    }, 0);
    const totalPurchaseValue = App.collection.reduce((sum, item) => sum + item.purchasePrice, 0);
    const valueChange = totalValue - totalPurchaseValue;
    const valueChangePercent = totalPurchaseValue > 0 ? ((valueChange / totalPurchaseValue) * 100).toFixed(1) : 0;

    const totalPieces = App.collection.reduce((sum, item) => sum + (item.pieces || 0), 0);
    const totalMinifigs = App.collection.reduce((sum, item) => sum + (item.minifigs || 0), 0);

    document.getElementById('totalSets').textContent = totalSets;
    document.getElementById('totalValue').textContent = Utils.formatCurrency(totalValue);
    document.getElementById('totalPieces').textContent = Utils.formatNumber(totalPieces);
    document.getElementById('totalMinifigs').textContent = totalMinifigs;

    const valueChangeEl = document.getElementById('valueChange');
    const changeSymbol = valueChange >= 0 ? '↑' : '↓';
    valueChangeEl.textContent = `${changeSymbol} ${Utils.formatCurrency(Math.abs(valueChange))} (${valueChangePercent}%)`;
    valueChangeEl.className = valueChange >= 0 ? 'summary-change positive' : 'summary-change negative';
}

function renderSetsGrid() {
    const grid = document.getElementById('setsGrid');
    const emptyState = document.getElementById('emptyState');

    // Filter and sort collection
    let filteredCollection = filterCollection();
    filteredCollection = sortCollection(filteredCollection);

    if (filteredCollection.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = filteredCollection.map(item => createSetCard(item)).join('');

    // Add click listeners to set cards
    grid.querySelectorAll('.set-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            showSetDetails(id);
        });
    });
}

function filterCollection() {
    return App.collection.filter(item => {
        // Search filter
        if (App.filters.search) {
            const searchLower = App.filters.search.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(searchLower) ||
                item.setNumber.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Theme filter
        if (App.filters.theme !== 'all' && item.theme !== App.filters.theme) {
            return false;
        }

        // Status filter
        if (App.filters.status !== 'all' && item.condition !== App.filters.status) {
            return false;
        }

        return true;
    });
}

function sortCollection(collection) {
    const sorted = [...collection];

    switch (App.filters.sort) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'value-desc':
            return sorted.sort((a, b) => (b.currentValue || b.retailPrice) - (a.currentValue || a.retailPrice));
        case 'value-asc':
            return sorted.sort((a, b) => (a.currentValue || a.retailPrice) - (b.currentValue || b.retailPrice));
        case 'pieces-desc':
            return sorted.sort((a, b) => (b.pieces || 0) - (a.pieces || 0));
        default:
            return sorted;
    }
}

function createSetCard(item) {
    const currentValue = item.currentValue || item.retailPrice;
    const valueChange = currentValue - item.purchasePrice;
    const valueChangePercent = ((valueChange / item.purchasePrice) * 100).toFixed(1);

    const themeName = App.themes.find(t => t.id === item.theme)?.name || item.theme;

    return `
        <div class="set-card" data-id="${item.id}">
            <div class="set-image">
                🧱
            </div>
            <div class="set-content">
                <div class="set-number">#${item.setNumber}</div>
                <div class="set-name">${item.name}</div>
                <div class="set-theme">${themeName}</div>
                <div class="set-meta">
                    <span>${item.pieces} pieces</span>
                    ${item.minifigs ? `<span>• ${item.minifigs} figs</span>` : ''}
                </div>
                <div class="set-value">${Utils.formatCurrency(currentValue)}</div>
                <span class="set-badge badge-${item.condition}">${item.condition}</span>
            </div>
        </div>
    `;
}

function handleSearch(e) {
    App.filters.search = e.target.value;
    renderSetsGrid();
}

function handleSort(e) {
    App.filters.sort = e.target.value;
    renderSetsGrid();
}

function handleFilter(e) {
    const filterType = e.target.id === 'themeFilter' ? 'theme' : 'status';
    App.filters[filterType] = e.target.value;
    renderSetsGrid();
}

function clearFilters() {
    App.filters = {
        search: '',
        theme: 'all',
        status: 'all',
        sort: 'date-desc'
    };

    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'date-desc';
    document.getElementById('themeFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';

    renderSetsGrid();
}

// Modal Functions
function openAddSetModal() {
    showModal('addSetModal');
}

function openScanner() {
    closeModal('addSetModal');
    showModal('scannerModal');
    simulateScanning();
}

function simulateScanning() {
    // Simulate a barcode scan after 2 seconds
    setTimeout(() => {
        const randomSet = App.popularSets[Math.floor(Math.random() * App.popularSets.length)];
        closeModal('scannerModal');
        showSetLookupResult(randomSet);
    }, 2000);
}

function openManualEntry() {
    closeModal('addSetModal');
    showModal('manualEntryModal');
}

function openBrowsePopular() {
    closeModal('addSetModal');
    renderPopularSets();
    showModal('browsePopularModal');
}

function renderPopularSets() {
    const grid = document.getElementById('popularSetsGrid');
    grid.innerHTML = App.popularSets.map(set => createPopularSetItem(set)).join('');

    grid.querySelectorAll('.popular-set-item').forEach(item => {
        item.addEventListener('click', () => {
            const setNumber = item.dataset.setNumber;
            const set = App.popularSets.find(s => s.setNumber === setNumber);
            closeModal('browsePopularModal');
            showSetLookupResult(set);
        });
    });
}

function createPopularSetItem(set) {
    const themeName = App.themes.find(t => t.id === set.theme)?.name || set.theme;

    return `
        <div class="popular-set-item" data-set-number="${set.setNumber}">
            <div class="popular-set-image">🧱</div>
            <div class="popular-set-info">
                <div class="popular-set-number">#${set.setNumber}</div>
                <div class="popular-set-name">${set.name}</div>
                <div class="popular-set-meta">${themeName} • ${set.pieces} pieces</div>
            </div>
        </div>
    `;
}

async function handleManualEntry(e) {
    e.preventDefault();

    const setNumber = document.getElementById('setNumber').value.trim();

    // Look up set in popular sets
    const set = App.popularSets.find(s => s.setNumber === setNumber);

    if (set) {
        closeModal('manualEntryModal');
        showSetLookupResult(set);
    } else {
        showToast('Set not found. Try browsing popular sets or check the set number.', 'error');
    }
}

function showSetLookupResult(set) {
    App.selectedSet = set;

    // Show set details and purchase info form
    document.getElementById('setDetailsTitle').textContent = `${set.name}`;

    const content = document.getElementById('setDetailsContent');
    content.innerHTML = `
        <div class="set-details-header">
            <div class="set-details-image">
                <div class="set-details-image-placeholder">🧱</div>
            </div>
            <div class="set-details-info">
                <div class="set-details-number">Set #${set.setNumber}</div>
                <div class="set-details-name">${set.name}</div>
                <div class="set-details-meta">
                    <div class="meta-item">
                        <span class="meta-label">Theme</span>
                        <span class="meta-value">${App.themes.find(t => t.id === set.theme)?.name || set.theme}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Pieces</span>
                        <span class="meta-value">${Utils.formatNumber(set.pieces)}</span>
                    </div>
                    ${set.minifigs ? `
                    <div class="meta-item">
                        <span class="meta-label">Minifigures</span>
                        <span class="meta-value">${set.minifigs}</span>
                    </div>
                    ` : ''}
                    <div class="meta-item">
                        <span class="meta-label">Release Year</span>
                        <span class="meta-value">${set.releaseYear}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Retail Price</span>
                        <span class="meta-value">${Utils.formatCurrency(set.retailPrice)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Current Value</span>
                        <span class="meta-value">${Utils.formatCurrency(set.currentValue)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Status</span>
                        <span class="meta-value">${set.retired ? '🔴 Retired' : '🟢 Available'}</span>
                    </div>
                </div>
            </div>
        </div>
        <button id="addToCollectionBtn" class="btn btn-primary btn-block">Add to Collection</button>
    `;

    showModal('setDetailsModal');

    document.getElementById('addToCollectionBtn').addEventListener('click', () => {
        closeModal('setDetailsModal');
        openPurchaseInfoModal();
    });
}

function openPurchaseInfoModal() {
    // Pre-fill purchase price with retail price
    document.getElementById('purchaseSetNumber').value = App.selectedSet.setNumber;
    document.getElementById('purchasePrice').value = App.selectedSet.retailPrice;
    document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];

    showModal('purchaseInfoModal');
}

async function handlePurchaseInfo(e) {
    e.preventDefault();

    const setNumber = document.getElementById('purchaseSetNumber').value;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const purchaseDate = document.getElementById('purchaseDate').value;
    const purchaseLocation = document.getElementById('purchaseLocation').value;
    const condition = document.getElementById('condition').value;
    const notes = document.getElementById('notes').value;

    try {
        // Add to collection
        const collectionItem = {
            ...App.selectedSet,
            purchasePrice,
            purchaseDate,
            purchaseLocation,
            condition,
            notes
        };

        await storage.addToCollection(collectionItem);
        await storage.cacheSet(setNumber, App.selectedSet);

        // Reload collection
        await loadCollection();

        closeModal('purchaseInfoModal');

        // Reset form
        e.target.reset();

        showToast('Set added to collection!', 'success');

        // Update view
        render();
    } catch (error) {
        console.error('Failed to add set to collection:', error);
        showToast('Failed to add set to collection', 'error');
    }
}

async function showSetDetails(id) {
    const item = App.collection.find(i => i.id === id);
    if (!item) return;

    const currentValue = item.currentValue || item.retailPrice;
    const valueChange = currentValue - item.purchasePrice;
    const valueChangePercent = ((valueChange / item.purchasePrice) * 100).toFixed(1);
    const changeSymbol = valueChange >= 0 ? '↑' : '↓';
    const changeClass = valueChange >= 0 ? 'positive' : 'negative';

    const themeName = App.themes.find(t => t.id === item.theme)?.name || item.theme;

    document.getElementById('setDetailsTitle').textContent = item.name;

    const content = document.getElementById('setDetailsContent');
    content.innerHTML = `
        <div class="set-details-header">
            <div class="set-details-image">
                <div class="set-details-image-placeholder">🧱</div>
            </div>
            <div class="set-details-info">
                <div class="set-details-number">Set #${item.setNumber}</div>
                <div class="set-details-name">${item.name}</div>
                <div class="set-details-meta">
                    <div class="meta-item">
                        <span class="meta-label">Theme</span>
                        <span class="meta-value">${themeName}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Pieces</span>
                        <span class="meta-value">${Utils.formatNumber(item.pieces)}</span>
                    </div>
                    ${item.minifigs ? `
                    <div class="meta-item">
                        <span class="meta-label">Minifigures</span>
                        <span class="meta-value">${item.minifigs}</span>
                    </div>
                    ` : ''}
                    <div class="meta-item">
                        <span class="meta-label">Release Year</span>
                        <span class="meta-value">${item.releaseYear}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Condition</span>
                        <span class="meta-value">${item.condition}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Date Added</span>
                        <span class="meta-value">${Utils.formatDate(item.dateAdded)}</span>
                    </div>
                    ${item.purchaseLocation ? `
                    <div class="meta-item">
                        <span class="meta-label">Purchased From</span>
                        <span class="meta-value">${item.purchaseLocation}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="set-details-price">
                    <div class="price-current">${Utils.formatCurrency(currentValue)}</div>
                    <div class="price-change ${changeClass}">
                        ${changeSymbol} ${Utils.formatCurrency(Math.abs(valueChange))} (${valueChangePercent}%)
                        <br>
                        <small>Purchase Price: ${Utils.formatCurrency(item.purchasePrice)}</small>
                    </div>
                </div>
            </div>
        </div>
        ${item.notes ? `
        <div style="margin-top: var(--spacing-lg);">
            <strong>Notes:</strong>
            <p style="margin-top: var(--spacing-sm); color: var(--text-secondary);">${item.notes}</p>
        </div>
        ` : ''}
        <div style="margin-top: var(--spacing-xl); display: flex; gap: var(--spacing-md);">
            <button id="deleteSetBtn" class="btn btn-outline" style="flex: 1;">Delete from Collection</button>
        </div>
    `;

    showModal('setDetailsModal');

    document.getElementById('deleteSetBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to remove this set from your collection?')) {
            try {
                await storage.deleteCollectionItem(id);
                await loadCollection();
                closeModal('setDetailsModal');
                showToast('Set removed from collection', 'success');
                render();
            } catch (error) {
                console.error('Failed to delete set:', error);
                showToast('Failed to delete set', 'error');
            }
        }
    });
}

function showStats() {
    if (App.collection.length === 0) {
        showToast('Add some sets to your collection first!', 'info');
        return;
    }

    const totalSets = App.collection.length;
    const totalValue = App.collection.reduce((sum, item) => sum + (item.currentValue || item.retailPrice), 0);
    const totalPurchaseValue = App.collection.reduce((sum, item) => sum + item.purchasePrice, 0);
    const totalPieces = App.collection.reduce((sum, item) => sum + (item.pieces || 0), 0);
    const totalMinifigs = App.collection.reduce((sum, item) => sum + (item.minifigs || 0), 0);

    const valueChange = totalValue - totalPurchaseValue;
    const valueChangePercent = ((valueChange / totalPurchaseValue) * 100).toFixed(1);

    // Most valuable set
    const mostValuable = App.collection.reduce((max, item) => {
        const value = item.currentValue || item.retailPrice;
        return value > (max.currentValue || max.retailPrice) ? item : max;
    }, App.collection[0]);

    // Biggest gainer
    const biggestGainer = App.collection.reduce((max, item) => {
        const gain = (item.currentValue || item.retailPrice) - item.purchasePrice;
        const maxGain = (max.currentValue || max.retailPrice) - max.purchasePrice;
        return gain > maxGain ? item : max;
    }, App.collection[0]);

    // Theme breakdown
    const themeBreakdown = {};
    App.collection.forEach(item => {
        if (!themeBreakdown[item.theme]) {
            themeBreakdown[item.theme] = 0;
        }
        themeBreakdown[item.theme]++;
    });

    const sortedThemes = Object.entries(themeBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const content = document.getElementById('statsContent');
    content.innerHTML = `
        <div class="stats-summary">
            <div class="stat-card">
                <div class="stat-value">${totalSets}</div>
                <div class="stat-label">Total Sets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Utils.formatCurrency(totalValue)}</div>
                <div class="stat-label">Total Value</div>
                <div class="stat-change ${valueChange >= 0 ? 'positive' : 'negative'}">
                    ${valueChange >= 0 ? '↑' : '↓'} ${Utils.formatCurrency(Math.abs(valueChange))} (${valueChangePercent}%)
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Utils.formatNumber(totalPieces)}</div>
                <div class="stat-label">Total Pieces</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalMinifigs}</div>
                <div class="stat-label">Total Minifigs</div>
            </div>
        </div>

        <div class="stats-section">
            <h3>Highlights</h3>
            <div style="display: grid; gap: var(--spacing-md);">
                <div class="card">
                    <strong>Most Valuable Set</strong>
                    <p style="margin-top: var(--spacing-sm);">${mostValuable.name} - ${Utils.formatCurrency(mostValuable.currentValue || mostValuable.retailPrice)}</p>
                </div>
                <div class="card">
                    <strong>Biggest Gainer</strong>
                    <p style="margin-top: var(--spacing-sm);">${biggestGainer.name} - ${Utils.formatCurrency((biggestGainer.currentValue || biggestGainer.retailPrice) - biggestGainer.purchasePrice)} gain</p>
                </div>
            </div>
        </div>

        <div class="stats-section">
            <h3>Collection by Theme</h3>
            <div class="theme-breakdown">
                ${sortedThemes.map(([themeId, count]) => {
                    const theme = App.themes.find(t => t.id === themeId);
                    const themeName = theme?.name || themeId;
                    const percentage = (count / totalSets * 100).toFixed(1);
                    return `
                        <div class="theme-bar">
                            <div class="theme-bar-header">
                                <span class="theme-name">${themeName}</span>
                                <span class="theme-count">${count} sets (${percentage}%)</span>
                            </div>
                            <div class="theme-bar-fill">
                                <div class="theme-bar-progress" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    showModal('statsModal');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showToast(message, type = 'info') {
    Utils.toast(message, type);
}
