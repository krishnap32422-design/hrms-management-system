




from sqlalchemy import Column, ForeignKey,Integer,String,Boolean,Numeric,Time,Date
from app.database import Base
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__="employee"
    id=Column(Integer,primary_key=True,index=True)
    employee_code=Column(String(20),unique=True,nullable=False)
    name=Column(String(100),nullable=False)
    email=Column(String(100),unique=True,nullable=False)
    phone=Column(String(15))
    desigination=Column(String(100))
    salary=Column(Numeric(10,2))
    is_active=Column(Boolean,default=True)
    department_id=Column(Integer,ForeignKey("departments.id"),nullable=True)
    user_id=Column(Integer,ForeignKey("user.id"),unique=True,nullable=True)
    department=relationship("Department",back_populates="employees")
    attendance=relationship("Attendance",back_populates="employee")
    user=relationship("User",back_populates="employee")
    leaves=relationship("Leave",back_populates="employee")
class Department(Base):
    __tablename__="departments"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String(100),unique=True,nullable=False)
    description=Column(String(255))
    is_active=Column(Boolean,default=True)
    employees=relationship("Employee",back_populates="department")

class User (Base):
    __tablename__="user"

    id=Column(Integer,primary_key=True,index=True)

    name=Column(String(100),nullable=False)

    email=Column(String(100),unique=True,nullable=False,index=True)

    password_hash=Column(String(250),nullable=False)

    role=Column(String(20),default="EMPLOYEE",nullable=False)

    is_active=Column(Boolean,default=True,nullable=False)

    employee=relationship("Employee",back_populates="user",uselist=False)

class  Attendance(Base):
    __tablename__="attendance"

    id=Column(Integer,primary_key=True,index=True)

    employee_id=Column(Integer,ForeignKey("employee.id"),nullable=False)

    date=Column(Date,nullable=False)

    check_in=Column(Time,nullable=True)

    check_out=Column(Time,nullable=True)

    status=Column(String(20),default="PRESENT",nullable=False)

    employee=relationship("Employee",back_populates="attendance")


class Leave(Base):
    __tablename__ = "leave"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id = Column(
        Integer,
        ForeignKey("employee.id"),
        nullable=False
    )

    start_date = Column(
        Date,
        nullable=False
    )

    end_date = Column(
        Date,
        nullable=False
    )

    reason = Column(
        String(255),
        nullable=False
    )

    status = Column(
        String(20),
        default="PENDING",
        nullable=False
    )

    employee = relationship(
        "Employee",
        back_populates="leaves"
    )
