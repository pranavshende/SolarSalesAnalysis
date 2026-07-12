from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import models
from schemas import ForecastRequest, ForecastResponse, AnalysisRequest, AnalysisResponse, StateDataPoint
import base64
import io
import numpy as np
from PIL import Image
import cv2
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Database Setup
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

# SQLAlchemy/psycopg2 does not support Prisma's ?pgbouncer=true parameter
clean_url = DATABASE_URL.replace("?pgbouncer=true", "")
engine = create_engine(clean_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models for Postgres (ML Specific)
class SatelliteAnalysisRecord(Base):
    __tablename__ = "satellite_analyses"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    estimated_capacity_mw = Column(Float)
    detected_panels_count = Column(Integer)
    confidence_score = Column(Float)
    zoom_level = Column(Integer)
    details = Column(String)

# Reflect existing SolarData table for fetching
class SolarDataRecord(Base):
    __tablename__ = "SolarData" # Match the table name from Sequelize
    __table_args__ = {'extend_existing': True}
    id = Column(String, primary_key=True)
    state = Column(String)
    city = Column(String)
    year = Column(Integer)
    capacity_kW = Column(Float)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Solar Forecasting Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"status": "online", "service": "Solar Forecasting AI", "database": "connected"}

@app.post("/forecast", response_model=ForecastResponse)
async def get_forecast(request: ForecastRequest, db: Session = Depends(get_db)):
    historical_data = request.historical_data
    
    # If historical data is not provided, fetch from Postgres
    if not historical_data:
        db_records = db.query(SolarDataRecord).filter(SolarDataRecord.state == request.state).order_by(SolarDataRecord.year).all()
        if not db_records:
            raise HTTPException(status_code=404, detail=f"No historical data found for state: {request.state}")
        
        # Convert DB records to StateDataPoint
        # Group by year since models expect yearly data
        yearly_map = {}
        for r in db_records:
            yearly_map[r.year] = yearly_map.get(r.year, 0) + r.capacity_kW
        
        historical_data = [StateDataPoint(year=y, capacity=c) for y, c in sorted(yearly_map.items())]

    if len(historical_data) < 2:
        raise HTTPException(status_code=400, detail="Insufficient data for forecasting. Need at least 2 years of history.")
    
    forecast, model_name = models.get_best_forecast(historical_data, request.forecast_years)
        
    return ForecastResponse(
        state=request.state,
        forecast=forecast,
        model_used=model_name
    )

@app.post("/analyze-satellite", response_model=AnalysisResponse)
async def analyze_satellite(request: AnalysisRequest, db: Session = Depends(get_db)):
    try:
        # Decode base64 image
        header, encoded = request.image_base64.split(",", 1)
        image_data = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_data))
        img_np = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        
        # Detect solar panels (Heuristic)
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        lower_blue = np.array([90, 50, 50])
        upper_blue = np.array([130, 255, 255])
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        panel_count = 0
        total_pixel_area = 0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 100:
                panel_count += 1
                total_pixel_area += area
        
        zoom_factor = max(1, 20 - request.zoom_level)
        capacity_mw = (total_pixel_area * (zoom_factor ** 2)) / 100000 
        
        # Save to Postgres
        analysis_details = f"Detected {panel_count} potential PV clusters in viewport at zoom {request.zoom_level}."
        db_record = SatelliteAnalysisRecord(
            estimated_capacity_mw=float(capacity_mw),
            detected_panels_count=panel_count,
            confidence_score=0.85 if panel_count > 0 else 0.4,
            zoom_level=request.zoom_level,
            details=analysis_details
        )
        db.add(db_record)
        db.commit()
        
        return AnalysisResponse(
            estimated_capacity_mw=round(capacity_mw, 2),
            detected_panels_count=panel_count,
            confidence_score=db_record.confidence_score,
            analysis_details=analysis_details
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
