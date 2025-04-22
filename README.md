# 4CHAN500: The AI-Powered Meme Index Fund

A web application for collecting and analyzing meme and trading data.

## Project Structure

```
.
├── app/
│   ├── globals.css               # Global CSS styles
│   ├── layout.tsx                # Main application layout component
│   └── page.tsx                  # Main page component
│
├── components/
│   ├── ui/                       # UI component library
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── header.tsx                # Header component
│   ├── market-sentiment.tsx      # Market sentiment component
│   ├── submission-form.tsx       # Form for submissions
│   ├── theme-provider.tsx        # Theme provider component
│   ├── ticker-table.tsx          # Table for displaying tickers
│   └── trending-tickers.tsx      # Trending tickers component
│
├── hooks/
│   ├── use-mobile.tsx            # Hook for mobile detection
│   └── use-toast.ts              # Hook for toast notifications
│
├── lib/
│   ├── data.ts                   # Data utilities
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
│
├── public/                       # Public assets
│
├── styles/                       # Additional styles
│
├── chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json  # Firebase service account key
├── components.json               # Component configuration
├── debug_kym_page.html           # Debug HTML for KYM scraper
├── firebase_admin_setup.py       # Firebase Admin SDK setup
├── kym_debug.html                # Debug HTML for KYM scraper
├── kym_scraper.py                # Know Your Meme scraper script
├── next.config.mjs               # Next.js configuration
├── package.json                  # NPM package configuration
├── pnpm-lock.yaml                # PNPM lock file
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── trending_memes.json           # JSON output from the KYM scraper
└── tsconfig.json                 # TypeScript configuration
```

## The First Meta-Memecoin

## Firebase Integration

The project uses Firebase Admin SDK for backend services. The setup is in `firebase_admin_setup.py`, which initializes Firebase with the service account key and provides a Firestore client for database operations.

## Scripts

- `kym_scraper.py` - A Python script to scrape trending memes from Know Your Meme website.

## Technology Stack

- Next.js - React framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Firebase - Backend and database services
- Python - For scraping and backend scripts

## Getting Started

1. Install dependencies:
```
npm install
```

2. Run the development server:
```
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Firebase Setup

Firebase connection is set up using the `firebase_admin_setup.py` script, which needs the service account JSON file to authenticate with Firebase.

## Deploying to Vercel

### Firebase Configuration for Vercel

The project is configured to work both locally and on Vercel. For Vercel deployment, you'll need to set the following environment variables:

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add the following variables:

```
FIREBASE_PROJECT_ID=chan500
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@chan500.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

The private key should be copied from your Firebase service account JSON file, with newlines properly escaped as `\n`.

### Local Development

For local development, you can use the Firebase service account JSON file directly. The app is configured to look for `chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json` in the project root.

Alternatively, you can create a `.env.local` file with the same environment variables as above for local development. 