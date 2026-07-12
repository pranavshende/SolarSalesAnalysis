# Solar Intelligence & Sales Optimization Platform

An AI-powered, centralized decision support system designed for solar companies, policymakers, and investors. It eliminates fragmented data by processing 10 years of historical data (2014-2024) across 36 Indian States and Union Territories to provide actionable insights, financial metrics, and AI-driven forecasting.

## 🚀 Key Features

### 1. Executive & Revenue Dashboards
- **Executive View**: Aggregates thousands of records (81.8+ GW national capacity) to showcase Top Performing states and Year-over-Year (YoY) growth charts. Features Carbon Offset tracking (CO2 savings) and competitive benchmarking.
- **Revenue Analytics**: Isolates the financial impact by calculating CapEx using standardized cost matrices, tracking investment velocity, and visualizing ROI distribution across the nation.

### 2. Geo-Intelligence Hub
- **Interactive Mapping**: React-Leaflet integrated with ArcGIS World Imagery for real satellite views, choropleth heatmaps, and spatial risk analysis (dust/soiling risk).
- **Solar Park Inspector**: Explore major Indian mega solar parks (e.g., Bhadla, Pavagada) with custom markers, popup metrics, and city-wise hover tooltips.
- **Real-Time Satellite Vision AI**: Uses OpenCV HSV color segmentation via a Python ML microservice to detect PV panel clusters dynamically from the map, estimating MW capacity in real-time!

### 3. AI Forecasting Engine
- **Polynomial Regression (Degree 2)**: Replaces standard linear models to accurately map the exponential, parabolic growth curve of solar adoption in India.
- **Predictive Analytics**: Validated with an 80/20 train/test split on historical data. Predicts future capacity targets up to 2030 with dynamic Confidence Intervals, enabling supply chain optimization for manufacturers.

### 4. Innovation Hub & 3D Simulation
- **Solar Walkthrough**: Interactive 3D solar farm simulation built with Three.js and `@react-three/fiber`.
- **AR Simulator & Financial Tools**: Calculate panel capacity based on surface area, track policies, and use the ROI financial simulator.
- **Smart Chatbot**: Context-aware AI assistant deployed across the platform (e.g., explains ML models when on the Forecast page).

### 5. Sales Intelligence & Deep Analytics
- **Smart Lead Prioritization**: Weighted scoring engine ranks sales leads by potential.
- **Weather-Impact Insights**: Correlates sales opportunities with regional weather data.
- **Advanced Financial Metrics**: Calculates 10-Year CAGR to highlight long-term sustainable growth, filtering out short-term market volatility.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Three.js (`@react-three/fiber`), Leaflet.js (Geo-mapping), html2canvas
- **Backend**: Node.js, Express.js, Mongoose / PostgreSQL, Passport.js
- **ML Service**: Python, FastAPI, scikit-learn (`PolynomialFeatures`), OpenCV (Vision AI), Pillow, pandas
- **Database**: MongoDB (core app) and PostgreSQL (for analytical relational data)
- **Containerization**: Docker, Docker Compose

## 📁 Project Structure

```text
├── backend/                  # Node.js/Express backend API (auth, routes, analytics proxy)
├── frontend/                 # React frontend application (dashboards, 3D walkthrough, maps)
├── ml_service/               # Python/FastAPI microservice for forecasting & vision AI
├── data/                     # Raw and processed datasets (CSV/Excel: 2014-2024 data)
├── output/                   # Generated graphs and analysis outputs
├── docker-compose.yml        # Docker configuration to spin up all services
├── package.json              # Root package.json for concurrently running all services
├── requirements.txt          # Python dependencies for ML service & offline scripts
├── solar_analysis.py         # Standalone script for comprehensive solar sales analysis
├── generate_yoy_line.py      # Script to generate Year-over-Year performance charts
├── plot_results.py           # Visualization script for plotting dataset trends
└── upload_data.py            # Utility to automate data upload processes
```

## 🧑‍💻 User Roles
- **Admin**: Full access to all features, including User and System Management.
- **Analyst**: Access to data upload, processing pipelines, and in-depth analytics.
- **Sales Manager**: Access to view dashboard metrics, performance reports, and forecasts.
- **Investor**: Access to high-level summaries, ROI metrics, and growth projections.

## ⚙️ Setup & Installation

### Option 1: Docker (Recommended)
You can easily spin up the entire application (Database, Backend, Frontend, and ML Service) using Docker Compose.

1. Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop) is installed and running.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```
3. The services will be available at:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **ML Service**: http://localhost:8000

### Option 2: Local Development Setup
If you prefer running the services natively on your machine:

**1. Prerequisites**
- Node.js (v18+)
- Python (3.9+)
- MongoDB (Running locally on port 27017)

**2. Install Root Dependencies**
```bash
npm install
```

**3. Setup ML Environment**
```bash
python -m venv ml_service\.venv
.\ml_service\.venv\Scripts\activate   # For Windows
pip install -r requirements.txt
```

**4. Run All Services**
The root `package.json` contains a convenient `dev` script that uses `concurrently` to run all 3 main layers simultaneously.
```bash
npm run dev
```

### 5. Seeding Initial Data
To populate the database with initial users and roles, run:
```bash
npm run seed
```

## 📊 Offline Data Analysis
The project includes several standalone Python scripts in the root directory for offline data crunching and visualization generation. These scripts will save outputs to the `/output` folder:
- Run `python solar_analysis.py` for full predictive analysis.
- Run `python plot_results.py` to generate standalone PNG charts.
- Run `python generate_yoy_line.py` for Year-over-Year trend tracking.
