# Instructions for Claude/AI Agents

This document provides guidelines for AI agents (Claude) working on this repository. Follow these patterns to maintain consistency and quality across all prototypes.

## Repository Purpose

This is a GitHub Pages-hosted collection of web prototypes. Each prototype is a standalone web application designed to work excellently on mobile devices, accessible at `https://<username>.github.io/cc-ideas/`.

## Core Principles

1. **Mobile-First Design**: Always design for mobile screens first, then enhance for larger screens
2. **No Build Step (Default)**: Use vanilla HTML/CSS/JS unless there's a compelling reason for React
3. **Self-Contained**: Each prototype should work independently
4. **Consistent Structure**: Follow the established folder pattern
5. **Well-Documented**: Every prototype needs a SPEC.md file

## Adding a New Prototype

### Step 1: Create Folder Structure

```bash
ideas/
└── your-prototype-name/
    ├── index.html
    ├── SPEC.md
    ├── style.css
    ├── app.js
    └── assets/          # Optional: images, icons, etc.
```

### Step 2: Create SPEC.md

Every prototype MUST have a SPEC.md file with these sections:

```markdown
# [Prototype Name]

## Overview
Brief description of what this prototype does and why it exists.

## Target Users
Who is this for?

## Core Features
- Feature 1
- Feature 2
- Feature 3

## Technical Implementation

### Technologies Used
- HTML5
- CSS3 (with CSS Grid/Flexbox)
- Vanilla JavaScript (ES6+)
- [Any APIs or libraries]

### Data Storage
How data is stored (LocalStorage, IndexedDB, etc.)

### External Dependencies
List any CDN libraries or APIs used

## Mobile Considerations
Specific mobile UX decisions and touch interactions

## Future Enhancements
Ideas for future iterations

## Development Status
- [ ] Basic structure
- [ ] Core functionality
- [ ] Mobile optimization
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Complete

## Known Issues
Any current bugs or limitations
```

### Step 3: Create index.html

Use this template as a starting point:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[Brief description for SEO]">
    <meta name="theme-color" content="#3b82f6">
    <title>[Prototype Name]</title>

    <!-- Shared styles -->
    <link rel="stylesheet" href="../../shared/styles/mobile-first.css">

    <!-- Prototype-specific styles -->
    <link rel="stylesheet" href="style.css">

    <!-- PWA Meta Tags (Optional but recommended) -->
    <link rel="apple-touch-icon" href="assets/icon-192.png">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <header>
        <nav>
            <a href="../../index.html" class="back-link">← All Prototypes</a>
        </nav>
        <h1>[Prototype Name]</h1>
    </header>

    <main>
        <!-- Your content here -->
    </main>

    <footer>
        <p>Part of <a href="../../index.html">CC-Ideas</a> prototypes collection</p>
    </footer>

    <!-- Shared utilities -->
    <script src="../../shared/scripts/utils.js"></script>

    <!-- Prototype-specific JavaScript -->
    <script src="app.js"></script>
</body>
</html>
```

### Step 4: Create style.css

Start with mobile-first CSS:

```css
/* Mobile-first styles */
:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --text-color: #1f2937;
    --bg-color: #ffffff;
    --border-radius: 8px;
    --spacing: 1rem;
}

/* Base styles for mobile */
main {
    padding: var(--spacing);
    max-width: 100%;
}

/* Touch-friendly buttons */
button {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 24px;
    font-size: 16px;
}

/* Tablet styles */
@media (min-width: 768px) {
    main {
        padding: calc(var(--spacing) * 2);
        max-width: 768px;
        margin: 0 auto;
    }
}

/* Desktop styles */
@media (min-width: 1024px) {
    main {
        max-width: 1024px;
    }
}
```

### Step 5: Create app.js

Use modern JavaScript patterns:

```javascript
// Use strict mode
'use strict';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Initialize your app
    setupEventListeners();
    loadData();
    render();
}

function setupEventListeners() {
    // Add event listeners
}

function loadData() {
    // Load from LocalStorage or API
}

function render() {
    // Update UI
}

// Export functions if needed by other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init };
}
```

### Step 6: Update Main Index

Add your prototype to `/index.html`:

```html
<div class="prototype-card">
    <h3>Your Prototype Name</h3>
    <p>Brief description of the prototype</p>
    <a href="ideas/your-prototype-name/" class="btn">Launch →</a>
</div>
```

## Using React (When Necessary)

If a prototype truly needs React (complex state management, rich interactions):

### Step 1: Create React App in Prototype Folder

```bash
cd ideas/your-prototype-name/
npx create-react-app .
```

### Step 2: Update Package.json

Add homepage field:

```json
{
  "homepage": "/cc-ideas/ideas/your-prototype-name/",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "npm run build"
  }
}
```

### Step 3: Update GitHub Actions

The `.github/workflows/pages.yml` workflow will automatically detect React apps and build them.

### Step 4: Document in SPEC.md

Clearly indicate that the prototype uses React and requires a build step.

## Shared Resources

### Shared CSS (`/shared/styles/mobile-first.css`)

Use shared CSS for:
- CSS resets and normalize
- Base typography
- Mobile-first utilities
- Common component styles (buttons, cards, forms)

### Shared JavaScript (`/shared/scripts/utils.js`)

Use shared utilities for:
- LocalStorage helpers
- API fetch wrappers
- Common formatting functions
- Mobile detection utilities

## Mobile Best Practices

### Touch Targets
- Minimum 44x44px for interactive elements
- Adequate spacing between touch targets (8px minimum)

### Responsive Images
```html
<img src="image.jpg"
     srcset="image-320.jpg 320w, image-640.jpg 640w, image-1280.jpg 1280w"
     sizes="(max-width: 640px) 100vw, 640px"
     alt="Description">
```

### Viewport Meta Tag
Always include (already in template):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Prevent Zoom on Input Focus (iOS)
```css
input, select, textarea {
    font-size: 16px; /* Prevents iOS zoom */
}
```

### Use CSS Grid and Flexbox
```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}
```

## Performance Optimization

### Lazy Loading Images
```html
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" alt="Description">
```

### Code Splitting (Vanilla JS)
```javascript
// Load heavy features only when needed
async function loadFeature() {
    const module = await import('./heavy-feature.js');
    module.init();
}
```

### Minimize Dependencies
- Use native browser APIs when possible
- Only include CDN libraries if absolutely necessary
- Consider bundle size impact

## Accessibility Checklist

Before marking a prototype complete:

- [ ] Semantic HTML elements used appropriately
- [ ] All images have alt text
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Tested with screen reader (VoiceOver or NVDA)
- [ ] No auto-playing media
- [ ] Forms have proper labels

## Testing Checklist

- [ ] Works on iOS Safari (primary mobile browser)
- [ ] Works on Chrome Android
- [ ] Responsive on 320px width (iPhone SE)
- [ ] Responsive on 768px width (iPad)
- [ ] Responsive on 1920px width (desktop)
- [ ] Touch interactions work smoothly
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Works offline (if PWA features added)

## Git Workflow

1. Always work on a branch starting with `claude/`
2. Commit messages should be descriptive:
   - `feat: Add barcode scanning to Lego Tracker`
   - `fix: Resolve touch event bug on iOS`
   - `docs: Update SPEC.md for StreamFinder`
   - `style: Improve mobile layout for Senior Connect Helper`
3. Push to origin with `-u` flag: `git push -u origin claude/feature-name`
4. Update PLAN.md with progress

## Common Pitfalls to Avoid

1. **Don't forget viewport meta tag** - Mobile won't work properly without it
2. **Don't use hover-only interactions** - Mobile has no hover state
3. **Don't make text too small** - Minimum 16px for body text
4. **Don't create tiny touch targets** - Minimum 44x44px
5. **Don't use `alert()`** - Use custom modals with proper touch handling
6. **Don't forget to test on actual devices** - Emulators aren't perfect
7. **Don't hardcode API keys** - Use environment variables or backend proxy
8. **Don't skip the SPEC.md** - Future agents need this context

## File Naming Conventions

- **Folders**: lowercase-with-hyphens
- **HTML**: index.html (or feature-name.html)
- **CSS**: style.css (or feature-name.css)
- **JavaScript**: app.js (or feature-name.js)
- **Images**: descriptive-name.jpg (lowercase-with-hyphens)
- **Documentation**: UPPERCASE.md (SPEC.md, README.md)

## When to Ask for Clarification

Ask the user when:
1. The prototype requirements are ambiguous
2. You need to choose between significantly different approaches
3. External API access or costs are involved
4. The scope seems too large for a single prototype
5. Accessibility or privacy concerns arise

## Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Comprehensive web API documentation
- [Can I Use](https://caniuse.com/) - Browser compatibility tables
- [WebAIM](https://webaim.org/) - Web accessibility resources
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Google's mobile usability test

## Success Criteria

A prototype is considered "complete" when:

1. ✅ All core features from SPEC.md are implemented
2. ✅ Works perfectly on mobile devices (iOS Safari + Chrome Android)
3. ✅ Passes accessibility audit
4. ✅ Lighthouse score > 90
5. ✅ No console errors
6. ✅ Code is clean and well-commented
7. ✅ SPEC.md is up to date
8. ✅ Added to main index.html
9. ✅ Tested on real devices (not just emulators)
10. ✅ User feedback incorporated (if available)

---

**Remember**: Quality over quantity. It's better to have one excellent, polished prototype than multiple half-finished ones. Take time to test on real mobile devices and ensure everything works smoothly.

**Last Updated**: 2025-11-16
