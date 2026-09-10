import { useEffect, useState } from "react";
import axios from "axios";

https://_URL = "https://://hrms-management-system-147q.onrender.com";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  https:// = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get Departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/department/");

      setDepartments(response.data);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail || "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Department
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Department name is required");
      return;
    }

    try {
      if (editingId) {
        // Update
        await api.put(`/department/${editingId}`, {
          name: formData.name,
          description: formData.description,
        });

        alert("Department updated successfully");
      } else {
        // Create
        await api.post("/department/", {
          name: formData.name,
          description: formData.description,
        });

        alert("Department added successfully");
      }

      setFormData({
        name: "",
        description: "",
      });

      setEditingId(null);

      fetchDepartments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Something went wrong"
      );
    }
  };

  // Edit
  const handleEdit = (department) => {
    setEditingId(department.id);

    setFormData({
      name: department.name,
      description: department.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/department/${id}`);

      alert("Department deleted successfully");

      fetchDepartments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete department"
      );
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  // Search
  const filteredDepartments = departments.filter((department) =>
    department.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage your organization's departments</p>
        </div>
      </div>

      {/* Department Form */}
      <div className="common-card">
        <div className="card-header">
          <div>
            <h2>
              {editingId
                ? "Edit Department"
                : "Add New Department"}
            </h2>

            <p>
              {editingId
                ? "Update department information"
                : "Create a new department"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="employee-form">

          <div className="form-group">
            <label>Department Name *</label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Human Resources"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <input
              type="text"
              name="description"
              placeholder="Department description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {editingId
                ? "Update Department"
                : "Add Department"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Search */}
      <div className="common-card search-card">

        <div className="search-container">

          <input
            type="text"
            className="employee-search"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Department Table */}
      <div className="common-card">

        <div className="card-header">

          <div>
            <h2>Department List</h2>

            <p>
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>

        {loading ? (
          <div className="loading">
            Loading departments...
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="empty-state">
            <h3>No departments found</h3>

            <p>
              Add your first department using the form
              above.
            </p>
          </div>
        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Employees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredDepartments.map((department) => (

                  <tr key={department.id}>

                    <td>#{department.id}</td>

                    <td>
                      <strong>
                        {department.name}
                      </strong>
                    </td>

                    <td>
                      {department.description ||
                        "No description"}
                    </td>

                    <td>
                      {department.employees?.length || 0}
                    </td>

                    <td>
                      {department.is_active ? (
                        <span className="status-active">
                          Active
                        </span>
                      ) : (
                        <span className="status-inactive">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(department)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(department.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

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

export default Departments;