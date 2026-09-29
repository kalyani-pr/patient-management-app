import { useEffect, useState } from "react";
import Header from "../components/Header";
import PatientTable from "../components/PatientTable";
import AddPatient from "../components/AddPatient";
import { getPatients } from "../services/api";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load patients.");
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
    fetchPatients();
  }, []);

  return (
    <div className="app">
      <Header
        onAddPatient={() => setShowModal(true)}
      />

      <main className="main-content">
        <div className="page-heading">
          <h3>Patients list</h3>
        </div>

        {loading ? (
          <div className="message">
            Loading patients...
          </div>
        ) : error ? (
          <div className="message error">
            {error}
          </div>
        ) : (
          <PatientTable patients={patients} />
        )}
      </main>

      {showModal && (
        <AddPatient
          onClose={() => setShowModal(false)}
          onPatientAdded={fetchPatients}
        />
      )}
    </div>
  );
}

export default PatientList;