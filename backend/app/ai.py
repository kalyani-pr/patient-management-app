import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_ai_summary(patient, case_sheet, age):

    pain_level = (
        str(case_sheet.get("pain_level"))
        if case_sheet.get("pain_level") is not None
        else "Not provided"
    )

    other_observations = (
        case_sheet.get("other_observations")
        if case_sheet.get("other_observations")
        else "Not provided"
    )

    clinical_notes = (
        case_sheet.get("clinical_notes")
        if case_sheet.get("clinical_notes")
        else "Not provided"
    )

    recommended_care = (
        case_sheet.get("recommended_care")
        if case_sheet.get("recommended_care")
        else "Not provided"
    )

    prompt = f"""
You are an AI assistant for a dental patient management application.
Generate a concise clinical patient summary in natural language.

The summary must:
- Write exactly 2-3 concise sentences.
- Use natural, professional clinical language.
- Begin with the patient's age and presenting complaint.
- Mention the duration of the complaint.
- Mention the pain level only if it was provided.
- Include relevant investigation findings such as the affected tooth/area, examination findings, tenderness, sensitivity, and other observations.
- Incorporate the clinical diagnosis provided in the case sheet naturally.
- Treat the provided clinical diagnosis as the clinician's recorded diagnosis. Do not imply that the AI independently diagnosed the patient.
- If the findings support or are consistent with the recorded diagnosis, phrases such as "findings suggestive of..." or "consistent with..." may be used.
- Mention the recommended care only when it is provided.
- Use present or past tense naturally based on the context.
- Do not repeat the same information.
- Do not use headings.
- Do not use bullet points or numbered lists.
- Do not use markdown.
- Do not use phrases such as:
  "The clinical diagnosis is..."
  "According to the case sheet..."
  "The patient information indicates..."
- Do not invent symptoms, findings, diagnoses, treatments, medications, medical history, or recommendations.
- Do not provide new medical or dental advice.
- If an optional field is "Not provided", simply omit that information from the summary.
- Return ONLY the final summary paragraph.

Patien Information:
- Patient ID: {patient.get("patient_id")}
- Name: {patient.get("name")}
- Age: {age}
- Gender: {patient.get("gender")}
- Date of Birth: {patient.get("date_of_birth")}

Case Sheet Information:
- Chief Complaint: {case_sheet.get("chief_complaint")}
- Duration: {case_sheet.get("duration")}
- Pain Level: {pain_level}
- Tooth/Area: {case_sheet.get("affected_tooth_area")}
- Examination Findings: {case_sheet.get("examination_findings")}
- Tenderness: {case_sheet.get("tenderness")}
- Sensitivity: {case_sheet.get("sensitivity")}
- Other Observations:{other_observations}
- Clinical Diagnosis: {case_sheet.get("clinical_diagnosis")}
- Clinical Notes: {clinical_notes}
- Recommended Care: {recommended_care}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text