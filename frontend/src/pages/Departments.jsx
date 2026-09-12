import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hrms-management-system-147q.onrender.com";


// =========================
// GET USER ROLE FROM JWT
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
    console.error("Invalid token:", error);
    return null;
  }
}


// =========================
// DEPARTMENTS PAGE
// =========================

export default function Departments() {

  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const role = getUserRole();
  const isDemo = role === "DEMO";


  // =========================
  // AXIOS CONFIG
  // =========================

  const api = axios.create({
    baseURL: API,
  });


  api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });


  // =========================
  // FETCH DEPARTMENTS
  // =========================

  const fetchDepartments = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/department/");

      setDepartments(response.data);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Failed to load departments"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchDepartments();

  }, []);


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setName("");
    setDescription("");
    setEditingId(null);

  };


  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (isDemo) {
      return;
    }

    if (!name.trim()) {

      alert("Department name is required");

      return;
    }


    try {

      setSaving(true);

      setError("");


      const data = {
        name: name.trim(),
        description: description.trim(),
      };


      if (editingId) {

        await api.put(
          `/department/${editingId}`,
          data
        );

        alert("Department updated successfully");

      } else {

        await api.post(
          "/department/",
          data
        );

        alert("Department added successfully");

      }


      resetForm();

      fetchDepartments();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Something went wrong"
      );

    } finally {

      setSaving(false);

    }
  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (department) => {

    if (isDemo) {
      return;
    }

    setEditingId(department.id);

    setName(department.name || "");

    setDescription(
      department.description || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    if (isDemo) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      await api.delete(
        `/department/${id}`
      );

      alert("Department deleted successfully");

      fetchDepartments();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Failed to delete department"
      );
    }
  };


  // =========================
  // SEARCH
  // =========================

  const filteredDepartments =
    departments.filter((department) => {

      const searchText =
        search.toLowerCase();

      return (
        department.name
          ?.toLowerCase()
          .includes(searchText) ||

        department.description
          ?.toLowerCase()
          .includes(searchText)
      );
    });


  // =========================
  // UI
  // =========================

  return (

    <div className="page-container">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <div>

          <h1>Departments</h1>

          <p>
            Manage and organize company departments
          </p>

        </div>


        {!isDemo && (

          <button
            className="primary-btn"
            onClick={() => {

              resetForm();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

            }}
          >
            + Add Department
          </button>

        )}

      </div>


      {/* =========================
          DEMO MODE NOTICE
      ========================= */}

      {isDemo && (

        <div
          style={{
            background: "#eef6ff",
            border: "1px solid #cfe3ff",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            color: "#24527a",
          }}
        >

          <strong>Demo Mode</strong>

          <div
            style={{
              marginTop: "4px",
              fontSize: "14px",
            }}
          >
            You have read-only access.
            Department management actions
            are disabled in the demo.
          </div>

        </div>

      )}


      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      {!isDemo && (

        <div className="card">

          <div className="card-header">

            <div>

              <h2>
                {editingId
                  ? "Edit Department"
                  : "Add Department"}
              </h2>

              <p>
                {editingId
                  ? "Update department information"
                  : "Create a new department"}
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >

            <div className="form-group">

              <label>
                Department Name
              </label>

              <input
                type="text"
                placeholder="e.g. Human Resources"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <input
                type="text"
                placeholder="Department description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>


            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "end",
              }}
            >

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Department"
                  : "Add Department"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

      )}


      {/* =========================
          SEARCH
      ========================= */}

      <div className="card">

        <div className="search-row">

          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-input"
          />

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          style={{
            background: "#fff1f1",
            color: "#b42318",
            border: "1px solid #f3c4c4",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>

      )}


      {/* =========================
          DEPARTMENT TABLE
      ========================= */}

      <div className="card">

        <div className="card-header">

          <div>

            <h2>
              Department List
            </h2>

            <p>
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>


        {loading ? (

          <div
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            Loading departments...
          </div>

        ) : filteredDepartments.length === 0 ? (

          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#777",
            }}
          >

            No departments found.

          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Department</th>

                  <th>Description</th>

                  {!isDemo && (
                    <th>Actions</th>
                  )}

                </tr>

              </thead>


              <tbody>

                {filteredDepartments.map(
                  (department) => (

                    <tr key={department.id}>

                      <td>
                        #{department.id}
                      </td>


                      <td>

                        <strong>
                          {department.name}
                        </strong>

                      </td>


                      <td>
                        {department.description ||
                          "No description"}
                      </td>


                      {!isDemo && (

                        <td>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >

                            <button
                              className="secondary-btn"
                              onClick={() =>
                                handleEdit(
                                  department
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="danger-btn"
                              onClick={() =>
                                handleDelete(
                                  department.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      )}

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