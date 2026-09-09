# HRMS - Human Resource Management System

A full-stack Human Resource Management System designed to help organizations manage employees, departments, attendance, and leave requests through a centralized web application.

## 🚀 Features

* 🔐 JWT-based authentication
* 👥 Employee Management

  * Add employees
  * View employees
  * Edit employee details
  * Delete employees
* 🏢 Department Management

  * Create departments
  * View departments
  * Update departments
  * Delete departments
* 🕐 Attendance Management

  * Track employee attendance
  * View attendance information
  * Attendance overview on dashboard
* 📝 Leave Management

  * Submit leave requests
  * View leave requests
  * Approve/reject leave requests
* 📊 Dashboard

  * Total employees
  * Departments
  * Today's attendance
  * Pending leave requests
* 👤 User Profile
* 🛡️ Role-based access control
* 🔄 RESTful API architecture
* 🗄️ PostgreSQL database

## 🛠️ Tech Stack

### Backend

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* JWT Authentication
* Pydantic

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Tools

* Git
* GitHub
* VS Code

## 📂 Project Structure

```text
HRMS/
│
├── app/
│   ├── routers/
│   │   ├── attendance.py
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   ├── deparment.py
│   │   ├── employees.py
│   │   └── leave.py
│   │
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
│
├── frontend/
│
├── .gitignore
├── requirements.txt
└── README.md
```

## 🔑 Authentication

The application uses JWT-based authentication to protect authenticated routes and manage user sessions.

Users must log in before accessing protected HRMS functionality.

## 📊 Main Modules

| Module           | Description                                    |
| ---------------- | ---------------------------------------------- |
| Dashboard        | Organization overview and important statistics |
| Employees        | Employee CRUD management                       |
| Departments      | Department management                          |
| Attendance       | Employee attendance tracking                   |
| Leave Management | Leave request and approval management          |
| Profile          | User profile management                        |
| Authentication   | Login and JWT-based authorization              |

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/krishnap32422-design/hrms-management-system.git
```

```bash
cd hrms-management-system
```

### 2. Create Python virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root and add the required database and authentication configuration.

> Never commit `.env` or other secrets to GitHub.

### 5. Start the FastAPI backend

```bash
uvicorn app.main:app --reload
```

The backend API will be available locally through the FastAPI server.

## 🌐 API Documentation

FastAPI automatically provides interactive API documentation.

After starting the backend, open:

```text
/docs
```

You can use the Swagger interface to test the available API endpoints.

## 💻 Frontend Setup

Open a new terminal and move into the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will provide the local web interface for the HRMS application.

## 🔒 Security

The project follows basic application security practices including:

* JWT-based authentication
* Protected API routes
* Password hashing
* Environment-based configuration
* Input validation
* Role-based authorization

## 📸 Screenshots

Screenshots of the HRMS dashboard and major modules can be added here.

### Dashboard

*Add dashboard screenshot here.*

### Employee Management

*Add employee management screenshot here.*

### Attendance

*Add attendance screenshot here.*

### Leave Management

*Add leave management screenshot here.*

## 🎯 Project Goals

The goal of this project is to build a practical HR management platform that can be used as a foundation for small and medium-sized organizations.

The project also demonstrates full-stack development skills including frontend development, REST API development, authentication, database management, and application deployment.

## 🔮 Future Improvements

Possible future improvements include:

* Employee salary/payroll management
* Email notifications
* Advanced attendance reports
* Export reports to PDF/Excel
* Cloud deployment
* Docker support
* CI/CD pipeline
* Advanced analytics
* Audit logs

## 👨‍💻 Developer

**Krishna Patel**

B.Tech Computer Science & Engineering Student

GitHub: https://github.com/krishnap32422-design

## 📄 License

This project is currently intended for learning, portfolio, and demonstration purposes.
