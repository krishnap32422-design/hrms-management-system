from datetime import date
from pydantic import BaseModel

from pydantic import BaseModel,Field

from app.models import Department

from datetime import date, time 


class EmployeeCreate(BaseModel):  #employee apni infornmation dega
    employee_code:str=Field(min_length=3,max_length=20)
    name:str=Field(min_length=2,max_length=100)
    email:str
    phone:str|None=None
    desigination:str|None=None
    salary:float|None=Field(default=None,ge=0)
    department_id:int
    password:str=Field(min_length=6,max_length=100)
class DepartmentBasic(BaseModel):
    id:int
    name:str
    class Config:
        from_attributes=True

class EmployeeResponse(BaseModel): # aur data base  use id aur active saturus provide karega
        employee_code:str
        name:str
        email:str
        phone:str|None=None
        desigination:str|None=None
        salary:float|None=Field(default=None,ge=0)
        department_id:int|None=None
        id:int
        is_active:bool
        user_id:int|None=None
        department:DepartmentBasic|None=None
    

        class Config:
          from_attributes=True #sql model ke data se read kar kr response bana saktah hai
class EmployeeUpdate(BaseModel):
    name:str|None=Field(default=None,min_length=2,max_length=100)
    
    phone:str|None=None
    desigination:str|None=None
    salary:float|None=Field(default=None,ge=0)
    is_active:bool|None=None
    department_id:int|None=None

class DepartmentCreate(BaseModel):
    name:str=Field(min_length=2,max_length=100)
    description:str|None=None

class EmployeeBasic(BaseModel):
    id:int
    name:str

    class Config:
        from_attributes=True
class DepartmentResponse(DepartmentCreate):
    id:int
    is_active:bool
    employees:list[EmployeeBasic]=[]

    class Config:
        from_attributes=True
class DepartmentUpdate(BaseModel):
    name:str|None=Field(default=None,min_length=2,max_length=100)
    description:str|None=None
    is_active:bool|None=None

class UserCreat(BaseModel):
    name:str
    email:str
    password:str
    role:str="EMPLOYEE"

class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    role:str
    is_active:bool

    class Config:
        from_attributes=True

class LoginRequest(BaseModel):
    email:str
    password:str

class TokenResponse(BaseModel):
    access_token:str
    token_type:str

class AttendanceCreate(BaseModel):
    employee_id:int
    date:date
    check_in:time|None=None
    check_out:time|None=None
    status:str="PRESENT"

class AttendanceResponse(BaseModel):

    id:int
    employee_id:int
    date:date
    check_in:time|None=None
    check_out:time|None=None
    status:str

    class Config:
            from_attributes=True
     

class CheckInAttendance(BaseModel):
    employee_id:int

class CheckOuTAttendance(BaseModel):
    employee_id:int

 


class LeaveCreate(BaseModel):
    
    start_date: date
    end_date: date
    reason: str=Field(min_length=3,max_length=255)


class LeaveResponse(BaseModel):
    id: int
    employee_id:int
    start_date: date
    end_date: date
    reason: str
    status: str

    class Config:
        from_attributes = True
    
 