from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Department, Employee, User
from app.schemas import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.dependencies import require_role
from app.security import hash_password


router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()


# =========================
# CREATE EMPLOYEE
# =========================

@router.post("/", response_model=EmployeeResponse)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):

    # 1. Check employee code
    existing_code = db.query(Employee).filter(
        Employee.employee_code == employee.employee_code
    ).first()

    if existing_code:
        raise HTTPException(
            status_code=409,
            detail="Employee code already exists"
        )

    # 2. Check employee email
    existing_employee_email = db.query(Employee).filter(
        Employee.email == employee.email
    ).first()

    if existing_employee_email:
        raise HTTPException(
            status_code=409,
            detail="Employee email already exists"
        )

    # 3. Check User email
    existing_user_email = db.query(User).filter(
        User.email == employee.email
    ).first()

    if existing_user_email:
        raise HTTPException(
            status_code=409,
            detail="User account with this email already exists"
        )

    # 4. Check department
    if employee.department_id is not None:

        department = db.query(Department).filter(
            Department.id == employee.department_id
        ).first()

        if not department:
            raise HTTPException(
                status_code=404,
                detail="Department not found"
            )

    # =========================
    # CREATE USER ACCOUNT
    # =========================

    new_user = User(
        name=employee.name,
        email=employee.email,

        # Password will be hashed
        password_hash=hash_password(employee.password),

        # Every employee gets EMPLOYEE role
        role="EMPLOYEE",

        is_active=True
    )

    db.add(new_user)

    # Generate new_user.id
    db.flush()

    # =========================
    # CREATE EMPLOYEE
    # =========================

    new_employee = Employee(
        employee_code=employee.employee_code,
        name=employee.name,
        email=employee.email,
        phone=employee.phone,
        desigination=employee.desigination,
        salary=employee.salary,
        department_id=employee.department_id,

        # IMPORTANT
        # Link Employee with User
        user_id=new_user.id
    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    return new_employee


# =========================
# GET ALL EMPLOYEES
# =========================

@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["HR", "ADMIN"])
    )
):

    employees = db.query(Employee).all()

    return employees


# =========================
# GET SINGLE EMPLOYEE
# =========================

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["HR", "ADMIN"])
    )
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


# =========================
# UPDATE EMPLOYEE
# =========================

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["HR", "ADMIN"])
    )
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Check department if changing department
    if employee_data.department_id is not None:

        department = db.query(Department).filter(
            Department.id == employee_data.department_id
        ).first()

        if not department:
            raise HTTPException(
                status_code=404,
                detail="Department not found"
            )

    update_data = employee_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(employee, field, value)

    db.commit()

    db.refresh(employee)

    return employee


# =========================
# DELETE EMPLOYEE
# =========================

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["ADMIN"])
    )
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Linked User account
    user = employee.user

    db.delete(employee)

    if user:
        db.delete(user)

    db.commit()

    return {
        "message": "Employee and user account deleted successfully"}