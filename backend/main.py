from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes.scenarios import router as scenarioRouter
from routes.plants import router as plantsRouter
from routes.auth import router as authRouter


app = FastAPI(redirect_slashes=False)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "https://mecaqc.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(scenarioRouter)
app.include_router(plantsRouter)
app.include_router(authRouter)