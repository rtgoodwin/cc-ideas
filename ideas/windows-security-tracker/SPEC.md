# Windows 10 Security Tracker

## Overview
A data visualization dashboard that tracks virus growth, exploit count, and security vulnerabilities since Windows 10 reached end of support. The goal is to provide a compelling visual argument for upgrading to Windows 11 or switching to a supported operating system.

## Target Users
- IT administrators managing corporate Windows 10 deployments
- Home users still on Windows 10
- Security researchers tracking OS vulnerability trends
- Journalists writing about OS security
- Family members concerned about relatives still using Windows 10

## Core Features

### 1. Dashboard Overview
- Current exploit count (since EOL date)
- New vulnerabilities this week/month
- Critical vs non-critical breakdown
- Comparison to Windows 11 vulnerability rate
- "Days since support ended" counter

### 2. Timeline Visualization
- Interactive timeline chart showing exploit growth
- Mark major security events
- Hover for details on specific exploits
- Zoom and pan controls
- Export as image for sharing

### 3. Vulnerability Database
- List of known exploits since EOL
- Filter by severity (Critical, High, Medium, Low)
- Search by CVE number or keyword
- Link to official Microsoft/NIST advisories
- "Exploited in the wild" indicator

### 4. Statistics & Insights
- Average time from disclosure to exploit
- Most common vulnerability types
- Trend analysis (accelerating/stable/declining)
- Industry comparison (macOS, Linux, Windows 11)

### 5. Recommendations
- Clear call-to-action to upgrade
- Links to Windows 11 upgrade checker
- Alternative OS options
- Security best practices for those who can't upgrade yet

### 6. Data Sources Transparency
- Credit all data sources
- Last updated timestamp
- Methodology documentation
- Allow data export (JSON, CSV)

## Technical Implementation

### Technologies Used
- HTML5
- CSS3 (Grid for dashboard layout)
- Vanilla JavaScript (ES6+)
- Chart.js for visualizations (lightweight charting library)
- Service Worker for offline viewing

### Data Sources

#### 1. National Vulnerability Database (NVD)
- **URL**: https://nvd.nist.gov/
- **API**: https://services.nvd.nist.gov/rest/json/cves/2.0
- **Free**: Yes
- **Data**: CVE details, CVSS scores, descriptions
- **Rate Limit**: 5 requests per 30 seconds

#### 2. Microsoft Security Response Center (MSRC)
- **URL**: https://msrc.microsoft.com/
- **API**: https://api.msrc.microsoft.com/
- **Free**: Yes
- **Data**: Microsoft-specific vulnerability data
- **Authentication**: API key required (free)

#### 3. CISA Known Exploited Vulnerabilities
- **URL**: https://www.cisa.gov/known-exploited-vulnerabilities
- **Format**: JSON catalog
- **Free**: Yes
- **Data**: Actively exploited vulnerabilities
- **Update Frequency**: Regularly updated

#### 4. CVE Details
- **URL**: https://www.cvedetails.com/
- **Access**: Web scraping or API (check ToS)
- **Data**: Vulnerability statistics and trends

### Data Storage

#### LocalStorage
- User preferences (chart type, filters)
- Last viewed date
- Bookmarked vulnerabilities

#### IndexedDB
- Cached vulnerability data (refresh daily)
- Historical data for offline viewing
- Chart configuration

### Data Update Strategy
1. **Daily**: Fetch new CVEs from NVD API
2. **Weekly**: Update statistics and trends
3. **On-demand**: User can manually refresh
4. **Background**: Service Worker updates cache

### Architecture
```
/ideas/windows-security-tracker/
├── index.html          # Main dashboard
├── SPEC.md            # This file
├── style.css          # Dashboard styles
├── app.js             # Main application logic
├── modules/
│   ├── data-fetcher.js    # API integration
│   ├── data-parser.js     # Parse and normalize data
│   ├── chart-manager.js   # Chart.js wrapper
│   ├── statistics.js      # Calculate stats
│   └── storage.js         # IndexedDB management
├── components/
│   ├── dashboard.js
│   ├── timeline.js
│   ├── vulnerability-list.js
│   └── stats-cards.js
├── assets/
│   └── icons/
└── data/
    ├── vulnerability-cache.json    # Pre-populated data
    └── metadata.json              # Last update time, etc.
```

## Mobile Considerations

### Responsive Charts
- Charts resize gracefully on small screens
- Touch-enabled pan and zoom
- Simplified tooltips for mobile
- Rotate device for better chart viewing

### Data Tables
- Horizontal scroll for wide tables
- Sticky headers
- Collapsible columns on mobile
- "Load more" pagination instead of scrolling

### Performance
- Lazy load vulnerability details
- Paginate large datasets (100 items at a time)
- Optimize chart rendering
- Service Worker for fast repeat loads

## User Experience Flow

### First Visit
1. **Landing**: See hero section with current exploit count
2. **Overview**: Dashboard with key statistics
3. **Timeline**: Interactive chart showing growth
4. **Details**: Scroll to see vulnerability list
5. **Action**: Call-to-action to upgrade

### Return Visitor
1. **What's New**: Badge showing new exploits since last visit
2. **Updated Charts**: Charts reflect latest data
3. **Bookmarks**: Quick access to saved vulnerabilities

### Sharing
- Share specific vulnerability
- Share current statistics as image
- Export data for presentations

## Data Visualization Design

### Color Scheme
- **Critical**: Red (#ef4444)
- **High**: Orange (#f59e0b)
- **Medium**: Yellow (#fbbf24)
- **Low**: Blue (#3b82f6)
- **Windows 10**: Red gradient
- **Windows 11**: Green gradient (for comparison)

### Chart Types

#### 1. Main Timeline (Line Chart)
- X-axis: Time (weeks/months since EOL)
- Y-axis: Cumulative exploit count
- Multiple lines: Total, Critical, High severity

#### 2. Severity Breakdown (Donut Chart)
- Show proportion of Critical/High/Medium/Low
- Interactive (click to filter)

#### 3. Trends (Bar Chart)
- New exploits per month
- Show trend line

#### 4. Comparison (Stacked Bar Chart)
- Windows 10 vs Windows 11 vulnerabilities
- Show active support makes a difference

### Key Metrics Cards
```
┌─────────────────────┐  ┌─────────────────────┐
│ Total Exploits      │  │ Critical Severity   │
│      1,247          │  │        89           │
│ ↑ 23 this week      │  │ ↑ 3 this week       │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ Days Since EOL      │  │ Actively Exploited  │
│      623            │  │        156          │
│ October 14, 2025    │  │ ⚠️ In the wild      │
└─────────────────────┘  └─────────────────────┘
```

## Future Enhancements

### Phase 2
- [ ] Email alerts for critical exploits
- [ ] Historical comparison (XP EOL, Win7 EOL)
- [ ] Industry sector risk assessment
- [ ] PDF report generation

### Phase 3
- [ ] API for developers
- [ ] Embeddable widgets
- [ ] RSS feed for updates
- [ ] Integration with vulnerability scanners

### Phase 4
- [ ] Multi-language support
- [ ] Custom alerts based on user's software
- [ ] Predictive analytics (estimate future growth)
- [ ] Community contributions (verified reports)

## Development Status
- [ ] Basic dashboard layout
- [ ] NVD API integration
- [ ] CISA catalog integration
- [ ] Timeline chart implementation
- [ ] Vulnerability list with filters
- [ ] Statistics calculation
- [ ] Mobile responsive design
- [ ] Service Worker for offline
- [ ] Data export functionality
- [ ] Complete and launched

## Success Metrics
- Data updates automatically within 24 hours
- Charts load in < 3 seconds
- Accurate exploit count
- Mobile-friendly visualizations
- Lighthouse performance score > 85
- Clear, understandable by non-technical users

## Known Issues
None yet - prototype not started

## Important Dates

### Windows 10 End of Support Timeline
- **Windows 10 Home/Pro EOL**: October 14, 2025
- **Extended Security Updates**: Available for Enterprise/Education (paid)
- **Baseline Date**: October 14, 2025 (start tracking from here)

### Data Collection Start
- Begin tracking vulnerabilities disclosed after EOL date
- Also track unpatched vulnerabilities disclosed before but still exploitable

## Ethical Considerations

### Responsible Disclosure
- Only show publicly disclosed vulnerabilities
- Don't include proof-of-concept exploit code
- Link to patches/mitigations when available
- Clear warnings about risk

### Balanced Presentation
- Note that Windows 10 Extended Security Updates exist
- Acknowledge some users can't upgrade (hardware limitations)
- Provide security best practices for those staying on Win10
- Don't fear-monger, just present data

### Accuracy
- Cite all sources
- Update data regularly
- Correct errors promptly
- Be transparent about methodology

## Content Guidelines

### Vulnerability Descriptions
- Use official CVE descriptions
- Simplify technical jargon in summaries
- Explain real-world impact
- Link to detailed technical analysis

### Upgrade Messaging
- Factual, not alarmist
- Acknowledge legitimate reasons to delay upgrade
- Provide alternatives (Linux, etc.)
- Include free upgrade information

### Best Practices for Holdouts
1. Use a good antivirus
2. Enable Windows Firewall
3. Don't run as administrator
4. Keep other software updated
5. Consider upgrading hardware if possible

## Data Schema

### Vulnerability Object
```json
{
  "id": "CVE-2025-12345",
  "title": "Remote Code Execution in Windows 10",
  "severity": "CRITICAL",
  "cvss_score": 9.8,
  "published_date": "2025-11-15",
  "description": "Brief description",
  "affected_versions": ["Windows 10 21H2", "Windows 10 22H2"],
  "exploited_in_wild": true,
  "patch_available": false,
  "sources": ["NVD", "MSRC"],
  "references": ["https://nvd.nist.gov/vuln/detail/CVE-2025-12345"]
}
```

### Statistics Object
```json
{
  "total_count": 1247,
  "critical_count": 89,
  "high_count": 234,
  "medium_count": 567,
  "low_count": 357,
  "exploited_count": 156,
  "last_updated": "2025-11-16T10:00:00Z",
  "weekly_trend": 23,
  "monthly_trend": 87
}
```

---

**Last Updated**: 2025-11-16
**Status**: Planned
**Priority**: Medium (good for data visualization practice)
**Est. Development Time**: 2 weeks for MVP
**Note**: Windows 10 EOL is October 14, 2025 - this tracker becomes more relevant after that date
