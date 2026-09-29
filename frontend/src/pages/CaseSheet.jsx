import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCaseSheet, createCaseSheet, updateCaseSheet, getAISummary, } from "../services/api";

const emptyCaseSheet = {
    chief_complaint: "",
    duration: "",
    pain_level: "",
    affected_tooth_area: "",
    examination_findings: "",
    tenderness: "",
    sensitivity: "",
    other_observations: "",
    clinical_diagnosis: "",
    clinical_notes: "",
    recommended_care: "",
};

function CaseSheet() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [caseSheet, setCaseSheet] = useState(emptyCaseSheet);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [aiSummary, setAiSummary] = useState("");
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [hasCaseSheet, setHasCaseSheet] = useState(false);

    const loadCaseSheet = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCaseSheet(patientId);

            if (data) {
                setHasCaseSheet(true);
                setCaseSheet({
                    chief_complaint: data.chief_complaint || "",
                    duration: data.duration || "",
                    pain_level: data.pain_level ?? "",
                    affected_tooth_area: data.affected_tooth_area || "",
                    examination_findings: data.examination_findings || "",
                    tenderness: data.tenderness || "",
                    sensitivity: data.sensitivity || "None",
                    other_observations: data.other_observations || "",
                    clinical_diagnosis: data.clinical_diagnosis || "",
                    clinical_notes: data.clinical_notes || "",
                    recommended_care: data.recommended_care || "",
                });

                setEditing(false);
            } else {
                setHasCaseSheet(false);
                setEditing(true);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [patientId]);
    useEffect(() => {
        loadCaseSheet();
    }, [loadCaseSheet]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setCaseSheet((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
    };

    const handleSave = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const dataToSend = {
                ...caseSheet,
                pain_level:
                    caseSheet.pain_level === ""
                        ? null
                        : Number(caseSheet.pain_level),
            };

            if (hasCaseSheet) {
                await updateCaseSheet(
                    patientId,
                    dataToSend
                );
            } else {
                await createCaseSheet(
                    patientId,
                    dataToSend
                );

                setHasCaseSheet(true);
            }

            setEditing(false);
            setSuccess("Case sheet saved successfully.");

            await loadCaseSheet();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateSummary = async () => {
        try {
            setGeneratingSummary(true);
            setSummaryError("");
            setAiSummary("");

            const data = await getAISummary(patientId);

            setAiSummary(data.summary);
        } catch (err) {
            console.error(err);

            setSummaryError(
                err.message || "Failed to generate AI summary."
            );
        } finally {
            setGeneratingSummary(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="message">
                    Loading case sheet...
                </div>
            </div>
        );
    }

    return (
        <div className="case-sheet-page">
            <button
                className="back-button"
                onClick={() =>
                    navigate(`/patients/${patientId}`)
                }
            >
                ← Back to Patient
            </button>

            <div className="case-sheet-header">
                <div>
                    <h3>Patient Case Sheet</h3>
                    <span className="profile-patient-id">
                        {patientId}
                    </span>
                </div>

                {!editing && (
                    <button
                        className="edit-button"
                        onClick={() => {
                            setEditing(true);
                            setSuccess("");
                        }}
                    >
                        Edit
                    </button>
                )}
            </div>

            {error && (
                <div className="case-sheet-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="case-sheet-success">
                    {success}
                </div>
            )}

            <form
                className="case-sheet-form"
                onSubmit={handleSave}
            >
                <div className="case-section">
                    <h3>Chief Complaint</h3>

                    <div className="form-group">
                        <label htmlFor="chief_complaint">
                            Chief Complaint <span className="required">*</span>
                        </label>

                        <textarea
                            id="chief_complaint"
                            name="chief_complaint"
                            value={caseSheet.chief_complaint}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter the patient's main complaint"
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="duration">
                                Duration <span className="required">*</span>
                            </label>

                            <input
                                id="duration"
                                name="duration"
                                type="text"
                                value={caseSheet.duration}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="e.g. 3 days"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pain_level">
                                Pain Level
                            </label>

                            <input
                                id="pain_level"
                                name="pain_level"
                                type="number"
                                min="1"
                                max="10"
                                value={caseSheet.pain_level}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="1 - 10"
                            />
                        </div>
                    </div>
                </div>

                <div className="case-section">
                    <h3>Investigation</h3>

                    <div className="form-group">
                        <label htmlFor="affected_tooth_area">
                            Tooth / Area <span className="required">*</span>
                        </label>

                        <input
                            id="affected_tooth_area"
                            name="affected_tooth_area"
                            type="text"
                            value={caseSheet.affected_tooth_area}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="e.g. Lower right first molar"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="examination_findings">
                            Clinical Findings <span className="required">*</span>
                        </label>

                        <textarea
                            id="examination_findings"
                            name="examination_findings"
                            value={caseSheet.examination_findings}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter examination findings"
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tenderness">
                                Tenderness <span className="required">*</span>
                            </label>

                            <select
                                id="tenderness"
                                name="tenderness"
                                value={caseSheet.tenderness}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            >
                                <option value="">
                                    Select
                                </option>

                                <option value="Yes">
                                    Yes
                                </option>

                                <option value="No">
                                    No
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sensitivity">
                                Sensitivity <span className="required">*</span>
                            </label>

                            <select
                                id="sensitivity"
                                name="sensitivity"
                                value={caseSheet.sensitivity}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            >
                                <option value="">
                                    Select
                                </option>

                                <option value="Hot">
                                    Hot
                                </option>

                                <option value="Cold">
                                    Cold
                                </option>

                                <option value="Both">
                                    Both
                                </option>

                                <option value="None">
                                    None
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="other_observations">
                            Other Observations
                        </label>

                        <textarea
                            id="other_observations"
                            name="other_observations"
                            value={caseSheet.other_observations}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Any additional observations"
                            rows="2"
                        />
                    </div>
                </div>

                <div className="case-section">
                    <h3>Diagnosis</h3>

                    <div className="form-group">
                        <label htmlFor="clinical_diagnosis">
                            Clinical Diagnosis <span className="required">*</span>
                        </label>

                        <textarea
                            id="clinical_diagnosis"
                            name="clinical_diagnosis"
                            value={caseSheet.clinical_diagnosis}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter clinical diagnosis"
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clinical_notes">
                            Clinical Notes
                        </label>

                        <textarea
                            id="clinical_notes"
                            name="clinical_notes"
                            value={caseSheet.clinical_notes}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Additional clinical notes"
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="recommended_care">
                            Recommended Care
                        </label>

                        <textarea
                            id="recommended_care"
                            name="recommended_care"
                            value={caseSheet.recommended_care}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Recommended treatment or follow-up"
                            rows="2"
                        />
                    </div>
                </div>

                {editing && (
                    <div className="case-sheet-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                loadCaseSheet();
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Case Sheet"}
                        </button>
                    </div>
                )}
            </form>

            <div className="ai-summary-section">
                <div className="ai-summary-header">
                    <button
                        type="button"
                        className="generate-summary-button"
                        onClick={handleGenerateSummary}
                        disabled={generatingSummary || editing}
                    >
                        {generatingSummary
                            ? "Generating..."
                            : "Generate AI Summary"}
                    </button>
                </div>

                {summaryError && (
                    <div className="case-sheet-error">
                        {summaryError}
                    </div>
                )}

                {aiSummary && (
                    <div className="ai-summary-card">
                        <p>{aiSummary}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CaseSheet;