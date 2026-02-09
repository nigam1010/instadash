# 📊 InstaDash - Instagram Competitors Analytics

A real-time Instagram analytics dashboard that tracks your performance against competitors using automated data scraping and AI-powered insights.

![Dashboard Preview](docs/dashboard.png)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Apify        │────▶│      n8n        │────▶│   MongoDB       │
│ (Instagram      │     │  (Automation)   │     │   Atlas         │
│  Scraper)       │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌────────────────────────────────┘
                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Vercel       │◀────│     Render      │◀────│   Meta Graph    │
│  (Frontend)     │     │   (Backend)     │     │     API         │
│   React/Vite    │     │    FastAPI      │     │ (Your IG Data)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## ✨ Features

- **Real-time Analytics** - Track followers, engagement, and post performance
- **Competitor Tracking** - Monitor up to 5 competitors automatically
- **AI Insights** - Get actionable recommendations
- **Visual Charts** - Recharts-powered data visualization
- **Auto-scraping** - n8n triggers daily Apify scrapes

---

## 🔄 Data Pipeline

### Step 1: Apify Scraper
The [Instagram Scraper](https://apify.com/apify/instagram-scraper) extracts:
- Profile info (followers, posts, bio)
- Recent posts (likes, comments, views)
- Engagement metrics

![Apify Configuration](docs/apify.png)

### Step 2: n8n Automation
n8n workflow:
1. Triggers Apify scraper on schedule
2. Receives webhook when scrape completes
3. Transforms and stores data in MongoDB

![n8n Workflow](docs/n8n.png)

### Step 3: Dashboard
FastAPI backend processes data and React frontend visualizes it.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Meta Developer account (for your IG data)

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your credentials
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
META_PAGE_ID=your_instagram_page_id
META_ACCESS_TOKEN=your_meta_access_token
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (Vercel)**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📁 Project Structure

```
instadash/
├── backend/
│   ├── main.py              # FastAPI entry
│   ├── models.py            # Pydantic models
│   ├── database.py          # MongoDB connection
│   └── routers/
│       ├── analytics.py     # Your IG data (Meta API)
│       ├── competitors.py   # Competitor data
│       ├── insights.py      # AI insights generation
│       └── proxy.py         # Image proxy (CORS)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main dashboard
│   │   ├── App.css          # Styles
│   │   └── services/api.js  # API client
│   └── index.html
│
└── docs/
    ├── apify.png            # Apify setup screenshot
    └── n8n.png              # n8n workflow screenshot
```

---

## 🌐 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Backend | Render | `https://instadash-backend.onrender.com` |
| Frontend | Vercel | `https://instadash.vercel.app` |
| Database | MongoDB Atlas | Cloud |
| Automation | n8n Cloud | Cloud |

---

## 📊 Dashboard Sections

1. **Performance Pulse** - Key metrics at a glance
2. **Market Trajectory** - Historical engagement trends
3. **Competitor Deep Dive** - Profile cards with best posts
4. **Your Analytics** - Post-level performance
5. **Market Showdown** - Your best vs competitor's best

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Recharts, Vite |
| Backend | FastAPI, Beanie ODM |
| Database | MongoDB Atlas |
| Scraping | Apify |
| Automation | n8n |
| Icons | Lucide React |

---

## 📜 License

MIT License - feel free to use for your own projects!

---

## 🤝 Contributing

PRs welcome! Please open an issue first to discuss changes.
