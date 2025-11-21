# Page Transition System

A clean, sophisticated page transition system that creates smooth animations when navigating between the home page and project pages.

## How It Works

### The Animation Sequence

**Forward Navigation (Home → Project):**
1. User clicks on a case study card
2. Entire page scales down to 0.85, dark overlay fades in (400ms)
3. Project page slides up from bottom with leading color rectangle (600ms)
4. Transition completes, overlay fades out

**Back Navigation (Project → Home):**
1. User triggers back navigation (browser back, trackpad gesture, or UI button)
2. Project page slides down off screen (0.6s) - reveals scaled home page underneath
3. Home page scales back up from 0.85 to 1.0 (0.4s) - sequential after slide-down
4. Overlay fades out
5. Total duration: 1.0s (0.6s + 0.4s)

### Architecture

#### `lib/transitionConfig.ts`
Centralized configuration for all animation timing and values.

**Configuration:**
- `durations`: Animation durations in seconds (scale, slideUp, slideDown, overlay, navigationDelay)
- `easing`: Easing curves for smooth motion (smooth, slideEase)
- `scale`: Scale values for home page animation (normal: 1, reduced: 0.85)
- `overlay`: Overlay opacity values (visible: 0.4, hidden: 0)

#### `lib/context/TransitionContext.tsx`
Global state management for transitions.

**State:**
- `direction`: Navigation direction (`forward`, `back`, `null`)
- `cardMetadata`: Info about clicked card (slug, color, position)
- `isTransitioning`: Boolean flag for active transitions
- `isProjectSliding`: Boolean flag tracking if project is sliding down (enables sequential animations)

**Actions:**
- `startTransition(metadata)`: Initiates forward transition with card metadata
- `startBackTransition()`: Initiates back transition (sets `isProjectSliding: true`)
- `completeProjectSlideDown()`: Called when project finishes sliding down (triggers home scale-up)
- `completeTransition()`: Marks transition as complete
- `resetTransition()`: Resets all transition state to idle

**Hooks:**
- `useTransition()`: Access transition state and actions
- `useNavigateBack()`: Programmatic back navigation with animations (for UI buttons)

#### `TransitionOverlay.tsx`
Dark overlay that provides visual focus during transitions.

**Behavior:**
- Fades in when `isTransitioning` is true
- Fades out when transition completes
- Non-interactive (pointer-events-none)
- Uses centralized config for timing and opacity

#### `PageScaleWrapper.tsx`
Wraps the home page and handles scaling animations.

**Behavior:**
- Scales to 0.85 when navigating forward (to project)
- **Stays scaled at 0.85 while viewing projects** (key for reveal effect)
- Scales back to 1.0 **only after** project slides down (`isProjectSliding: false`)
- Sequential timing ensures proper reveal animation
- Uses `transform-origin: center center` for consistent scaling
- All values configured via `transitionConfig.ts`

#### `ProjectPageWrapper.tsx`
Wraps project pages and handles entry and exit animations.

**Behavior:**
- **Entry:** Slides up from `translateY(100vh)` to `translateY(0)` with leading colored rectangle
- **Exit:** Slides down to `translateY(100vh)` on back navigation (when `direction === 'back'`)
- Uses `useAnimation` controls for programmatic animation triggering
- Calls `completeProjectSlideDown()` when slide-down finishes (triggers home scale-up)
- Stagger effect (0.15s delay) on both entry and exit for polish
- Uses centralized timing and easing config

#### `BackNavigationHandler.tsx`
Detects browser back navigation and triggers animations.

**Behavior:**
- Monitors pathname changes (home page only)
- Uses Performance API to detect back/forward navigation
- Calls `startBackTransition()` when detected
- Auto-resets after **sequential** animation duration (1.0s total)
- Timing accounts for slide-down (0.6s) + scale-up (0.4s)

### Modified Files

#### `app/layout.tsx`
Wraps the entire app with:
- `TransitionProvider`: Makes transition state globally available
- `TransitionOverlay`: Renders the dark overlay
- `BackNavigationHandler`: Detects back navigation

#### `app/page.tsx`
Wrapped with `PageScaleWrapper` to enable scaling animation.

#### `app/components/CaseStudyCard.tsx`
Enhanced with transition trigger:
- Captures click events
- Stores card metadata (slug, color, position)
- Initiates transition via `startTransition()`
- Adds visual highlight (white ring) when clicked
- Delays navigation using config timing

#### `app/components/ProjectTemplate.tsx`
Wrapped with `ProjectPageWrapper` to enable slide-up animation.

### Using Programmatic Back Navigation

For custom UI buttons (like "Back to Projects"), use the `useNavigateBack` hook:

```typescript
import { useNavigateBack } from '@/lib/context/TransitionContext';

function BackButton() {
  const navigateBack = useNavigateBack();
  
  return (
    <button onClick={navigateBack}>
      ← Back to Projects
    </button>
  );
}
```

This triggers the same reveal animation as browser back button or trackpad gestures.

## Implementation Status

All components have been implemented and are working together:
- ✅ `lib/transitionConfig.ts` - Animation configuration
- ✅ `lib/context/TransitionContext.tsx` - State management
- ✅ `app/components/transitions/TransitionOverlay.tsx` - Dark overlay
- ✅ `app/components/transitions/PageScaleWrapper.tsx` - Home page scaling
- ✅ `app/components/transitions/ProjectPageWrapper.tsx` - Project slide animations
- ✅ `app/components/transitions/BackNavigationHandler.tsx` - Back navigation detection
- ✅ `app/components/CaseStudyCard.tsx` - Transition triggers
- ✅ `app/layout.tsx` - Provider and overlay integration
- ✅ `app/page.tsx` - Home page wrapper
- ✅ `app/components/ProjectTemplate.tsx` - Project page wrapper

## Customization

All animation values are centralized in `lib/transitionConfig.ts` for easy customization.

### Adjusting Animation Timing

Edit `transitionConfig.ts`:

```typescript
durations: {
  scale: 0.4,          // Home page scale animation duration
  slideUp: 0.6,        // Project entry slide-up duration
  slideDown: 0.6,      // Project exit slide-down duration (back navigation)
  overlay: 0.4,        // Overlay fade duration
  navigationDelay: 0.5, // Delay before page navigation (forward)
}
```

**Note:** For the best visual effect, keep `slideDown` and `slideUp` the same duration.

### Adjusting Scale Amount

```typescript
scale: {
  normal: 1,
  reduced: 0.85,  // Change to 0.7 for dramatic, 0.95 for subtle
}
```

### Adjusting Overlay Opacity

```typescript
overlay: {
  visible: 0.4,  // Change opacity (0.2 = light, 0.6 = dark)
  hidden: 0,
}
```

### Customizing Easing

```typescript
easing: {
  smooth: 'easeInOut',
  slideEase: [0.22, 1, 0.36, 1], // Custom cubic bezier
}
```

Common alternatives:
- `"easeInOut"`: Smooth ease in and out
- `"easeOut"`: Fast start, slow end
- `[0.4, 0, 0.2, 1]`: Material Design standard easing

### Disabling Transitions

To temporarily disable the transition system:

1. **Remove wrapper from home page** (`app/page.tsx`):
```typescript
// Remove PageScaleWrapper
return (
  <>
    <main>...</main>
  </>
);
```

2. **Remove wrapper from project pages** (`app/components/ProjectTemplate.tsx`):
```typescript
// Remove ProjectPageWrapper
return (
  <>
    <main>...</main>
  </>
);
```

3. **Disable card interaction** (`CaseStudyCard.tsx`):
```typescript
// Comment out onClick handler
<Link href={`/${study.slug}`}>
  {cardContent}
</Link>
```

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari 13+
- ⚠️ Requires JavaScript enabled
- ⚠️ Performance API for back navigation detection

## Performance Considerations

- Uses `will-change: transform` for GPU acceleration
- Animations use `transform` (GPU-accelerated) over position properties
- Overlay uses `pointer-events: none` to avoid blocking interactions
- Context updates are minimized to prevent unnecessary re-renders
- Home page remains scaled at 0.85 during project viewing (no performance impact, pure CSS transform)
- Sequential animations use Promise callbacks for precise timing coordination

## Troubleshooting

**Animation feels laggy:**
- Reduce animation durations
- Simplify easing curves
- Check for heavy components re-rendering

**Back navigation not working:**
- Ensure `BackNavigationHandler` is in layout
- Check browser console for errors
- Verify Performance API is available

**Overlay stays visible:**
- Check transition phase in React DevTools
- Verify `completeTransition()` is being called
- Check for JavaScript errors blocking execution

**Card doesn't highlight when clicked:**
- Verify `isClicked` state is updating
- Check Tailwind ring classes are applying
- Ensure card metadata is being captured

**Back navigation animations don't run:**
- Verify Performance API support in browser
- Check that `BackNavigationHandler` is mounted in layout
- Ensure you're on the home page (`/` pathname)
- Look for `isProjectSliding` state changes in React DevTools

**Home page scales up too early (before project slides down):**
- Check that `isProjectSliding` is true when project starts sliding
- Verify `completeProjectSlideDown()` is being called at the right time
- Ensure sequential timing logic in `PageScaleWrapper` is correct

**Project page doesn't slide down smoothly:**
- Check `direction === 'back'` condition in `ProjectPageWrapper`
- Verify both page and color rect animations are running
- Ensure `slideDown` duration is configured correctly

