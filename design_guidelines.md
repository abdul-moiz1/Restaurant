# Gourmet Haven Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from upscale restaurant platforms like OpenTable, Resy, and Tock, combined with the elegant simplicity of culinary-focused experiences. The design emphasizes sophistication, clarity, and appetite appeal through refined visual hierarchy and premium material treatments.

## Core Design Elements

### A. Typography
- **Headings**: Playfair Display or Cormorant Garamond (serif) - conveys elegance and culinary refinement
  - H1: text-5xl lg:text-6xl font-bold
  - H2: text-3xl lg:text-4xl font-semibold
  - H3: text-2xl font-semibold
- **Body**: Inter or Source Sans Pro (sans-serif) - modern readability
  - Base: text-base leading-relaxed
  - Small: text-sm
  - Large: text-lg
- **Accent Text**: Gold elements use font-medium or font-semibold for emphasis

### B. Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 to p-8
- Section spacing: py-12 lg:py-20
- Card gaps: gap-6 lg:gap-8
- Form fields: space-y-4

**Container Strategy**:
- Max width: max-w-7xl mx-auto
- Content sections: px-4 lg:px-8
- Cards: max-w-sm to max-w-md

### C. Color Application
- **Primary Background**: White (bg-white)
- **Gold Accent** (#c9a348): 
  - Primary CTAs and highlights
  - Hover states: darken to #b08f3a
  - Borders and decorative elements
- **Supporting Palette**:
  - Neutral grays: bg-gray-50, bg-gray-100, text-gray-600, text-gray-800
  - Success states: green-600 for available items
  - Borders: border-gray-200

## Component Library

### Navigation Bar
- Sticky header with backdrop-blur-sm bg-white/95
- Logo: "🍽️ Gourmet Haven" in serif font (text-2xl font-bold)
- Links: Horizontal layout with gold underline on hover (border-b-2 border-[#c9a348])
- CTA buttons use gold background
- Height: h-16 to h-20

### Hero Section (Home Page)
- **Layout**: Full-width hero with centered content overlay
- **Image**: High-quality restaurant ambiance or signature dish (h-[500px] lg:h-[600px])
- **Overlay**: Dark gradient (bg-gradient-to-b from-black/40 to-black/60)
- **Content**: 
  - Large serif headline in white
  - Subtitle in white/90
  - Primary CTA with blurred background (backdrop-blur-md bg-[#c9a348]/90)
  - No hover effects on hero buttons

### Menu Cards
- **Card Structure**: 
  - White background with subtle shadow (shadow-md hover:shadow-xl)
  - Rounded corners (rounded-lg)
  - Image: aspect-ratio-4/3, object-cover, rounded-t-lg
  - Content padding: p-6
- **Content Hierarchy**:
  - Dish image at top (h-48 to h-56)
  - Dish name (text-xl font-semibold serif)
  - Description (text-gray-600 text-sm line-clamp-2)
  - Tags as pills (inline-flex px-3 py-1 bg-gray-100 rounded-full text-xs)
  - Price in gold (text-[#c9a348] text-lg font-bold)
- **Grid Layout**: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

### Forms (DishForm & PreferencesForm)
- **Container**: White card with shadow-lg, rounded-xl, p-8
- **Input Fields**:
  - Full-width with border-gray-300
  - Rounded (rounded-md)
  - Focus ring in gold (focus:ring-2 focus:ring-[#c9a348])
  - Labels: font-medium text-gray-700 mb-2
- **Checkboxes**: Gold accent color
- **Slider**: Custom track with gold fill
- **Submit Button**: Full-width gold background, py-3, rounded-md

### Dashboard Layout
- **Owner Dashboard**:
  - Header with welcome message and "Add New Dish" CTA (gold button)
  - Stats cards: Grid of 3-4 cards showing metrics (total dishes, available, etc.)
  - Menu management table/grid below
- **Customer Dashboard**:
  - Two-column layout: Preferences form (sticky) + Menu browsing area
  - Preferences card: Fixed sidebar on desktop (lg:w-80)

### Role Selector Modal
- **Overlay**: Fixed inset-0 bg-black/50 backdrop-blur-sm
- **Modal**: Centered white card (max-w-md rounded-2xl p-8)
- **Options**: Two large clickable cards
  - Icons or illustrations for Customer/Owner
  - Radio button selection
  - Gold border on selected state

### Footer
- Multi-column layout (4 columns on desktop)
- Sections: About, Quick Links, Contact, Newsletter
- Dark background (bg-gray-900 text-gray-300)
- Gold accents for links and newsletter CTA
- Restaurant hours and contact info included

## Images

### Hero Image
- **Placement**: Full-width hero section on Home page
- **Type**: Elegant restaurant interior or beautifully plated signature dish
- **Treatment**: Dark overlay with gradient for text readability
- **Size**: 1920x1080 minimum resolution

### Menu Card Images
- **Placement**: Top of each menu card
- **Type**: Food photography - close-up, well-lit dish presentations
- **Aspect Ratio**: 4:3 landscape
- **Treatment**: No overlay, rounded top corners only

### Dashboard Background (Optional)
- Subtle pattern or texture in bg-gray-50 for visual interest

## Interactions & States
- **Buttons**: Transform scale on hover (hover:scale-105 transition-transform)
- **Cards**: Subtle lift effect (hover:shadow-xl transition-shadow)
- **Links**: Color change and underline (hover:text-[#c9a348])
- **No animations** on modal overlays - instant appearance
- **Loading states**: Gold spinner or skeleton screens

## Accessibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels for icon-only buttons
- Keyboard navigation support