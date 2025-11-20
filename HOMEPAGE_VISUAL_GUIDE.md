# 🎨 Homepage Visual Guide

## Component Architecture

```
HomePage.tsx (Router)
    │
    ├─── IF authenticated & onboarding complete
    │    └─── FarmerFriendlyDashboard.tsx (Existing)
    │
    └─── ELSE
         └─── MarketingHomePage.tsx
              │
              ├─── Navigation Bar
              │    ├─── Logo
              │    ├─── LanguageSelector
              │    ├─── Login Button
              │    └─── Signup Button
              │
              ├─── HeroSection.tsx
              │    ├─── Logo & Title
              │    ├─── Tagline
              │    ├─── Key Benefits (4 cards)
              │    ├─── CTA Buttons
              │    └─── Trust Indicator
              │
              ├─── FeaturesGrid.tsx
              │    ├─── Section Header
              │    ├─── 6 Feature Cards
              │    │    ├─── Soil Saathi
              │    │    ├─── Disease Detection
              │    │    ├─── AI Advisor
              │    │    ├─── Weather Intelligence
              │    │    ├─── Smart Marketplace
              │    │    └─── Mandi Prices
              │    └─── Bottom CTA
              │
              └─── Footer
                   ├─── Branding
                   ├─── Links
                   └─── Copyright
```

## Layout Breakdown

### Desktop View (1920x1080)
```
┌─────────────────────────────────────────────────────────────┐
│ 🌾 Plant Saathi AI          [EN ▼] [Login] [Sign Up]       │ ← Nav Bar
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    🌾 Plant Saathi AI                       │
│         Your AI-powered farming companion                   │
│         for smarter decisions and better yields             │
│                                                             │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│    │ 🛰️       │ │ 🧠       │ │ 📈       │ │ 🌱       │   │
│    │Satellite │ │AI Insights│ │Market   │ │Disease   │   │
│    │Data      │ │          │ │Intel    │ │Detection │   │
│    └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                             │
│         [Get Started Free]  [Learn More]                    │
│                                                             │
│         ✓ Trusted by 10,000+ farmers across India          │
│                                                             │
├─────────────────────────────────────────────────────────────┤ ← Hero Section
│                                                             │
│           Everything You Need to Farm Smarter               │
│     Six powerful modules working together to maximize       │
│              your farm productivity                         │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ 🛰️          │ │ 🐛          │ │ 🧠          │         │
│  │ Soil Saathi │ │ Disease     │ │ AI Advisor  │         │
│  │             │ │ Detection   │ │             │         │
│  │ Real-time   │ │ AI-powered  │ │ Personalized│         │
│  │ satellite   │ │ crop disease│ │ farming     │         │
│  │ monitoring  │ │ ID with     │ │ advice      │         │
│  │ with NDVI   │ │ treatment   │ │ powered by  │         │
│  │ EVI & soil  │ │ recommend-  │ │ advanced AI │         │
│  │ moisture    │ │ ations      │ │             │         │
│  │             │ │             │ │             │         │
│  │ Learn more →│ │ Learn more →│ │ Learn more →│         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ ☁️          │ │ 🛒          │ │ 📈          │         │
│  │ Weather     │ │ Smart       │ │ Mandi       │         │
│  │ Intelligence│ │ Marketplace │ │ Prices      │         │
│  │             │ │             │ │             │         │
│  │ 16-day      │ │ AI-         │ │ Live market │         │
│  │ forecasts   │ │ recommended │ │ prices and  │         │
│  │ with farming│ │ products    │ │ trends to   │         │
│  │ specific    │ │ based on    │ │ help you    │         │
│  │ alerts      │ │ field needs │ │ sell right  │         │
│  │             │ │             │ │             │         │
│  │ Learn more →│ │ Learn more →│ │ Learn more →│         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                             │
│         Ready to transform your farming?                    │
│            [Start Now - It's Free]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤ ← Features Grid
│                                                             │
│                  🌾 Plant Saathi AI                         │
│        Empowering farmers with AI and satellite             │
│                    technology                               │
│                                                             │
│        About | Contact | Privacy | Terms                    │
│                                                             │
│          © 2024 Plant Saathi AI. All rights reserved.      │
│                                                             │
└─────────────────────────────────────────────────────────────┘ ← Footer
```

### Tablet View (768x1024)
```
┌───────────────────────────────────────┐
│ 🌾 Plant Saathi  [EN] [Login] [Sign] │
├───────────────────────────────────────┤
│                                       │
│        🌾 Plant Saathi AI             │
│   Your AI-powered farming companion   │
│                                       │
│   ┌──────┐ ┌──────┐ ┌──────┐        │
│   │ 🛰️   │ │ 🧠   │ │ 📈   │        │
│   └──────┘ └──────┘ └──────┘        │
│                                       │
│   [Get Started]  [Learn More]        │
│                                       │
├───────────────────────────────────────┤
│                                       │
│   Everything You Need to Farm Smarter │
│                                       │
│  ┌────────────┐ ┌────────────┐      │
│  │ 🛰️         │ │ 🐛         │      │
│  │ Soil       │ │ Disease    │      │
│  │ Saathi     │ │ Detection  │      │
│  └────────────┘ └────────────┘      │
│                                       │
│  ┌────────────┐ ┌────────────┐      │
│  │ 🧠         │ │ ☁️         │      │
│  │ AI Advisor │ │ Weather    │      │
│  └────────────┘ └────────────┘      │
│                                       │
│  ┌────────────┐ ┌────────────┐      │
│  │ 🛒         │ │ 📈         │      │
│  │ Marketplace│ │ Mandi      │      │
│  └────────────┘ └────────────┘      │
│                                       │
│      [Start Now - It's Free]         │
│                                       │
├───────────────────────────────────────┤
│         © 2024 Plant Saathi AI        │
└───────────────────────────────────────┘
```

### Mobile View (375x667)
```
┌─────────────────────────┐
│ 🌾 Plant  [EN] [Login]  │
├─────────────────────────┤
│                         │
│   🌾 Plant Saathi AI    │
│   Your AI-powered       │
│   farming companion     │
│                         │
│   ┌────┐ ┌────┐        │
│   │ 🛰️ │ │ 🧠 │        │
│   └────┘ └────┘        │
│                         │
│   [Get Started Free]    │
│   [Learn More]          │
│                         │
├─────────────────────────┤
│                         │
│  Everything You Need    │
│  to Farm Smarter        │
│                         │
│  ┌───────────────────┐ │
│  │ 🛰️                │ │
│  │ Soil Saathi       │ │
│  │                   │ │
│  │ Real-time         │ │
│  │ satellite         │ │
│  │ monitoring        │ │
│  │                   │ │
│  │ Learn more →      │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │ 🐛                │ │
│  │ Disease Detection │ │
│  │                   │ │
│  │ AI-powered crop   │ │
│  │ disease ID        │ │
│  │                   │ │
│  │ Learn more →      │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │ 🧠                │ │
│  │ AI Advisor        │ │
│  │ ...               │ │
│  └───────────────────┘ │
│                         │
│  [... 3 more cards]     │
│                         │
│  [Start Now - Free]     │
│                         │
├─────────────────────────┤
│  © 2024 Plant Saathi    │
└─────────────────────────┘
```

## Color Scheme

### Hero Section
```css
background: linear-gradient(to bottom right, 
  #16a34a,  /* green-600 */
  #10b981,  /* emerald-600 */
  #16a34a   /* green-700 */
);
color: white;
```

### Feature Cards
```css
/* Soil Saathi */
gradient: from-blue-500 to-blue-600

/* Disease Detection */
gradient: from-red-500 to-red-600

/* AI Advisor */
gradient: from-purple-500 to-purple-600

/* Weather */
gradient: from-cyan-500 to-cyan-600

/* Marketplace */
gradient: from-orange-500 to-orange-600

/* Mandi Prices */
gradient: from-green-500 to-green-600
```

### Hover Effects
```css
/* Feature Cards */
hover:shadow-xl
hover:border-green-500
hover:scale-110 (icon)

/* Buttons */
hover:bg-green-700
hover:bg-green-50
```

## Typography

### Hero Section
```
Title: text-4xl sm:text-6xl font-bold
Tagline: text-xl sm:text-2xl text-green-50
Benefits: text-sm font-medium
```

### Features Grid
```
Section Title: text-3xl sm:text-4xl font-bold
Section Subtitle: text-lg text-gray-600
Card Title: text-xl font-bold
Card Description: text-sm text-gray-600
```

### Navigation
```
Logo: text-2xl font-bold text-green-600
Buttons: text-base font-medium
```

## Spacing

### Desktop
```
Hero Section: py-16 sm:py-24
Features Grid: py-16
Card Padding: p-6
Card Gap: gap-6
```

### Mobile
```
Hero Section: py-12
Features Grid: py-12
Card Padding: p-4
Card Gap: gap-4
```

## Responsive Breakpoints

```css
/* Mobile First */
default: 1 column

/* Tablet (md: 768px) */
md: 2 columns

/* Desktop (lg: 1024px) */
lg: 3 columns

/* Large Desktop (xl: 1280px) */
xl: 3 columns (wider)
```

## Interactive Elements

### Buttons
```
Primary CTA:
- bg-white text-green-600
- hover:bg-green-50
- shadow-xl
- px-8 py-6

Secondary CTA:
- border-2 border-white
- text-white
- hover:bg-white/10
- px-8 py-6
```

### Feature Cards
```
Default:
- border-2
- hover:shadow-xl
- hover:border-green-500
- cursor-pointer
- transition-all duration-300

Icon:
- group-hover:scale-110
- transition-transform
```

### Language Selector
```
- Dropdown menu
- Flags or language codes
- Smooth transition
```

## Animation Timing

```css
/* Card Hover */
transition: all 300ms ease-in-out

/* Icon Scale */
transition: transform 300ms ease-in-out

/* Button Hover */
transition: background-color 200ms ease-in-out

/* Scroll Behavior */
scroll-behavior: smooth
```

## Accessibility

### Keyboard Navigation
```
Tab Order:
1. Skip to content
2. Language selector
3. Login button
4. Signup button
5. Get Started button
6. Learn More button
7. Feature cards (1-6)
8. Footer links
```

### Screen Reader
```html
<nav aria-label="Main navigation">
<section aria-labelledby="hero-heading">
<section aria-labelledby="features-heading">
<footer aria-label="Site footer">
```

### Focus States
```css
focus:ring-2
focus:ring-green-500
focus:ring-offset-2
```

## Loading States

### Initial Load
```
1. Show skeleton (optional)
2. Load hero section (400ms)
3. Load features grid (600ms)
4. Total: ~800ms
```

### Auth Check
```
1. Check localStorage/session
2. Query Supabase (if needed)
3. Render appropriate view
4. Total: ~200-500ms
```

## Error States

### Network Error
```
Show: "Unable to load. Please check your connection."
Action: Retry button
```

### Auth Error
```
Show: Marketing page (fallback)
Log: Error to console
```

## Success States

### Anonymous User
```
✓ Marketing page loaded
✓ All features visible
✓ CTAs clickable
✓ Language selector works
```

### Authenticated User
```
✓ Dashboard loaded
✓ User data fetched
✓ Widgets populated
✓ Navigation ready
```

---

## Component Props

### HomePage
```typescript
// No props - handles logic internally
```

### MarketingHomePage
```typescript
// No props - self-contained
```

### HeroSection
```typescript
// No props - uses i18n for text
```

### FeaturesGrid
```typescript
// No props - uses i18n for text
```

---

## State Management

### HomePage State
```typescript
const [loading, setLoading] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [onboardingComplete, setOnboardingComplete] = useState(false);
```

### No Global State Needed
- Auth state from Supabase
- Translations from i18n
- No Redux/Context required

---

**This visual guide shows the complete structure and styling of your new homepage!**
