from fastapi import APIRouter
from mock_data import plants
from schema import PlantInput
from calculator import calculateAllScenarios

router = APIRouter()
@router.get("/plants")
def allPlants():
    return plants


@router.get("/plants/summary")
def plantSummary():
    results = []
    for facilityID, plant in plants.items():
        plantCopy = plant.copy()
        plantI = PlantInput(
            state=plantCopy["state"],
            capacity=plantCopy["capacity"],
            annualGeneration=plantCopy["annualGeneration"],
            heatInput=plantCopy["heatInput"],
            SO2Rate=plantCopy["SO2Rate"],
            operatingHours=plantCopy["operatingHours"],
            baselineSO2=max(plantCopy["baselineSO2"], 0),
            baselineNOx=max(plantCopy["baselineNOx"], 0),
            baselineCO2=max(plantCopy["baselineCO2"], 0),
            baselinePM25=max(plantCopy["baselinePM25"], 0),
            baselineVOC=max(plantCopy["baselineVOC"], 0),
        )
        plantScenario = calculateAllScenarios(plantI)

        acNB = plantScenario.ac.netBenefits.netBenefit
        gtNB = plantScenario.gt.netBenefits.netBenefit
        rtNB = plantScenario.rt.netBenefits.netBenefit

        maxBenefit = max(acNB, gtNB, rtNB)
        if(maxBenefit == acNB):
            maxBenefitScenario = "ac"
        elif(maxBenefit == gtNB):
            maxBenefitScenario = "gt"
        else:
            maxBenefitScenario = "rt"    
        results.append({
            "facilityID": facilityID,
            "facilityName": plant["facilityName"],
            "lat": plant["Latitude"],
            "lon": plant["Longitude"],
            "capacity": plant["capacity"],
            "bestNetBenefit": maxBenefit,
            "bestScenario": maxBenefitScenario
        })
    
    return results



@router.get("/plants/{facilityID}")
def plantsByID(facilityID: int):
    return plants[facilityID]
