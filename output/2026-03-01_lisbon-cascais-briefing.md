# MARITIME WEATHER BRIEFING
**Date**: 1 March 2026
**Route**: Lisbon → Cascais
**Base coordinates**: 38.682°N, 9.219°W | Elevation: 16m
**Web**: [martinsda.github.io/maritime-weather](https://martinsda.github.io/maritime-weather/)

---

## TODAY — HOURLY FORECAST

> ICON-EU: **Windy API** (3-hourly, ⚠ test key — values shuffled, not reliable) · Temp / Precip / Rain: **Open-Meteo** (live)
> Δkt = ECMWF minus ICON-EU — divergence ⚠ >5kt signals low forecast confidence.

| Time  | Temp    | ICON-EU Dir     | ICON (kt) | Gust (kt) | BFT  | ECMWF Dir | ECMWF (kt) | Δkt   | Precip % | Rain (mm) |
|-------|---------|-----------------|-----------|-----------|------|-----------|------------|-------|----------|-----------|
| 09:00  | 10.1°C  | 359° N     | 3.2kt | 10.5kt | F1 | ENE   | 3.1kt | -0.1 | 0% | 0.0mm |
| **12:00**  | **15.3°C**  | **160° SSE  ** | **9.7kt** | **16.4kt** | **F3** | **ESE  ** | **1.8kt** | **⚠ -7.9** | **0%** | **0.0mm** |
| 15:00  | 16.3°C  |  88° E     | 1.8kt | 23.0kt | F1 | SSW   | 4.7kt | +2.9 | 0% | 0.0mm |
| 18:00  | 14.4°C  | 190° S     | 3.8kt | 9.0kt | F1 | WSW   | 3.1kt | -0.7 | 0% | 0.0mm |
| 21:00  | 12.1°C  | 295° WNW   | 7.5kt | 19.5kt | F3 | WNW   | 2.5kt | ⚠ -5.0 | 0% | 0.0mm |

**Wind summary**: Peak 9.7kt from 160° SSE at 12:00, gusting 16.4kt (F3). Direction: N → SSE → E → S → WNW. Max model spread: **7.9kt** (ICON-EU vs ECMWF — ⚠ low confidence), plan for the stronger figure. Zero precipitation. Temperature: **10.1°C** (min) → **16.3°C** (max).

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

| Time (UTC)    | Stream at departure/return    | Passage note                                     |
|---------------|-------------------------------|--------------------------------------------------|
| 14:00 (dep)  | slack ebb                     | Near-slack (13:29→19:26) — negligible effect |
| 17:00 (ret)  | strong ebb                    | strong ebb — adverse for return; plan for extra time |
| 00:57 UTC | HW slack (3.28m ZH) | Calmest bar crossing window |
| 07:17 UTC | LW slack (0.80m ZH) | Calmest bar crossing window |
| 13:29 UTC | HW slack (3.14m ZH) | Calmest bar crossing window |
| 19:26 UTC | LW slack (0.90m ZH) | Calmest bar crossing window |

> **Passage window**: ✓ Depart 14:00 on slack ebb — seaward/Cascais favoured. Return 17:00 on strong ebb — allow extra time against ebb.

---

## MULTI-DAY FORECAST (Open-Meteo — Live Data)

| Date          | Condition             | Max°C | Min°C | Rain % | Precip (mm) | Wind Max (kt) | Gust Max (kt) | Dom. Dir      |
|---------------|-----------------------|-------|-------|--------|-------------|---------------|---------------|---------------|
| Sun 01 Mar    | Overcast              | 17.0 | 8.1 | 0% | 0.0 | 5.7 | 14.6 | 254° WSW |
| **Mon 02 Mar   ** | **Rain showers         ** | **13.5** | **10.7** | **85%** | **6.4** | **5.1** | **15.7** | **281° W** |
| Tue 03 Mar    | Overcast              | 20.2 | 11.5 | 30% | 0.0 | 9.8 | 23.5 | 35° NE |
| Wed 04 Mar    | Overcast              | 19.7 | 12.9 | 5% | 0.0 | 9.1 | 22.4 | 358° N |
| Thu 05 Mar    | Overcast              | 15.1 | 10.3 | 13% | 0.0 | 13.8 | 35.2 | 355° N |
| Fri 06 Mar    | Clear sky             | 16.5 | 8.4 | 12% | 0.0 | 11.1 | 26.8 | 16° NNE |
| Sat 07 Mar    | Mainly clear          | 17.0 | 6.9 | 10% | 0.0 | 7.8 | 18.7 | 69° ENE |

**Week reading**: 5 of 7 days settled (rain <20%, wind <15kt). Peak gust this week: **35.2kt** on Thu 05 Mar. Confidence high D+0–D+2, indicative only beyond 72 hrs.

---

## SOURCES

| Source | Type | Endpoint |
|--------|------|----------|
| Windy API / iconEu | Wind, pressure, temp | `api.windy.com/api/point-forecast/v2` |
| Windy API / gfsWave | Waves, swell | `api.windy.com/api/point-forecast/v2` |
| Open-Meteo | Temp, rain, precip probability | `api.open-meteo.com/v1/forecast` |
| Stormglass.io | Tidal extremes | `api.stormglass.io/v2/tide/extremes/point` |

*Generated: 2026-03-01T10:35:17.473Z UTC*