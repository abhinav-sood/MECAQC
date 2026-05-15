import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from calculator import calculateBAU, calculateGT, calculateRT
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
    