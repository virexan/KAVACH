---
name: KAVACH Portal
description: AI-Powered Welfare & Workload Analysis Platform
colors:
  primary: "#0f766e"
  primary-hover: "#0d9488"
  background: "#f8fafc"
  surface: "#ffffff"
  surface-alt: "#f1f5f9"
  border: "#e2e8f0"
  text-primary: "#0f172a"
  text-secondary: "#334155"
  text-muted: "#64748b"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  info: "#3b82f6"
  risk-low: "#3b82f6"
  risk-moderate: "#f59e0b"
  risk-elevated: "#f97316"
  risk-high: "#dc2626"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.45
  tiny:
    fontFamily: "Inter, sans-serif"
    fontSize: "10px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: KAVACH Portal

## Overview

**Creative North Star: "The Guided Shield"**

KAVACH is designed to be a calm, secure, and professional early-welfare support platform. Rather than presenting high-intensity alerts, the visual architecture focuses on structured layouts, desaturated tones, and progressive disclosure to convey safety, operational trust, and intelligence.

Key Characteristics:
- Calm brand colors (teal primary, slate background)
- Clean, layout-preserving grid rhythms
- Low-intensity desaturated status badges
- Clear accessibility focus outlines

## Colors

The color palette is composed of professional teal and neutral slate elements to deliver an authoritative yet supportive user experience.

### Primary
- **Calm Teal** (#0f766e): Used for brand elements, logo icons, active navigation tabs, and primary action buttons.

### Neutral
- **Slate Text Primary** (#0f172a): Main typography color for headers and titles.
- **Slate Text Secondary** (#334155): Standard paragraph text body.
- **Slate Text Muted** (#64748b): Captions, labels, table subtitles.
- **Slate Background** (#f8fafc): Overall page background color.
- **Slate Surface** (#ffffff): Card background, panel segments.
- **Slate Border** (#e2e8f0): Thin border accents.

### Named Rules
**The Rarity of Brand Primary Rule.** The primary brand Teal accent is utilized on less than 10% of any screen surface to draw attention strictly to critical actions.

## Typography

**Display Font:** Inter (with system-ui, -apple-system, sans-serif fallbacks)
**Body Font:** Inter (with sans-serif fallbacks)

### Hierarchy
- **Display** (Bold, 2.25rem, 1.2): Main landing headers.
- **Headline** (SemiBold, 1.875rem, 1.25): Dashboard section titles.
- **Title** (SemiBold, 1.25rem, 1.3): Widget and card headers.
- **Body** (Regular, 1rem, 1.45): Primary copy paragraphs.
- **Label** (Medium, 0.875rem, 1.4): Table headers and text input titles.
- **Tiny** (Medium, 10px): Small tags, metadata indicators, footer lines.

## Layout

The spatial model uses an 8px layout grid with strict margins:
- Margins: 16px (sm), 24px (md), 32px (lg).
- Columns: standard 12-column grid layout for responsive viewports.

## Elevation & Depth

KAVACH is flat-by-default, utilizing light borders and tone changes rather than heavy elevations.

### Shadow Vocabulary
- **Card Shadow** (`0 1px 3px 0 rgba(0,0,0,0.1)`): Standard resting card containers.
- **Panel Shadow** (`0 4px 6px -1px rgba(0,0,0,0.1)`): Hovered cards or sliding panels.

## Shapes

Form elements use a clean curved shape language:
- Standard Buttons: 8px border-radius (`rounded-lg`)
- Data Cards: 12px border-radius (`rounded-xl`)
- Badge Pill shapes: 9999px border-radius (`rounded-full`)

## Components

### Buttons
- **Shape:** 8px radius (`rounded-lg`).
- **Primary:** Calm Teal background with Slate Surface text.
- **Hover:** Slightly lighter teal-600 (`#0d9488`) with a scale transition of 150ms.

### Cards / Containers
- **Corner Style:** 12px radius.
- **Background:** White (`#ffffff`).
- **Border:** Thin Slate Border (`#e2e8f0`).

## Do's and Don'ts

### Do:
- **Do** map risk indicators to desaturated badges using the label + icon format.
- **Do** preserve 24px padding inside widgets to prevent visual clutter.

### Don't:
- **Don't** use high-intensity neon colors for headers.
- **Don't** overlay multiple shadow layers on resting containers.
