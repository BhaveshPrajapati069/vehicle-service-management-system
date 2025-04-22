
# Vehicle Service Management System 🚗🛠️

This is a full-stack Vehicle Service Management System built with Django for the backend and React.js for the frontend, styled with Bootstrap. It allows users to register vehicles and components, log issues, perform services, simulate payments, and visualize revenue data.

---

## 🚀 Features

- Register and list vehicles and components.
- Report vehicle issues and view reported issues.
- Log services, use new components, and calculate total cost.
- Simulate payments for services.
- Display revenue summary with charts.
- Auto-refresh UI with real-time updates.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Bootstrap 5
- **Backend:** Django, Django REST Framework
- **Database:** SQLite (default), can be configured for PostgreSQL/MySQL

---

## 📦 Installation & Setup

### Backend (Django)

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000/`

---

### Frontend (React)

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000/`




## 📁 Project Structure

```
/backend         # Django backend
/frontend        # React frontend
```


