from pydantic import BaseModel
from pydantic import Field

class PlantInput(BaseModel):
    state: str
    capacity: float = Field(gt=0)          # MW
    annualGeneration: float = Field(gt=0)# MWh
    heatInput: float = Field(gt=0)       # MMBtu/yr
    SO2Rate: float = Field(gt=0)  # llbs/MMBtu
    operatingHours: float = Field(gt=0)   # hours/yr
    baselineSO2: float = Field(ge=0)      # tons/yr
    baselineNOx: float = Field(ge=0)      # tons/yr
    baselinePM25: float = Field(ge=0)     # tons/yr
    baselineVOC: float = Field(ge=0)      # tons/yr
    baselineCO2: float = Field(ge=0)      # tons/yr
    

class ReductionOutput(BaseModel):
    SO2ChangePerYear: float
    NOxChangePerYear: float
    PM25ChangePerYear: float
    VOCChangePerYear: float
    CO2ChangePerYear: float

class NetBenefitOutput(BaseModel):
    totalBenefit: float      # Σ(BPT × Δe)
    totalAnnualCost: float   # TAC
    netBenefit: float        # totalBenefit - totalAnnualCost

class ScenarioResult(BaseModel):
    scenario: str
    reductions: ReductionOutput
    netBenefits: NetBenefitOutput  # replaces both CostOutput and float

class AllScenariosResult(BaseModel):
    bau: ScenarioResult
    ac: ScenarioResult
    gt: ScenarioResult
    rt: ScenarioResult