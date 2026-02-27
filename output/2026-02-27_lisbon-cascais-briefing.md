# MARITIME WEATHER BRIEFING
**Date**: 27 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| **06:00**  | **11.7°C**  | **135° SE   ** | **7.7kt** | **5.4kt** | **F3** | **0%** | **0.0mm** |
| 09:00  | 12.8°C  |   5° N     | 5.9kt | 6.1kt | F2 | 3% | 0.0mm |
| 12:00  | 15.9°C  | 196° SSW   | 2.0kt | 17.6kt | F1 | 50% | 0.0mm |
| 15:00  | 16.6°C  | 195° SSW   | 2.8kt | 25.0kt | F1 | 8% | 0.0mm |
| 18:00  | 14.2°C  | 258° WSW   | 5.2kt | 8.1kt | F2 | 0% | 0.0mm |
| 21:00  | 11.7°C  | 144° SE    | 6.0kt | 5.7kt | F2 | 0% | 0.0mm |

**Wind summary**: Peak 7.7kt from 135° SE at 06:00, gusting 5.4kt (F3). Direction: SE → N → SSW → WSW. Zero precipitation. Temperature: **11.7°C** (min) → **16.6°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 11:41 UTC — 2.75m (ZH)
LW:  05:24 UTC — 1.23m (ZH)
LW:  17:44 UTC — 1.30m (ZH)
Tidal range: 1.52m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 09:41 | Flood at peak         | Assists entry to estuary               |
| 11:41           | HW slack              | Cross bars and shallows — timing key   |
| 13:41 | Ebb building          | Assists exit from estuary → sea        |
| 03:24 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 05:24           | LW slack              | Calmest bar crossing window            |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| **Fri 27 Feb   ** | **Rain showers         ** | **17.1** | **11.5** | **50%** | **0.2** | **10.3** | **24.1** | **352° N** |
| Sat 28 Feb    | Overcast              | 16.0 | 10.2 | 0% | 0.0 | 11.2 | 26.6 | 6° N |
| Sun 01 Mar    | Overcast              | 17.2 | 8.7 | 0% | 0.0 | 5.4 | 16.3 | 271° W |
| **Mon 02 Mar   ** | **🌧 Light rain        ** | **13.1** | **8.4** | **86%** | **5.1** | **7.5** | **24.5** | **271° W** |
| Tue 03 Mar    | Overcast              | 15.2 | 7.0 | 25% | 0.0 | 8.8 | 21.2 | 61° ENE |
| Wed 04 Mar    | Partly cloudy         | 18.4 | 11.7 | 10% | 0.0 | 11.7 | 25.9 | 357° N |
| Thu 05 Mar    | Overcast              | 13.8 | 11.1 | 25% | 0.0 | 15.8 | 35.0 | 347° NNW |

**Week reading**: 3 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **35.0kt** on Thu 05 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-27T07:39:57.432Z UTC*