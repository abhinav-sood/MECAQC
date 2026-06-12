import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from calculator import calculateBAU, calculateGT, calculateRT, calculateAC
from schema import PlantInput

plant = PlantInput(
        state = "AL",
        capacity = 403,
        annualGeneration = 166714,
        heatInput = 1598916,
        SO2Rate = 1.10,
        operatingHours = 910,
        baselineSO2 = 953,
        baselineNOx = 227,
        baselinePM25 = 71.6,
        baselineVOC = 4.1,
        baselineCO2 = 164046  
    )

def test_bau():
    BAUval = calculateBAU(plant)
    assert abs(BAUval.netBenefits.totalAnnualCost - 22474283.93) < 50000

def test_gt():
    GTval = calculateGT(plant)
    assert abs(GTval.netBenefits.totalAnnualCost - -16036097.37) < 50000

def test_rt():
    RTval = calculateRT(plant)
    assert abs(RTval.netBenefits.totalAnnualCost - -2794049.915) < 50000
    
def test_ac():
    ACval = calculateAC(plant)
    assert abs(ACval.netBenefits.totalAnnualCost - 16_665_443.66) < 50_000

def test_gt_net_benefit():
    GTval = calculateGT(plant)
    assert GTval.netBenefits.netBenefit == pytest.approx(
        GTval.netBenefits.totalBenefit - GTval.netBenefits.totalAnnualCost, abs=1.0
    )

def test_negative_pm25_clamped():
    bad_plant = PlantInput(
        state="AL",
        capacity=403,
        annualGeneration=166714,
        heatInput=1598916,
        SO2Rate=1.10,
        operatingHours=910,
        baselineSO2=953,
        baselineNOx=227,
        baselinePM25=0.0, 
        baselineVOC=4.1,
        baselineCO2=164046
    )
    result = calculateRT(bad_plant)
    assert result.reductions.PM25ChangePerYear >= 0.0