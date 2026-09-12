# ==========================================
# HRMS DEMO DATA
# ==========================================
# This data is ONLY for public DEMO users.
# It does not come from the real database.


DEMO_DEPARTMENTS = [
    {
        "id": 1,
        "name": "Engineering",
        "description": "Software development and technology team",
        "is_active": True
    },
    {
        "id": 2,
        "name": "Human Resources",
        "description": "People operations and employee management",
        "is_active": True
    },
    {
        "id": 3,
        "name": "Finance",
        "description": "Finance and accounting operations",
        "is_active": True
    },
    {
        "id": 4,
        "name": "Marketing",
        "description": "Marketing and business growth team",
        "is_active": True
    }
]


DEMO_EMPLOYEES = [
    {
        "id": 1,
        "employee_code": "EMP001",
        "name": "Aarav Sharma",
        "email": "aarav@example.com",
        "phone": "9876500001",
        "desigination": "Software Engineer",
        "salary": 65000,
        "is_active": True,
        "department_id": 1,
        "user_id": None,
        "department": {
            "id": 1,
            "name": "Engineering"
        }
    },
    {
        "id": 2,
        "employee_code": "EMP002",
        "name": "Priya Singh",
        "email": "priya@example.com",
        "phone": "9876500002",
        "desigination": "HR Executive",
        "salary": 55000,
        "is_active": True,
        "department_id": 2,
        "user_id": None,
        "department": {
            "id": 2,
            "name": "Human Resources"
        }
    },
    {
        "id": 3,
        "employee_code": "EMP003",
        "name": "Rohan Verma",
        "email": "rohan@example.com",
        "phone": "9876500003",
        "desigination": "Backend Developer",
        "salary": 72000,
        "is_active": True,
        "department_id": 1,
        "user_id": None,
        "department": {
            "id": 1,
            "name": "Engineering"
        }
    },
    {
        "id": 4,
        "employee_code": "EMP004",
        "name": "Ananya Patel",
        "email": "ananya@example.com",
        "phone": "9876500004",
        "desigination": "UI/UX Designer",
        "salary": 60000,
        "is_active": True,
        "department_id": 1,
        "user_id": None,
        "department": {
            "id": 1,
            "name": "Engineering"
        }
    },
    {
        "id": 5,
        "employee_code": "EMP005",
        "name": "Vikram Gupta",
        "email": "vikram@example.com",
        "phone": "9876500005",
        "desigination": "Accountant",
        "salary": 58000,
        "is_active": True,
        "department_id": 3,
        "user_id": None,
        "department": {
            "id": 3,
            "name": "Finance"
        }
    },
    {
        "id": 6,
        "employee_code": "EMP006",
        "name": "Neha Joshi",
        "email": "neha@example.com",
        "phone": "9876500006",
        "desigination": "Marketing Executive",
        "salary": 52000,
        "is_active": True,
        "department_id": 4,
        "user_id": None,
        "department": {
            "id": 4,
            "name": "Marketing"
        }
    },
    {
        "id": 7,
        "employee_code": "EMP007",
        "name": "Aditya Rao",
        "email": "aditya@example.com",
        "phone": "9876500007",
        "desigination": "DevOps Engineer",
        "salary": 78000,
        "is_active": True,
        "department_id": 1,
        "user_id": None,
        "department": {
            "id": 1,
            "name": "Engineering"
        }
    },
    {
        "id": 8,
        "employee_code": "EMP008",
        "name": "Kavya Mehta",
        "email": "kavya@example.com",
        "phone": "9876500008",
        "desigination": "HR Manager",
        "salary": 85000,
        "is_active": True,
        "department_id": 2,
        "user_id": None,
        "department": {
            "id": 2,
            "name": "Human Resources"
        }
    }
]


DEMO_ATTENDANCE = [
    {
        "id": 1,
        "employee_id": 1,
        "date": "2026-09-12",
        "check_in": "09:05:00",
        "check_out": "18:02:00",
        "status": "PRESENT"
    },
    {
        "id": 2,
        "employee_id": 2,
        "date": "2026-09-12",
        "check_in": "09:15:00",
        "check_out": "17:45:00",
        "status": "PRESENT"
    },
    {
        "id": 3,
        "employee_id": 3,
        "date": "2026-09-12",
        "check_in": "09:00:00",
        "check_out": "18:10:00",
        "status": "PRESENT"
    },
    {
        "id": 4,
        "employee_id": 4,
        "date": "2026-09-12",
        "check_in": None,
        "check_out": None,
        "status": "ABSENT"
    },
    {
        "id": 5,
        "employee_id": 5,
        "date": "2026-09-12",
        "check_in": "09:20:00",
        "check_out": "17:30:00",
        "status": "PRESENT"
    },
    {
        "id": 6,
        "employee_id": 6,
        "date": "2026-09-12",
        "check_in": "09:10:00",
        "check_out": "17:50:00",
        "status": "PRESENT"
    },
    {
        "id": 7,
        "employee_id": 7,
        "date": "2026-09-12",
        "check_in": "08:55:00",
        "check_out": "18:15:00",
        "status": "PRESENT"
    },
    {
        "id": 8,
        "employee_id": 8,
        "date": "2026-09-12",
        "check_in": None,
        "check_out": None,
        "status": "LEAVE"
    }
]


DEMO_LEAVES = [
    {
        "id": 1,
        "employee_id": 2,
        "start_date": "2026-09-15",
        "end_date": "2026-09-16",
        "reason": "Personal work",
        "status": "PENDING"
    },
    {
        "id": 2,
        "employee_id": 3,
        "start_date": "2026-09-20",
        "end_date": "2026-09-22",
        "reason": "Family function",
        "status": "APPROVED"
    },
    {
        "id": 3,
        "employee_id": 5,
        "start_date": "2026-09-25",
        "end_date": "2026-09-26",
        "reason": "Personal leave",
        "status": "PENDING"
    },
    {
        "id": 4,
        "employee_id": 6,
        "start_date": "2026-09-05",
        "end_date": "2026-09-06",
        "reason": "Medical appointment",
        "status": "APPROVED"
    }
]