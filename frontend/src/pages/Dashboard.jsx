import { useEffect, useState } from "react";
import axios from "axios";

https:// = "https://://hrms-management-system-147q.onrender.com";

// =========================
// GET ROLE FROM JWT
// =========================

function getUserRole() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(
        token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return payload.role;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}


function Dashboard() {

  const [role] = useState(getUserRole());

  const [summary, setSummary] = useState({
    total_employees: 0,
    total_departments: 0,
    present_today: 0,
    pending_leaves: 0,
    approved_leaves: 0,
  });

  const [employeeData, setEmployeeData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");


  // ============================================================
  // FETCH DASHBOARD
  // ============================================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        if (!token) {
          window.location.href = "/login";
          return;
        }


        // ======================================================
        // EMPLOYEE DASHBOARD
        // ======================================================

        if (role === "EMPLOYEE") {

          const response = await axios.get(
            `${API}/dashboard/employee-summary`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setEmployeeData(response.data);

        }


        // ======================================================
        // HR / ADMIN DASHBOARD
        // ======================================================

        else if (role === "HR" || role === "ADMIN") {

          const response = await axios.get(
            `${API}/dashboard/summary`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSummary(response.data);

        }


        // ======================================================
        // UNKNOWN ROLE
        // ======================================================

        else {

          setError(
            "Invalid user role. Please login again."
          );

        }

      } catch (error) {

        console.error(error);

        if (error.response?.status === 401) {

          localStorage.removeItem("token");
          window.location.href = "/login";
          return;

        }

        if (error.response?.status === 403) {

          setError(
            "You do not have permission to access this dashboard."
          );

          return;

        }

        setError(
          error.response?.data?.detail ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, [token, role]);


  // ============================================================
  // TODAY
  // ============================================================

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );


  // ============================================================
  // HR / ADMIN ATTENDANCE %
  // ============================================================

  const attendancePercentage =
    summary.total_employees > 0
      ? Math.round(
          (summary.present_today /
            summary.total_employees) *
            100
        )
      : 0;


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div className="dashboard-page">

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading dashboard...
          </p>

        </div>

      </div>
    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (
      <div className="dashboard-page">

        <div className="dashboard-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );

  }


  // ============================================================
  // EMPLOYEE DASHBOARD
  // ============================================================

  if (role === "EMPLOYEE") {

    const todayAttendance =
      employeeData?.today;

    const attendance =
      employeeData?.attendance;

    const leaves =
      employeeData?.leaves;


    return (

      <div className="dashboard-page">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-welcome">
              Welcome back 👋
            </span>

            <h1>
              Employee Dashboard
            </h1>

            <p>
              Welcome to your HRMS employee portal.
            </p>

          </div>


          <div className="dashboard-date">

            <span>
              Today
            </span>

            <strong>
              {today}
            </strong>

          </div>

        </div>


        {/* ================= EMPLOYEE INFO ================= */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h2>
                My Profile
              </h2>

              <p>
                Your employee information
              </p>

            </div>

            <div className="card-heading-icon">
              👤
            </div>

          </div>


          <div className="employee-dashboard-info">

            <div>

              <span>
                Name
              </span>

              <strong>
                {employeeData?.name || "-"}
              </strong>

            </div>


            <div>

              <span>
                Email
              </span>

              <strong>
                {employeeData?.email || "-"}
              </strong>

            </div>


            <div>

              <span>
                Employee ID
              </span>

              <strong>
                {employeeData?.employee_id || "-"}
              </strong>

            </div>

          </div>

        </div>


        {/* ================= STAT CARDS ================= */}

        <div className="dashboard-stats">


          {/* PRESENT DAYS */}

          <div className="dashboard-stat-card">

            <div className="stat-top">

              <div className="dashboard-icon attendance-icon">
                ✓
              </div>

              <span className="stat-label">
                Present Days
              </span>

            </div>

            <div className="stat-number">

              {attendance?.present_days || 0}

            </div>

            <div className="stat-bottom">

              <span>
                Total days present
              </span>

            </div>

          </div>


          {/* TOTAL LEAVES */}

          <div className="dashboard-stat-card">

            <div className="stat-top">

              <div className="dashboard-icon leave-icon">
                📝
              </div>

              <span className="stat-label">
                Total Leaves
              </span>

            </div>

            <div className="stat-number">

              {leaves?.total || 0}

            </div>

            <div className="stat-bottom">

              <span>
                Leave requests
              </span>

            </div>

          </div>


          {/* PENDING */}

          <div className="dashboard-stat-card">

            <div className="stat-top">

              <div className="dashboard-icon departments-icon">
                ⏳
              </div>

              <span className="stat-label">
                Pending Leaves
              </span>

            </div>

            <div className="stat-number">

              {leaves?.pending || 0}

            </div>

            <div className="stat-bottom">

              <span>
                Awaiting approval
              </span>

            </div>

          </div>


          {/* APPROVED */}

          <div className="dashboard-stat-card">

            <div className="stat-top">

              <div className="dashboard-icon employees-icon">
                ✓
              </div>

              <span className="stat-label">
                Approved Leaves
              </span>

            </div>

            <div className="stat-number">

              {leaves?.approved || 0}

            </div>

            <div className="stat-bottom">

              <span>
                Approved requests
              </span>

            </div>

          </div>

        </div>


        {/* ================= TODAY ATTENDANCE ================= */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h2>
                Today's Attendance
              </h2>

              <p>
                Your attendance status for today
              </p>

            </div>

            <div className="card-heading-icon">
              📅
            </div>

          </div>


          <div className="attendance-details">


            <div className="detail-row">

              <div className="detail-label">

                <span className="dot present-dot"></span>

                Check In

              </div>

              <strong>

                {todayAttendance?.check_in ||
                  "Not checked in"}

              </strong>

            </div>


            <div className="detail-row">

              <div className="detail-label">

                <span className="dot total-dot"></span>

                Check Out

              </div>

              <strong>

                {todayAttendance?.check_out ||
                  "Not checked out"}

              </strong>

            </div>


            <div className="detail-row">

              <div className="detail-label">

                <span className="dot remaining-dot"></span>

                Status

              </div>

              <strong>

                {todayAttendance?.checked_out
                  ? "Completed"
                  : todayAttendance?.checked_in
                  ? "Checked In"
                  : "Not Checked In"}

              </strong>

            </div>

          </div>

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-card quick-actions-card">

          <div className="card-heading">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Access your HRMS features
              </p>

            </div>

          </div>


          <div className="quick-actions">


            <button
              className="quick-action"
              onClick={() => {
                window.location.href =
                  "/my-attendance";
              }}
            >

              <div className="quick-action-icon">
                📅
              </div>

              <div>

                <strong>
                  My Attendance
                </strong>

                <span>
                  View your attendance
                </span>

              </div>

              <b>
                ›
              </b>

            </button>


            <button
              className="quick-action"
              onClick={() => {
                window.location.href =
                  "/leaves";
              }}
            >

              <div className="quick-action-icon">
                📝
              </div>

              <div>

                <strong>
                  My Leaves
                </strong>

                <span>
                  Apply and view leaves
                </span>

              </div>

              <b>
                ›
              </b>

            </button>


            <button
              className="quick-action"
              onClick={() => {
                window.location.href =
                  "/profile";
              }}
            >

              <div className="quick-action-icon">
                👤
              </div>

              <div>

                <strong>
                  My Profile
                </strong>

                <span>
                  View your profile
                </span>

              </div>

              <b>
                ›
              </b>

            </button>


          </div>

        </div>

      </div>

    );

  }


  // ============================================================
  // HR / ADMIN DASHBOARD
  // ============================================================

  return (

    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-welcome">
            Welcome back 👋
          </span>

          <h1>
            HRMS Dashboard
          </h1>

          <p>
            Here's what's happening in your organization today.
          </p>

        </div>


        <div className="dashboard-date">

          <span>
            Today
          </span>

          <strong>
            {today}
          </strong>

        </div>

      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="dashboard-stats">


        {/* EMPLOYEES */}

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="dashboard-icon employees-icon">
              👥
            </div>

            <span className="stat-label">
              Employees
            </span>

          </div>

          <div className="stat-number">
            {summary.total_employees}
          </div>

          <div className="stat-bottom">

            <span>
              Active employees
            </span>

          </div>

        </div>


        {/* DEPARTMENTS */}

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="dashboard-icon departments-icon">
              🏢
            </div>

            <span className="stat-label">
              Departments
            </span>

          </div>

          <div className="stat-number">
            {summary.total_departments}
          </div>

          <div className="stat-bottom">

            <span>
              Organization units
            </span>

          </div>

        </div>


        {/* ATTENDANCE */}

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="dashboard-icon attendance-icon">
              ✓
            </div>

            <span className="stat-label">
              Present Today
            </span>

          </div>

          <div className="stat-number">
            {summary.present_today}
          </div>

          <div className="stat-bottom">

            <span className="positive-text">
              {attendancePercentage}% attendance
            </span>

          </div>

        </div>


        {/* LEAVES */}

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <div className="dashboard-icon leave-icon">
              📝
            </div>

            <span className="stat-label">
              Pending Leaves
            </span>

          </div>

          <div className="stat-number">
            {summary.pending_leaves}
          </div>

          <div className="stat-bottom">

            <span>
              Awaiting approval
            </span>

          </div>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-main-grid">


        {/* ATTENDANCE */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h2>
                Attendance Overview
              </h2>

              <p>
                Today's workforce attendance
              </p>

            </div>

            <div className="card-heading-icon">
              📊
            </div>

          </div>


          <div className="attendance-content">

            <div className="attendance-circle">

              <div>

                <strong>
                  {attendancePercentage}%
                </strong>

                <span>
                  Present
                </span>

              </div>

            </div>


            <div className="attendance-details">


              <div className="detail-row">

                <div className="detail-label">

                  <span className="dot present-dot"></span>

                  Present

                </div>

                <strong>
                  {summary.present_today}
                </strong>

              </div>


              <div className="detail-row">

                <div className="detail-label">

                  <span className="dot total-dot"></span>

                  Total Employees

                </div>

                <strong>
                  {summary.total_employees}
                </strong>

              </div>


              <div className="detail-row">

                <div className="detail-label">

                  <span className="dot remaining-dot"></span>

                  Not Checked In

                </div>

                <strong>

                  {Math.max(
                    summary.total_employees -
                    summary.present_today,
                    0
                  )}

                </strong>

              </div>


            </div>

          </div>

        </div>


        {/* LEAVE */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h2>
                Leave Overview
              </h2>

              <p>
                Current leave requests
              </p>

            </div>

            <div className="card-heading-icon">
              📅
            </div>

          </div>


          <div className="leave-overview">


            <div className="leave-item pending-leave">

              <div className="leave-icon-box">
                ⏳
              </div>

              <div>

                <span>
                  Pending Requests
                </span>

                <strong>
                  {summary.pending_leaves}
                </strong>

              </div>

            </div>


            <div className="leave-item approved-leave">

              <div className="leave-icon-box">
                ✓
              </div>

              <div>

                <span>
                  Approved Leaves
                </span>

                <strong>
                  {summary.approved_leaves}
                </strong>

              </div>

            </div>


          </div>

        </div>

      </div>


      {/* ================= QUICK ACTIONS ================= */}

      <div className="dashboard-card quick-actions-card">

        <div className="card-heading">

          <div>

            <h2>
              Quick Actions
            </h2>

            <p>
              Access frequently used HRMS modules
            </p>

          </div>

        </div>


        <div className="quick-actions">


          <button
            onClick={() => {
              window.location.href =
                "/employees";
            }}
            className="quick-action"
          >

            <div className="quick-action-icon">
              👥
            </div>

            <div>

              <strong>
                Employees
              </strong>

              <span>
                Manage employees
              </span>

            </div>

            <b>
              ›
            </b>

          </button>


          <button
            onClick={() => {
              window.location.href =
                "/departments";
            }}
            className="quick-action"
          >

            <div className="quick-action-icon">
              🏢
            </div>

            <div>

              <strong>
                Departments
              </strong>

              <span>
                Manage departments
              </span>

            </div>

            <b>
              ›
            </b>

          </button>


          <button
            onClick={() => {
              window.location.href =
                "/attendance";
            }}
            className="quick-action"
          >

            <div className="quick-action-icon">
              📋
            </div>

            <div>

              <strong>
                Attendance
              </strong>

              <span>
                Track attendance
              </span>

            </div>

            <b>
              ›
            </b>

          </button>


          <button
            onClick={() => {
              window.location.href =
                "/leaves";
            }}
            className="quick-action"
          >

            <div className="quick-action-icon">
              📝
            </div>

            <div>

              <strong>
                Leave Management
              </strong>

              <span>
                Review leave requests
              </span>

            </div>

            <b>
              ›
            </b>

          </button>


        </div>

      </div>

    </div>

  );
}

export default Dashboard;