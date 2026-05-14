import pandas as pd
from pathlib import Path

current_dir = Path(__file__).resolve().parent
eia_df = pd.read_excel(current_dir / "2___Plant_Y2020.xlsx", header=1)
plants_df = pd.read_csv(current_dir / "../backend/data/plants.csv")

merged = pd.merge(plants_df, eia_df[['Plant Code', 'Latitude', 'Longitude']], 
                  left_on='facilityID', 
                  right_on='Plant Code', 
                  how='left')


merged.to_csv(current_dir / '../backend/data/plants.csv', index=False)
print(f'Done. {len(merged)} plants written.')
