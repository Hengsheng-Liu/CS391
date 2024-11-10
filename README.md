# Spark Bytes

**Project Title:** Spark Bytes  
**Project Plan:** [Link to Project Plan](https://docs.google.com/document/d/10pkAZIoFl5MzBUSwCCxR0NGx_LZfaYNjJFyO7zmyBfA/edit)

### Overview
Spark Bytes is a full-stack application designed to showcase seamless integration between a Next.js frontend and a FastAPI backend. The layout and design are planned using Draw.IO, creating a clear visual structure for the application's architecture.

#### Technologies Used:
- **Frontend:** Next.js, React
- **Backend:** FastAPI, Python
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **Package Management:** Pipenv (Python), npm (JavaScript)

### Prerequisites
Ensure that you have Docker and Docker Compose installed on your system to easily build and deploy the application. Additionally, you will need `pipenv` for managing Python dependencies.

### Running the Project

1. Clone the repository and navigate to the project directory.
2. Ensure you have `pipenv` installed. You can find installation instructions here: [Pipenv Installation](https://pipenv.pypa.io/en/latest/installation.html).
4. Run the following command to start the database container:
   ```bash
   docker compose up
5. Navigate to the server folder and install the Python dependencies:
   ```bash 
   pipenv install
6. Start the FastAPI server:
   ```bash
   pipenv run python main.py
7. Navigate to the client folder and install need packages:
   ```bash
   npm install
8. Start the Front end application:
   ```bash
   npm run dev

- #### Frontend (Client):
   ```bash
   http://localhost:3000
- #### Backend (Server):
   ```bash
   http://localhost:8000

