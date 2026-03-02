# MARITIME WEATHER BRIEFING
**Date**: 2 March 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> ICON-EU: **Windy API** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)
> Δkt = ECMWF minus ICON-EU — divergence ⚠ >5kt signals low forecast confidence.

| Time  | Temp    | ICON-EU Dir     | ICON (kt) | Gust (kt) | BFT  | ECMWF Dir | ECMWF (kt) | Δkt   | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|-----------|------------|-------|----------|-----------|
| 06:00  | 12.4°C  | 176° S     | 13.3kt | 8.6kt | F4 | SE    | 2.9kt | ⚠ -10.4 | 13% | 0.0mm |
| 09:00  | 12.9°C  |  22° NNE   | 3.7kt | 17.1kt | F1 | SE    | 5.8kt | +2.1 | 45% | 0.0mm |
| 12:00  | 14.0°C  | 359° N     | 3.0kt | 17.5kt | F1 | SSE   | 4.6kt | +1.6 | 68% | 0.0mm |
| 15:00  | 13.1°C  | 216° SW    | 6.1kt | 15.1kt | F2 | SSW   | 5.1kt | -1.0 | 65% | 5.0mm |
| 18:00  | 12.4°C  | 167° SSE   | 4.8kt | 12.1kt | F2 | NNW   | 5.7kt | +0.9 | 65% | 0.0mm |
| **21:00**  | **11.9°C**  | **197° SSW  ** | **15.7kt** | **13.7kt** | **F4** | **NE   ** | **6.0kt** | **⚠ -9.7** | **40%** | **0.0mm** |

**Wind summary**: Peak 15.7kt from 197° SSW at 21:00, gusting 13.7kt (F4). Direction: S → NNE → N → SW → SSE → SSW. Max model spread: **10.4kt** (ICON-EU vs ECMWF — ⚠ low confidence), plan for the stronger figure. Total rain: 5.0mm. Temperature: **11.9°C** (min) → **14.0°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 01:42 UTC — 3.48m (ZH)
HW2: 14:09 UTC — 3.29m (ZH)
LW:  07:58 UTC — 0.65m (ZH)
LW:  20:06 UTC — 0.74m (ZH)
Tidal range: 2.83m
```

| Time (UTC)    | Stream at departure/return    | Passage note                                     |
|---------------|-------------------------------|--------------------------------------------------|
| 14:00 (dep)  | slack flood                   | Near-slack (07:58→14:09 UTC) — minimal current |
| 17:00 (ret)  | strong ebb                    | strong ebb — seaward back to base ✓ |
| 01:42 UTC | HW slack (3.48m ZH) | Calmest bar crossing window |
| 07:58 UTC | LW slack (0.65m ZH) | Calmest bar crossing window |
| 14:09 UTC | HW slack (3.29m ZH) | Calmest bar crossing window |
| 20:06 UTC | LW slack (0.74m ZH) | Calmest bar crossing window |

> **Passage window**: Depart 14:00 → **upriver** (near-slack (HIGH at 14:09 UTC — minimal adverse current on departure)). Return 17:00 on **strong ebb** — ✓ seaward (back to base).

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| **Mon 02 Mar   ** | **Rain showers         ** | **14.0** | **11.7** | **75%** | **16.1** | **6.4** | **17.7** | **213° SSW** |
| Tue 03 Mar    | Rain showers          | 20.1 | 11.6 | 30% | 1.1 | 10.0 | 24.3 | 46° NE |
| Wed 04 Mar    | Partly cloudy         | 21.0 | 13.8 | 0% | 0.0 | 8.8 | 20.4 | 19° NNE |
| Thu 05 Mar    | Overcast              | 15.6 | 10.5 | 20% | 0.0 | 13.8 | 37.3 | 356° N |
| Fri 06 Mar    | Mainly clear          | 14.6 | 9.6 | 28% | 0.0 | 11.1 | 28.0 | 5° N |
| Sat 07 Mar    | Mainly clear          | 14.9 | 7.4 | 15% | 0.0 | 5.6 | 15.6 | 23° NNE |
| Sun 08 Mar    | Overcast              | 14.3 | 7.4 | 22% | 0.3 | 8.5 | 18.7 | 307° NW |

**Week reading**: 2 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **37.3kt** on Thu 05 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-03-02T07:43:04.783Z UTC*