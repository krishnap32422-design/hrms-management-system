import { useEffect, useState } from "react";
import axios from "axios";

https:// = "https://://hrms-management-system-147q.onrender.com";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAttendance = async () => {
    try {
      const [historyResponse, todayResponse] = await Promise.all([
        axios.get(`${API}/attendance/my`, config),
        axios.get(`${API}/attendance/my/today`, config),
      ]);

      setAttendance(historyResponse.data);
      setToday(todayResponse.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.detail ||
          "Unable to load attendance."
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAttendance();
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);

      await axios.post(
        `${API}/attendance/check-in`,
        {},
        config
      );

      alert("Check-in successful!");

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to check in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);

      await axios.post(
        `${API}/attendance/check-out`,
        {},
        config
      );

      alert("Check-out successful!");

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to check out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "--:--";

    return time.substring(0, 5);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="employee-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-page">
        <div className="employee-error">
          <h2>Unable to load attendance</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-page">

      {/* Header */}

      <div className="employee-page-header">

        <div>
          <span className="page-small-title">
            Employee Portal
          </span>

          <h1>My Attendance</h1>

          <p>
            Track your daily attendance and working hours.
          </p>
        </div>

      </div>

      {/* Today's Attendance */}

      <div className="my-attendance-card">

        <div className="my-attendance-header">

          <div>
            <span>Today's Attendance</span>

            <h2>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
          </div>

          <div className="today-status">
            {today ? today.status : "NOT MARKED"}
          </div>

        </div>

        <div className="today-attendance-content">

          <div className="time-box">

            <div className="time-icon">
              🟢
            </div>

            <div>
              <span>Check In</span>

              <strong>
                {formatTime(today?.check_in)}
              </strong>
            </div>

          </div>

          <div className="time-box">

            <div className="time-icon">
              🔴
            </div>

            <div>
              <span>Check Out</span>

              <strong>
                {formatTime(today?.check_out)}
              </strong>
            </div>

          </div>

          <div className="attendance-actions">

            {!today?.check_in && (
              <button
                className="employee-checkin-btn"
                onClick={handleCheckIn}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "✓ Check In"}
              </button>
            )}

            {today?.check_in && !today?.check_out && (
              <button
                className="employee-checkout-btn"
                onClick={handleCheckOut}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "↪ Check Out"}
              </button>
            )}

            {today?.check_in && today?.check_out && (
              <div className="attendance-completed">
                ✓ Attendance Completed
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Attendance History */}

      <div className="my-history-card">

        <div className="history-header">

          <div>
            <h2>Attendance History</h2>
            <p>Your previous attendance records</p>
          </div>

          <span>
            {attendance.length} Records
          </span>

        </div>

        {attendance.length === 0 ? (
          <div className="no-attendance">
            <div>📋</div>

            <h3>No attendance records</h3>

            <p>
              Your attendance history will appear here.
            </p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">

            <table className="my-attendance-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((record) => (
                  <tr key={record.id}>

                    <td>
                      <strong>
                        {formatDate(record.date)}
                      </strong>
                    </td>

                    <td>
                      {formatTime(record.check_in)}
                    </td>

                    <td>
                      {formatTime(record.check_out)}
                    </td>

                    <td>
                      <span
                        className={`my-status ${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default MyAttendance;