# Lego Set Tracker

## Overview
A comprehensive tool for Lego collectors to track retired sets by scanning barcodes, maintain a personal collection library, and visualize price trends over time. Helps collectors make informed decisions about when to buy sets before retirement and track investment value.

## Target Users
- Lego collectors and investors
- Parents tracking their children's Lego sets
- Resellers monitoring market prices
- Lego enthusiasts researching sets
- AFOLs (Adult Fans of Lego)

## Core Features

### 1. Barcode Scanning
- Scan Lego set barcodes using device camera
- Support multiple barcode formats (UPC, EAN)
- Manual entry fallback
- Quick add to collection
- Batch scanning mode

### 2. Collection Management
- View all sets in collection
- Sort by: date added, set number, theme, price, retirement status
- Filter by: theme, year, retirement status, price range
- Search by name or set number
- Mark sets as built/unbuilt, sealed/opened
- Track purchase price and date
- Add custom notes and photos

### 3. Set Details
- Set name and number
- Theme and sub-theme
- Piece count
- Minifigure count
- Release date
- Retirement date (if applicable)
- Original retail price
- Current market value
- Price history chart
- Set images (official Lego images)
- Links to Brickset, BrickLink, BrickEconomy

### 4. Price Tracking
- Historical price chart (6mo, 1yr, all time)
- Current market value (average from multiple sources)
- Value change since purchase
- ROI calculation for sealed sets
- Price alerts (notify when price changes significantly)
- Comparison to original retail price

### 5. Retirement Tracking
- List of recently retired sets
- Sets rumored to retire soon
- Notification when sets in wishlist are retiring
- Timeline of retirement announcements

### 6. Statistics & Insights
- Total collection value
- Number of sets owned
- Total piece count
- Investment performance
- Most valuable set
- Biggest gainer/loser
- Collection breakdown by theme
- Annual spending

### 7. Wishlist
- Save sets to purchase later
- Track price changes on wishlist items
- Get alerts when retiring soon
- Sort by priority
- Budget planning

## Technical Implementation

### Technologies Used
- HTML5 (Canvas API for image processing)
- CSS3 (Grid for collection gallery)
- Vanilla JavaScript (ES6+)
- QuaggaJS or ZXing (barcode scanning library)
- Chart.js (price history charts)
- IndexedDB (collection storage)

### Barcode Scanning Libraries

#### Option 1: QuaggaJS
- **Pros**: Pure JavaScript, works in browser, good accuracy
- **Cons**: Larger file size
- **Size**: ~200KB
- **Formats**: EAN, UPC, Code 128, Code 39

#### Option 2: ZXing (via jsQR)
- **Pros**: Lightweight, fast
- **Cons**: Fewer supported formats
- **Size**: ~50KB
- **Formats**: QR, UPC, EAN

**Chosen**: QuaggaJS for comprehensive barcode format support

### APIs & Data Sources

#### 1. Rebrickable API
- **URL**: https://rebrickable.com/api/
- **Free Tier**: Yes (need API key)
- **Data**: Set details, parts, minifigs, themes
- **Rate Limit**: 1000 requests/day
- **Best for**: Set metadata and details

#### 2. Brickset API
- **URL**: https://brickset.com/api/
- **Free Tier**: Yes (need API key)
- **Data**: Set info, release dates, retirement dates, prices
- **Rate Limit**: Reasonable
- **Best for**: Release/retirement dates, retail prices

#### 3. BrickEconomy (Web Scraping or Manual)
- **URL**: https://www.brickeconomy.com/
- **API**: No official API
- **Data**: Market prices, investment tracking
- **Access**: Web scraping (check ToS) or manual
- **Best for**: Current market values

#### 4. BrickLink (Price Guide)
- **URL**: https://www.bricklink.com/
- **API**: Yes (OAuth required)
- **Data**: Marketplace prices, sales history
- **Best for**: Accurate market pricing

### Data Storage

#### IndexedDB Schema

**Collections Table**
- Collection ID
- Set number
- Name
- Theme
- Purchase date
- Purchase price
- Purchase location
- Condition (sealed, opened, built)
- Notes
- Custom photos
- Date added

**Sets Cache Table**
- Set number (primary key)
- Set metadata (from API)
- Last updated
- Images URLs

**Price History Table**
- Set number
- Date
- Price
- Source (BrickLink, eBay, etc.)

#### LocalStorage
- User preferences (default currency, theme)
- API keys (encrypted)
- Last sync timestamp
- Wishlist

### Architecture
```
/ideas/lego-tracker/
├── index.html          # Main collection view
├── SPEC.md            # This file
├── style.css          # App styles
├── app.js             # Main application logic
├── pages/
│   ├── scanner.html   # Barcode scanning interface
│   ├── set-detail.html # Individual set view
│   └── stats.html     # Statistics dashboard
├── modules/
│   ├── scanner.js     # Barcode scanning logic
│   ├── api/
│   │   ├── rebrickable.js
│   │   ├── brickset.js
│   │   └── bricklink.js
│   ├── storage.js     # IndexedDB wrapper
│   ├── price-tracker.js
│   └── charts.js      # Price chart rendering
├── components/
│   ├── set-card.js
│   ├── price-chart.js
│   ├── filter-panel.js
│   └── stats-widget.js
├── assets/
│   ├── images/
│   └── icons/
└── data/
    └── themes.json    # Lego themes list
```

## Mobile Considerations

### Camera Access
- Request camera permission gracefully
- Explain why camera is needed
- Provide manual entry alternative
- Handle permission denied scenario

### Scanner UX
- Full-screen camera view
- Clear targeting guide
- Auto-focus and auto-capture when barcode detected
- Haptic feedback on successful scan
- Torch/flashlight toggle for low light

### Collection Gallery
- Grid view optimized for mobile (2 columns)
- Lazy load images
- Pull-to-refresh to sync data
- Swipe to delete/edit

### Performance
- Compress and cache images
- Paginate collection (50 sets at a time)
- Background sync with APIs
- Offline-first approach

## User Experience Flow

### First Time User
1. **Welcome**: Explain features
2. **Setup**: Request camera permission, enter API keys (optional)
3. **Add First Set**: Tutorial on scanning barcode
4. **Success**: See set added to collection
5. **Explore**: Browse collection, see statistics

### Adding a Set
1. **Tap "Add Set"**: Choose scan or manual entry
2. **Scan Barcode**: Point camera at barcode
3. **Auto-Detect**: App identifies set
4. **Review Details**: Confirm set information
5. **Add Purchase Info**: Enter price, date, condition
6. **Save**: Set added to collection

### Tracking Prices
1. **View Set**: Tap set in collection
2. **See Current Price**: Market value displayed
3. **View History**: Interactive price chart
4. **Set Alert**: Get notified of price changes
5. **Compare**: See ROI vs purchase price

## Data Visualization

### Price Chart
- Line chart showing price over time
- Mark purchase date with vertical line
- Show current value prominently
- % change indicator
- Time range selector (1mo, 6mo, 1yr, all)

### Collection Statistics
```
┌─────────────────────┐  ┌─────────────────────┐
│ Total Sets          │  │ Total Value         │
│      87             │  │    $12,450          │
│                     │  │ ↑ $2,100 (20%)      │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ Total Pieces        │  │ Total Minifigs      │
│    45,231           │  │       312           │
│                     │  │                     │
└─────────────────────┘  └─────────────────────┘
```

### Theme Breakdown (Pie Chart)
- Show collection by theme
- Interactive (tap to filter)
- Color-coded by Lego theme colors

## Future Enhancements

### Phase 2
- [ ] Export collection to CSV/PDF
- [ ] Import from Brickset/Rebrickable
- [ ] Share collection publicly
- [ ] Parts inventory tracking
- [ ] MOC (My Own Creation) tracking

### Phase 3
- [ ] Price predictions using historical data
- [ ] Marketplace integration (buy/sell)
- [ ] Trading with other collectors
- [ ] Set location tracking (where stored)
- [ ] Insurance value reports

### Phase 4
- [ ] AR view of sets (using built images)
- [ ] Build progress tracking
- [ ] Instructions PDF viewer
- [ ] Community features (reviews, ratings)
- [ ] Multi-user family accounts

## Development Status
- [ ] Basic collection management
- [ ] Barcode scanning implementation
- [ ] Rebrickable API integration
- [ ] Brickset API integration
- [ ] IndexedDB storage setup
- [ ] Set detail page
- [ ] Price tracking system
- [ ] Charts implementation
- [ ] Statistics dashboard
- [ ] Mobile optimization
- [ ] Complete and launched

## Success Metrics
- Barcode scanning works with 95%+ accuracy
- Set details load in < 2 seconds
- Price data updates daily
- Offline collection browsing works
- Lighthouse performance score > 85
- Can manage 500+ sets without lag

## Known Issues
None yet - prototype not started

## Barcode Scanning Implementation

### Setup
```javascript
import Quagga from 'quagga';

Quagga.init({
  inputStream: {
    type: "LiveStream",
    target: document.querySelector('#scanner'),
    constraints: {
      facingMode: "environment" // Use back camera
    }
  },
  decoder: {
    readers: ["ean_reader", "upc_reader"]
  }
}, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  Quagga.start();
});

Quagga.onDetected((result) => {
  const barcode = result.codeResult.code;
  lookupSetByBarcode(barcode);
});
```

### Barcode to Set Number Lookup
1. Scan barcode (e.g., `673419340496`)
2. Query Rebrickable: `/api/v3/lego/sets/?search={barcode}`
3. If not found, try Brickset API
4. If still not found, manual entry with barcode saved
5. Cache barcode-to-set mappings for offline use

## Price Tracking Implementation

### Data Collection
1. **Daily**: Fetch prices from BrickLink API
2. **Store**: Save to Price History table
3. **Calculate**: Average, min, max for the day
4. **Alert**: Check if price change > 10%, notify user

### Chart Rendering
```javascript
import Chart from 'chart.js/auto';

const ctx = document.getElementById('priceChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Market Value',
      data: prices,
      borderColor: '#3b82f6',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      annotation: {
        annotations: {
          purchaseLine: {
            type: 'line',
            yMin: purchasePrice,
            yMax: purchasePrice,
            borderColor: '#10b981',
            borderWidth: 2,
            label: {
              content: 'Purchase Price',
              enabled: true
            }
          }
        }
      }
    }
  }
});
```

## Privacy & Data

### User Data
- All collection data stored locally (IndexedDB)
- No server-side storage
- No account required
- Export/backup to user's device

### API Keys
- User provides their own API keys (optional)
- Stored encrypted in LocalStorage
- Clear instructions for obtaining keys
- App provides default keys with rate limits

### Sharing
- If user chooses to share collection, generate read-only link
- Share via JSON export (import into other apps)
- No personal information in shared data

## Challenges & Solutions

### Challenge 1: Barcode Accuracy
- **Problem**: Not all Lego sets have scannable barcodes
- **Solution**:
  1. Manual set number entry
  2. Search by name
  3. Browse by theme/year
  4. Recent sets list

### Challenge 2: Price Data Accuracy
- **Problem**: No single source of truth for prices
- **Solution**:
  1. Aggregate from multiple sources
  2. Show price range (min-max)
  3. Let user choose preferred source
  4. Manual price entry override

### Challenge 3: Retirement Dates
- **Problem**: Lego doesn't announce retirement dates in advance
- **Solution**:
  1. Use community-sourced data (Brickset)
  2. Mark as "rumored" vs "confirmed"
  3. Historical patterns (usually 18-24 months)
  4. Update when official

### Challenge 4: Offline Functionality
- **Problem**: APIs not available offline
- **Solution**:
  1. Aggressive caching of set metadata
  2. Queue price updates for when online
  3. All collection features work offline
  4. Sync when connection restored

## API Rate Limit Management

### Strategy
1. **Cache aggressively**: 7 days for set metadata
2. **Batch requests**: Fetch multiple sets in one call
3. **Background sync**: Update prices during low usage
4. **Fallback**: Use cached data if rate limit hit
5. **User communication**: Show "Data may be outdated" if stale

---

**Last Updated**: 2025-11-16
**Status**: Planned
**Priority**: High (unique value, good technical challenge)
**Est. Development Time**: 3-4 weeks for MVP
**Dependencies**: Need API keys from Rebrickable and Brickset (free)
