# Senior Connect Helper

## Overview
An educational web application designed to help older adults understand and connect to modern technology. This app provides simple, visual guides for common technology challenges like understanding WiFi vs cellular data, connecting to streaming services, pairing Bluetooth devices, and more.

## Target Users
- Adults 60+ years old
- People new to smartphones and smart devices
- Caregivers helping elderly family members
- Anyone who feels overwhelmed by modern technology

## Core Features

### 1. Topic Browser
- Browse by category (Internet, Streaming, Smart Home, etc.)
- Search functionality for specific topics
- Favorite topics for quick access

### 2. Visual Step-by-Step Guides
- Large, clear screenshots with annotations
- Simple language avoiding jargon
- Print-friendly versions
- Videos where helpful

### 3. Common Scenarios Covered

#### Internet Connectivity
- Understanding WiFi vs Cellular Data
- Connecting to WiFi networks
- Troubleshooting "No Internet" problems
- Understanding data usage

#### Streaming Services
- Connecting Roku to WiFi
- Finding apps on Roku/Fire TV/Apple TV
- Setting up Netflix, Hulu, Prime Video
- Using streaming service search

#### Smart Devices
- Pairing Bluetooth headphones
- Setting up smart speakers (Alexa, Google Home)
- Understanding app permissions
- Managing notifications

#### Email & Communication
- Reading and sending emails
- Understanding spam/phishing
- Video calling (FaceTime, Zoom)
- Text messaging basics

### 4. Glossary
- Simple definitions of technical terms
- Searchable and browsable
- Cross-linked with guides

### 5. Tips & Tricks
- Battery saving tips
- Privacy and security basics
- Accessibility features
- Common shortcuts

## Technical Implementation

### Technologies Used
- HTML5 (semantic markup for accessibility)
- CSS3 (Grid/Flexbox for responsive layout)
- Vanilla JavaScript (ES6+)
- No external frameworks

### Data Storage
- LocalStorage for:
  - Favorite topics
  - Recently viewed guides
  - User preferences (text size, high contrast mode)

### External Dependencies
None - fully self-contained for reliability

### Content Structure
```
/ideas/senior-connect-helper/
├── index.html          # Main navigation page
├── SPEC.md            # This file
├── style.css          # App-specific styles
├── app.js             # Main application logic
├── guides/            # Individual guide HTML files
│   ├── wifi-vs-cellular.html
│   ├── connect-roku.html
│   └── ...
├── assets/
│   ├── images/        # Screenshots and diagrams
│   └── icons/         # UI icons
└── data/
    └── guides.json    # Guide metadata and search index
```

## Mobile Considerations

### Extra Large Text
- Base font size: 18px (vs standard 16px)
- Headings proportionally larger
- User can increase further via settings

### Touch Targets
- All buttons minimum 56x56px (larger than standard 44px)
- Generous spacing between interactive elements
- No hover-dependent interactions

### Simplified Navigation
- Maximum 2 levels deep
- Back button always visible
- Breadcrumb trail on all pages

### High Contrast Mode
- Optional high contrast color scheme
- Better for users with vision impairment
- Stored in LocalStorage

### Screen Reader Support
- All images have descriptive alt text
- Proper heading hierarchy
- ARIA labels where needed
- Skip to content link

## User Experience Flow

1. **Landing Page**: User sees categories and search
2. **Category View**: User sees list of guides in category
3. **Guide View**: User reads step-by-step instructions with images
4. **Related Guides**: Suggested next steps at bottom of each guide

## Future Enhancements

### Phase 2
- [ ] Video walkthroughs for complex tasks
- [ ] Printable PDF versions of guides
- [ ] Voice search using Web Speech API
- [ ] Dark mode option

### Phase 3
- [ ] Community Q&A section
- [ ] User-submitted tips
- [ ] Share guides via email/text
- [ ] Progressive Web App (PWA) with offline support

### Phase 4
- [ ] Multi-language support (Spanish first)
- [ ] Device-specific guides (auto-detect iOS vs Android)
- [ ] Integration with video calling for remote tech support
- [ ] Accessibility features (text-to-speech for guides)

## Development Status
- [ ] Basic structure and navigation
- [ ] Category browsing system
- [ ] Search functionality
- [ ] First 5 guides completed
- [ ] Print-friendly styling
- [ ] Favorite/bookmark system
- [ ] Mobile optimization complete
- [ ] Accessibility audit passed
- [ ] User testing with target audience
- [ ] Complete and launched

## Success Metrics
- Easy to navigate (user testing)
- All guides complete in under 10 steps
- Text readable without zooming
- Works on iOS Safari and Chrome Android
- Lighthouse accessibility score > 95
- Positive feedback from senior users

## Known Issues
None yet - prototype not started

## Content Planning

### Initial Guide Topics (MVP)

**Internet & WiFi (5 guides)**
1. What is WiFi vs Cellular Data?
2. How to Connect to WiFi
3. Why Does My WiFi Say "No Internet"?
4. How to Turn WiFi On/Off
5. Understanding Data Usage

**Streaming (5 guides)**
1. How to Connect Roku to WiFi
2. Finding Netflix on Your Roku
3. How to Search for Shows
4. Understanding Subscription Services
5. Troubleshooting Buffering Issues

**Basic Phone Use (5 guides)**
1. How to Make a Video Call
2. Sending Text Messages with Pictures
3. Understanding Notifications
4. Managing Your Battery
5. Taking and Sharing Photos

**Safety & Security (5 guides)**
1. Recognizing Scam Emails
2. Creating Strong Passwords
3. Understanding App Permissions
4. Safe Online Shopping
5. Two-Factor Authentication Explained

## Design Guidelines

### Color Palette
- Large, clear buttons with high contrast
- Avoid red/green only indicators (colorblind-friendly)
- Primary: Blue (#3b82f6) - trustworthy, calm
- Secondary: Green (#10b981) - success, positive
- Warning: Orange (#f59e0b) - caution
- Text: Dark gray (#1f2937) - easy to read

### Typography
- Sans-serif font (system default for familiarity)
- Minimum 18px body text
- Line height: 1.7 (more space between lines)
- Shorter paragraphs (3-4 lines max)

### Images
- Large, clear screenshots
- Annotations with arrows and circles
- Simplified where possible (crop unnecessary UI)
- Alt text describes both what's shown and what to do

### Language
- No jargon or technical terms without explanation
- Active voice ("Tap the button" not "The button should be tapped")
- Short sentences (max 20 words)
- One instruction per step

---

**Last Updated**: 2025-11-16
**Status**: Planned
**Priority**: High (simplest scope, highest impact)
