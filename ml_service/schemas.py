from pydantic import BaseModel
from typing import List, Optional

class StateDataPoint(BaseModel):
    year: int
    capacity: float

class ForecastRequest(BaseModel):
    state: str
    historical_data: Optional[List[StateDataPoint]] = None
    forecast_years: int = 6 # Till 2030 by default

class ForecastPoint(BaseModel):
    year: int
    predicted_capacity: float
    confidence_interval_low: float
    confidence_interval_high: float

class ForecastResponse(BaseModel):
    state: str
    forecast: List[ForecastPoint]
    model_used: str
    mape_score: Optional[float] = None

class AnalysisRequest(BaseModel):
    image_base64: str
    zoom_level: int

class AnalysisResponse(BaseModel):
    estimated_capacity_mw: float
    detected_panels_count: int
    confidence_score: float
    analysis_details: str
