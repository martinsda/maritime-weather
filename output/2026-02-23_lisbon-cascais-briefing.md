# MARITIME WEATHER BRIEFING
**Date**: 23 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 11.0°C  | 242° WSW   | 3.2kt | 23.6kt | F1 | 0% | 0.0mm |
| **09:00**  | **11.9°C**  | **147° SSE  ** | **7.0kt** | **9.3kt** | **F2** | **0%** | **0.0mm** |
| 12:00  | 18.2°C  | 357° N     | 3.4kt | 14.3kt | F1 | 0% | 0.0mm |
| 15:00  | 20.3°C  | 183° S     | 4.7kt | 9.8kt | F2 | 0% | 0.0mm |
| 18:00  | 17.0°C  | 310° NW    | 3.7kt | 6.4kt | F1 | 0% | 0.0mm |
| 21:00  | 14.0°C  | 311° NW    | 0.9kt | 5.7kt | F0 | 0% | 0.0mm |

**Wind summary**: Peak 7.0kt from 147° SSE at 09:00, gusting 9.3kt (F2). Direction: WSW → SSE → N → S → NW. Zero precipitation. Temperature: **11.0°C** (min) → **20.3°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 06:14 UTC — 3.14m (ZH)
HW2: 18:40 UTC — 2.96m (ZH)
LW:  12:19 UTC — 1.05m (ZH)
Tidal range: 2.09m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 04:14 | Flood at peak         | Assists entry to estuary               |
| 06:14           | HW slack              | Cross bars and shallows — timing key   |
| 08:14 | Ebb building          | Assists exit from estuary → sea        |
| 10:19 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 12:19           | LW slack              | Calmest bar crossing window            |
| 18:40          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Mon 23 Feb    | Overcast              | 20.9 | 10.5 | 0% | 0.0 | 6.0 | 13.0 | 148° SSE |
| Tue 24 Feb    | Overcast              | 18.7 | 12.7 | 3% | 0.0 | 11.2 | 22.9 | 198° SSW |
| **Wed 25 Feb   ** | **Rain showers         ** | **18.3** | **12.6** | **54%** | **2.0** | **7.3** | **18.9** | **312° NW** |
| Thu 26 Feb    | Overcast              | 20.3 | 11.1 | 0% | 0.0 | 5.7 | 13.6 | 11° N |
| Fri 27 Feb    | 🌧 Light rain         | 18.7 | 11.2 | 20% | 3.3 | 11.7 | 25.9 | 4° N |
| Sat 28 Feb    | Overcast              | 15.3 | 11.2 | 3% | 0.0 | 16.4 | 34.6 | 355° N |
| Sun 01 Mar    | Overcast              | 15.6 | 11.6 | 7% | 0.0 | 7.9 | 18.5 | 324° NW |

**Week reading**: 4 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **34.6kt** on Sat 28 Feb. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-23T07:48:21.376Z UTC*