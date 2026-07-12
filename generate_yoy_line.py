import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd
import numpy as np
import os

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
OUT_DIR   = os.path.join(BASE_DIR, "output")
CHART_DIR = os.path.join(OUT_DIR, "charts")
os.makedirs(CHART_DIR, exist_ok=True)

yearly = pd.read_csv(os.path.join(OUT_DIR, "india_yearly_summary.csv"))
yearly["YoY_pct"] = yearly["Total_Solar_kW"].pct_change() * 100
yoy = yearly.dropna(subset=["YoY_pct"]).copy()

# ── Design ─────────────────────────────────────────────────
BG       = "#0D1117"
CARD     = "#161B22"
GRID_C   = "#21262D"
TEXT_PRI = "#E6EDF3"
TEXT_SEC = "#8B949E"
ACCENT1  = "#F7B731"   # gold
ACCENT3  = "#EF5350"   # red
ACCENT4  = "#66BB6A"   # green

fig, ax = plt.subplots(figsize=(13, 6))
fig.patch.set_facecolor(BG)
ax.set_facecolor(CARD)
for spine in ax.spines.values():
    spine.set_edgecolor(GRID_C)
ax.grid(axis="y", color=GRID_C, linewidth=0.8, linestyle="--", alpha=0.7)
ax.set_axisbelow(True)

years_str = yoy["Year"].astype(str).tolist()
vals      = yoy["YoY_pct"].tolist()

# Main line
ax.plot(years_str, vals,
        color=ACCENT1, linewidth=2.8, zorder=4,
        marker="o", markersize=9, markerfacecolor=ACCENT1,
        markeredgecolor=BG, markeredgewidth=1.5)

# Shaded fills
yoy_arr = np.array(vals)
ax.fill_between(years_str, yoy_arr, 0,
                where=(yoy_arr >= 30),
                interpolate=False,
                color=ACCENT4, alpha=0.20, label="Strong Growth (>=30%)")
ax.fill_between(years_str, yoy_arr, 0,
                where=(yoy_arr < 30),
                interpolate=False,
                color=ACCENT3, alpha=0.20, label="Slow Growth (<30%)")

# Data labels
for i, (yr, val) in enumerate(zip(years_str, vals)):
    offset = 10 if val >= 0 else -18
    ax.annotate(f"{val:.1f}%",
                xy=(yr, val),
                xytext=(0, offset), textcoords="offset points",
                ha="center", color=TEXT_PRI,
                fontsize=9, fontweight="bold")

# Peak annotation
peak_idx = int(np.argmax(vals))
ax.annotate("  Peak",
            xy=(years_str[peak_idx], vals[peak_idx]),
            xytext=(25, 0), textcoords="offset points",
            color=ACCENT4, fontsize=9, fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=ACCENT4, lw=1.5))

# Trough annotation
trough_idx = int(np.argmin(vals))
ax.annotate("  Slowdown",
            xy=(years_str[trough_idx], vals[trough_idx]),
            xytext=(25, 0), textcoords="offset points",
            color=ACCENT3, fontsize=9, fontweight="bold",
            arrowprops=dict(arrowstyle="->", color=ACCENT3, lw=1.5))

ax.axhline(0, color=TEXT_SEC, linewidth=0.8, linestyle="--", alpha=0.5)
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x:.0f}%"))
ax.set_xlabel("Year", color=TEXT_SEC, fontsize=10)
ax.set_ylabel("YoY Growth (%)", color=TEXT_SEC, fontsize=10)
ax.tick_params(colors=TEXT_SEC, labelsize=9)

ax.set_title("India Solar Capacity — Year-on-Year (YoY) Growth Rate (2015–2024)",
             color=TEXT_PRI, fontsize=14, fontweight="bold", pad=14, loc="left")
ax.annotate("Percentage change in cumulative solar capacity vs prior year",
            xy=(0, 1.025), xycoords="axes fraction",
            color=TEXT_SEC, fontsize=9, ha="left")

ax.legend(facecolor=CARD, edgecolor=GRID_C, labelcolor=TEXT_PRI,
          fontsize=9, loc="upper right")

fig.tight_layout()
out = os.path.join(CHART_DIR, "13_yoy_growth_line.png")
fig.savefig(out, dpi=160, bbox_inches="tight", facecolor=BG)
plt.close(fig)
print(f"[SAVED] {out}")
