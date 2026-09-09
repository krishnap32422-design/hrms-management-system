

from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime,timedelta,timezone
from jose import jwt,JWTError

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

SECURITY_KEY="change-this-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60


def hash_password(password:str)->str:
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str)-> bool:
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data:dict,expires_delta:timedelta|None=None):
    to_encode=data.copy()

    if expires_delta:
        expire=datetime.now(timezone.utc)+expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    encoded_jwt=jwt.encode(to_encode,SECURITY_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def verify_access_tolen(token:str):
    try:
        payload=jwt.decode(token,SECURITY_KEY,algorithms=[ALGORITHM])

        user_id=payload.get("sub") 
        if user_id is None:
            raise HTTPException(status_code=401,detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401,detail="Invalid or expireed token")

    