# Mobile Responsiveness Testing Guide

## Breakpoints to Test

- **320px** - Small mobile (iPhone SE)
- **375px** - Standard mobile (iPhone 12/13)
- **390px** - iPhone 14 Pro
- **414px** - Large mobile (iPhone Plus models)
- **768px** - Tablet portrait
- **1024px** - Tablet landscape
- **1280px** - Small desktop
- **1920px** - Full HD desktop

## Components Mobile Checklist

### ✅ Hero Section
- [x] Responsive typography (3xl → 7xl)
- [x] Stacked CTAs on mobile
- [x] Touch targets (min 44px)
- [x] Readable line lengths
- [x] Entrance animations work on mobile

### ✅ Credibility Strip
- [x] Horizontal scroll on mobile
- [x] Auto-scroll disabled on mobile
- [x] Swipeable
- [x] Logo sizing appropriate

### ✅ Value Section
- [x] Single column layout
- [x] Staggered animations
- [x] Readable typography
- [x] Border accents visible

### ✅ Case Studies
- [x] Stack cards on mobile (1 column)
- [x] 3 columns on desktop
- [x] Touch-friendly card interactions
- [x] Image placeholders scale correctly

### ✅ Process Section
- [x] Stack on mobile
- [x] 3 columns on desktop
- [x] Flow indicators appropriate
- [x] Icons visible

### ✅ About Section
- [x] Stack headshot + content on mobile
- [x] Side-by-side on desktop
- [x] CV button full-width on mobile

### ✅ Two-Door CTA
- [x] Stack cards on mobile
- [x] Side-by-side on desktop
- [x] Touch-friendly buttons
- [x] Day rate visible

### ✅ Footer
- [x] Stack contact links on mobile
- [x] Horizontal on desktop
- [x] Touch-friendly links

### ✅ Three.js Background
- [x] Disabled on mobile (performance)
- [x] Desktop only

## Testing Checklist

### Visual Testing
- [ ] Test all breakpoints in Chrome DevTools
- [ ] Test on real iOS device (iPhone)
- [ ] Test on real Android device
- [ ] Check landscape orientation
- [ ] Verify safe area insets (notch)

### Touch Interactions
- [ ] All buttons min 44px × 44px
- [ ] No hover-only interactions
- [ ] Swipe gestures work
- [ ] No accidental taps

### Performance
- [ ] Smooth scrolling (60fps)
- [ ] No layout shifts
- [ ] Fast initial load
- [ ] Animations perform well

### Typography
- [ ] Text readable without zooming
- [ ] Line lengths appropriate
- [ ] No text overflow
- [ ] Contrast ratios meet WCAG AA

### Layout
- [ ] No horizontal scroll
- [ ] Safe areas respected
- [ ] Proper spacing
- [ ] Images scale correctly

## Browser Testing

- [ ] Safari iOS (primary)
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet

## Known Mobile Optimizations

1. **Lazy Loading**: Below-fold sections load on scroll
2. **Reduced Motion**: Animations respect user preferences
3. **Touch Targets**: All interactive elements ≥44px
4. **Viewport Units**: iOS-safe viewport heights
5. **Font Optimization**: Inter font with `font-display: swap`

## Testing Tools

### Browser DevTools
```
Chrome DevTools → Toggle Device Toolbar (Cmd+Shift+M)
- Select device or enter custom dimensions
- Test touch simulation
- Throttle network
```

### Lighthouse Audit
```bash
npm run build
npm run start
# Then run Lighthouse in Chrome DevTools
```

### Responsive Design Mode (Firefox)
```
Cmd+Option+M (macOS) / Ctrl+Shift+M (Windows/Linux)
```

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Mobile-Specific Features

1. **Safe Area Insets**: Respects iOS notch
2. **Touch Scroll**: Smooth native scrolling
3. **Text Size Adjust**: Prevents auto-zoom on iOS
4. **Viewport Units**: Uses `-webkit-fill-available`
5. **Performance**: Three.js disabled on mobile

