<!-- Deployment trigger: 2024-04-23 -->

# 4CHAN500: The AI-Powered Meme Index Fund

A web application for collecting and analyzing meme and trading data, providing real-time insights into meme market trends and virality.

## 🌟 Features

- **AI-Powered Analysis**
  - Real-time sentiment analysis of trending memes
  - Virality forecasting using engagement metrics
  - Market sentiment summaries and predictions

- **Meme Market Metrics**
  - LULZ Score: Overall meme performance metric
  - Vibe Shift: Sentiment change indicator
  - Forecast Score: Early virality potential
  - Real-time price updates based on engagement

- **Data Sources**
  - Reddit r/memes integration
  - 4chan board monitoring
  - Social media trend tracking
  - User submissions

- **User Interface**
  - Real-time meme feed
  - Market sentiment dashboard
  - Trending tickers display (ticker table limited to 50 entries for performance)
  - Mobile-responsive design

## 🏗️ Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── firebase-test/      # Firebase diagnostics
│   │   ├── memes/             # Meme data endpoints
│   │   └── sentiment/         # Sentiment analysis
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Main layout
│   └── page.tsx               # Home page
│
├── components/                 # UI Components
│   ├── ui/                    # Shadcn UI components
│   ├── header.tsx             # Site header
│   ├── market-sentiment.tsx   # Market analysis
│   ├── submission-form.tsx    # User submissions
│   ├── theme-provider.tsx     # Theme management
│   ├── ticker-table.tsx       # Meme tickers
│   └── trending-tickers.tsx   # Trending display
│
├── hooks/                     # React Hooks
│   ├── use-mobile.tsx        # Mobile detection
│   └── use-toast.ts          # Notifications
│
├── lib/                       # Utilities
│   ├── data.ts               # Data handling
│   ├── firebase-admin.ts     # Firebase setup
│   ├── format-utils.ts       # Formatting
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # General utilities
│
├── python-scripts/            # Python Backend
│   ├── reddit_scraper.py     # Reddit data collection
│   ├── forecast_trends.py    # Virality forecasting
│   └── firebase_admin_setup.py # Firebase Python setup
│
├── public/                    # Static Assets
│   └── assets/
│       └── memes/            # Meme images
│
├── scripts/                   # Build Scripts
│   └── format-firebase-key.js # Firebase key formatter
│
└── styles/                    # CSS
    ├── animations.css        # Animations
    └── globals.css           # Global styles
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Components**: Radix UI
- **Animation**: Framer Motion
- **Forms**: React Hook Form
- **Dates**: date-fns

### Backend
- **API**: Next.js API Routes
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage

### Data Processing
- **Language**: Python
- **APIs**: Reddit API, OpenAI API
- **Libraries**: Requests, Beautiful Soup
- **Analysis**: Custom virality algorithms

### Infrastructure
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm
- **Linting**: ESLint
- **CSS Processing**: PostCSS + Autoprefixer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- pnpm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/4chan500.git
cd 4chan500
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Python Scripts
- `reddit_scraper.py`: Fetches and processes Reddit memes
- `forecast_trends.py`: Calculates virality metrics
- `firebase_admin_setup.py`: Firebase Python SDK setup

### Firebase Setup

1. Generate Firebase credentials:
```bash
node scripts/format-firebase-key.js
```

2. Add to Vercel environment variables:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (with quotes)

### Deployment

1. Push to main branch:
```bash
git push origin main
```

2. Vercel will automatically deploy

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Not Configured**
   - Check environment variables
   - Verify service account key format
   - Clear Vercel cache

2. **Python Script Errors**
   - Verify Python version
   - Check dependencies
   - Review Firebase permissions

3. **Deployment Issues**
   - Check Vercel logs
   - Verify environment variables
   - Clear build cache

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@4chan500.com or open an issue.