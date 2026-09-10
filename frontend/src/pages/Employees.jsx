import { useEffect, useState } from "react";
import "./Employees.css";

const API = "https://://hrms-management-system-147q.onrender.com";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    employee_code: "",
    name: "",
    email: "",
    phone: "",
    desigination: "",
    salary: "",
    department_id: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // =========================
  // GET EMPLOYEES
  // =========================

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API}/employees/`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch employees");
      }

      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =========================
  // GET DEPARTMENTS
  // =========================

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API}/department/`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch departments");
      }

      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      employee_code: "",
      name: "",
      email: "",
      phone: "",
      desigination: "",
      salary: "",
      department_id: "",
      password: "",
    });

    setEditingId(null);
  };

  // =========================
  // ADD
  // =========================

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================
  // EDIT
  // =========================

  const openEditModal = (employee) => {
    setEditingId(employee.id);

    setForm({
      employee_code: employee.employee_code || "",
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      desigination: employee.desigination || "",
      salary: employee.salary || "",
      department_id: employee.department_id || "",
      password: "",
    });

    setShowModal(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        const updateData = {
          name: form.name,
          phone: form.phone || null,
          desigination: form.desigination || null,
          salary: form.salary ? Number(form.salary) : null,
          department_id: form.department_id
            ? Number(form.department_id)
            : null,
        };

        response = await fetch(
          `${API}/employees/${editingId}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(updateData),
          }
        );
      } else {
        if (!form.password) {
          alert("Please enter a password");
          return;
        }

        const createData = {
          employee_code: form.employee_code,
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          desigination: form.desigination || null,
          salary: form.salary ? Number(form.salary) : null,
          department_id: form.department_id
            ? Number(form.department_id)
            : null,
          password: form.password,
        };

        response = await fetch(`${API}/employees/`, {
          method: "POST",
          headers,
          body: JSON.stringify(createData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Something went wrong"
        );
      }

      alert(
        editingId
          ? "Employee updated successfully"
          : "Employee created successfully"
      );

      setShowModal(false);
      resetForm();
      fetchEmployees();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/employees/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete employee"
        );
      }

      alert(data.message);

      fetchEmployees();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredEmployees = employees.filter((employee) => {
    const text = search.toLowerCase();

    return (
      employee.name?.toLowerCase().includes(text) ||
      employee.email?.toLowerCase().includes(text) ||
      employee.employee_code
        ?.toLowerCase()
        .includes(text)
    );
  });

  // =========================
  // UI
  // =========================

  return (
    <div className="employees-page">

      <div className="employees-header">
        <div>
          <h1>Employees</h1>
          <p>Manage your organization's employees</p>
        </div>

        <button
          className="add-employee-btn"
          onClick={openAddModal}
        >
          + Add Employee
        </button>
      </div>

      {/* SEARCH */}

      <div className="employee-toolbar">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* EMPLOYEE TABLE */}

      <div className="employee-table-container">

        <table className="employee-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="10">
                  No employees found
                </td>
              </tr>
            ) : (

              filteredEmployees.map((employee) => (

                <tr key={employee.id}>

                  <td>{employee.id}</td>

                  <td>
                    {employee.employee_code}
                  </td>

                  <td>
                    {employee.name}
                  </td>

                  <td>
                    {employee.email}
                  </td>

                  <td>
                    {employee.phone || "-"}
                  </td>

                  <td>
                    {employee.desigination || "-"}
                  </td>

                  <td>
                    {employee.department?.name || "-"}
                  </td>

                  <td>
                    {employee.salary
                      ? `₹${employee.salary}`
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={
                        employee.is_active
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {employee.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditModal(employee)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEmployee(employee.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="employee-modal">

            <h2>
              {editingId
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit}>

              {/* EMPLOYEE CODE */}

              <input
                type="text"
                name="employee_code"
                placeholder="Employee Code"
                value={form.employee_code}
                onChange={handleChange}
                disabled={!!editingId}
                required
              />

              {/* NAME */}

              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              {/* EMAIL */}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                disabled={!!editingId}
                required
              />

              {/* PHONE */}

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />

              {/* DESIGNATION */}

              <input
                type="text"
                name="desigination"
                placeholder="Designation"
                value={form.desigination}
                onChange={handleChange}
              />

              {/* SALARY */}

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={form.salary}
                onChange={handleChange}
                min="0"
              />

              {/* DEPARTMENT */}

              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>

              {/* PASSWORD ONLY FOR NEW EMPLOYEE */}

              {!editingId && (

                <input
                  type="password"
                  name="password"
                  placeholder="Login Password"
                  value={form.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />

              )}

              {/* BUTTONS */}

              <div className="modal-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? "Update Employee"
                    : "Create Employee"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Employees;
