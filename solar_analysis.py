# ============================================
# SOLAR SALES, REVENUE & FORECAST ANALYSIS
# All capacity values stored and exported in kW
# (LOCAL VERSION – Windows Compatible)
# ============================================
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")   # non-interactive backend – no display/Tkinter needed
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# --------------------------------------------
# 0. PATHS
# --------------------------------------------
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATA_DIR    = os.path.join(BASE_DIR, "data")
OUTPUT_DIR  = os.path.join(BASE_DIR, "output")
os.makedirs(DATA_DIR,   exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

FILE_PATH = os.path.join(DATA_DIR, "Year & state Wise Data Of solar  installations.xlsx")

if not os.path.exists(FILE_PATH):
    raise FileNotFoundError(
        f"\n[ERROR] Excel file not found at:\n  {FILE_PATH}\n"
        "Please copy your Excel file into the 'data/' folder and re-run.\n"
    )

# --------------------------------------------
# 1. LOAD DATA  (auto-detect header row)
# --------------------------------------------
raw = pd.read_excel(FILE_PATH, header=None)
print(f"[INFO] Raw sheet shape (no header): {raw.shape}")
print(f"[INFO] First 5 rows of raw data:\n{raw.head()}")

def _looks_like_year(val):
    try:
        v = int(float(str(val).strip()))
        return 2000 <= v <= 2040
    except (ValueError, TypeError):
        return False

header_row = 0
for i, row in raw.iterrows():
    if any(_looks_like_year(cell) for cell in row):
        header_row = i
        break

print(f"[INFO] Detected header at Excel row index: {header_row}")

df = pd.read_excel(FILE_PATH, header=header_row)
print(f"[INFO] Loaded file with shape: {df.shape}")
print(f"[INFO] Columns after header-detection: {df.columns.tolist()}")

# Drop units row if present
if len(df) > 0:
    first_row_vals = df.iloc[0].apply(lambda x: str(x).strip())
    def _is_non_numeric(s):
        clean = s.replace('.', '', 1).lstrip('-')
        return not clean.isdigit() and s.lower() not in ('nan', '')
    non_numeric = first_row_vals.apply(_is_non_numeric)
    if non_numeric.sum() >= len(df.columns) // 2:
        print(f"[INFO] Skipping units/label row: {df.iloc[0].tolist()}")
        df = df.iloc[1:].reset_index(drop=True)

# --------------------------------------------
# 2. CLEAN COLUMN NAMES
# --------------------------------------------
df.columns = (
    df.columns
    .astype(str)
    .str.strip()
    .str.replace(r'\s+', ' ', regex=True)
)

# --------------------------------------------
# 3. NORMALISE THE STATE COLUMN
# --------------------------------------------
state_col = None
for col in df.columns:
    col_lower = col.lower().strip()
    if col_lower in ("state", "states", "state name", "name of state"):
        state_col = col
        break

if state_col is None:
    for col in df.columns:
        if not str(col).isdigit():
            state_col = col
            break

if state_col is None:
    raise KeyError(
        "[ERROR] Cannot identify a 'State' column.\n"
        f"Available columns: {df.columns.tolist()}"
    )

print(f"[INFO] Using column '{state_col}' as the State column.")
df.rename(columns={state_col: "State"}, inplace=True)
df = df[df["State"].notna()]

# --------------------------------------------
# 4. REMOVE TOTAL / HEADER ROWS
# --------------------------------------------
df["State"] = df["State"].astype(str).str.strip()
df = df[~df["State"].str.lower().isin(["total", "grand total", "all india", "nan", ""])]

# --------------------------------------------
# 5. IDENTIFY YEAR COLUMNS
# --------------------------------------------
def _col_to_year(col):
    try:
        v = int(float(str(col).strip()))
        if 2000 <= v <= 2040:
            return v
    except (ValueError, TypeError):
        pass
    return None

year_cols_raw = [col for col in df.columns if _col_to_year(col) is not None]
year_map = {col: str(_col_to_year(col)) for col in year_cols_raw}
df.rename(columns=year_map, inplace=True)
year_cols = sorted(set(year_map.values()), key=int)

if not year_cols:
    raise ValueError(
        "[ERROR] No numeric year columns detected.\n"
        f"Columns found: {df.columns.tolist()}"
    )

print(f"[INFO] Year columns detected: {year_cols}")
df[year_cols] = df[year_cols].apply(pd.to_numeric, errors="coerce").fillna(0)

# --------------------------------------------
# UNIT CONVERSION: MW → kW (×1000)
# --------------------------------------------
MW_TO_KW = 1000
df[year_cols] = df[year_cols] * MW_TO_KW
print("[INFO] Unit conversion applied: MW × 1000 = kW")

# --------------------------------------------
# 6. CONVERT WIDE → LONG FORMAT
# --------------------------------------------
long_df = df.melt(
    id_vars=["State"],
    value_vars=year_cols,
    var_name="Year",
    value_name="Solar_kW"        # ← correctly named kW column
)
long_df["Year"] = long_df["Year"].astype(int)
long_df = long_df.sort_values(["State", "Year"]).reset_index(drop=True)

# --------------------------------------------
# 7. ANNUAL SOLAR SALES (YoY diff)
# --------------------------------------------
long_df["Annual_Sales_kW"] = long_df.groupby("State")["Solar_kW"].diff()

# --------------------------------------------
# 8. YoY GROWTH %
# --------------------------------------------
long_df["YoY_Growth_pct"] = (
    long_df["Annual_Sales_kW"] /
    long_df.groupby("State")["Solar_kW"].shift(1)
) * 100

# --------------------------------------------
# 9. MARKET SIZE & SHARE (latest year)
# --------------------------------------------
latest_year = max(int(y) for y in year_cols)
print(f"[INFO] Latest year for market-share analysis: {latest_year}")

state_market = (
    long_df[long_df["Year"] == latest_year]
    .groupby("State")["Solar_kW"]
    .sum()
    .reset_index()
)
india_total_kw = state_market["Solar_kW"].sum()
state_market["Market_Share_pct"] = (state_market["Solar_kW"] / india_total_kw * 100)

# --------------------------------------------
# 10. CAGR (earliest → latest year)
# --------------------------------------------
pivot = long_df.pivot(index="State", columns="Year", values="Solar_kW")
earliest_year = min(int(y) for y in year_cols)
n_years = latest_year - earliest_year

if n_years > 0:
    pivot["CAGR_pct"] = (
        (pivot[latest_year] / pivot[earliest_year].replace(0, np.nan)) ** (1 / n_years) - 1
    ) * 100
else:
    pivot["CAGR_pct"] = np.nan

# --------------------------------------------
# 11. REVENUE CALCULATION (₹ Crore)
#     Rates declared per kW (converted from per-MW originals)
#     Utility: ₹4 Cr/MW = ₹0.004 Cr/kW
#     Rooftop: ₹0.5 Cr/MW = ₹0.0005 Cr/kW
# --------------------------------------------
UTILITY_COST_PER_KW  = 4.0   / MW_TO_KW   # Cr per kW
ROOFTOP_COST_PER_KW  = 0.5   / MW_TO_KW   # Cr per kW
UTILITY_SHARE        = 0.80
ROOFTOP_SHARE        = 0.20

long_df["Utility_kW"]  = long_df["Annual_Sales_kW"] * UTILITY_SHARE
long_df["Rooftop_kW"]  = long_df["Annual_Sales_kW"] * ROOFTOP_SHARE
long_df["Revenue_Cr"]  = (
    long_df["Utility_kW"] * UTILITY_COST_PER_KW +
    long_df["Rooftop_kW"] * ROOFTOP_COST_PER_KW
)

# --------------------------------------------
# 12. INDIA YEARLY SUMMARY
# --------------------------------------------
india_yearly = long_df.groupby("Year").agg(
    Total_Solar_kW  = ("Solar_kW",        "sum"),
    Annual_Sales_kW = ("Annual_Sales_kW", "sum"),
    Revenue_Cr      = ("Revenue_Cr",      "sum")
).reset_index()

# --------------------------------------------
# 13. FORECASTING (Linear Regression, 2025–2030)
# --------------------------------------------
X = india_yearly["Year"].values.reshape(-1, 1)
y = india_yearly["Total_Solar_kW"].values

model = LinearRegression()
model.fit(X, y)

future_years  = np.arange(latest_year + 1, 2031).reshape(-1, 1)
forecast_kw   = model.predict(future_years)

forecast_df = pd.DataFrame({
    "Year":              future_years.flatten(),
    "Forecast_Solar_kW": forecast_kw
})

# Annual incremental capacity for forecast (year-over-year diff)
# The first forecast year adds on top of the last actual year
last_actual_kw = india_yearly["Total_Solar_kW"].iloc[-1]
all_cumulative = pd.concat([
    pd.Series([last_actual_kw]),
    pd.Series(forecast_kw.flatten())
], ignore_index=True)
forecast_annual_kw = all_cumulative.diff().iloc[1:].values  # drop NaN first row

forecast_df["Forecast_Annual_kW"] = forecast_annual_kw
forecast_df["Forecast_Revenue_Cr"] = (
    forecast_df["Forecast_Annual_kW"] * UTILITY_SHARE * UTILITY_COST_PER_KW +
    forecast_df["Forecast_Annual_kW"] * ROOFTOP_SHARE * ROOFTOP_COST_PER_KW
)

# State-level revenue summary
state_revenue = long_df.groupby("State").agg(
    Total_Solar_kW = ("Solar_kW",        "max"),
    Total_Revenue_Cr = ("Revenue_Cr",    "sum")
).reset_index().sort_values("Total_Revenue_Cr", ascending=False)

# --------------------------------------------
# 14. SAVE OUTPUT FILES (all kW-based)
# --------------------------------------------
long_df.to_csv(      os.path.join(OUTPUT_DIR, "solar_sales_analysis.csv"),      index=False)
state_market.to_csv( os.path.join(OUTPUT_DIR, "state_market_share.csv"),        index=False)
pivot.to_csv(        os.path.join(OUTPUT_DIR, "state_cagr.csv"))
india_yearly.to_csv( os.path.join(OUTPUT_DIR, "india_yearly_summary.csv"),      index=False)
forecast_df.to_csv(  os.path.join(OUTPUT_DIR, "india_solar_forecast_2030.csv"), index=False)
state_revenue.to_csv(os.path.join(OUTPUT_DIR, "state_revenue_summary.csv"),     index=False)
print("[INFO] All CSV outputs saved to:", OUTPUT_DIR)

# --------------------------------------------
# 15. QUICK SUMMARY PRINT
# --------------------------------------------
print("\n" + "="*65)
print("  INDIA SOLAR SUMMARY (kW values)")
print("="*65)
for _, row in india_yearly.iterrows():
    print(f"  {int(row['Year'])}  |  {int(row['Total_Solar_kW']):>15,} kW  |  "
          f"Rev: ₹{row['Revenue_Cr']:>10,.0f} Cr")
print("="*65)
print(f"  2030 Forecast: {int(forecast_df['Forecast_Solar_kW'].iloc[-1]):,} kW")
print("="*65)

# --------------------------------------------
# 16. QUICK VISUALIZATION (Capacity Forecast)
# --------------------------------------------
plt.figure(figsize=(10, 6))
plt.plot(
    india_yearly["Year"], india_yearly["Total_Solar_kW"],
    marker="o", linewidth=2, label="Actual (kW)"
)
plt.plot(
    forecast_df["Year"], forecast_df["Forecast_Solar_kW"],
    linestyle="--", marker="o", linewidth=2, label="Forecast (Linear)"
)
plt.xlabel("Year")
plt.ylabel("Solar Capacity (kW)")
plt.title("India Solar Capacity: Actual vs Forecast – in kW (2025–2030)")
plt.legend()
plt.grid(True, alpha=0.4)
plt.tight_layout()

chart_path = os.path.join(OUTPUT_DIR, "india_solar_forecast.png")
plt.savefig(chart_path, dpi=150)
plt.close()
print(f"[INFO] Chart saved to: {chart_path}")

print("\n[DONE] ANALYSIS COMPLETED SUCCESSFULLY")
