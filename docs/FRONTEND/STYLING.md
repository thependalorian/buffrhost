# Frontend Styling Guide

**Status: High-Level Outline**

This document provides guidelines for the styling and visual identity of the Buffr Host frontend.

## 1. Technology Stack

- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **CSS Preprocessor**: PostCSS

## 2. Core Principles

- **Utility-First**: Leverage Tailwind's utility classes for most styling to ensure consistency and reduce custom CSS.
- **Responsive Design**: All components and pages must be fully responsive and tested on mobile, tablet, and desktop breakpoints.
- **Theming**: The application uses a theme file (`tailwind.config.js`) to define the primary color palette, fonts, and spacing.

## 3. Color Palette

- **Primary**: `#4F46E5` (Indigo)
- **Secondary**: `#10B981` (Emerald)
- **Neutral**: A range of grays from `slate-100` to `slate-900`.
- **Error**: `#EF4444` (Red)
- **Success**: `#22C55E` (Green)

## 4. Typography

- **Font Family**: Inter (sans-serif)
- **Headings**: Use `text-xl`, `text-2xl`, `text-3xl` etc. with a heavier font weight (`font-bold`).
- **Body**: Use `text-base` with a normal font weight (`font-normal`).

## 5. Custom CSS

- Custom CSS should be avoided whenever possible.
- When necessary, group custom styles in the main `styles/globals.css` file using Tailwind's `@layer` directive to keep them organized.
