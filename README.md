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

## Deploying to Vercel

### Firebase Configuration for Vercel

The project is configured to work both locally and on Vercel. For Vercel deployment, you need to set up Firebase environment variables:

1. Run the helper script to generate properly formatted environment variables:
   ```
   node scripts/format-firebase-key.js
   ```

2. Go to your Vercel project settings
3. Navigate to the "Environment Variables" section
4. Add the following variables exactly as shown by the script output:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` - **IMPORTANT**: Include the double quotes around the value!

5. After adding the environment variables, redeploy your application from the Vercel dashboard or push a new commit.

### Troubleshooting Vercel Deployment

If your application shows "Firebase not configured" on Vercel:

1. **Run the helper script** to generate properly formatted values:
   ```
   node scripts/format-firebase-key.js
   ```

2. **In the Vercel dashboard**:
   - Go to your project settings
   - Select "Environment Variables"
   - Delete any existing Firebase variables
   - Add these three variables **exactly** as shown in the script output:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY` (include the quotes around the value!)

3. **After adding variables**:
   - Redeploy your application (Project > Deployments > "Redeploy" on your latest deployment)
   - Or click Settings > Deployments > "Create a new deployment" 

4. **If it still doesn't work**:
   - Visit the diagnostic endpoint at `/api/firebase-test` on your Vercel deployment
   - Check the values of the environment variables
   - Review your Vercel Function logs for any Firebase initialization errors

5. **Common Issues**:
   - Quotes missing from private key value
   - Private key format incorrect (needs `\n` for newlines)
   - Project cached with old environment variables (try a clean redeploy)

### Local Development

For local development, you can use the Firebase service account JSON file directly. The app is configured to look for `chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json` in the project root.

Alternatively, you can create a `.env.local` file with the same environment variables as above for local development. 