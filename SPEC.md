# CC-Ideas: Web Prototypes Repository

## Overview
This repository hosts multiple web-based prototype applications, all published via GitHub Pages. Each prototype is designed with mobile-first principles to function as standalone "apps" when viewed on mobile devices.

## Repository Structure

```
cc-ideas/
├── index.html                 # Main overview page listing all prototypes
├── SPEC.md                    # This file - overall specification
├── PLAN.md                    # Development plan and roadmap
├── CLAUDE_INSTRUCTIONS.md     # Instructions for AI agents working on this repo
├── .github/
│   └── workflows/
│       └── pages.yml          # GitHub Actions workflow for Pages deployment
├── shared/
│   ├── styles/
│   │   ├── mobile-first.css   # Shared mobile-first CSS framework
│   │   └── theme.css          # Shared theme variables
│   └── scripts/
│       └── utils.js           # Shared utility functions
└── ideas/
    ├── senior-connect-helper/
    │   ├── index.html
    │   ├── SPEC.md
    │   ├── style.css
    │   └── app.js
    ├── streamfinder/
    │   ├── index.html
    │   ├── SPEC.md
    │   ├── style.css
    │   └── app.js
    ├── windows-security-tracker/
    │   ├── index.html
    │   ├── SPEC.md
    │   ├── style.css
    │   └── app.js
    └── lego-tracker/
        ├── index.html
        ├── SPEC.md
        ├── style.css
        └── app.js
```

## Technology Stack

### Primary Approach: Vanilla Web Technologies
- **HTML5**: Semantic markup
- **CSS3**: Mobile-first responsive design
- **Vanilla JavaScript**: ES6+ features, no framework dependencies
- **No Build Step**: Works directly with GitHub Pages

### Alternative Approach (If Needed): React with GitHub Actions
- React prototypes can be built using GitHub Actions
- Compiled output deployed to `gh-pages` branch
- Instructions in CLAUDE_INSTRUCTIONS.md

## Design Principles

1. **Mobile-First**: All prototypes designed primarily for mobile viewing
2. **Responsive**: Adapt gracefully to tablet and desktop
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Fast loading, minimal dependencies
6. **Offline-Capable**: Service workers for offline functionality (where appropriate)

## Current Prototypes

### 1. Senior Connect Helper
**Path**: `/ideas/senior-connect-helper/`
**Purpose**: Educational tool to help older adults understand and connect to technology (WiFi vs cellular, streaming services, smart devices)

### 2. StreamFinder
**Path**: `/ideas/streamfinder/`
**Purpose**: JustWatch alternative that includes Plex and YouTube in search results

### 3. Windows Security Tracker
**Path**: `/ideas/windows-security-tracker/`
**Purpose**: Track virus growth and exploit count since Windows 10 end of support

### 4. Lego Tracker
**Path**: `/ideas/lego-tracker/`
**Purpose**: Track retired Lego sets via barcode scanning, maintain library, show price charts over time

## Development Workflow

1. Each idea lives in its own folder under `/ideas/`
2. Each idea has its own SPEC.md documenting requirements and implementation
3. Shared resources (CSS, utilities) go in `/shared/`
4. All changes committed to feature branches (claude/*)
5. GitHub Pages automatically publishes from the main branch
6. Access prototypes at: `https://<username>.github.io/cc-ideas/ideas/<prototype-name>/`

## Testing on Mobile

1. Open `https://<username>.github.io/cc-ideas/` on mobile device
2. Select a prototype from the overview page
3. Add to home screen for app-like experience
4. Test touch interactions, responsive layouts, and offline features

## Adding New Prototypes

See `CLAUDE_INSTRUCTIONS.md` for detailed instructions on adding new prototype ideas to this repository.
