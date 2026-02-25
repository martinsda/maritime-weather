# MARITIME WEATHER BRIEFING
**Date**: 25 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 13.5°C  | 213° SSW   | 2.8kt | 23.2kt | F1 | 10% | 0.0mm |
| 09:00  | 13.7°C  | 161° SSE   | 5.1kt | 18.1kt | F2 | 38% | 0.0mm |
| 12:00  | 16.1°C  | 110° ESE   | 3.5kt | 7.1kt | F1 | 15% | 0.0mm |
| 15:00  | 17.6°C  | 176° S     | 2.6kt | 6.8kt | F1 | 20% | 0.0mm |
| 18:00  | 15.9°C  | 169° S     | 7.0kt | 10.0kt | F3 | 8% | 0.0mm |
| **21:00**  | **14.1°C**  | **168° SSE  ** | **10.2kt** | **10.2kt** | **F3** | **3%** | **0.0mm** |

**Wind summary**: Peak 10.2kt from 168° SSE at 21:00, gusting 10.2kt (F3). Direction: SSW → SSE → ESE → S. Zero precipitation. Temperature: **13.5°C** (min) → **17.6°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 08:32 UTC — 2.67m (ZH)
HW2: 21:15 UTC — 2.73m (ZH)
LW:  02:03 UTC — 1.34m (ZH)
LW:  14:42 UTC — 1.46m (ZH)
Tidal range: 1.33m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 06:32 | Flood at peak         | Assists entry to estuary               |
| 08:32           | HW slack              | Cross bars and shallows — timing key   |
| 10:32 | Ebb building          | Assists exit from estuary → sea        |
| 00:03 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 02:03           | LW slack              | Calmest bar crossing window            |
| 21:15          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Wed 25 Feb    | Fog                   | 17.6 | 13.4 | 43% | 0.7 | 5.2 | 12.8 | 297° WNW |
| Thu 26 Feb    | Partly cloudy         | 21.2 | 11.3 | 5% | 0.1 | 5.2 | 12.6 | 23° NNE |
| Fri 27 Feb    | Overcast              | 17.0 | 11.7 | 19% | 0.0 | 9.7 | 22.4 | 355° N |
| Sat 28 Feb    | Overcast              | 16.5 | 10.7 | 3% | 0.0 | 11.3 | 28.0 | 360° N |
| Sun 01 Mar    | Overcast              | 16.7 | 10.4 | 5% | 0.0 | 6.7 | 15.6 | 233° SW |
| **Mon 02 Mar   ** | **Rain showers         ** | **12.9** | **9.4** | **67%** | **24.0** | **8.0** | **21.8** | **217° SW** |
| **Tue 03 Mar   ** | **Overcast             ** | **14.4** | **9.1** | **53%** | **0.0** | **15.1** | **35.2** | **126° SE** |

**Week reading**: 4 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **35.2kt** on Tue 03 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-25T07:46:38.691Z UTC*