from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
 
from app.database import engine
from app.models import Department
from app.schemas import DepartmentCreate, DepartmentResponse, DepartmentUpdate

router=APIRouter(prefix="/department",tags=["Departments"]) # api router manage  api organise (maake url)

def get_db():
    db=Session(engine)
    try:
        yield db
    finally:
    
        db.close()
@router.post("/",response_model=DepartmentResponse)
def creat_department(department:DepartmentCreate,db:Session=Depends(get_db)): # department.name user request hai
    existing_deparment=db.query(Department).filter(Department.name==department.name).first()

    if existing_deparment:
        raise HTTPException(status_code=404,detail="Deparment already exist")
    
    new_department=Department(name=department.name,description=department.description)
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department

@router.get("/",response_model=list[DepartmentResponse])
def get_departments(db:Session=Depends(get_db)):
    departments=db.query(Department).all()
    return departments

@router.get("/{department_id}",response_model=DepartmentResponse)
def get_department(department_id:int,db:Session=Depends(get_db)):
    department=db.query(Department).filter(Department.id==department_id).first()
    if not department:
        raise HTTPException(status_code=404,detail="Department not found")
    return department
@router.put("/{department_id}",response_model=DepartmentResponse)
def Update_department(department_id:int,department_data:DepartmentUpdate,db:Session=Depends(get_db)):

    department=db.query(Department).filter(Department.id==department_id).first()
 
    if not department:
        raise HTTPException(status_code=404,detail="Department not found")
    update_data=department_data.model_dump(exclude_unset=True)

    for field,value in update_data.items():
        setattr(department,field,value)

    db.commit()
    db.refresh(department)
    return department


@router.delete("/{department_id}")
def delete_department(department_id:int,db:Session=Depends(get_db)):
    department=db.query(Department).filter(Department.id==department_id).first()

    if not department:
        raise HTTPException(status_code=404,detail="department not found")
    db.delete(department)
    db.commit()
    return {"message": "Department deleted successfully"}

    
