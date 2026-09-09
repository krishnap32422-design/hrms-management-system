from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Attendance, Employee
from app.schemas import AttendanceCreate, AttendanceResponse
from app.dependencies import get_current_employee, require_role


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


# =========================
# DATABASE
# =========================

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


# ============================================================
# HR / ADMIN: ADD ATTENDANCE MANUALLY
# ============================================================

@router.post("/", response_model=AttendanceResponse)
def create_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    # Check employee exists
    employee = db.query(Employee).filter(
        Employee.id == attendance_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Prevent duplicate attendance for same employee and date
    existing_attendance = db.query(Attendance).filter(
        Attendance.employee_id == attendance_data.employee_id,
        Attendance.date == attendance_data.date
    ).first()

    if existing_attendance:
        raise HTTPException(
            status_code=409,
            detail="Attendance already exists for this employee on this date"
        )

    new_attendance = Attendance(
        employee_id=attendance_data.employee_id,
        date=attendance_data.date,
        check_in=attendance_data.check_in,
        check_out=attendance_data.check_out,
        status=attendance_data.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


# ============================================================
# EMPLOYEE: CHECK IN
# ============================================================

@router.post("/check-in", response_model=AttendanceResponse)
def check_in(
    employee=Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    today = datetime.now().date()
    current_time = datetime.now().time()

    # Check today's attendance
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    if attendance:
        if attendance.check_in:
            raise HTTPException(
                status_code=400,
                detail="You have already checked in today"
            )

        attendance.check_in = current_time

    else:
        attendance = Attendance(
            employee_id=employee.id,
            date=today,
            check_in=current_time,
            status="PRESENT"
        )

        db.add(attendance)

    db.commit()
    db.refresh(attendance)

    return attendance


# ============================================================
# EMPLOYEE: CHECK OUT
# ============================================================

@router.post("/check-out", response_model=AttendanceResponse)
def check_out(
    employee=Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    today = datetime.now().date()
    current_time = datetime.now().time()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=400,
            detail="You have not checked in today"
        )

    if not attendance.check_in:
        raise HTTPException(
            status_code=400,
            detail="Please check in first"
        )

    if attendance.check_out:
        raise HTTPException(
            status_code=400,
            detail="You have already checked out today"
        )

    attendance.check_out = current_time

    db.commit()
    db.refresh(attendance)

    return attendance


# ============================================================
# HR / ADMIN: EMPLOYEE CHECK IN
# ============================================================

@router.post(
    "/admin/check-in/{employee_id}",
    response_model=AttendanceResponse
)
def admin_check_in(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    today = datetime.now().date()
    current_time = datetime.now().time()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == today
    ).first()

    if attendance:
        if attendance.check_in:
            raise HTTPException(
                status_code=400,
                detail="Employee has already checked in today"
            )

        attendance.check_in = current_time

    else:
        attendance = Attendance(
            employee_id=employee_id,
            date=today,
            check_in=current_time,
            status="PRESENT"
        )

        db.add(attendance)

    db.commit()
    db.refresh(attendance)

    return attendance


# ============================================================
# HR / ADMIN: EMPLOYEE CHECK OUT
# ============================================================

@router.post(
    "/admin/check-out/{employee_id}",
    response_model=AttendanceResponse
)
def admin_check_out(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    today = datetime.now().date()
    current_time = datetime.now().time()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date == today
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=400,
            detail="Employee has not checked in today"
        )

    if not attendance.check_in:
        raise HTTPException(
            status_code=400,
            detail="Employee has not checked in yet"
        )

    if attendance.check_out:
        raise HTTPException(
            status_code=400,
            detail="Employee has already checked out today"
        )

    attendance.check_out = current_time

    db.commit()
    db.refresh(attendance)

    return attendance


# ============================================================
# HR / ADMIN: GET ALL ATTENDANCE
# ============================================================

@router.get("/", response_model=list[AttendanceResponse])
def get_all_attendance(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    attendance = db.query(Attendance).order_by(
        Attendance.date.desc()
    ).all()

    return attendance


# ============================================================
# EMPLOYEE: MY ATTENDANCE
# ============================================================

@router.get("/my", response_model=list[AttendanceResponse])
def get_my_attendance(
    employee=Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id
    ).order_by(
        Attendance.date.desc()
    ).all()

    return attendance


# ============================================================
# EMPLOYEE: TODAY'S ATTENDANCE
# ============================================================

@router.get("/my/today", response_model=AttendanceResponse | None)
def get_my_today_attendance(
    employee=Depends(get_current_employee),
    db: Session = Depends(get_db)
):
    today = datetime.now().date()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    return attendance


# ============================================================
# HR / ADMIN: GET ATTENDANCE OF ONE EMPLOYEE
# ============================================================

@router.get(
    "/employee/{employee_id}",
    response_model=list[AttendanceResponse]
)
def get_employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).order_by(
        Attendance.date.desc()
    ).all()

    return attendance


# ============================================================
# HR / ADMIN: GET SINGLE ATTENDANCE
# ============================================================

@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    return attendance


# ============================================================
# HR / ADMIN: UPDATE ATTENDANCE
# ============================================================

@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["HR", "ADMIN"]))
):
    attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    employee = db.query(Employee).filter(
        Employee.id == attendance_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance.employee_id = attendance_data.employee_id
    attendance.date = attendance_data.date
    attendance.check_in = attendance_data.check_in
    attendance.check_out = attendance_data.check_out
    attendance.status = attendance_data.status

    db.commit()
    db.refresh(attendance)

    return attendance


# ============================================================
# ADMIN: DELETE ATTENDANCE
# ============================================================

@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["ADMIN"]))
):
    attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    db.delete(attendance)
    db.commit()

    return {
        "message": "Attendance deleted successfully"
    }
