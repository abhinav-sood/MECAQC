from schema import PlantInput, AllScenariosResult
from fastapi import APIRouter, HTTPException
from calculator import calculateAllScenarios
from models import Scenario
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from typing import Optional
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/scenario/run", response_model=AllScenariosResult)
def runScenario(inputData: PlantInput):
    return calculateAllScenarios(inputData)

class SaveRequest(BaseModel):
    plant_input: PlantInput
    all_scenario_result: Optional[AllScenariosResult] = None

#Removed from frontend logic. keep if needed in the future
@router.post("/scenario/save")
def saveScenario(inputData: SaveRequest, db: Session = Depends(get_db)):
    scenario = Scenario(
        state = inputData.plant_input.state,
        capacity = inputData.plant_input.capacity,
        annualGeneration = inputData.plant_input.annualGeneration,
        heatInput = inputData.plant_input.heatInput,
        SO2Rate = inputData.plant_input.SO2Rate,
        operatingHours = inputData.plant_input.operatingHours,
        baselineSO2 = inputData.plant_input.baselineSO2,
        baselineNOx = inputData.plant_input.baselineNOx,
        baselinePM25 = inputData.plant_input.baselinePM25,
        baselineVOC = inputData.plant_input.baselineVOC,
        baselineCO2 = inputData.plant_input.baselineCO2,

        bau_so2_change = inputData.all_scenario_result.bau.reductions.SO2ChangePerYear if inputData.all_scenario_result else None,
        bau_nox_change = inputData.all_scenario_result.bau.reductions.NOxChangePerYear if inputData.all_scenario_result else None,
        bau_pm25_change = inputData.all_scenario_result.bau.reductions.PM25ChangePerYear if inputData.all_scenario_result else None,
        bau_voc_change = inputData.all_scenario_result.bau.reductions.VOCChangePerYear if inputData.all_scenario_result else None,
        bau_co2_change = inputData.all_scenario_result.bau.reductions.CO2ChangePerYear if inputData.all_scenario_result else None,
        bau_totalBenefit = inputData.all_scenario_result.bau.netBenefits.totalBenefit if inputData.all_scenario_result else None,
        bau_totalAnnualCost = inputData.all_scenario_result.bau.netBenefits.totalAnnualCost if inputData.all_scenario_result else None,
        bau_netBenefit = inputData.all_scenario_result.bau.netBenefits.netBenefit if inputData.all_scenario_result else None,

        ac_so2_change = inputData.all_scenario_result.ac.reductions.SO2ChangePerYear if inputData.all_scenario_result else None,
        ac_nox_change = inputData.all_scenario_result.ac.reductions.NOxChangePerYear if inputData.all_scenario_result else None,
        ac_pm25_change = inputData.all_scenario_result.ac.reductions.PM25ChangePerYear if inputData.all_scenario_result else None,
        ac_voc_change = inputData.all_scenario_result.ac.reductions.VOCChangePerYear if inputData.all_scenario_result else None,
        ac_co2_change = inputData.all_scenario_result.ac.reductions.CO2ChangePerYear if inputData.all_scenario_result else None,
        ac_totalBenefit = inputData.all_scenario_result.ac.netBenefits.totalBenefit if inputData.all_scenario_result else None,
        ac_totalAnnualCost = inputData.all_scenario_result.ac.netBenefits.totalAnnualCost if inputData.all_scenario_result else None,
        ac_netBenefit = inputData.all_scenario_result.ac.netBenefits.netBenefit if inputData.all_scenario_result else None,

        gt_so2_change = inputData.all_scenario_result.gt.reductions.SO2ChangePerYear if inputData.all_scenario_result else None,
        gt_nox_change = inputData.all_scenario_result.gt.reductions.NOxChangePerYear if inputData.all_scenario_result else None,
        gt_pm25_change = inputData.all_scenario_result.gt.reductions.PM25ChangePerYear if inputData.all_scenario_result else None,
        gt_voc_change = inputData.all_scenario_result.gt.reductions.VOCChangePerYear if inputData.all_scenario_result else None,
        gt_co2_change = inputData.all_scenario_result.gt.reductions.CO2ChangePerYear if inputData.all_scenario_result else None,
        gt_totalBenefit = inputData.all_scenario_result.gt.netBenefits.totalBenefit if inputData.all_scenario_result else None,
        gt_totalAnnualCost = inputData.all_scenario_result.gt.netBenefits.totalAnnualCost if inputData.all_scenario_result else None,
        gt_netBenefit = inputData.all_scenario_result.gt.netBenefits.netBenefit if inputData.all_scenario_result else None,

        rt_so2_change = inputData.all_scenario_result.rt.reductions.SO2ChangePerYear if inputData.all_scenario_result else None,
        rt_nox_change = inputData.all_scenario_result.rt.reductions.NOxChangePerYear if inputData.all_scenario_result else None,
        rt_pm25_change = inputData.all_scenario_result.rt.reductions.PM25ChangePerYear if inputData.all_scenario_result else None,
        rt_voc_change = inputData.all_scenario_result.rt.reductions.VOCChangePerYear if inputData.all_scenario_result else None,
        rt_co2_change = inputData.all_scenario_result.rt.reductions.CO2ChangePerYear if inputData.all_scenario_result else None, 
        rt_totalBenefit = inputData.all_scenario_result.rt.netBenefits.totalBenefit if inputData.all_scenario_result else None,
        rt_totalAnnualCost = inputData.all_scenario_result.rt.netBenefits.totalAnnualCost if inputData.all_scenario_result else None,
        rt_netBenefit = inputData.all_scenario_result.rt.netBenefits.netBenefit if inputData.all_scenario_result else None
    )
    try:
        db.add(scenario)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save scenario")
    
    return "Scenario Saved"
    

class ScenarioSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    state: str
    capacity: int
    created_at: datetime
    annualGeneration: Optional[float] = None
    heatInput: Optional[float] = None
    SO2Rate: Optional[float] = None
    operatingHours: Optional[float] = None
    baselineSO2: Optional[float] = None
    baselineNOx: Optional[float] = None
    baselinePM25: Optional[float] = None
    baselineVOC: Optional[float] = None
    baselineCO2: Optional[float] = None
    bau_netBenefit: Optional[float] = None
    ac_netBenefit: Optional[float] = None
    gt_netBenefit: Optional[float] = None
    rt_netBenefit: Optional[float] = None
    
@router.get("/scenarios", response_model = List[ScenarioSummary])
def getScenario(db: Session = Depends(get_db)):
    return db.query(Scenario).all()

