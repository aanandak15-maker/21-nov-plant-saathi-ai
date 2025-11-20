# 🎨 Farmer-Friendly Animation Usage Guide

## Quick Start

All animations are available via CSS classes. Just add the class to any element!

## 🌱 Nature-Inspired Animations

### Plant Growth
```tsx
<div className="animate-plant-grow">
  <Sprout className="w-8 h-8" />
</div>
```
**Use for**: Logo reveals, feature icons, success states

### Satellite Pulse
```tsx
<div className="animate-satellite-pulse">
  <Satellite className="w-8 h-8" />
</div>
```
**Use for**: Real-time data indicators, active monitoring badges

### Leaf Sway
```tsx
<div className="animate-leaf-sway">
  <Leaf className="w-8 h-8" />
</div>
```
**Use for**: Organic/sustainable badges, eco-friendly indicators

## 📊 Data & Stats Animations

### Counter Animation
```tsx
<div className="animate-count-up">
  <div className="text-3xl font-bold">12,500+</div>
  <div className="text-sm">Active Farmers</div>
</div>
```
**Use for**: Statistics, metrics, achievement numbers

### Card Reveal (with stagger)
```tsx
{features.map((feature, index) => (
  <Card 
    className="animate-card-reveal"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Card content */}
  </Card>
))}
```
**Use for**: Feature grids, product lists, testimonials

### Data Point Reveal
```tsx
<div className="animate-data-point-reveal">
  <div className="w-4 h-4 rounded-full bg-green-500" />
</div>
```
**Use for**: Map markers, chart points, field locations

## 🎯 Scroll-Triggered Animations

### Fade In Up
```tsx
<section className="animate-fade-in-up">
  <h2>Section Title</h2>
  <p>Content appears from bottom</p>
</section>
```
**Use for**: Section headers, content blocks

### Fade In Left/Right
```tsx
<div className="animate-fade-in-left">
  <img src="screenshot.jpg" alt="App screenshot" />
</div>

<div className="animate-fade-in-right">
  <div className="feature-description">...</div>
</div>
```
**Use for**: Image-text layouts, alternating content

### Scale In
```tsx
<div className="animate-scale-in">
  <Card>Feature card</Card>
</div>
```
**Use for**: Modal popups, important announcements

## 🖱️ Hover Effects

### Lift on Hover
```tsx
<Card className="hover-lift">
  <h3>Feature Title</h3>
  <p>Lifts up on hover</p>
</Card>
```
**Use for**: Cards, buttons, clickable elements

### Glow on Hover
```tsx
<Button className="hover-glow">
  Start Free Trial
</Button>
```
**Use for**: Primary CTAs, important actions

### Scale on Hover
```tsx
<div className="hover-scale">
  <img src="icon.svg" alt="Icon" />
</div>
```
**Use for**: Icons, small images, badges

## 🌦️ Weather Animations

### Weather Sway
```tsx
<div className="animate-weather-sway">
  <CloudRain className="w-8 h-8" />
</div>
```
**Use for**: Weather icons, forecast cards

### Rain Drop
```tsx
<div className="animate-rain-drop">
  <Droplet className="w-4 h-4" />
</div>
```
**Use for**: Rainfall indicators, irrigation alerts

## ⏳ Loading States

### Skeleton Loading
```tsx
<div className="skeleton-loading h-20 w-full rounded-lg" />
```
**Use for**: Content placeholders while loading

### Shimmer Effect
```tsx
<div className="skeleton-loading">
  <div className="h-4 w-3/4 bg-gray-200 rounded" />
  <div className="h-4 w-1/2 bg-gray-200 rounded mt-2" />
</div>
```
**Use for**: Loading states, data fetching

## 🎬 Complex Animations

### Staggered List
```tsx
{items.map((item, index) => (
  <div 
    key={item.id}
    className="animate-card-reveal"
    style={{ 
      animationDelay: `${index * 0.1}s`,
      opacity: 0 
    }}
  >
    {item.content}
  </div>
))}
```

### Progress Bar
```tsx
<div 
  className="h-2 bg-green-500 rounded-full"
  style={{
    animation: 'progress-fill 1s ease-out forwards',
    '--progress-value': '75%'
  } as React.CSSProperties}
/>
```

### Button Press Feedback
```tsx
<Button 
  className="active:animate-button-press"
  onClick={handleClick}
>
  Submit
</Button>
```

## 🎨 Combining Animations

### Card with Multiple Effects
```tsx
<Card className="animate-card-reveal hover-lift hover-glow">
  <div className="animate-satellite-pulse">
    <Satellite className="w-8 h-8" />
  </div>
  <h3>Satellite Monitoring</h3>
  <p>Real-time field health</p>
</Card>
```

### Stats with Counter + Hover
```tsx
<div className="animate-count-up hover-scale">
  <div className="text-3xl font-bold">98%</div>
  <div className="text-sm">Satisfaction</div>
</div>
```

## ♿ Accessibility

All animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who prefer reduced motion will see instant transitions instead of animations.

## 🎯 Best Practices

### DO:
✅ Use animations to guide attention
✅ Keep durations short (0.3-0.8s)
✅ Stagger multiple elements (0.1s increments)
✅ Use nature-inspired animations for farming context
✅ Combine hover effects with base animations

### DON'T:
❌ Animate everything (be selective)
❌ Use long durations (>1s)
❌ Animate on every interaction
❌ Ignore accessibility (always respect reduced motion)
❌ Use distracting infinite animations

## 📱 Mobile Considerations

Animations work great on mobile, but:
- Hover effects don't apply (touch devices)
- Keep animations subtle for battery life
- Test on actual devices

## 🔧 Custom Animations

To create custom animations:

```css
/* In your component CSS or farmer-animations.css */
@keyframes custom-animation {
  0% { /* start state */ }
  100% { /* end state */ }
}

.my-custom-animation {
  animation: custom-animation 0.6s ease-out forwards;
}
```

## 🎉 Examples in Action

Check these components for live examples:
- `src/components/homepage/HeroSection.tsx` - Stats counters
- `src/components/homepage/FeaturesGrid.tsx` - Card reveals
- `src/components/homepage/TestimonialsSection.tsx` - Testimonial cards

## 📚 Animation Reference

| Animation Class | Duration | Use Case |
|----------------|----------|----------|
| `animate-plant-grow` | 0.8s | Icons, logos |
| `animate-satellite-pulse` | 2s (infinite) | Active indicators |
| `animate-card-reveal` | 0.6s | Cards, content blocks |
| `animate-count-up` | 0.8s | Statistics, numbers |
| `animate-fade-in-up` | 0.8s | Sections, headers |
| `animate-scale-in` | 0.6s | Modals, popups |
| `hover-lift` | 0.3s | Interactive cards |
| `hover-glow` | 0.3s | Primary buttons |
| `hover-scale` | 0.3s | Icons, images |

Happy animating! 🌾✨
