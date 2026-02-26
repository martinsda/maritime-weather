# MARITIME WEATHER BRIEFING
**Date**: 26 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 11.3°C  | 139° SE    | 4.8kt | 13.2kt | F2 | 0% | 0.0mm |
| 09:00  | 12.3°C  | 358° N     | 3.1kt | 4.3kt | F1 | 0% | 0.0mm |
| 12:00  | 17.2°C  | 174° S     | 2.9kt | 7.8kt | F1 | 0% | 0.0mm |
| 15:00  | 19.9°C  | 191° S     | 2.1kt | 5.7kt | F1 | 0% | 0.0mm |
| 18:00  | 19.7°C  | 174° S     | 5.5kt | 23.0kt | F2 | 0% | 0.0mm |
| **21:00**  | **15.4°C**  | **161° SSE  ** | **11.9kt** | **14.0kt** | **F4** | **0%** | **0.0mm** |

**Wind summary**: Peak 11.9kt from 161° SSE at 21:00, gusting 14.0kt (F4). Direction: SE → N → S → SSE. Zero precipitation. Temperature: **11.3°C** (min) → **19.9°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 10:13 UTC — 2.62m (ZH)
HW2: 22:49 UTC — 2.83m (ZH)
LW:  03:50 UTC — 1.39m (ZH)
LW:  16:25 UTC — 1.46m (ZH)
Tidal range: 1.24m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 08:13 | Flood at peak         | Assists entry to estuary               |
| 10:13           | HW slack              | Cross bars and shallows — timing key   |
| 12:13 | Ebb building          | Assists exit from estuary → sea        |
| 01:50 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 03:50           | LW slack              | Calmest bar crossing window            |
| 22:49          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Thu 26 Feb    | Mainly clear          | 20.3 | 10.9 | 5% | 0.0 | 5.3 | 14.2 | 36° NE |
| Fri 27 Feb    | Rain showers          | 16.4 | 11.1 | 33% | 1.5 | 9.9 | 23.1 | 348° NNW |
| Sat 28 Feb    | Overcast              | 16.0 | 10.4 | 0% | 0.0 | 11.7 | 27.2 | 6° N |
| Sun 01 Mar    | Overcast              | 15.9 | 9.8 | 0% | 0.0 | 5.9 | 15.4 | 280° W |
| **Mon 02 Mar   ** | **🌧 Light rain        ** | **12.3** | **10.2** | **80%** | **8.7** | **8.4** | **23.7** | **337° NNW** |
| Tue 03 Mar    | Partly cloudy         | 15.1 | 10.1 | 34% | 0.0 | 12.5 | 27.6 | 350° N |
| Wed 04 Mar    | Overcast              | 13.8 | 10.5 | 10% | 0.0 | 10.1 | 22.0 | 342° NNW |

**Week reading**: 4 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **27.6kt** on Tue 03 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-26T07:45:03.315Z UTC*