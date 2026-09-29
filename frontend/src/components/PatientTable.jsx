import { useNavigate } from "react-router-dom";

function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function PatientTable({ patients }) {
    const navigate = useNavigate();
    return (
        <div className="patient-table-container">
            {patients.length === 0 ? (
                <div className="message">No patients found</div>
            ) : (
                <table className="patient-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.patient_id}>
                                <td>
                                    <span className="patient-id">
                                        {patient.patient_id}
                                    </span>
                                </td>

                                <td>
                                    <div className="patient-name">
                                        <div className="avatar">
                                            {patient.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{patient.name}</span>
                                    </div>
                                </td>

                                <td>
                                    {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "—"}
                                </td>

                                <td>{patient.gender || "—"}</td>

                                <td>
                                    {patient.date_of_birth || "—"}
                                </td>

                                <td>{patient.phone || "—"}</td>

                                <td>
                                    <button className="view-button"
                                        onClick={() =>
                                            navigate(
                                                `/patients/${patient.patient_id}`
                                            )
                                        }
                                    >
                                        View <span className="arrow">›</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PatientTable;