import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import CaseSheet from "./pages/CaseSheet";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/patients" replace />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:patientId" element={<PatientProfile />} />
        <Route path="/patients/:patientId/case-sheet" element={<CaseSheet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;