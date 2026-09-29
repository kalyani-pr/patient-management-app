# Patient Management Application

## Live demo
### Frontend:
https://patient-management-app-1-yozq.onrender.com

### Backend API:
https://patient-management-app-enco.onrender.com

## 1. Project Overview
A full-stack dental patient management web application for managing patient records, maintaining dental case sheets, and generating AI-powered patient summaries. The Patient Management Application provides a simple interface for managing dental patient information.

### Main features
- View a list of patients
- Add new patients
- View individual patient profiles
- Create and update dental case sheets
- Record clinical findings and investigation details
- Generate an AI-based summary from the patient's case sheet
- Store patient and case sheet information in MongoDB

### Application Flow
Patient list -> Patient profile -> Case sheet -> Generate AI summary

## 2. Technologies Used
### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- PyMongo

### Database
- MongoDB Atlas

### AI
- Gemini AI API for generating patient summaries

## 3. Frontend Setup

Navigate to the frontend directory:
> cd frontend

Install the required Node.js dependencies:
> npm install

Start the development server:
> npm run dev

The frontend will normally be available at: http://localhost:5173

## 4. Backend Setup
Navigate to the backend directory:
> cd backend

Create and activate a Python virtual environment:
> python3 -m venv .venv

> source .venv/bin/activate

Install the required Python packages:
> pip install -r requirements.txt

Start the FastAPI server:
> uvicorn app.main:app --reload

The backend will normally be available at: http://127.0.0.1:8000

FastAPI's interactive API documentation is available at: http://127.0.0.1:8000/docs

## 5. MongoDB Setup
The application uses MongoDB Atlas as the database.

### Steps
1. Create a MongoDB Atlas account.
2. Create a MongoDB cluster.
3. Create a database user.
4. Add the IP address of the machine running the backend to the Atlas Network Access list.
5. Obtain the MongoDB connection string.
6. Add the connection string to the backend environment variables.

The application uses MongoDB to store:
- Patient information
- Case sheet information
- Patient ID counters

## 6. Environment Variables Required
Create a `.env` file inside the `backend` directory.

Example:
MONGODB_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

Replace the placeholder values with your own credentials.

## 7. AI API Setup
The application uses Googel's Gemini AI API to generate a concise patient summary from the information entered in the patient's case sheet.

To enable the AI summary features:
1. Create a Gemini API key.
2. Create a `.env` file inside the `backend` directory.
3. Add the API key using the `GEMINI_API_KEY` variable.
4. Start the FastAPI backend.
5. Open a patient's case sheet.
6. Click **Generate AI Summary**.

The generated summary is based on the information entered in the patient's case sheet.

## 8. Steps to Run the Application Locally
### Step 1: Clone the repository
> git clone https://github.com/kalyani-pr/patient-management-app.git

> cd patient-management-app

### Step 2: Set up the backend
> cd backend

> python3 -m venv .venv

> source .venv/bin/activate

> pip install -r requirements.txt

Create the `.env` file and configure the required environment variables.

Start the backend:
> uvicorn app.main:app --reload

### Step 3: Set up the frontend
Open another terminal and navigate to the project:
> cd patient-management-app/frontend

Install dependencies:
> npm install

Start the frontend:
> npm run dev

### Step 4: Open the application
Open the frontend URL shown by Vite, normally:
http://localhost:5173

## 9. Assumptions and Known Limitations
- The application is intended as a demonstration/assessment project.
- Authentication and role-based access control are not implemented.
- MongoDB Atlas access must be configured for the machine running the backend.
- The application currently uses environment variables for database and AI API credentials.
- The frontend and backend are run separately during local development.
- The AI-generated summary is intended as an informational summary of the entered case sheet and should not replace professional clinical judgment.
- The application currently uses a local development configuration and requires additional deployment configuration for production hosting.
- Patient data should be handled securely and appropriate privacy and security measures should be implemented before production use.