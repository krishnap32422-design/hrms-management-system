import { useEffect, useState } from "react";

https:// = "https://://hrms-management-system-147q.onrender.com";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        const role = payload.role;

        // HR / ADMIN
        if (role === "HR" || role === "ADMIN") {
          const response = await fetch(`${API}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Unable to load profile");
          }

          const data = await response.json();

          setProfile({
            name: data.name,
            email: data.email,
            role: data.role,
            employee_code: null,
            designation: null,
            department: null,
          });

          return;
        }

        // EMPLOYEE
        const response = await fetch(`${API}/dashboard/employee-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load profile");
        }

        const data = await response.json();

        setProfile({
          name: data.name,
          email: data.email,
          role: "EMPLOYEE",
          employee_code: data.employee_code || null,
          designation: data.designation || null,
          department: data.department || null,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <div className="profile-error-icon">!</div>
          <h2>Unable to load profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const roleName =
    profile.role === "ADMIN"
      ? "Administrator"
      : profile.role === "HR"
      ? "HR Manager"
      : "Employee";

  return (
    <div className="profile-page">

      {/* PAGE HEADER */}
      <div className="profile-page-header">
        <div>
          <span className="profile-small-title">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>View your personal and account information.</p>
        </div>
      </div>

      {/* PROFILE HERO */}
      <div className="profile-hero">

        <div className="profile-avatar-large">
          {initials}
        </div>

        <div className="profile-hero-info">
          <h2>{profile.name}</h2>

          <p>{profile.email}</p>

          <div className="profile-role-badge">
            {roleName}
          </div>
        </div>

      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="profile-section">

        <div className="profile-section-header">
          <div>
            <h2>Account Information</h2>
            <p>Your account details</p>
          </div>
        </div>

        <div className="profile-info-grid">

          <div className="profile-info-item">
            <span>Name</span>
            <strong>{profile.name || "Not available"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Email Address</span>
            <strong>{profile.email || "Not available"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Role</span>
            <strong>{roleName}</strong>
          </div>

          {profile.employee_code && (
            <div className="profile-info-item">
              <span>Employee Code</span>
              <strong>{profile.employee_code}</strong>
            </div>
          )}

          {profile.designation && (
            <div className="profile-info-item">
              <span>Designation</span>
              <strong>{profile.designation}</strong>
            </div>
          )}

          {profile.department && (
            <div className="profile-info-item">
              <span>Department</span>
              <strong>{profile.department}</strong>
            </div>
          )}

        </div>

      </div>

      {/* SECURITY */}
      <div className="profile-section">

        <div className="profile-section-header">
          <div>
            <h2>Account Security</h2>
            <p>Your account is protected by secure authentication.</p>
          </div>
        </div>

        <div className="security-box">

          <div className="security-icon">
            🔐
          </div>

          <div>
            <strong>Password</strong>
            <p>
              Your password is securely protected and is not displayed here.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;