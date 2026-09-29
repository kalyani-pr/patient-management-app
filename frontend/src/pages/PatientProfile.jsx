import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatient } from "../services/api";

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference =
    today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPatient(patientId);
        setPatient(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load patient");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="message">
          Loading patient...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="message error">
          {error}
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="profile-page">
      <button
        className="back-button"
        onClick={() => navigate("/patients")}
      >
        ← Back to Patients
      </button>

      <div className="profile-header">
        <div>
          <p className="profile-label">
            Patient Profile
          </p>
          <h3>{patient.name}</h3>
          <span className="profile-patient-id">
            {patient.patient_id}
          </span>
        </div>

        <button
          className="case-sheet-button"
          onClick={() =>
            navigate(
              `/patients/${patient.patient_id}/case-sheet`
            )
          }
        >
          Open Case Sheet
        </button>
      </div>

      <div className="profile-card">
        <h3>Patient Information</h3>

        <div className="profile-grid">
          <div className="profile-field">
            <span>Age</span>
            <strong>
              {patient.date_of_birth ? calculateAge(patient.date_of_birth) : "—"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Gender</span>
            <strong>{patient.gender || "—"}</strong>
          </div>

          <div className="profile-field">
            <span>Date of Birth</span>
            <strong>
              {patient.date_of_birth || "—"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Phone</span>
            <strong>{patient.phone || "—"}</strong>
          </div>

          <div className="profile-field full-width">
            <span>Address</span>
            <strong>{patient.address || "—"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;