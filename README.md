# MiniMath - Educational Math Game

MiniMath is a kid-friendly educational math game built with Next.js, TypeScript, and SCSS modules. The application provides an interactive learning experience for children 6+ covering addition, subtraction, multiplication, division, mixed operations, and simple linear equations.

## 🚀 Features Implemented

### ✅ Project Setup
- **Next.js 15** with App Router and TypeScript
- **SCSS Modules** for component-level styling
- **Responsive Design** with breakpoints at 576/768/992/1200/1400px
- **Theme System** with light/dark mode support
- **Accessibility** features including keyboard navigation and proper contrast

### ✅ Architecture
- **Component-based structure** with reusable SCSS modules
- **Design system** with tokens, breakpoints, and themes
- **Global styles** for base elements and utilities
- **Type-safe routing** with dynamic pages

### ✅ Pages & Components
- **Home Page** (`/`) - Mode selection with 6 math operation cards
- **Game Pages** (`/play/[mode]`) - Dynamic routing for each math mode
- **Results Page** (`/results`) - Session summary and achievements
- **Header Component** - MiniMath logo with gradient animation
- **Theme Toggle** - Persistent light/dark mode switching

### ✅ Styling System
- **Design Tokens** - Typography, spacing, colors, shadows, and radii
- **Responsive Breakpoints** - Mobile-first design with utilities
- **Theme Variables** - CSS custom properties for light/dark themes
- **Kid-friendly Design** - Bright colors, large touch targets, playful animations

### ✅ Accessibility
- **WCAG AA contrast** ratios for both themes
- **Keyboard navigation** support throughout
- **Focus-visible** indicators for interactive elements
- **Touch targets** minimum 44×44px for mobile
- **Screen reader** friendly with proper ARIA labels

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules + CSS Variables
- **Icons**: Unicode emojis (no dependencies)
- **Development**: ESLint, Prettier, Jest

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header and theme
│   ├── page.tsx           # Home page with mode selection
│   ├── page.module.scss   # Home page styles
│   ├── play/[mode]/       # Dynamic game pages
│   │   ├── page.tsx       # Game page component
│   │   └── page.module.scss
│   └── results/           # Results summary page
│       ├── page.tsx
│       └── page.module.scss
├── components/            # Reusable components
│   ├── Header.tsx         # Main navigation header
│   ├── Header.module.scss
│   ├── ThemeToggle.tsx    # Light/dark mode switcher
│   └── ThemeToggle.module.scss
└── styles/               # Global styling system
    ├── _breakpoints.scss  # Responsive breakpoint utilities
    ├── _tokens.scss       # Design token variables
    ├── _theme.scss        # CSS custom properties for theming
    └── globals.scss       # Global styles and resets
```

## 🎨 Design Features

### Theme System
- **Automatic detection** of system theme preference
- **Persistent storage** of user theme choice
- **Smooth transitions** between light and dark modes
- **CSS variables** for consistent theming

### Kid-Friendly Interface
- **Large, colorful cards** for each math operation
- **Emoji icons** for visual recognition
- **Gradient animations** on logos and titles
- **Gentle hover effects** with scale and bounce
- **Supportive microcopy** throughout the interface

### Responsive Design
- **Mobile-first** approach with progressive enhancement
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly** controls on mobile devices
- **Readable typography** that scales appropriately

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run typecheck` - Type checking without emission

## 🎯 What's Next

This scaffolded version provides the foundation for:

- **Game Logic Implementation** - Problem generation and validation
- **Progress Tracking** - LocalStorage-based progress persistence  
- **Difficulty Levels** - 1-digit, 2-digit, and 3-digit number support
- **Visual Learning Aids** - Number lines, dot arrays, and balance scales
- **Interactive Feedback** - Instant validation with hints and encouragement

## 📋 Acceptance Criteria Status

✅ **Project scaffolded** with Next.js (App Router) and TypeScript  
✅ **SCSS set up** with modules and global design system  
✅ **Responsive system** with breakpoint utilities  
✅ **Theming system** with CSS variables and persistence  
✅ **Header** with logo and theme toggle  
✅ **Pages implemented**:
- `/` - Mode selection with 6 operation cards
- `/play/[mode]` - Dynamic game pages
- `/results` - Session summary page  
✅ **Accessibility features** implemented  
✅ **English UI** throughout  
✅ **No extra dependencies** beyond requirements

The MiniMath project is now ready for game logic implementation and further feature development!