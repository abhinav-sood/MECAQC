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

```
mecaqc/
├── backend/
│   ├── main.py               # FastAPI app and middleware
│   ├── calculator.py         # Scenario calculation engine
│   ├── mock_data.py          # Constants and state lookup tables
│   ├── schema.py             # Pydantic request/response schemas
│   ├── database.py           # SQLAlchemy engine and session setup
│   ├── models.py             # ORM model for saved scenarios
│   ├── routes/
│   │   ├── scenarios.py      # /scenario/run, /scenario/save, /scenarios
│   │   └── plants.py         # /plants, /plants/{facilityID}
│   ├── data/
│   │   └── plants.csv        # Pre-loaded EPA CAMPD facility data
│   ├── alembic/              # Database migrations
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx           # Root component, view state, layout
│       ├── InputForm.jsx     # 11-field facility input form
│       ├── ResultsPanel.jsx  # Scenario cards, charts, financials
│       ├── Map.jsx           # Interactive facility selection map
│       └── SavedScenarios.jsx# Saved runs list with form re-population
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL database (or a Supabase project)

### Backend

```bash
cd backend

# Create a .env file with your database connection string
echo "DATABASE_URL=postgresql://user:password@host/dbname" > .env

pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
# From the project root
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API

### `POST /scenario/run`

Accepts facility-level inputs and returns cost-benefit outputs for all four scenarios.

**Request body**

```json
{
  "state": "AL",
  "capacity": 403,
  "heatInput": 1598916,
  "annualGeneration": 166714,
  "SO2Rate": 0.6,
  "operatingHours": 8760,
  "baselineSO2": 953,
  "baselineNOx": 227,
  "baselinePM25": 71.6,
  "baselineVOC": 4.1,
  "baselineCO2": 164046
}
```

**Response**

Returns scenario results for BAU, GT, RT, and AC including net benefit, total annual cost (TAC), and per-pollutant emission changes.

---

### `POST /scenario/save`

Persists a facility input and its computed results to the database.

### `GET /scenarios`

Returns all saved scenario runs with key summary fields (state, capacity, per-scenario net benefits, timestamps).

### `GET /plants` / `GET /plants/{facilityID}`

Returns pre-loaded EPA CAMPD facility records for map-based selection.

---

## Scenarios

| Scenario | Description | Status |
|---|---|---|
| BAU | Business as Usual | ✅ Verified |
| GT | Gas Transition | ✅ Verified |
| RT | Renewables Transition | ✅ Verified |
| AC | Add-on Controls | ✅ Verified |

---

## Methodology

Emissions and cost calculations follow the peer-reviewed methodology from:

> Wu, S., et al. (2024). Health and climate benefits of different energy transition scenarios for coal-fired power plants in the United States. *Environmental Research Letters.*

Cost factors are sourced from EPA and EIA datasets and adjusted by state using regional multipliers. The AC scenario uses a capital recovery factor of 2.5% per EPA Control Cost Manual (Ch. 2), verified against the Barry plant reference case in Wu et al. 2024. All costs are reported in **2020 dollars**.

---

## Acknowledgements

Developed as part of the [Holloway Group](https://hollowaygroup.org) at the University of Wisconsin–Madison, a NASA-affiliated atmospheric science research lab. Special thanks to Dr. Xinran Wu, Dr. Tracey Holloway, and Vedaa Vandavasi.
