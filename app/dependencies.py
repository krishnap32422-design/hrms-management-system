from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.models import User

from app.security import verify_access_tolen
from app.database import engine

def get_db():  # ye pura mana o client kisi empolyee ki detail dalene ki request karega  session database open karega  phir database operation perform kargga aur phie close karge
    db=Session(engine)
    try:
        yield db
    finally:
        db.close()


security=HTTPBearer()



def get_current_employee(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = verify_access_tolen(token)

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    if not user.employee:
        raise HTTPException(
            status_code=404,
            detail="Employee profile not linked"
        )

    return user.employee






def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(security)):

    token=credentials.credentials

    payload=verify_access_tolen(token)

    return payload

def require_role(allowed_role:list[str]):
    def role_checked(current_user:dict=Depends(get_current_user)):

        user_role=current_user.get("role")

        if user_role not in allowed_role:
            raise HTTPException(status_code=403,detail="you don't have permission")

        return current_user
    return role_checked


