import { NavLink, useNavigate } from "react-router-dom";

function getUserRole() {
  const token = localStorage.getItem("token");

  if (!token) return null;

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

function Sidebar() {
  const navigate = useNavigate();

  const role = getUserRole();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const employeeMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "My Attendance",
      path: "/my-attendance",
      icon: "📅",
    },
    {
      name: "My Leaves",
      path: "/leaves",
      icon: "📝",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Employees",
      path: "/employees",
      icon: "👥",
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "🏢",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📅",
    },
    {
      name: "Leave Management",
      path: "/leaves",
      icon: "📝",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  const demoMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Employees",
      path: "/employees",
      icon: "👥",
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "🏢",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📅",
    },
    {
      name: "Leave Management",
      path: "/leaves",
      icon: "📝",
    },
  ];

  let menu;

  if (role === "EMPLOYEE") {
    menu = employeeMenu;
  } else if (role === "DEMO") {
    menu = demoMenu;
  } else {
    menu = adminMenu;
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>Human Resources</h2>
      </div>

      <nav className="sidebar-menu">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <button
          className="sidebar-link logout-btn"
          onClick={logout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;