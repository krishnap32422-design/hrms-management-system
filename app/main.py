from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine,Base
from app import models
from app.routers import employees, leave
from app.routers import deparment
from app.routers import auth
from app.routers import attendance
from app.routers import leave
from app.routers import dashboard

 
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://hrms-management-system-1-ejrd.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)#jo table base ke ander hai use databse me crete kro agar phale se nahi hai to

app.include_router(employees.router)
app.include_router(deparment.router)
app.include_router(auth.router)
app.include_router(attendance.router)
app.include_router(attendance.router)
app.include_router(leave.router)
app.include_router(dashboard.router)
@app.get("/")
def home():
    return {"message":"HRMS API is running "}

@app.get("/db-text")
def db_text():
    with engine.connect() as connection:
        result=connection.execute(text("SELECT 1"))
        return {"database":result.scalar()}

        