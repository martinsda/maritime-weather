# MARITIME WEATHER BRIEFING
**Date**: 24 February 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> Wind: **Windy API / iconEu** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)

| Time  | Temp    | Wind Dir        | Wind (kt) | Gust (kt) | BFT  | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|----------|-----------|
| 06:00  | 13.4°C  | 169° S     | 7.4kt | 26.1kt | F3 | 0% | 0.0mm |
| **09:00**  | **14.2°C**  | **194° SSW  ** | **10.9kt** | **9.5kt** | **F3** | **0%** | **0.0mm** |
| 12:00  | 16.4°C  | 146° SSE   | 3.0kt | 8.5kt | F1 | 0% | 0.0mm |
| 15:00  | 18.3°C  | 343° NNW   | 7.0kt | 5.8kt | F2 | 0% | 0.0mm |
| 18:00  | 17.0°C  | 174° S     | 7.6kt | 10.0kt | F3 | 0% | 0.0mm |
| 21:00  | 15.2°C  | 183° S     | 10.8kt | 6.9kt | F3 | 0% | 0.0mm |

**Wind summary**: Peak 10.9kt from 194° SSW at 09:00, gusting 9.5kt (F3). Direction: S → SSW → SSE → NNW. Zero precipitation. Temperature: **13.4°C** (min) → **18.3°C** (max).

---

## TIDES — Lisbon / Tagus Bar

> Heights above **Zero Hidrográfico (ZH)** — same datum as Porto de Lisboa and Portuguese charts.
> Stormglass model prediction (+2.08 m MSL→ZH offset applied). Always verify against the official source before critical passages.
> **Official tide table → [Porto de Lisboa — Marés](https://www.portodelisboa.pt/mares)**

```
HW1: 07:12 UTC — 2.88m (ZH)
HW2: 19:47 UTC — 2.81m (ZH)
LW:  00:46 UTC — 1.16m (ZH)
LW:  13:19 UTC — 1.28m (ZH)
Tidal range: 1.72m
```

| Time          | Stream                | Passage note                           |
|---------------|-----------------------|----------------------------------------|
| 05:12 | Flood at peak         | Assists entry to estuary               |
| 07:12           | HW slack              | Cross bars and shallows — timing key   |
| 09:12 | Ebb building          | Assists exit from estuary → sea        |
| 22:46 | Ebb at peak           | Fast exit — bar active, wind/tide risk |
| 00:46           | LW slack              | Calmest bar crossing window            |
| 19:47          | HW2 — flood building  | Comfortable return bar entry           |

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Tue 24 Feb    | Overcast              | 18.6 | 13.2 | 5% | 0.0 | 10.5 | 22.2 | 196° SSW |
| **Wed 25 Feb   ** | **Rain showers         ** | **16.8** | **13.9** | **50%** | **1.3** | **5.8** | **16.7** | **215° SW** |
| Thu 26 Feb    | Mainly clear          | 22.1 | 11.5 | 8% | 0.0 | 6.0 | 14.0 | 33° NNE |
| Fri 27 Feb    | Overcast              | 16.8 | 11.4 | 18% | 0.0 | 12.6 | 27.2 | 351° N |
| Sat 28 Feb    | Mainly clear          | 17.4 | 10.7 | 4% | 0.0 | 13.1 | 28.2 | 358° N |
| Sun 01 Mar    | Overcast              | 17.9 | 11.0 | 5% | 0.0 | 7.6 | 19.4 | 306° NW |
| Mon 02 Mar    | Rain showers          | 12.3 | 10.6 | 45% | 6.6 | 13.4 | 27.0 | 347° NNW |

**Week reading**: 5 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **28.2kt** on Sat 28 Feb. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-02-24T07:44:35.303Z UTC*