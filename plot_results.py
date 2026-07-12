# ============================================================
# SOLAR SALES ANALYSIS  –  PPT-READY VISUALIZATIONS
# All capacity values in kW (1 MW = 1,000 kW)
# 12 charts including dedicated Revenue analysis section
# ============================================================
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import os
import warnings
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
import pandas as pd
import numpy as np

warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
OUT_DIR   = os.path.join(BASE_DIR, "output")
CHART_DIR = os.path.join(OUT_DIR, "charts")
os.makedirs(CHART_DIR, exist_ok=True)

# ── Load CSVs ─────────────────────────────────────────────
yearly    = pd.read_csv(os.path.join(OUT_DIR, "india_yearly_summary.csv"))
forecast  = pd.read_csv(os.path.join(OUT_DIR, "india_solar_forecast_2030.csv"))
mshare    = pd.read_csv(os.path.join(OUT_DIR, "state_market_share.csv"))
cagr_df   = pd.read_csv(os.path.join(OUT_DIR, "state_cagr.csv"))
sales     = pd.read_csv(os.path.join(OUT_DIR, "solar_sales_analysis.csv"))
st_rev    = pd.read_csv(os.path.join(OUT_DIR, "state_revenue_summary.csv"))

# ── Unit Helpers ───────────────────────────────────────────
def _kw_fmt(x, _=None):
    """Auto-scale kW values for chart axes."""
    if abs(x) >= 1_000_000:
        return f"{x/1_000_000:.1f}M kW"
    elif abs(x) >= 100_000:
        return f"{x/100_000:.1f}L kW"
    elif abs(x) >= 1_000:
        return f"{x/1_000:.0f}k kW"
    return f"{x:.0f} kW"

def _kw_label(val):
    if abs(val) >= 1_000_000:
        return f"{val/1_000_000:.2f}M kW"
    elif abs(val) >= 100_000:
        return f"{val/100_000:.1f}L kW"
    elif abs(val) >= 1_000:
        return f"{val/1_000:.0f}k kW"
    return f"{val:.0f} kW"

def _cr_fmt(x, _=None):
    """Auto-scale ₹Crore values for axes."""
    if abs(x) >= 1_00_000:
        return f"₹{x/1_00_000:.1f}L Cr"
    elif abs(x) >= 1_000:
        return f"₹{x/1_000:.0f}k Cr"
    return f"₹{x:.0f} Cr"

def _cr_label(val):
    if abs(val) >= 1_00_000:
        return f"₹{val/1_00_000:.2f}L Cr"
    elif abs(val) >= 1_000:
        return f"₹{val/1_000:.1f}k Cr"
    return f"₹{val:.0f} Cr"

# ── Premium Design System ─────────────────────────────────
BG       = "#0D1117"
CARD     = "#161B22"
ACCENT1  = "#F7B731"   # solar gold
ACCENT2  = "#26C6DA"   # teal-cyan
ACCENT3  = "#EF5350"   # warm red
ACCENT4  = "#66BB6A"   # green
ACCENT5  = "#AB47BC"   # purple
GRID_C   = "#21262D"
TEXT_PRI = "#E6EDF3"
TEXT_SEC = "#8B949E"

DPI      = 160
TITLE_FS = 15
LABEL_FS = 10
TICK_FS  = 9

def _base_fig(w=12, h=6):
    fig, ax = plt.subplots(figsize=(w, h))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(CARD)
    ax.tick_params(colors=TEXT_SEC, labelsize=TICK_FS)
    ax.xaxis.label.set_color(TEXT_SEC)
    ax.yaxis.label.set_color(TEXT_SEC)
    for spine in ax.spines.values():
        spine.set_edgecolor(GRID_C)
    ax.grid(axis="y", color=GRID_C, linewidth=0.8, linestyle="--", alpha=0.7)
    ax.set_axisbelow(True)
    return fig, ax

def _base_fig_h(w=13, h=7):
    """Base figure with horizontal grid lines on both axes for horizontal bars."""
    fig, ax = plt.subplots(figsize=(w, h))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(CARD)
    ax.tick_params(colors=TEXT_SEC, labelsize=TICK_FS)
    ax.xaxis.label.set_color(TEXT_SEC)
    ax.yaxis.label.set_color(TEXT_SEC)
    for spine in ax.spines.values():
        spine.set_edgecolor(GRID_C)
    ax.grid(axis="x", color=GRID_C, linewidth=0.8, linestyle="--", alpha=0.7)
    ax.set_axisbelow(True)
    return fig, ax

def _title(ax, title, subtitle=""):
    ax.set_title(title, color=TEXT_PRI, fontsize=TITLE_FS,
                 fontweight="bold", pad=14, loc="left")
    if subtitle:
        ax.annotate(subtitle, xy=(0, 1.025), xycoords="axes fraction",
                    color=TEXT_SEC, fontsize=LABEL_FS - 1, ha="left")

def _save(fig, name):
    path = os.path.join(CHART_DIR, name)
    fig.tight_layout()
    fig.savefig(path, dpi=DPI, bbox_inches="tight", facecolor=BG)
    plt.close(fig)
    print(f"  [saved] {name}")


# ════════════════════════════════════════════════════════════
# CHART 1 – India Cumulative Solar Capacity (Actual + Forecast)
# ════════════════════════════════════════════════════════════
print("\n[1/12] Generating capacity forecast chart...")
fig, ax = _base_fig(13, 6)

ax.plot(yearly["Year"], yearly["Total_Solar_kW"],
        color=ACCENT1, linewidth=2.5, marker="o", markersize=6,
        label="Actual Capacity", zorder=3)
ax.fill_between(yearly["Year"], yearly["Total_Solar_kW"],
                alpha=0.15, color=ACCENT1)

ax.plot(forecast["Year"], forecast["Forecast_Solar_kW"],
        color=ACCENT2, linewidth=2.5, linestyle="--",
        marker="o", markersize=6, label="Forecast (Linear Reg.)", zorder=3)
ax.fill_between(forecast["Year"], forecast["Forecast_Solar_kW"],
                alpha=0.10, color=ACCENT2)

# Annotate last actual point
last = yearly.iloc[-1]
ax.annotate(_kw_label(last["Total_Solar_kW"]),
            xy=(last["Year"], last["Total_Solar_kW"]),
            xytext=(8, -18), textcoords="offset points",
            color=ACCENT1, fontsize=LABEL_FS, fontweight="bold")

# Annotate 2030 forecast
last_fcst = forecast.iloc[-1]
ax.annotate(_kw_label(last_fcst["Forecast_Solar_kW"]),
            xy=(last_fcst["Year"], last_fcst["Forecast_Solar_kW"]),
            xytext=(8, 5), textcoords="offset points",
            color=ACCENT2, fontsize=LABEL_FS, fontweight="bold")

ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
ax.set_xlabel("Year", fontsize=LABEL_FS)
_title(ax, "India Cumulative Solar Capacity: 2014–2030 (in kW)",
       "Actual installations vs Linear Regression Forecast")
ax.legend(facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_save(fig, "01_india_capacity_forecast.png")


# ════════════════════════════════════════════════════════════
# CHART 2 – Annual New Solar Additions (Bar Chart)
# ════════════════════════════════════════════════════════════
print("[2/12] Generating annual additions chart...")
fig, ax = _base_fig(13, 6)

annual = yearly[yearly["Annual_Sales_kW"] > 0].copy()
colors = [ACCENT1 if v == annual["Annual_Sales_kW"].max() else ACCENT2
          for v in annual["Annual_Sales_kW"]]

bars = ax.bar(annual["Year"].astype(str), annual["Annual_Sales_kW"],
              color=colors, width=0.6, zorder=3, edgecolor=BG, linewidth=0.5)

for bar in bars:
    h = bar.get_height()
    ax.text(bar.get_x() + bar.get_width() / 2, h * 1.01,
            _kw_label(h), ha="center", va="bottom",
            color=TEXT_SEC, fontsize=TICK_FS - 1)

ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
ax.set_xlabel("Year", fontsize=LABEL_FS)
ax.set_ylabel("New Capacity Added (kW)", fontsize=LABEL_FS)

gold_patch = mpatches.Patch(color=ACCENT1, label="Peak Year")
teal_patch = mpatches.Patch(color=ACCENT2, label="Other Years")
ax.legend(handles=[gold_patch, teal_patch],
          facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_title(ax, "Annual Solar Capacity Additions (kW)",
       "New kW installed each year across India")
_save(fig, "02_annual_additions.png")


# ════════════════════════════════════════════════════════════
# CHART 3 – Annual Revenue (₹ Crore) — Bar + Line
# ════════════════════════════════════════════════════════════
print("[3/12] Generating annual revenue bar+line chart...")
fig, ax = _base_fig(13, 6)

rev = yearly[yearly["Revenue_Cr"] > 0].copy()
bars = ax.bar(rev["Year"].astype(str), rev["Revenue_Cr"],
              color=ACCENT4, width=0.6, zorder=3, edgecolor=BG, linewidth=0.5, alpha=0.85)
ax.plot(rev["Year"].astype(str), rev["Revenue_Cr"],
        color=ACCENT1, linewidth=2.2, marker="D", markersize=6, zorder=4, label="Revenue trend")

for bar in bars:
    h = bar.get_height()
    ax.text(bar.get_x() + bar.get_width() / 2, h * 1.015,
            _cr_label(h), ha="center", va="bottom",
            color=TEXT_SEC, fontsize=TICK_FS - 1)

ax.yaxis.set_major_formatter(mticker.FuncFormatter(_cr_fmt))
ax.set_xlabel("Year", fontsize=LABEL_FS)
ax.set_ylabel("Revenue (₹ Crore)", fontsize=LABEL_FS)
_title(ax, "Estimated Annual Solar Revenue (₹ Crore)",
       "Utility (80%) @ ₹4 Cr/MW + Rooftop (20%) @ ₹0.5 Cr/MW")
ax.legend(facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_save(fig, "03_annual_revenue.png")


# ════════════════════════════════════════════════════════════
# CHART 4 – Annual Revenue: Actual (2015–2024) + Forecast (2025–2030)
# ════════════════════════════════════════════════════════════
print("[4/12] Generating revenue forecast chart...")
fig, ax = _base_fig(14, 6)

actual_rev = yearly[yearly["Revenue_Cr"] > 0].copy()
fcst_rev   = forecast[forecast["Forecast_Revenue_Cr"] > 0].copy()

# Actual bars
ax.bar(actual_rev["Year"].astype(str), actual_rev["Revenue_Cr"],
       color=ACCENT4, width=0.6, alpha=0.85, zorder=3,
       edgecolor=BG, linewidth=0.5, label="Actual Revenue")

# Forecast bars (different shade)
ax.bar(fcst_rev["Year"].astype(str), fcst_rev["Forecast_Revenue_Cr"],
       color=ACCENT2, width=0.6, alpha=0.75, zorder=3,
       edgecolor=BG, linewidth=0.5, label="Forecast Revenue")

# Trend line connecting actual → forecast
all_years  = list(actual_rev["Year"].astype(str)) + list(fcst_rev["Year"].astype(str))
all_revs   = list(actual_rev["Revenue_Cr"])        + list(fcst_rev["Forecast_Revenue_Cr"])
ax.plot(all_years, all_revs,
        color=ACCENT1, linewidth=2, marker="o", markersize=4,
        linestyle="--", alpha=0.9, zorder=4, label="Revenue Trend")

# Vertical divider between actual and forecast
ax.axvline(x=len(actual_rev) - 0.5, color=TEXT_SEC,
           linewidth=1, linestyle=":", alpha=0.7)
ax.text(len(actual_rev) - 0.45, ax.get_ylim()[1] * 0.02,
        "◄ Actual  |  Forecast ►",
        color=TEXT_SEC, fontsize=TICK_FS - 1, va="bottom")

# Annotate last actual and last forecast
last_a = actual_rev.iloc[-1]
ax.annotate(_cr_label(last_a["Revenue_Cr"]),
            xy=(str(int(last_a["Year"])), last_a["Revenue_Cr"]),
            xytext=(0, 8), textcoords="offset points",
            ha="center", color=ACCENT4, fontsize=TICK_FS, fontweight="bold")

last_f = fcst_rev.iloc[-1]
ax.annotate(_cr_label(last_f["Forecast_Revenue_Cr"]),
            xy=(str(int(last_f["Year"])), last_f["Forecast_Revenue_Cr"]),
            xytext=(0, 8), textcoords="offset points",
            ha="center", color=ACCENT2, fontsize=TICK_FS, fontweight="bold")

ax.yaxis.set_major_formatter(mticker.FuncFormatter(_cr_fmt))
ax.set_xlabel("Year", fontsize=LABEL_FS)
ax.set_ylabel("Annual Revenue (₹ Crore)", fontsize=LABEL_FS)
_title(ax, "India Solar Annual Revenue: Actual 2015–2024 + Forecast 2025–2030 (₹ Cr)",
       "Based on annual new kW installed × blended rate (Utility 80% @ ₹4 Cr/MW + Rooftop 20% @ ₹0.5 Cr/MW)")
ax.legend(facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_save(fig, "04_revenue_forecast_2030.png")


# ════════════════════════════════════════════════════════════
# CHART 5 – Top 10 States by Revenue (Horizontal Bar)
# ════════════════════════════════════════════════════════════
print("[5/12] Generating top 10 states by revenue chart...")
fig, ax = _base_fig_h(13, 7)

top10_rev = st_rev.nlargest(10, "Total_Revenue_Cr").sort_values("Total_Revenue_Cr")
grad_colors = plt.cm.RdYlGn(np.linspace(0.25, 0.85, len(top10_rev)))

bars = ax.barh(top10_rev["State"], top10_rev["Total_Revenue_Cr"],
               color=grad_colors, edgecolor=BG, linewidth=0.5, zorder=3)

for bar in bars:
    w = bar.get_width()
    ax.text(w * 1.008, bar.get_y() + bar.get_height() / 2,
            _cr_label(w),
            va="center", color=TEXT_PRI, fontsize=TICK_FS)

ax.xaxis.set_major_formatter(mticker.FuncFormatter(_cr_fmt))
ax.set_xlabel("Cumulative Revenue 2014–2024 (₹ Crore)", fontsize=LABEL_FS)
ax.tick_params(axis="y", colors=TEXT_PRI, labelsize=TICK_FS)
_title(ax, "Top 10 States — Cumulative Solar Revenue 2014–2024 (₹ Cr)",
       "Based on annual new installations (kW) × blended revenue rate")
_save(fig, "05_top10_states_revenue.png")


# ════════════════════════════════════════════════════════════
# CHART 6 – Revenue vs Capacity Scatter (State-level)
# ════════════════════════════════════════════════════════════
print("[6/12] Generating revenue vs capacity scatter chart...")
fig, ax = plt.subplots(figsize=(13, 7))
fig.patch.set_facecolor(BG)
ax.set_facecolor(CARD)
for spine in ax.spines.values():
    spine.set_edgecolor(GRID_C)
ax.grid(color=GRID_C, linewidth=0.8, linestyle="--", alpha=0.6)
ax.set_axisbelow(True)

plot_rev = st_rev[st_rev["Total_Revenue_Cr"] > 0].copy()
sizes = (plot_rev["Total_Revenue_Cr"] / plot_rev["Total_Revenue_Cr"].max() * 300).clip(20)

scatter = ax.scatter(
    plot_rev["Total_Solar_kW"],
    plot_rev["Total_Revenue_Cr"],
    s=sizes, c=plot_rev["Total_Revenue_Cr"],
    cmap="YlOrRd", alpha=0.85, edgecolors=BG, linewidth=0.8, zorder=3
)

# Label top states
top_states = plot_rev.nlargest(8, "Total_Revenue_Cr")
for _, row in top_states.iterrows():
    ax.annotate(row["State"],
                xy=(row["Total_Solar_kW"], row["Total_Revenue_Cr"]),
                xytext=(6, 4), textcoords="offset points",
                color=TEXT_PRI, fontsize=TICK_FS - 1,
                bbox=dict(boxstyle="round,pad=0.2", fc=CARD, alpha=0.7, ec=GRID_C))

cbar = fig.colorbar(scatter, ax=ax, pad=0.01)
cbar.ax.yaxis.set_tick_params(color=TEXT_SEC, labelcolor=TEXT_SEC)
cbar.set_label("Revenue (₹ Cr)", color=TEXT_SEC, fontsize=LABEL_FS)

ax.xaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
ax.yaxis.set_major_formatter(mticker.FuncFormatter(_cr_fmt))
ax.set_xlabel("Installed Capacity (kW)", fontsize=LABEL_FS)
ax.set_ylabel("Cumulative Revenue (₹ Crore)", fontsize=LABEL_FS)
ax.tick_params(colors=TEXT_SEC, labelsize=TICK_FS)
_title(ax, "Revenue vs Installed Capacity — State-Level Relationship",
       "Bubble size proportional to revenue; top 8 states labelled")
_save(fig, "06_revenue_vs_capacity_scatter.png")


# ════════════════════════════════════════════════════════════
# CHART 7 – Top 10 States by Installed Capacity 2024 (Horizontal Bar)
# ════════════════════════════════════════════════════════════
print("[7/12] Generating top 10 states by capacity chart...")
fig, ax = _base_fig_h(13, 7)

top10 = mshare.nlargest(10, "Solar_kW").sort_values("Solar_kW")
grad_colors = plt.cm.YlOrRd(np.linspace(0.35, 0.95, len(top10)))

bars = ax.barh(top10["State"], top10["Solar_kW"],
               color=grad_colors, edgecolor=BG, linewidth=0.5, zorder=3)

for bar, share in zip(bars, top10["Market_Share_pct"].values):
    w = bar.get_width()
    ax.text(w * 1.005, bar.get_y() + bar.get_height() / 2,
            f"{_kw_label(w)}  ({share:.1f}%)",
            va="center", color=TEXT_PRI, fontsize=TICK_FS)

ax.xaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
ax.set_xlabel("Installed Capacity (kW)", fontsize=LABEL_FS)
ax.tick_params(axis="y", colors=TEXT_PRI, labelsize=TICK_FS)
_title(ax, "Top 10 States — Solar Installed Capacity in kW (2024)",
       "Market share % of total India installed base shown in brackets")
_save(fig, "07_top10_states_capacity_2024.png")


# ════════════════════════════════════════════════════════════
# CHART 8 – Market Share Pie (Top 8 + Others)
# ════════════════════════════════════════════════════════════
print("[8/12] Generating market share pie chart...")
fig, ax = plt.subplots(figsize=(11, 8))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

top8  = mshare.nlargest(8, "Solar_kW").copy()
other = mshare[~mshare["State"].isin(top8["State"])]["Solar_kW"].sum()
pie_data = pd.concat([top8[["State", "Solar_kW"]],
                      pd.DataFrame([{"State": "Others", "Solar_kW": other}])],
                     ignore_index=True)

palette = [ACCENT1, ACCENT2, ACCENT4, ACCENT3,
           "#AB47BC", "#26A69A", "#EC407A", "#42A5F5", "#78909C"]
explode = [0.04] * len(pie_data)

wedges, texts, autotexts = ax.pie(
    pie_data["Solar_kW"],
    labels=pie_data["State"],
    autopct="%1.1f%%",
    startangle=140,
    colors=palette[:len(pie_data)],
    explode=explode,
    pctdistance=0.78,
    wedgeprops={"linewidth": 1.5, "edgecolor": BG}
)
for t in texts:
    t.set_color(TEXT_PRI); t.set_fontsize(TICK_FS)
for at in autotexts:
    at.set_color(BG); at.set_fontsize(TICK_FS - 1); at.set_fontweight("bold")

ax.set_title("State-Wise Solar Market Share — 2024 (kW basis)",
             color=TEXT_PRI, fontsize=TITLE_FS, fontweight="bold", pad=20)
_save(fig, "08_market_share_pie.png")


# ════════════════════════════════════════════════════════════
# CHART 9 – Top 15 States by CAGR (10-Year)
# ════════════════════════════════════════════════════════════
print("[9/12] Generating CAGR chart...")
fig, ax = _base_fig_h(13, 7)

cagr_clean = cagr_df[["State", "CAGR_pct"]].dropna()
cagr_clean = cagr_clean[np.isfinite(cagr_clean["CAGR_pct"])]
top_cagr = cagr_clean.nlargest(15, "CAGR_pct").sort_values("CAGR_pct")

bar_colors = [ACCENT3 if v > 50 else ACCENT1 for v in top_cagr["CAGR_pct"]]
bars = ax.barh(top_cagr["State"], top_cagr["CAGR_pct"],
               color=bar_colors, edgecolor=BG, linewidth=0.5, zorder=3)

for bar in bars:
    w = bar.get_width()
    ax.text(w + 0.3, bar.get_y() + bar.get_height() / 2,
            f"{w:.1f}%", va="center", color=TEXT_PRI, fontsize=TICK_FS)

ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x:.0f}%"))
ax.set_xlabel("10-Year CAGR (%)", fontsize=LABEL_FS)
ax.tick_params(axis="y", colors=TEXT_PRI, labelsize=TICK_FS)

red_patch  = mpatches.Patch(color=ACCENT3, label="CAGR > 50%")
gold_patch = mpatches.Patch(color=ACCENT1, label="CAGR ≤ 50%")
ax.legend(handles=[red_patch, gold_patch], facecolor=CARD,
          edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_title(ax, "Top 15 States — 10-Year CAGR (2014–2024)",
       "CAGR is unit-independent (ratio); same result in kW or MW")
_save(fig, "09_top15_state_cagr.png")


# ════════════════════════════════════════════════════════════
# CHART 10 – YoY Growth Rate (India Level)
# ════════════════════════════════════════════════════════════
print("[10/12] Generating YoY growth rate chart...")
fig, ax = _base_fig(13, 6)

yoy = yearly.copy()
yoy["YoY_pct"] = yoy["Total_Solar_kW"].pct_change() * 100
yoy = yoy.dropna(subset=["YoY_pct"])

bar_col = [ACCENT4 if v >= 0 else ACCENT3 for v in yoy["YoY_pct"]]
ax.bar(yoy["Year"].astype(str), yoy["YoY_pct"],
       color=bar_col, width=0.6, zorder=3, edgecolor=BG, linewidth=0.5)
ax.axhline(0, color=TEXT_SEC, linewidth=0.8, linestyle="--")

for _, row in yoy.iterrows():
    offset = 1 if row["YoY_pct"] >= 0 else -3
    ax.text(str(int(row["Year"])), row["YoY_pct"] + offset,
            f"{row['YoY_pct']:.0f}%", ha="center",
            color=TEXT_PRI, fontsize=TICK_FS - 1)

ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x:.0f}%"))
ax.set_xlabel("Year", fontsize=LABEL_FS)
ax.set_ylabel("YoY Growth (%)", fontsize=LABEL_FS)

g_patch = mpatches.Patch(color=ACCENT4, label="Positive Growth")
r_patch = mpatches.Patch(color=ACCENT3, label="Decline")
ax.legend(handles=[g_patch, r_patch], facecolor=CARD,
          edgecolor=GRID_C, labelcolor=TEXT_PRI, fontsize=LABEL_FS)
_title(ax, "India Solar Capacity — Year-on-Year Growth Rate",
       "Percentage change in cumulative kW capacity vs prior year")
_save(fig, "10_yoy_growth_rate.png")


# ════════════════════════════════════════════════════════════
# CHART 11 – Multi-State Growth Trend (Top 6 states)
# ════════════════════════════════════════════════════════════
print("[11/12] Generating multi-state growth trend chart...")
fig, ax = _base_fig(14, 7)

top6_states  = mshare.nlargest(6, "Solar_kW")["State"].tolist()
state_colors = [ACCENT1, ACCENT2, ACCENT4, ACCENT3, "#AB47BC", "#42A5F5"]

sales["Year"] = sales["Year"].astype(int)
for state, color in zip(top6_states, state_colors):
    s = sales[sales["State"] == state].sort_values("Year")
    ax.plot(s["Year"], s["Solar_kW"],
            label=state, color=color, linewidth=2, marker="o", markersize=4)

ax.yaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
ax.set_xlabel("Year", fontsize=LABEL_FS)
ax.set_ylabel("Cumulative Capacity (kW)", fontsize=LABEL_FS)
ax.legend(facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI,
          fontsize=LABEL_FS, ncol=2, loc="upper left")
_title(ax, "Cumulative Solar Growth — Top 6 States in kW (2014–2024)",
       "State-level capacity trajectories over the decade")
_save(fig, "11_top6_state_trends.png")


# ════════════════════════════════════════════════════════════
# CHART 12 – Revenue vs kW Dual-Axis (India Total)
# ════════════════════════════════════════════════════════════
print("[12/12] Generating dual-axis capacity vs revenue chart...")
fig, ax1 = plt.subplots(figsize=(13, 6))
fig.patch.set_facecolor(BG)
ax1.set_facecolor(CARD)
for spine in ax1.spines.values():
    spine.set_edgecolor(GRID_C)
ax1.grid(axis="y", color=GRID_C, linewidth=0.8, linestyle="--", alpha=0.5)
ax1.set_axisbelow(True)

rev2 = yearly[yearly["Revenue_Cr"] > 0].copy()
x_pos = np.arange(len(rev2))
bar_w = 0.4

# Revenue bars (left axis)
bars1 = ax1.bar(x_pos - bar_w/2, rev2["Revenue_Cr"],
                width=bar_w, color=ACCENT4, alpha=0.8, label="Revenue (₹ Cr)",
                edgecolor=BG, linewidth=0.5, zorder=3)

ax1.set_xticks(x_pos)
ax1.set_xticklabels(rev2["Year"].astype(str), color=TEXT_SEC, fontsize=TICK_FS)
ax1.set_ylabel("Revenue (₹ Crore)", color=ACCENT4, fontsize=LABEL_FS)
ax1.tick_params(axis="y", colors=ACCENT4, labelsize=TICK_FS)
ax1.yaxis.set_major_formatter(mticker.FuncFormatter(_cr_fmt))

# Capacity bars (right axis)
ax2 = ax1.twinx()
ax2.set_facecolor("none")
annual2 = yearly[yearly["Annual_Sales_kW"] > 0].copy()
# align x positions
rev2_years = rev2["Year"].tolist()
annual_vals = [annual2[annual2["Year"] == yr]["Annual_Sales_kW"].values[0]
               if yr in annual2["Year"].values else 0 for yr in rev2_years]

bars2 = ax2.bar(x_pos + bar_w/2, annual_vals,
                width=bar_w, color=ACCENT1, alpha=0.85, label="New Capacity (kW)",
                edgecolor=BG, linewidth=0.5, zorder=3)

ax2.set_ylabel("New Capacity Added (kW)", color=ACCENT1, fontsize=LABEL_FS)
ax2.tick_params(axis="y", colors=ACCENT1, labelsize=TICK_FS)
ax2.yaxis.set_major_formatter(mticker.FuncFormatter(_kw_fmt))
for spine in ax2.spines.values():
    spine.set_edgecolor(GRID_C)

# Combined legend
h1, l1 = ax1.get_legend_handles_labels()
h2, l2 = ax2.get_legend_handles_labels()
ax1.legend(h1 + h2, l1 + l2, facecolor=CARD, edgecolor=GRID_C,
           labelcolor=TEXT_PRI, fontsize=LABEL_FS, loc="upper left")

ax1.set_title("India Solar: Annual Revenue vs New Capacity Added (kW)",
              color=TEXT_PRI, fontsize=TITLE_FS, fontweight="bold",
              pad=14, loc="left")
ax1.annotate("Revenue (₹ Cr) & Capacity (kW) — dual-axis comparison per year",
             xy=(0, 1.025), xycoords="axes fraction",
             color=TEXT_SEC, fontsize=LABEL_FS - 1, ha="left")

fig.tight_layout()
fig.savefig(os.path.join(CHART_DIR, "12_revenue_vs_capacity_dual_axis.png"),
            dpi=DPI, bbox_inches="tight", facecolor=BG)
plt.close(fig)
print("  [saved] 12_revenue_vs_capacity_dual_axis.png")


# ════════════════════════════════════════════════════════════
# QUICK SUMMARY TABLE
# ════════════════════════════════════════════════════════════
print("\n" + "="*75)
print("  INDIA SOLAR SUMMARY — All values in kW")
print("="*75)
print(f"  {'Year':>4}  |  {'Capacity (kW)':>18}  |  {'New kW Added':>16}  |  {'Revenue (₹ Cr)':>16}")
print("-"*75)
for _, row in yearly.iterrows():
    sales_str = f"{int(row['Annual_Sales_kW']):>16,}" if row["Annual_Sales_kW"] > 0 else f"{'—':>16}"
    print(f"  {int(row['Year']):>4}  |  {int(row['Total_Solar_kW']):>18,} kW  |  {sales_str} kW  |  ₹{row['Revenue_Cr']:>14,.0f} Cr")
print("="*75)
print(f"  2030 Forecast Capacity : {int(forecast['Forecast_Solar_kW'].iloc[-1]):>18,} kW")
print(f"  2030 Forecast Revenue  : ₹{forecast['Forecast_Revenue_Cr'].iloc[-1]:>17,.0f} Cr")
print("="*75)

print("\n[DONE] All 12 PPT-ready charts saved to:")
print(f"       {CHART_DIR}\n")
charts = [
    "01_india_capacity_forecast.png        — Actual vs Forecast (2014-2030) in kW",
    "02_annual_additions.png               — Annual new capacity added (kW)",
    "03_annual_revenue.png                 — Annual revenue bar + trend line (₹ Cr)",
    "04_revenue_forecast_2030.png          — Revenue actual + forecast 2014-2030 (₹ Cr)",
    "05_top10_states_revenue.png           — Top 10 states by cumulative revenue",
    "06_revenue_vs_capacity_scatter.png    — State-level revenue vs capacity scatter",
    "07_top10_states_capacity_2024.png     — Top 10 states by installed kW (2024)",
    "08_market_share_pie.png               — State-wise market share pie (kW basis)",
    "09_top15_state_cagr.png               — Top 15 states by 10-year CAGR",
    "10_yoy_growth_rate.png                — India YoY growth rate bars",
    "11_top6_state_trends.png              — Top 6 state growth trajectories in kW",
    "12_revenue_vs_capacity_dual_axis.png  — Dual-axis revenue & capacity comparison",
]
for c in charts:
    print(f"  {c}")
