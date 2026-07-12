import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
from typing import List, Tuple
from schemas import StateDataPoint, ForecastPoint
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.metrics import mean_squared_error

def forecast_linear_regression(data: List[StateDataPoint], forecast_years: int) -> List[ForecastPoint]:
    df = pd.DataFrame([{"year": p.year, "capacity": p.capacity} for p in data])
    X = df[["year"]].values
    y = df["capacity"].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    last_year = df["year"].max()
    future_years = np.arange(last_year + 1, last_year + forecast_years + 1).reshape(-1, 1)
    predictions = model.predict(future_years)
    
    # Calculate simple confidence intervals (std of residuals)
    residuals = y - model.predict(X)
    std_error = np.std(residuals)
    
    forecast = []
    for year, pred in zip(future_years.flatten(), predictions):
        forecast.append(ForecastPoint(
            year=int(year),
            predicted_capacity=float(max(0, pred)),
            confidence_interval_low=float(max(0, pred - 1.96 * std_error)),
            confidence_interval_high=float(pred + 1.96 * std_error)
        ))
    
    return forecast

def forecast_arima(data: List[StateDataPoint], forecast_years: int) -> List[ForecastPoint]:
    # Simple ARIMA (1,1,0) for trend-based solar growth
    series = pd.Series([p.capacity for p in data], index=[pd.to_datetime(p.year, format='%Y') for p in data])
    
    try:
        model = ARIMA(series, order=(1, 1, 0))
        model_fit = model.fit()
        predictions = model_fit.forecast(steps=forecast_years)
        
        last_year = max(p.year for p in data)
        forecast = []
        for i, pred in enumerate(predictions):
            forecast.append(ForecastPoint(
                year=int(last_year + i + 1),
                predicted_capacity=float(max(0, pred)),
                confidence_interval_low=float(max(0, pred * 0.9)), # Simplified CI
                confidence_interval_high=float(pred * 1.1)
            ))
        return forecast
    except Exception as e:
        print(f"ARIMA failed: {e}. Falling back to Linear Regression.")
        return forecast_linear_regression(data, forecast_years)

def forecast_exponential_smoothing(data: List[StateDataPoint], forecast_years: int) -> List[ForecastPoint]:
    series = pd.Series([p.capacity for p in data])
    try:
        # Multiplicative trend if data is always positive, else additive
        model = ExponentialSmoothing(series, trend='add', seasonal=None)
        model_fit = model.fit()
        predictions = model_fit.forecast(steps=forecast_years)
        
        last_year = max(p.year for p in data)
        forecast = []
        for i, pred in enumerate(predictions):
            forecast.append(ForecastPoint(
                year=int(last_year + i + 1),
                predicted_capacity=float(max(0, pred)),
                confidence_interval_low=float(max(0, pred * 0.95)),
                confidence_interval_high=float(pred * 1.05)
            ))
        return forecast
    except Exception as e:
        print(f"ExpSmoothing failed: {e}")
        return forecast_linear_regression(data, forecast_years)

def forecast_polynomial_regression(data: List[StateDataPoint], forecast_years: int) -> List[ForecastPoint]:
    from sklearn.preprocessing import PolynomialFeatures
    df = pd.DataFrame([{"year": p.year, "capacity": p.capacity} for p in data])
    X = df[["year"]].values
    y = df["capacity"].values
    
    poly = PolynomialFeatures(degree=2)
    X_poly = poly.fit_transform(X)
    
    model = LinearRegression()
    model.fit(X_poly, y)
    
    last_year = df["year"].max()
    future_years = np.arange(last_year + 1, last_year + forecast_years + 1).reshape(-1, 1)
    future_years_poly = poly.transform(future_years)
    predictions = model.predict(future_years_poly)
    
    # Simple confidence interval based on training residuals
    residuals = y - model.predict(X_poly)
    std_error = np.std(residuals)
    
    forecast = []
    for year, pred in zip(future_years.flatten(), predictions):
        forecast.append(ForecastPoint(
            year=int(year),
            predicted_capacity=float(max(0, pred)),
            confidence_interval_low=float(max(0, pred - 1.96 * std_error)),
            confidence_interval_high=float(pred + 1.96 * std_error)
        ))
    return forecast

def get_best_forecast(data: List[StateDataPoint], forecast_years: int) -> Tuple[List[ForecastPoint], str]:
    if len(data) < 4:
        return forecast_linear_regression(data, forecast_years), "Linear Regression (Baseline)"

    y_true = np.array([p.capacity for p in data])
    X = np.array([p.year for p in data]).reshape(-1, 1)
    
    # 1. Linear Regression fit
    lr_model = LinearRegression().fit(X, y_true)
    lr_rmse = np.sqrt(mean_squared_error(y_true, lr_model.predict(X)))
    
    # 2. Exp Smoothing fit
    try:
        es_model = ExponentialSmoothing(y_true, trend='add').fit()
        es_rmse = np.sqrt(mean_squared_error(y_true, es_model.fittedvalues))
    except:
        es_rmse = float('inf')
    
    # 3. Polynomial Regression fit
    from sklearn.preprocessing import PolynomialFeatures
    poly = PolynomialFeatures(degree=2)
    poly_model = LinearRegression().fit(poly.fit_transform(X), y_true)
    poly_rmse = np.sqrt(mean_squared_error(y_true, poly_model.predict(poly.fit_transform(X))))
    
    # Evaluation Logic: Pick the one with lowest training RMSE (Best Fit)
    # Note: In a real production system, we would use cross-validation or a hold-out set.
    results = [
        (lr_rmse, "Linear Regression", forecast_linear_regression),
        (es_rmse, "Exponential Smoothing", forecast_exponential_smoothing),
        (poly_rmse, "Polynomial Regression", forecast_polynomial_regression)
    ]
    
    # Penalize complexity slightly to avoid overfitting on small datasets
    # Polynomial and ES are more prone to overfitting than LR
    best_rmse, best_name, best_func = results[0]
    for rmse, name, func in results[1:]:
        if rmse < best_rmse * 0.95: # Must be at least 5% better to switch from Linear
            best_rmse, best_name, best_func = rmse, name, func
            
    return best_func(data, forecast_years), best_name
