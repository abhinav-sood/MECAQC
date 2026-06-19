import pandas as pd

df = pd.read_csv('../uncontrolled_bpt.csv')

aggregated = df.groupby('Facility ID').agg(
    facilityID    = ('Facility ID', 'first'),
    facilityName  = ('Facility Name', 'first'),
    state         = ('State', 'first'),
    capacity      = ('capacity', 'sum'),
    annualGeneration = ('Gross_Load_MWh', 'sum'),
    heatInput     = ('Heat Input (mmBtu)', 'sum'),
    operatingHours = ('Sum of the Operating Time', 'sum'),
    SO2Rate       = ('SO2 Rate (lbs/mmBtu)', 'mean'),
    baselineSO2   = ('SO2(short tons)', 'sum'),
    baselineNOx   = ('NOx (short tons)', 'sum'),
    baselineCO2   = ('CO2 (short tons)', 'sum'),
    baselinePM25  = ('PM2.5', 'sum'),
    baselineVOC   = ('VOC', 'sum'),
).reset_index(drop=True)

EXPECTED_COLS = {
    "facilityID", "facilityName", "state", "capacity", "annualGeneration",
    "heatInput", "operatingHours", "SO2Rate", "baselineSO2", "baselineNOx",
    "baselineCO2", "baselinePM25", "baselineVOC"
}
actual_cols = set(aggregated.columns)
assert actual_cols == EXPECTED_COLS, f"Schema mismatch: {actual_cols ^ EXPECTED_COLS}"

aggregated.to_csv('../backend/data/plants.csv', index=False)
print(f'Done. {len(aggregated)} plants written.')