# MARITIME WEATHER BRIEFING
**Date**: 1 March 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 8.4°C  |  35° NE    | 1.8kt | 18.5kt | F1 | 0% | 0.0mm |
| **09:00**  | **10.1°C**  | **183° S    ** | **16.9kt** | **29.7kt** | **F4** | **0%** | **0.0mm** |
| 12:00  | 15.5°C  | 173° S     | 7.7kt | 20.7kt | F3 | 0% | 0.0mm |
| 15:00  | 16.4°C  | 225° SW    | 8.6kt | 20.0kt | F3 | 0% | 0.0mm |
| 18:00  | 14.9°C  | 204° SSW   | 12.0kt | 21.8kt | F4 | 0% | 0.0mm |
| 21:00  | 12.4°C  | 169° S     | 3.0kt | 14.1kt | F1 | 0% | 0.0mm |

**Wind summary**: Peak 16.9kt from 183° S at 09:00, gusting 29.7kt (F4). Direction: NE → S → SW → SSW. Zero precipitation. Temperature: **8.4°C** (min) → **16.4°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 00:57 UTC — 3.28m (ZH)
HW2: 13:29 UTC — 3.14m (ZH)
LW:  07:17 UTC — 0.80m (ZH)
LW:  19:26 UTC — 0.90m (ZH)
Tidal range: 2.49m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 22:57 | Flood at peak         | Assists entry to estuary               |
| 00:57           | HW slack              | Cross bars and shallows — timing key   |
| 02:57 | Ebb building          | Assists exit from estuary → sea        |
| 05:17 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 07:17           | LW slack              | Calmest bar crossing window            |
| 13:29          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Sun 01 Mar    | Overcast              | 16.9 | 8.1 | 0% | 0.0 | 5.6 | 14.6 | 245° WSW |
| **Mon 02 Mar   ** | **Rain showers         ** | **14.1** | **11.1** | **83%** | **9.5** | **9.3** | **22.9** | **350° N** |
| Tue 03 Mar    | Rain showers          | 19.8 | 11.0 | 30% | 1.8 | 10.4 | 25.3 | 36° NE |
| Wed 04 Mar    | Mainly clear          | 20.8 | 13.3 | 5% | 0.0 | 8.9 | 20.6 | 19° NNE |
| Thu 05 Mar    | Overcast              | 16.8 | 11.4 | 11% | 0.0 | 14.8 | 37.9 | 360° N |
| Fri 06 Mar    | Clear sky             | 16.5 | 9.1 | 11% | 0.0 | 12.5 | 30.1 | 18° NNE |
| Sat 07 Mar    | Mainly clear          | 17.0 | 6.9 | 10% | 0.0 | 7.8 | 18.7 | 69° ENE |

**Week reading**: 5 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **37.9kt** on Thu 05 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-03-01T07:27:02.346Z UTC*