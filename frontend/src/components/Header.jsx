function Header() {

  return (
    <header className="header">

      <div>
        <h2>Dashboard</h2>
        <p>Welcome back to HRMS</p>
      </div>

      <div className="header-user">
        <div className="avatar">
          HR
        </div>

        <div>
          <strong>HR Admin</strong>
          <small>Administrator</small>
        </div>
      </div>

    </header>
  )
}

export default Header