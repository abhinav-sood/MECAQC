from fastapi import APIRouter
from mock_data import plants

router = APIRouter()
@router.get("/plants")
def allPlants():
    return plants

@router.get("/plants/{facilityID}")
def plantsByID(facilityID: int):
    return plants[facilityID]
