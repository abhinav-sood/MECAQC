from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key = True, index = True)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    plant_name = Column(String, nullable = True)
    state = Column(String)
    capacity = Column(Integer)
    annualGeneration = Column(Float)
    heatInput = Column(Float)
    SO2Rate = Column(Float)
    operatingHours = Column(Float)
    baselineSO2 = Column(Float)
    baselineNOx = Column(Float)
    baselinePM25 = Column(Float)
    baselineVOC = Column(Float)
    baselineCO2 = Column(Float)

    
    bau_totalBenefit = Column(Float, nullable=True)
    bau_totalAnnualCost = Column(Float, nullable=True)
    bau_netBenefit = Column(Float, nullable=True)

    gt_totalBenefit = Column(Float, nullable=True)
    gt_totalAnnualCost = Column(Float, nullable=True)
    gt_netBenefit = Column(Float, nullable=True)

    rt_totalBenefit = Column(Float, nullable=True)
    rt_totalAnnualCost = Column(Float, nullable=True)
    rt_netBenefit = Column(Float, nullable=True)

    ac_totalBenefit = Column(Float, nullable=True)
    ac_totalAnnualCost = Column(Float, nullable=True)
    ac_netBenefit = Column(Float, nullable=True)

    bau_so2_change = Column(Float, nullable = True)
    bau_nox_change = Column(Float, nullable = True)
    bau_pm25_change = Column(Float, nullable = True)
    bau_voc_change = Column(Float, nullable = True)
    bau_co2_change = Column(Float, nullable = True)
    
    ac_so2_change = Column(Float, nullable = True)
    ac_nox_change = Column(Float, nullable = True)
    ac_pm25_change = Column(Float, nullable = True)
    ac_voc_change = Column(Float, nullable = True)
    ac_co2_change = Column(Float, nullable = True)

    gt_so2_change = Column(Float, nullable = True)
    gt_nox_change = Column(Float, nullable = True)
    gt_pm25_change = Column(Float, nullable = True)
    gt_voc_change = Column(Float, nullable = True)
    gt_co2_change = Column(Float, nullable = True)

    rt_so2_change = Column(Float, nullable = True)
    rt_nox_change = Column(Float, nullable = True)
    rt_pm25_change = Column(Float, nullable = True)
    rt_voc_change = Column(Float, nullable = True)
    rt_co2_change = Column(Float, nullable = True)


