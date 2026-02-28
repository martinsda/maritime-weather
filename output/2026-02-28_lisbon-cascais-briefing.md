# MARITIME WEATHER BRIEFING
**Date**: 28 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 10.4°C  | 147° SSE   | 5.2kt | 17.1kt | F2 | 0% | 0.0mm |
| 09:00  | 11.6°C  | 283° WNW   | 1.8kt | 11.8kt | F1 | 0% | 0.0mm |
| 12:00  | 15.3°C  |   7° N     | 4.4kt | 6.6kt | F2 | 0% | 0.0mm |
| 15:00  | 16.4°C  | 177° S     | 9.9kt | 6.0kt | F3 | 0% | 0.0mm |
| 18:00  | 13.8°C  |  47° NE    | 2.8kt | 6.0kt | F1 | 0% | 0.0mm |
| **21:00**  | **11.4°C**  | **159° SSE  ** | **9.9kt** | **17.2kt** | **F3** | **0%** | **0.0mm** |

**Wind summary**: Peak 9.9kt from 159° SSE at 21:00, gusting 17.2kt (F3). Direction: SSE → WNW → N → S → NE. Zero precipitation. Temperature: **10.4°C** (min) → **16.4°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 00:02 UTC — 3.05m (ZH)
HW2: 12:42 UTC — 2.95m (ZH)
LW:  06:29 UTC — 1.01m (ZH)
LW:  18:41 UTC — 1.09m (ZH)
Tidal range: 2.04m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 22:02 | Flood at peak         | Assists entry to estuary               |
| 00:02           | HW slack              | Cross bars and shallows — timing key   |
| 02:02 | Ebb building          | Assists exit from estuary → sea        |
| 04:29 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 06:29           | LW slack              | Calmest bar crossing window            |
| 12:42          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Sat 28 Feb    | Overcast              | 16.5 | 10.2 | 0% | 0.0 | 9.6 | 23.3 | 8° N |
| Sun 01 Mar    | Overcast              | 17.6 | 8.5 | 0% | 0.0 | 4.9 | 13.4 | 34° NE |
| **Mon 02 Mar   ** | **Rain showers         ** | **14.2** | **9.9** | **93%** | **5.3** | **8.6** | **21.2** | **268° W** |
| Tue 03 Mar    | 🌧 Light rain         | 18.4 | 9.9 | 33% | 1.1 | 8.4 | 25.3 | 32° NNE |
| Wed 04 Mar    | Overcast              | 19.9 | 12.2 | 8% | 0.0 | 8.8 | 23.1 | 354° N |
| Thu 05 Mar    | 🌧 Light rain         | 13.2 | 10.0 | 20% | 1.5 | 19.1 | 44.5 | 352° N |
| Fri 06 Mar    | Mainly clear          | 14.2 | 8.2 | 25% | 0.0 | 13.8 | 32.3 | 9° N |

**Week reading**: 3 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **44.5kt** on Thu 05 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-28T07:20:28.414Z UTC*