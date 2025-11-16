# StreamFinder

## Overview
A comprehensive streaming search tool that aggregates results from multiple platforms including traditional streaming services (Netflix, Hulu, Disney+, etc.), Plex personal libraries, and YouTube. Unlike JustWatch, StreamFinder includes your personal Plex library and YouTube content in search results, giving you a complete picture of where to watch content.

## Target Users
- Cord-cutters with multiple streaming subscriptions
- Plex users who want to check their library before renting/buying
- People frustrated by searching multiple platforms
- Users who want to include YouTube in their streaming searches

## Core Features

### 1. Unified Search
- Search across all configured platforms simultaneously
- Include movies, TV shows, and videos
- Filter by content type (movie, series, documentary, etc.)
- Sort by price, availability, rating

### 2. Platform Integration

#### Supported Services
- **Streaming**: Netflix, Hulu, Disney+, HBO Max, Prime Video, Apple TV+, Peacock, Paramount+
- **Personal**: Plex library (via Plex API)
- **Video**: YouTube (via YouTube Data API)
- **Rental**: iTunes, Google Play, Vudu, Amazon

### 3. Results Display
- Show all available platforms for each title
- Highlight free options (included in subscription)
- Show rental/purchase prices
- Display Plex matches prominently
- Include YouTube trailers, reviews, and full content

### 4. User Configuration
- Select which streaming services you subscribe to
- Connect Plex account (optional)
- Set preferred platforms
- Filter out platforms you don't have

### 5. Watchlist
- Save titles to watch later
- Mark as watched
- Export to CSV
- Share watchlist

### 6. Details View
- IMDb/TMDB ratings
- Synopsis and cast
- Trailer (YouTube embed)
- All availability options
- Price comparison

## Technical Implementation

### Technologies Used
- HTML5
- CSS3 (Grid for results layout)
- Vanilla JavaScript (ES6+)
- Service Worker (for caching search results)

### APIs Required

#### 1. The Movie Database (TMDB) API
- **Purpose**: Movie/TV metadata, images
- **Cost**: Free (up to 50 requests per second)
- **Documentation**: https://developers.themoviedb.org/3

#### 2. YouTube Data API v3
- **Purpose**: Search YouTube content, get video details
- **Cost**: Free (quota-based, 10,000 units/day sufficient)
- **Documentation**: https://developers.google.com/youtube/v3

#### 3. Plex API
- **Purpose**: Search user's Plex library
- **Cost**: Free (requires user authentication)
- **Documentation**: https://www.plex.tv/media-server-downloads/#plex-app

#### 4. JustWatch API (Unofficial)
- **Purpose**: Streaming availability data
- **Alternative**: Scrape or use TMDB + manual mapping
- **Note**: May need to find alternative or build own database

### Data Storage

#### LocalStorage
- User's streaming subscriptions
- Plex authentication token
- Search history (last 20 searches)
- Watchlist
- Preferred platforms

#### IndexedDB (for larger datasets)
- Cached search results (expire after 24 hours)
- Plex library cache (refresh on demand)
- Platform availability data

### Architecture
```
/ideas/streamfinder/
├── index.html          # Main search interface
├── SPEC.md            # This file
├── style.css          # App-specific styles
├── app.js             # Main application
├── modules/
│   ├── search.js      # Search orchestration
│   ├── tmdb.js        # TMDB API wrapper
│   ├── youtube.js     # YouTube API wrapper
│   ├── plex.js        # Plex API wrapper
│   ├── storage.js     # LocalStorage/IndexedDB helpers
│   └── ui.js          # UI rendering
├── components/
│   ├── search-bar.js
│   ├── result-card.js
│   ├── filter-panel.js
│   └── detail-modal.js
└── assets/
    ├── images/        # Platform logos
    └── icons/
```

## Mobile Considerations

### Responsive Layout
- Single column results on mobile
- Swipeable filter chips
- Bottom sheet for filters (instead of sidebar)
- Pull-to-refresh for search results

### Performance
- Lazy load images
- Virtualized scrolling for long results
- Progressive loading (show results as they arrive)
- Cache API responses aggressively

### Touch Interactions
- Swipe left on result to add to watchlist
- Long press for more options
- Touch-friendly filter controls

## User Experience Flow

### First Time User
1. **Welcome Screen**: Explain what StreamFinder does
2. **Setup**: Select streaming subscriptions
3. **Optional**: Connect Plex account
4. **Search**: Try first search

### Regular Use
1. **Search**: Enter movie/show title
2. **Results**: See all platforms where it's available
3. **Filter**: Refine by platform, price, etc.
4. **Details**: Tap result for more info
5. **Action**: Watch, add to watchlist, or share

### Plex Connection Flow
1. User clicks "Connect Plex"
2. Show instructions to get Plex token
3. User enters token
4. Verify connection
5. Cache library (async, show progress)
6. Library now searchable

## API Integration Details

### Search Flow
1. User enters search query
2. Simultaneously query:
   - TMDB for metadata and IDs
   - YouTube for related videos
   - Plex library (if connected)
3. Aggregate results
4. Display unified results with all sources

### Rate Limiting
- Implement exponential backoff
- Cache results for 24 hours
- Show cached results instantly, refresh in background
- Queue requests to avoid hitting limits

### Error Handling
- Graceful degradation if one API fails
- Show partial results
- Clear error messages
- Retry logic for transient failures

## Future Enhancements

### Phase 2
- [ ] Browser extension for quick searches
- [ ] Price tracking and alerts
- [ ] Recommendations based on watchlist
- [ ] Social features (share watchlists)

### Phase 3
- [ ] Calendar view (upcoming releases)
- [ ] Download to Plex integration
- [ ] Advanced filters (genre, rating, year)
- [ ] Custom lists (not just watchlist)

### Phase 4
- [ ] Integration with TV time tracking apps
- [ ] Statistics (most used platform, spending)
- [ ] Family accounts (shared watchlists)
- [ ] Smart suggestions based on viewing history

## Development Status
- [ ] Basic structure and search UI
- [ ] TMDB API integration
- [ ] YouTube API integration
- [ ] Plex API integration
- [ ] Results aggregation logic
- [ ] Filter and sort functionality
- [ ] Watchlist feature
- [ ] Details modal
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Complete and launched

## Success Metrics
- Search returns results in < 2 seconds
- Accurately shows platform availability
- Plex library integration works smoothly
- Mobile-friendly on iOS and Android
- Lighthouse performance score > 85
- User can find content faster than checking each platform manually

## Known Issues
None yet - prototype not started

## Privacy & Security

### Data Collection
- No personal data collected
- Plex token stored locally only
- Search history stays on device
- No analytics or tracking

### API Keys
- TMDB API key required (user provides their own OR use app key with rate limits)
- YouTube API key required
- Plex token is user's own

### Best Practices
- All API calls over HTTPS
- Tokens encrypted in LocalStorage
- No server-side storage
- Open source for transparency

## Content Guidelines

### Platform Logos
- Use official logos with proper attribution
- Link to platform terms of service
- Comply with trademark guidelines

### Metadata
- TMDB content used per their terms
- YouTube embeds follow YouTube ToS
- Respect content ratings and warnings

## Technical Challenges

### Challenge 1: Streaming Availability Data
- **Problem**: No free, comprehensive API for streaming availability
- **Solutions**:
  1. Use TMDB + community contributions
  2. Manual mapping for popular titles
  3. User-contributed availability (Wikipedia model)
  4. Scrape JustWatch (not ideal, against ToS)
- **Chosen**: Start with TMDB, add manual data for popular titles

### Challenge 2: Plex Library Access
- **Problem**: Requires user's Plex token, not trivial for non-technical users
- **Solution**:
  1. Clear, step-by-step instructions with screenshots
  2. Video tutorial
  3. Make it optional, not required
  4. Validate token before proceeding

### Challenge 3: API Rate Limits
- **Problem**: Free tiers have limited requests
- **Solution**:
  1. Aggressive caching (24-hour cache)
  2. Debounce search input
  3. Batch requests where possible
  4. Show cached results immediately

### Challenge 4: Mobile Performance
- **Problem**: Multiple API calls can be slow on mobile networks
- **Solution**:
  1. Progressive loading (show TMDB results first)
  2. Service Worker for offline cache
  3. Optimize images
  4. Virtual scrolling for results

## MVP Features (Initial Launch)

### Must Have
- [x] Basic search interface
- [x] TMDB integration for metadata
- [x] YouTube integration for trailers
- [x] Display results with platform availability
- [x] Simple watchlist
- [x] Mobile-responsive design

### Nice to Have (Post-MVP)
- [ ] Plex integration
- [ ] Advanced filters
- [ ] Price tracking
- [ ] Recommendations

### Future
- [ ] Browser extension
- [ ] TV app
- [ ] Social features

---

**Last Updated**: 2025-11-16
**Status**: Planned
**Priority**: Medium (complex APIs, but high value)
**Est. Development Time**: 2-3 weeks for MVP
