import { useEffect, useState } from "react";
import axios from "axios";

https:// = "https://hrms-management-system-147q.onrender.com";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    status: "PRESENT",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${API}/attendance/`,
        config
      );

      setAttendance(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.detail ||
          "Unable to load attendance"
      );
    }
  };

  // ==========================================
  // FETCH EMPLOYEES
  // ==========================================

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API}/employees/`,
        config
      );

      setEmployees(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to load employees"
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchAttendance(),
          fetchEmployees(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================================
  // EMPLOYEE NAME
  // ==========================================

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (emp) => emp.id === employeeId
    );

    return employee
      ? employee.name
      : `Employee #${employeeId}`;
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setFormData({
      employee_id: "",
      date: today,
      check_in: "",
      check_out: "",
      status: "PRESENT",
    });

    setShowForm(true);
  };

  // ==========================================
  // EDIT FORM
  // ==========================================

  const openEditForm = (record) => {
    setEditingId(record.id);

    setFormData({
      employee_id: String(record.employee_id),
      date: record.date,
      check_in: record.check_in
        ? record.check_in.substring(0, 5)
        : "",
      check_out: record.check_out
        ? record.check_out.substring(0, 5)
        : "",
      status: record.status,
    });

    setShowForm(true);
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee_id) {
      alert("Please select employee");
      return;
    }

    if (!formData.date) {
      alert("Please select date");
      return;
    }

    const data = {
      employee_id: Number(formData.employee_id),
      date: formData.date,
      check_in: formData.check_in || null,
      check_out: formData.check_out || null,
      status: formData.status,
    };

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `${API}/attendance/${editingId}`,
          data,
          config
        );

        alert("Attendance updated successfully");
      } else {
        await axios.post(
          `${API}/attendance/`,
          data,
          config
        );

        alert("Attendance added successfully");
      }

      setShowForm(false);
      setEditingId(null);

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CHECK IN SELECTED EMPLOYEE
  // ==========================================

  const handleCheckIn = async (employeeId) => {
    try {
      setSaving(true);

      await axios.post(
        `${API}/attendance/admin/check-in/${employeeId}`,
        {},
        config
      );

      alert("Employee checked in successfully");

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to check in employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CHECK OUT SELECTED EMPLOYEE
  // ==========================================

  const handleCheckOut = async (employeeId) => {
    try {
      setSaving(true);

      await axios.post(
        `${API}/attendance/admin/check-out/${employeeId}`,
        {},
        config
      );

      alert("Employee checked out successfully");

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to check out employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setSaving(true);

      await axios.delete(
        `${API}/attendance/${id}`,
        config
      );

      alert("Attendance deleted successfully");

      await fetchAttendance();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to delete attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredAttendance = attendance.filter(
    (record) => {
      const employeeName = getEmployeeName(
        record.employee_id
      ).toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        employeeName.includes(searchText) ||
        String(record.employee_id).includes(
          searchText
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        record.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        record.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    }
  );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAttendance = attendance.length;

  const presentCount = attendance.filter(
    (item) => item.status === "PRESENT"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "ABSENT"
  ).length;

  const leaveCount = attendance.filter(
    (item) => item.status === "LEAVE"
  ).length;

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // GET TODAY'S RECORD
  // ==========================================

  const getTodayRecord = (employeeId) => {
    return attendance.find(
      (record) =>
        record.employee_id === employeeId &&
        record.date === today
    );
  };

  return (
    <div className="page-container">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Attendance</h1>

          <p>
            Manage and monitor employee attendance
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddForm}
        >
          + Add Attendance
        </button>

      </div>

      {/* ======================================
          STATS
      ====================================== */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            📋
          </div>

          <div>
            <span>Total Records</span>
            <h2>{totalAttendance}</h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🟢
          </div>

          <div>
            <span>Present</span>
            <h2>{presentCount}</h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🔴
          </div>

          <div>
            <span>Absent</span>
            <h2>{absentCount}</h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🟡
          </div>

          <div>
            <span>Leave</span>
            <h2>{leaveCount}</h2>
          </div>

        </div>

      </div>

      {/* ======================================
          TODAY'S EMPLOYEE CHECK IN PANEL
      ====================================== */}

      <div className="common-card">

        <div className="table-header">

          <div>
            <h2>Today's Attendance</h2>

            <p>
              Check in or check out employees
            </p>
          </div>

          <span>
            {today}
          </span>

        </div>

        {employees.length === 0 ? (

          <div className="empty-state">
            No employees found.
          </div>

        ) : (

          <div className="employee-attendance-list">

            {employees.map((employee) => {

              const record = getTodayRecord(
                employee.id
              );

              return (

                <div
                  className="employee-attendance-row"
                  key={employee.id}
                >

                  <div className="employee-info">

                    <div className="employee-avatar">
                      {employee.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {employee.name}
                      </strong>

                      <small>
                        {employee.employee_code}
                      </small>
                    </div>

                  </div>

                  <div className="today-times">

                    <span>
                      In:{" "}
                      {record?.check_in
                        ? record.check_in.substring(
                            0,
                            5
                          )
                        : "--:--"}
                    </span>

                    <span>
                      Out:{" "}
                      {record?.check_out
                        ? record.check_out.substring(
                            0,
                            5
                          )
                        : "--:--"}
                    </span>

                  </div>

                  <div className="today-actions">

                    {!record?.check_in && (

                      <button
                        className="check-in-btn"
                        disabled={saving}
                        onClick={() =>
                          handleCheckIn(
                            employee.id
                          )
                        }
                      >
                        Check In
                      </button>

                    )}

                    {record?.check_in &&
                      !record?.check_out && (

                        <button
                          className="check-out-btn"
                          disabled={saving}
                          onClick={() =>
                            handleCheckOut(
                              employee.id
                            )
                          }
                        >
                          Check Out
                        </button>

                      )}

                    {record?.check_in &&
                      record?.check_out && (

                        <span className="completed-badge">
                          ✓ Completed
                        </span>

                      )}

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* ======================================
          FILTER
      ====================================== */}

      <div className="common-card">

        <div className="filter-row">

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="PRESENT">
              Present
            </option>

            <option value="ABSENT">
              Absent
            </option>

            <option value="LEAVE">
              Leave
            </option>

            <option value="HALF_DAY">
              Half Day
            </option>

          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
          />

          <button
            className="secondary-btn"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setDateFilter("");
            }}
          >
            Clear
          </button>

        </div>

      </div>

      {/* ======================================
          ATTENDANCE TABLE
      ====================================== */}

      <div className="common-card">

        <div className="table-header">

          <div>
            <h2>Attendance Records</h2>

            <p>
              Attendance history
            </p>
          </div>

          <span>
            {filteredAttendance.length} Records
          </span>

        </div>

        {loading ? (

          <div className="empty-state">
            Loading attendance...
          </div>

        ) : filteredAttendance.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No attendance records found
            </h3>

            <p>
              Attendance records will appear here.
            </p>

          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredAttendance.map(
                  (record) => (

                    <tr key={record.id}>

                      <td>
                        #{record.id}
                      </td>

                      <td>

                        <strong>
                          {getEmployeeName(
                            record.employee_id
                          )}
                        </strong>

                        <small>
                          ID:{" "}
                          {record.employee_id}
                        </small>

                      </td>

                      <td>
                        {record.date}
                      </td>

                      <td>
                        {record.check_in
                          ? record.check_in.substring(
                              0,
                              5
                            )
                          : "--"}
                      </td>

                      <td>
                        {record.check_out
                          ? record.check_out.substring(
                              0,
                              5
                            )
                          : "--"}
                      </td>

                      <td>

                        <span
                          className={`status-badge ${record.status.toLowerCase()}`}
                        >
                          {record.status}
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              openEditForm(record)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            disabled={saving}
                            onClick={() =>
                              handleDelete(
                                record.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Attendance"
                    : "Add Attendance"}
                </h2>

                <p>
                  Enter attendance information
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form
              className="employee-form"
              onSubmit={handleSubmit}
            >

              {/* EMPLOYEE */}

              <div className="form-group">

                <label>
                  Employee
                </label>

                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="employee-select"
                >

                  <option value="">
                    Select Employee
                  </option>

                  {employees.map(
                    (employee) => (

                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.name} -{" "}
                        {employee.employee_code}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* CHECK IN */}

              <div className="form-group">

                <label>
                  Check In
                </label>

                <input
                  type="time"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                />

              </div>

              {/* CHECK OUT */}

              <div className="form-group">

                <label>
                  Check Out
                </label>

                <input
                  type="time"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="PRESENT">
                    Present
                  </option>

                  <option value="ABSENT">
                    Absent
                  </option>

                  <option value="LEAVE">
                    Leave
                  </option>

                  <option value="HALF_DAY">
                    Half Day
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Attendance"
                    : "Add Attendance"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Attendance;