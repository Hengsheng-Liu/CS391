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
3. Run the following command to start the database container:

   ```bash
   docker-compose up
4. Navigate to the server folder and install the Python dependencies:
   - **pipenv install**
5. Start the FastAPI server:
   - **pipenv run python main.py**
6. Navigate to the client folder and start the frontend application:
   - **npm run dev**

Frontend (Client): http://localhost:3000
Backend (Server): http://localhost:8000
