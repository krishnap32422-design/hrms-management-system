import { useEffect, useState } from "react";
import axios from "axios";

const API  = "https://hrms-management-system-147q.onrender.com";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // GET ALL LEAVES
  // =========================
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/leave/`,
        config
      );

      setLeaves(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to load leaves"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API}/employees/`,
        config
      );

      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  // =========================
  // EMPLOYEE NAME
  // =========================
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (emp) => emp.id === employeeId
    );

    return employee
      ? employee.name
      : `Employee #${employeeId}`;
  };

  // =========================
  // APPROVE LEAVE
  // =========================
  const handleApprove = async (leaveId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this leave?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      await axios.put(
        `${API}/leave/${leaveId}/approve`,
        {},
        config
      );

      alert("Leave approved successfully");

      fetchLeaves();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to approve leave"
      );
    }
  };

  // =========================
  // REJECT LEAVE
  // =========================
  const handleReject = async (leaveId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this leave?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      await axios.put(
        `${API}/leave/${leaveId}/reject`,
        {},
        config
      );

      alert("Leave rejected successfully");

      fetchLeaves();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Unable to reject leave"
      );
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredLeaves = leaves.filter((leave) => {
    const employeeName = getEmployeeName(
      leave.employee_id
    ).toLowerCase();

    const searchText = search.toLowerCase();

    const matchesSearch =
      employeeName.includes(searchText) ||
      String(leave.employee_id).includes(searchText) ||
      leave.reason.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      leave.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATS
  // =========================
  const totalLeaves = leaves.length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const rejectedLeaves = leaves.filter(
    (leave) => leave.status === "REJECTED"
  ).length;

  // =========================
  // CALCULATE DAYS
  // =========================
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  return (
    <div className="page-container">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <h1>Leave Management</h1>

          <p>
            Review and manage employee leave requests
          </p>
        </div>

      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            📋
          </div>

          <div>
            <span>Total Requests</span>
            <h2>{totalLeaves}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🟡
          </div>

          <div>
            <span>Pending</span>
            <h2>{pendingLeaves}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🟢
          </div>

          <div>
            <span>Approved</span>
            <h2>{approvedLeaves}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🔴
          </div>

          <div>
            <span>Rejected</span>
            <h2>{rejectedLeaves}</h2>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="common-card">

        <div className="filter-row">

          <input
            type="text"
            placeholder="Search employee or reason..."
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

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>

          <button
            className="secondary-btn"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Clear
          </button>

        </div>

      </div>

      {/* LEAVE TABLE */}
      <div className="common-card">

        <div className="table-header">

          <h2>Leave Requests</h2>

          <span>
            {filteredLeaves.length} Requests
          </span>

        </div>

        {loading ? (
          <div className="empty-state">
            Loading leave requests...
          </div>
        ) : filteredLeaves.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No leave requests found
            </h3>

            <p>
              There are no leave requests matching
              your filters.
            </p>

          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Leave Period</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredLeaves.map(
                  (leave) => (

                    <tr key={leave.id}>

                      {/* ID */}
                      <td>
                        #{leave.id}
                      </td>

                      {/* EMPLOYEE */}
                      <td>

                        <strong>
                          {getEmployeeName(
                            leave.employee_id
                          )}
                        </strong>

                        <small>
                          ID: {leave.employee_id}
                        </small>

                      </td>

                      {/* DATE */}
                      <td>

                        <div className="leave-date">

                          <span>
                            {leave.start_date}
                          </span>

                          <span>
                            to
                          </span>

                          <span>
                            {leave.end_date}
                          </span>

                        </div>

                      </td>

                      {/* DAYS */}
                      <td>

                        <strong>
                          {calculateDays(
                            leave.start_date,
                            leave.end_date
                          )}
                        </strong>

                      </td>

                      {/* REASON */}
                      <td>

                        <div className="reason-text">
                          {leave.reason}
                        </div>

                      </td>

                      {/* STATUS */}
                      <td>

                        <span
                          className={`status-badge ${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td>

                        {leave.status === "PENDING" ? (

                          <div className="action-buttons">

                            <button
                              className="approve-btn"
                              onClick={() =>
                                handleApprove(
                                  leave.id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                handleReject(
                                  leave.id
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="processed-text">
                            Processed
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Leaves;
