# MARITIME WEATHER BRIEFING
**Date**: 22 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 18:00  | 19.8°C  |  26° NNE   | 2.5kt | 9.0kt | F1 | 0% | 0.0mm |
| **21:00**  | **15.7°C**  | **315° NW   ** | **3.0kt** | **7.2kt** | **F1** | **0%** | **0.0mm** |

**Wind summary**: Peak 3.0kt from 315° NW at 21:00, gusting 7.2kt (F1). Direction: NNE → NW. Zero precipitation. Temperature: **15.7°C** (min) → **19.8°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 05:26 UTC — 3.37m (ZH)
HW2: 17:49 UTC — 3.14m (ZH)
LW:  11:32 UTC — 0.83m (ZH)
LW:  23:51 UTC — 0.94m (ZH)
Tidal range: 2.54m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 03:26 | Flood at peak         | Assists entry to estuary               |
| 05:26           | HW slack              | Cross bars and shallows — timing key   |
| 07:26 | Ebb building          | Assists exit from estuary → sea        |
| 09:32 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 11:32           | LW slack              | Calmest bar crossing window            |
| 17:49          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Sun 22 Feb    | Partly cloudy         | 20.9 | 10.5 | 0% | 0.0 | 5.9 | 14.2 | 48° NE |
| Mon 23 Feb    | Overcast              | 20.8 | 10.6 | 0% | 0.0 | 4.3 | 10.5 | 83° E |
| Tue 24 Feb    | Overcast              | 18.0 | 12.6 | 4% | 0.0 | 11.3 | 23.7 | 199° SSW |
| **Wed 25 Feb   ** | **⚡ Thunderstorm       ** | **17.7** | **12.2** | **53%** | **2.1** | **7.3** | **15.9** | **288° WNW** |
| Thu 26 Feb    | Overcast              | 19.0 | 10.8 | 3% | 0.0 | 6.2 | 12.8 | 359° N |
| Fri 27 Feb    | 🌧 Light rain         | 15.4 | 10.3 | 25% | 3.0 | 16.2 | 33.8 | 355° N |
| Sat 28 Feb    | Overcast              | 14.2 | 10.5 | 13% | 0.0 | 13.3 | 27.2 | 354° N |

⚡ **Wed 25 Feb — DO NOT SAIL**: Thunderstorm (WMO 95), 53% probability.

**Week reading**: 5 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **33.8kt** on Fri 27 Feb. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-22T21:18:07.431Z UTC*