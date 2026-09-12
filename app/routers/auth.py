
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import engine
from app.schemas import (
    LoginRequest,
    TokenResponse,
    UserCreat,
    UserResponse
)
from app.models import User
from app.security import (
    create_access_token,
    hash_password,
    verify_password
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ---------------------------------------------------------
# DATABASE CONNECTION
# ---------------------------------------------------------

def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# CREATE USER
# ---------------------------------------------------------

@router.post(
    "/",
    response_model=UserResponse
)
def create_user(
    user: UserCreat,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exist"
        )

    hashed_pwd = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pwd,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ---------------------------------------------------------
# NORMAL USER LOGIN
# ---------------------------------------------------------

@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    user: LoginRequest,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="invalid email or password"
        )

    if not existing_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="user account is inactive"
        )

    access_token = create_access_token(
        data={
            "sub": str(existing_user.id),
            "role": existing_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------------------------------------------------------
# DEMO LOGIN
# ---------------------------------------------------------

@router.post(
    "/demo-login",
    response_model=TokenResponse
)
def demo_login():

    access_token = create_access_token(
        data={
            "sub": "0",
            "role": "DEMO"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
