/**
 * Windows 10 Security Tracker
 * Main Application Logic
 */

// Configuration
const CONFIG = {
    EOL_DATE: new Date('2025-10-14'),
    CACHE_KEY: 'win10_security_data',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    NVD_API_BASE: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
    CISA_KEV_URL: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    ITEMS_PER_PAGE: 20
};

// Global state
const state = {
    allVulnerabilities: [],
    filteredVulnerabilities: [],
    displayedCount: 0,
    charts: {},
    filters: {
        search: '',
        severity: 'all',
        exploitedOnly: false
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Windows 10 Security Tracker initialized');

    // Calculate and display days since EOL
    updateDaysSinceEOL();

    // Load data (from cache or fetch fresh)
    await loadData();

    // Initialize UI components
    initializeCharts();
    initializeFilters();
    initializeChartControls();

    // Update all displays
    updateMetrics();
    updateCharts();
    renderVulnerabilities();

    // Set last update time
    updateLastUpdateTime();
});

// ============================================
// DATA LOADING & CACHING
// ============================================

async function loadData() {
    // Try to load from cache first
    const cachedData = loadFromCache();

    if (cachedData) {
        console.log('Loading data from cache');
        state.allVulnerabilities = cachedData.vulnerabilities;
        state.filteredVulnerabilities = [...state.allVulnerabilities];
        return;
    }

    // If no cache or expired, load demo data
    // In production, this would fetch from real APIs
    console.log('Loading demo data');
    state.allVulnerabilities = generateDemoData();
    state.filteredVulnerabilities = [...state.allVulnerabilities];

    // Cache the data
    saveToCache({
        vulnerabilities: state.allVulnerabilities,
        timestamp: Date.now()
    });
}

function loadFromCache() {
    try {
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;

        if (age > CONFIG.CACHE_DURATION) {
            console.log('Cache expired');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error loading cache:', error);
        return null;
    }
}

function saveToCache(data) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

// ============================================
// DEMO DATA GENERATION
// ============================================

function generateDemoData() {
    const vulnerabilities = [];
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const severityWeights = [0.15, 0.30, 0.35, 0.20]; // Distribution

    // Generate vulnerabilities from EOL date to now
    const startDate = new Date(CONFIG.EOL_DATE);
    const endDate = new Date();
    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Generate increasing number of vulnerabilities over time
    const totalVulnerabilities = Math.min(daysDiff * 2, 300); // Cap at 300 for demo

    for (let i = 0; i < totalVulnerabilities; i++) {
        // Random date between EOL and now
        const daysOffset = Math.floor(Math.random() * daysDiff);
        const publishedDate = new Date(startDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);

        // Select severity based on weights
        const severityIndex = weightedRandom(severityWeights);
        const severity = severities[severityIndex];

        // CVSS score based on severity
        let cvssScore;
        if (severity === 'CRITICAL') cvssScore = 9.0 + Math.random() * 1.0;
        else if (severity === 'HIGH') cvssScore = 7.0 + Math.random() * 2.0;
        else if (severity === 'MEDIUM') cvssScore = 4.0 + Math.random() * 3.0;
        else cvssScore = 0.1 + Math.random() * 3.9;

        // 20% chance of being actively exploited for critical/high
        const exploitedInWild = (severity === 'CRITICAL' || severity === 'HIGH') && Math.random() < 0.2;

        const vuln = {
            id: `CVE-2025-${String(10000 + i).padStart(5, '0')}`,
            title: generateVulnerabilityTitle(severity),
            severity: severity,
            cvssScore: parseFloat(cvssScore.toFixed(1)),
            publishedDate: publishedDate.toISOString().split('T')[0],
            description: generateVulnerabilityDescription(severity),
            exploitedInWild: exploitedInWild,
            affectedVersions: ['Windows 10 21H2', 'Windows 10 22H2'],
            references: [
                `https://nvd.nist.gov/vuln/detail/CVE-2025-${String(10000 + i).padStart(5, '0')}`,
                `https://msrc.microsoft.com/update-guide/CVE-2025-${String(10000 + i).padStart(5, '0')}`
            ]
        };

        vulnerabilities.push(vuln);
    }

    // Sort by date (newest first)
    vulnerabilities.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return vulnerabilities;
}

function weightedRandom(weights) {
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return i;
    }
    return weights.length - 1;
}

function generateVulnerabilityTitle(severity) {
    const types = [
        'Remote Code Execution',
        'Privilege Escalation',
        'Information Disclosure',
        'Denial of Service',
        'Security Feature Bypass',
        'Spoofing'
    ];

    const components = [
        'Windows Kernel',
        'Windows Graphics Component',
        'Windows Shell',
        'Windows TCP/IP',
        'Windows SMB',
        'Windows NTLM',
        'Windows DWM',
        'Windows Print Spooler'
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const component = components[Math.floor(Math.random() * components.length)];

    return `${component} ${type} Vulnerability`;
}

function generateVulnerabilityDescription(severity) {
    const descriptions = [
        'An elevation of privilege vulnerability exists when Windows improperly handles calls to Advanced Local Procedure Call (ALPC).',
        'A remote code execution vulnerability exists in the way that the scripting engine handles objects in memory.',
        'An information disclosure vulnerability exists when the Windows kernel improperly handles objects in memory.',
        'A denial of service vulnerability exists when Windows improperly handles objects in memory.',
        'A security feature bypass vulnerability exists when Windows incorrectly validates kernel driver signatures.',
        'A spoofing vulnerability exists when Windows incorrectly validates file signatures.'
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// ============================================
// METRICS CALCULATIONS
// ============================================

function updateDaysSinceEOL() {
    const now = new Date();
    const diff = now - CONFIG.EOL_DATE;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

    document.getElementById('days-since-eol').textContent = days;
}

function updateMetrics() {
    const total = state.allVulnerabilities.length;
    const critical = state.allVulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const exploited = state.allVulnerabilities.filter(v => v.exploitedInWild).length;

    // Calculate "this week" vulnerabilities
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = state.allVulnerabilities.filter(v =>
        new Date(v.publishedDate) >= oneWeekAgo
    ).length;

    // Update metric cards
    document.getElementById('total-exploits').textContent = total;
    document.getElementById('critical-exploits').textContent = critical;
    document.getElementById('exploited-wild').textContent = exploited;
    document.getElementById('this-week').textContent = thisWeek;

    // Update trends
    updateTrends();

    // Update severity breakdown
    updateSeverityBreakdown();
}

function updateTrends() {
    // Calculate weekly trend
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = state.allVulnerabilities.filter(v =>
        new Date(v.publishedDate) >= oneWeekAgo
    ).length;

    const lastWeek = state.allVulnerabilities.filter(v => {
        const date = new Date(v.publishedDate);
        return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    const criticalThisWeek = state.allVulnerabilities.filter(v =>
        v.severity === 'CRITICAL' && new Date(v.publishedDate) >= oneWeekAgo
    ).length;

    document.getElementById('total-trend').innerHTML = `
        <span class="trend-icon">↑</span>
        <span class="trend-value">${thisWeek} this week</span>
    `;

    document.getElementById('critical-trend').innerHTML = `
        <span class="trend-icon">↑</span>
        <span class="trend-value">${criticalThisWeek} this week</span>
    `;

    const weekComparison = thisWeek - lastWeek;
    const arrow = weekComparison >= 0 ? '↑' : '↓';
    document.getElementById('week-comparison').innerHTML = `
        <span class="trend-value">${arrow} ${Math.abs(weekComparison)} vs last week</span>
    `;
}

function updateSeverityBreakdown() {
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const total = state.allVulnerabilities.length;

    severities.forEach(severity => {
        const count = state.allVulnerabilities.filter(v => v.severity === severity).length;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        const countId = `${severity.toLowerCase()}-count`;
        const barId = `${severity.toLowerCase()}-bar`;

        document.getElementById(countId).textContent = count;
        document.getElementById(barId).style.width = `${percentage}%`;
    });
}

// ============================================
// CHART INITIALIZATION
// ============================================

function initializeCharts() {
    // Timeline Chart
    const timelineCtx = document.getElementById('timeline-chart').getContext('2d');
    state.charts.timeline = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Vulnerabilities',
                data: [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Critical Only',
                data: [],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.05)',
                fill: false,
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });

    // Severity Breakdown Chart
    const severityCtx = document.getElementById('severity-chart').getContext('2d');
    state.charts.severity = new Chart(severityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#fbbf24',
                    '#3b82f6'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateCharts() {
    updateTimelineChart();
    updateSeverityChart();
}

function updateTimelineChart() {
    // Group vulnerabilities by week
    const weeklyData = {};

    state.allVulnerabilities.forEach(vuln => {
        const date = new Date(vuln.publishedDate);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { total: 0, critical: 0 };
        }
        weeklyData[weekKey].total++;
        if (vuln.severity === 'CRITICAL') {
            weeklyData[weekKey].critical++;
        }
    });

    // Convert to cumulative data
    const sortedWeeks = Object.keys(weeklyData).sort();
    let cumulativeTotal = 0;
    let cumulativeCritical = 0;

    const labels = [];
    const totalData = [];
    const criticalData = [];

    sortedWeeks.forEach(week => {
        cumulativeTotal += weeklyData[week].total;
        cumulativeCritical += weeklyData[week].critical;

        labels.push(formatDate(new Date(week)));
        totalData.push(cumulativeTotal);
        criticalData.push(cumulativeCritical);
    });

    // Update chart
    state.charts.timeline.data.labels = labels;
    state.charts.timeline.data.datasets[0].data = totalData;
    state.charts.timeline.data.datasets[1].data = criticalData;
    state.charts.timeline.update();
}

function updateSeverityChart() {
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const data = severities.map(severity =>
        state.allVulnerabilities.filter(v => v.severity === severity).length
    );

    state.charts.severity.data.datasets[0].data = data;
    state.charts.severity.update();
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ============================================
// VULNERABILITY LIST RENDERING
// ============================================

function renderVulnerabilities() {
    const container = document.getElementById('vulnerabilities-list');
    const loadMoreBtn = document.getElementById('load-more');

    // Apply filters
    applyFilters();

    // Clear container
    container.innerHTML = '';

    // Render vulnerabilities
    const toDisplay = state.filteredVulnerabilities.slice(0, CONFIG.ITEMS_PER_PAGE);
    state.displayedCount = toDisplay.length;

    if (toDisplay.length === 0) {
        container.innerHTML = `
            <div class="loading-state">
                <p>No vulnerabilities found matching your filters.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    toDisplay.forEach(vuln => {
        const card = createVulnerabilityCard(vuln);
        container.appendChild(card);
    });

    // Show/hide load more button
    if (state.displayedCount < state.filteredVulnerabilities.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function createVulnerabilityCard(vuln) {
    const card = document.createElement('div');
    card.className = `vulnerability-card ${vuln.severity.toLowerCase()}`;

    const badges = `
        <div class="vulnerability-badges">
            <span class="badge ${vuln.severity.toLowerCase()}">${vuln.severity}</span>
            ${vuln.exploitedInWild ? '<span class="badge exploited">⚠️ Actively Exploited</span>' : ''}
        </div>
    `;

    const links = vuln.references.map((ref, index) =>
        `<a href="${ref}" target="_blank" rel="noopener">Reference ${index + 1} →</a>`
    ).join('');

    card.innerHTML = `
        <div class="vulnerability-header">
            <div class="vulnerability-id">${vuln.id}</div>
            ${badges}
        </div>
        <div class="vulnerability-title">${vuln.title}</div>
        <div class="vulnerability-meta">
            <span>📅 Published: ${vuln.publishedDate}</span>
            <span>📊 CVSS: ${vuln.cvssScore}</span>
        </div>
        <div class="vulnerability-description">${vuln.description}</div>
        <div class="vulnerability-links">
            ${links}
        </div>
    `;

    return card;
}

function loadMoreVulnerabilities() {
    const container = document.getElementById('vulnerabilities-list');
    const loadMoreBtn = document.getElementById('load-more');

    const currentCount = state.displayedCount;
    const nextBatch = state.filteredVulnerabilities.slice(
        currentCount,
        currentCount + CONFIG.ITEMS_PER_PAGE
    );

    nextBatch.forEach(vuln => {
        const card = createVulnerabilityCard(vuln);
        container.appendChild(card);
    });

    state.displayedCount += nextBatch.length;

    // Hide button if no more to load
    if (state.displayedCount >= state.filteredVulnerabilities.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// ============================================
// FILTERING & SEARCH
// ============================================

function initializeFilters() {
    const searchInput = document.getElementById('search-input');
    const severityFilter = document.getElementById('severity-filter');
    const exploitedFilter = document.getElementById('exploited-filter');
    const loadMoreBtn = document.getElementById('load-more');

    searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value.toLowerCase();
        renderVulnerabilities();
    });

    severityFilter.addEventListener('change', (e) => {
        state.filters.severity = e.target.value;
        renderVulnerabilities();
    });

    exploitedFilter.addEventListener('change', (e) => {
        state.filters.exploitedOnly = e.target.checked;
        renderVulnerabilities();
    });

    loadMoreBtn.addEventListener('click', loadMoreVulnerabilities);
}

function applyFilters() {
    state.filteredVulnerabilities = state.allVulnerabilities.filter(vuln => {
        // Search filter
        if (state.filters.search) {
            const searchLower = state.filters.search;
            const matchesSearch =
                vuln.id.toLowerCase().includes(searchLower) ||
                vuln.title.toLowerCase().includes(searchLower) ||
                vuln.description.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Severity filter
        if (state.filters.severity !== 'all') {
            if (vuln.severity !== state.filters.severity) return false;
        }

        // Exploited filter
        if (state.filters.exploitedOnly) {
            if (!vuln.exploitedInWild) return false;
        }

        return true;
    });
}

// ============================================
// CHART CONTROLS
// ============================================

function initializeChartControls() {
    const controls = document.querySelectorAll('.btn-control');

    controls.forEach(control => {
        control.addEventListener('click', (e) => {
            // Update active state
            controls.forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');

            // Update chart based on period
            const period = e.target.dataset.period;
            filterChartByPeriod(period);
        });
    });
}

function filterChartByPeriod(period) {
    // This would filter the timeline chart data
    // For now, just update the chart (full implementation would filter data)
    console.log(`Filtering chart by period: ${period}`);
    updateTimelineChart();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function updateLastUpdateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    document.getElementById('last-update-time').textContent = formatted;
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.securityTracker = {
        state,
        CONFIG,
        refreshData: loadData,
        updateMetrics,
        updateCharts
    };
}
