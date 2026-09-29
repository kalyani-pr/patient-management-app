function Header({ onAddPatient }) {
  return (
    <header className="header">
      <h1>Patient Management System</h1>
      <button
        className="add-patient-button"
        onClick={onAddPatient}
      >
        + Add Patient
      </button>
    </header>
  );
}

export default Header;