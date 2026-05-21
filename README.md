# MECAQC
### Multi-pollutant Emissions Calculator for Air Quality and Climate

A full-stack web application that models four regulatory transition scenarios for coal-fired power facilities, producing monetized health and climate impact estimates across multiple pollutant types. Developed as a member of the Holloway Group at the University of Wisconsin–Madison, a NASA-affiliated atmospheric science research lab. This application implements and operationalizes the modeling framework from Wu et al. (2024).

> Based on: Wu, S., et al. (2024). Health and climate benefits of different energy transition scenarios for coal-fired power plants in the United States. *Environmental Research Letters.*

---

## Features

- Models four transition scenarios: Business as Usual (BAU), Gas Transition (GT), Renewables Transition (RT), and Add-on Controls (AC)
- Calculates emissions changes across SO₂, NOₓ, PM₂.₅, VOC, and CO₂
- Produces annualized health and climate benefit estimates using EPA and EIA monetization factors
- State-specific cost adjustment logic based on EPA CAMPD and EIA reference datasets
- Interactive map for selecting pre-loaded EPA CAMPD facilities
- Persistent scenario storage with form re-population from saved runs
- React frontend with landing page, guided 3-step workflow, and real-time results rendering

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | PostgreSQL (Supabase), SQLAlchemy, Alembic |
| Validation | Pydantic |
| Testing | pytest |
| Data sources | EPA CAMPD, EIA, Wu et al. 2024 |

---

## Project Structure

