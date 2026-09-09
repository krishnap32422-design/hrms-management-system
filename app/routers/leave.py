from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import engine
from app.models import Leave, Employee
from app.schemas import LeaveCreate, LeaveResponse
from app.dependencies import get_current_employee, get_current_user, require_role


router = APIRouter(
    prefix="/leave",
    tags=["Leave"]
)

def get_db():  # ye pura mana o client kisi empolyee ki detail dalene ki request karega  session database open karega  phir database operation perform kargga aur phie close karge
    db=Session(engine)
    try:
        yield db
    finally:
        db.close()

@router.post(
    "/",
    response_model=LeaveResponse
)
def apply_leave(
    leave_data: LeaveCreate,
    db: Session = Depends(get_db),employee:Employee=Depends(get_current_employee)
):
    # 
    # Date validation
    if leave_data.end_date < leave_data.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date cannot be before start date"
        )

    # Create leave
    new_leave = Leave(
        employee_id=employee.id,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason,
        status="PENDING"
    )

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)

    return new_leave

@router.get(
    "/my",
    response_model=list[LeaveResponse]
)
def get_my_leaves(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee)
):
    leaves = db.query(Leave).filter(
        Leave.employee_id == employee.id
    ).all()

    return leaves

@router.get(
    "/",
    response_model=list[LeaveResponse]
)
def get_all_leaves(
    db: Session = Depends(get_db),
    current_user:dict=Depends(require_role(["HR","ADMIN"]))
    
):
    leaves = db.query(Leave).all()

    return leaves


@router.put(
    "/{leave_id}/approve",
    response_model=LeaveResponse
)
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["ADMIN", "HR"])
    )
):
    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found"
        )

    if leave.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Leave has already been processed"
        )

    leave.status = "APPROVED"

    db.commit()
    db.refresh(leave)

    return leave


@router.put(
    "/{leave_id}/reject",
    response_model=LeaveResponse
)
def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(["ADMIN", "HR"])
    )
):
    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found"
        )

    if leave.status != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Leave has already been processed"
        )

    leave.status = "REJECTED"

    db.commit()
    db.refresh(leave)

    return leave