const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getPatients() {
  const response = await fetch(`${API_URL}/patients`);
  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }
  return response.json();
}

export async function getPatient(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch patient");
  }
  return data;
}

export async function createPatient(patientData) {
  const response = await fetch(`${API_URL}/patients`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(patientData),
    });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to add patient");
  }
  return data;
}

export async function getCaseSheet(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/case-sheet`);
  if (response.status === 404) { return null; }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch case sheet");
  }
  return data;
}

export async function createCaseSheet(patientId, caseSheet) {
  const response = await fetch(`${API_URL}/patients/${patientId}/case-sheet`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(caseSheet),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create case sheet");
  }
  return data;
}

export async function updateCaseSheet(patientId, caseSheet) {
  const response = await fetch(`${API_URL}/patients/${patientId}/case-sheet`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(caseSheet),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update case sheet");
  }
  return data;
}

export async function getAISummary(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/ai-summary`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to generate AI summary");
  }
  return data;
}