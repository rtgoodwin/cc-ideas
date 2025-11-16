# Development Plan & Roadmap

## Project Goals

Create a collection of web-based prototypes that:
1. Solve real problems or fill gaps in existing solutions
2. Work seamlessly on mobile devices
3. Can be tested as "apps" via GitHub Pages
4. Serve as portfolio pieces and proof-of-concepts

## Implementation Phases

### Phase 1: Infrastructure Setup ✅ (Current)

- [x] Create repository structure
- [x] Write SPEC.md and PLAN.md
- [x] Create CLAUDE_INSTRUCTIONS.md for future development
- [x] Set up shared CSS framework for mobile-first design
- [x] Create main index.html overview page
- [x] Configure GitHub Pages deployment
- [x] Create folder structure for all initial ideas

### Phase 2: Initial Prototypes (In Progress)

#### Priority 1: Senior Connect Helper
**Why First**: Simplest scope, primarily educational content
- [ ] Design information architecture for topics
- [ ] Create visual guides with illustrations
- [ ] Implement step-by-step tutorials
- [ ] Add search/navigation functionality
- [ ] Test with target audience

#### Priority 2: Windows Security Tracker
**Why Second**: Data visualization practice, API integration
- [ ] Research data sources for vulnerability tracking
- [ ] Design dashboard layout
- [ ] Implement data fetching and caching
- [ ] Create charts/visualizations
- [ ] Add timeline view

#### Priority 3: Lego Tracker
**Why Third**: Requires barcode scanning, local storage
- [ ] Research barcode scanning libraries (QuaggaJS, ZXing)
- [ ] Design library interface
- [ ] Implement barcode scanning
- [ ] Integrate with Brickset or Rebrickable API
- [ ] Create price history charts
- [ ] Implement local storage for collection

#### Priority 4: StreamFinder
**Why Last**: Most complex, requires multiple API integrations
- [ ] Research available APIs (TMDB, YouTube, Plex)
- [ ] Design search interface
- [ ] Implement unified search across sources
- [ ] Create results aggregation logic
- [ ] Add filters and sorting
- [ ] Implement watchlist feature

### Phase 3: Enhancement & Polish

- [ ] Add progressive web app (PWA) features
- [ ] Implement service workers for offline capability
- [ ] Add app icons and manifest files
- [ ] Performance optimization
- [ ] Accessibility audit and fixes
- [ ] Cross-browser testing

### Phase 4: Future Ideas

Potential future prototypes to add:
- Recipe manager with meal planning
- Personal finance dashboard
- Habit tracker with streaks
- Local event aggregator
- Plant care reminder system
- Movie/TV show tracker with statistics

## Technical Decisions

### Decision 1: Vanilla JS vs Framework
**Decision**: Start with vanilla JavaScript
**Rationale**:
- No build step required
- Faster initial development
- Lighter weight for mobile
- Can migrate individual prototypes to React later if needed

**Future**: If a prototype requires React:
1. Create GitHub Actions workflow
2. Build to separate output directory
3. Deploy compiled assets to Pages
4. Instructions in CLAUDE_INSTRUCTIONS.md

### Decision 2: Shared vs Individual Styles
**Decision**: Hybrid approach
**Rationale**:
- Shared base styles ensure consistency
- Individual styles allow prototype-specific customization
- Mobile-first framework in `/shared/styles/`

### Decision 3: Data Storage
**Decision**: LocalStorage first, IndexedDB if needed
**Rationale**:
- LocalStorage sufficient for most prototypes
- IndexedDB for larger datasets (Lego library)
- No backend required
- Export/import functionality for data portability

### Decision 4: External APIs
**Decision**: Client-side API calls with CORS proxies when needed
**Rationale**:
- Keep prototypes purely frontend
- Use CORS proxies (cors-anywhere) for restrictive APIs
- Consider serverless functions (Netlify/Vercel) if CORS issues persist

## Development Standards

### Code Quality
- Use ESLint for JavaScript linting
- Follow Airbnb style guide
- Comment complex logic
- Keep functions small and focused

### Responsive Breakpoints
```css
/* Mobile first - base styles */
/* Tablet: min-width: 768px */
/* Desktop: min-width: 1024px */
/* Large desktop: min-width: 1440px */
```

### Accessibility Requirements
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- Screen reader tested

### Performance Targets
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90
- Total page size < 1MB (initial load)

## Success Metrics

### Per Prototype
- Mobile usability score > 95 (Google)
- Core functionality works offline
- No console errors
- Passes accessibility audit
- Works on iOS Safari and Chrome Android

### Overall Repository
- Clean, navigable overview page
- Consistent design language
- Clear documentation
- Easy for AI agents to extend
- Suitable for portfolio demonstration

## Next Steps

1. Complete Phase 1 infrastructure
2. Start Senior Connect Helper prototype
3. Test on actual mobile devices
4. Gather feedback
5. Iterate and improve
6. Move to next prototype

## Timeline

- **Week 1**: Infrastructure + Senior Connect Helper
- **Week 2**: Windows Security Tracker
- **Week 3**: Lego Tracker
- **Week 4**: StreamFinder
- **Week 5+**: Polish, PWA features, new ideas

---

**Last Updated**: 2025-11-16
**Current Phase**: Phase 1 - Infrastructure Setup
**Next Milestone**: Complete all Phase 1 tasks and begin Senior Connect Helper
