from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Employee, Department, Attendance, Leave
from app.dependencies import require_role, get_current_employee


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


# ============================================================
# HR / ADMIN DASHBOARD
# ============================================================
@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["ADMIN", "HR", "DEMO"])
    )
):

    # ========================================================
    # DEMO DASHBOARD
    # ========================================================
    # DEMO user ko real database data nahi dikhayenge.
    # Isliye sample data return hoga.

    if current_user.get("role") == "DEMO":

        return {
            "total_employees": 12,
            "total_departments": 4,
            "present_today": 9,
            "pending_leaves": 2,
            "approved_leaves": 6
        }


    # ========================================================
    # HR / ADMIN DASHBOARD
    # ========================================================

    today = datetime.now().date()

    total_employees = db.query(Employee).count()

    total_departments = db.query(Department).count()

    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "PRESENT"
    ).count()

    pending_leaves = db.query(Leave).filter(
        Leave.status == "PENDING"
    ).count()

    approved_leaves = db.query(Leave).filter(
        Leave.status == "APPROVED"
    ).count()

    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "present_today": present_today,
        "pending_leaves": pending_leaves,
        "approved_leaves": approved_leaves
    }


# ============================================================
# EMPLOYEE DASHBOARD
# ============================================================

@router.get("/employee-summary")
def employee_dashboard(
    db: Session = Depends(get_db),
    employee=Depends(get_current_employee)
):
    today = datetime.now().date()

    # Today's attendance
    today_attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    # Total present days
    total_present = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.status == "PRESENT"
    ).count()

    # Total leaves
    total_leaves = db.query(Leave).filter(
        Leave.employee_id == employee.id
    ).count()

    # Pending leaves
    pending_leaves = db.query(Leave).filter(
        Leave.employee_id == employee.id,
        Leave.status == "PENDING"
    ).count()

    # Approved leaves
    approved_leaves = db.query(Leave).filter(
        Leave.employee_id == employee.id,
        Leave.status == "APPROVED"
    ).count()

    return {
        "employee_id": employee.id,
        "name": employee.name,
        "email": employee.email,

        "today": {
            "checked_in": (
                today_attendance is not None
                and today_attendance.check_in is not None
            ),

            "checked_out": (
                today_attendance is not None
                and today_attendance.check_out is not None
            ),

            "check_in": (
                str(today_attendance.check_in)
                if today_attendance
                and today_attendance.check_in
                else None
            ),

            "check_out": (
                str(today_attendance.check_out)
                if today_attendance
                and today_attendance.check_out
                else None
            )
        },

        "attendance": {
            "present_days": total_present
        },

        "leaves": {
            "total": total_leaves,
            "pending": pending_leaves,
            "approved": approved_leaves
        }
    }