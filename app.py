


from flask import Flask, request, jsonify, session, render_template, redirect, url_for
import mysql.connector
import secrets
from flask_cors import CORS
import google.generativeai as genai
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Allow frontend (if on another port) to access backend
app.secret_key = 'your_secret_key'

# -------------------- GEMINI + RULES --------------------

#GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
GEMINI_API_KEY = your_new_api_key_here

genai.configure(api_key=GEMINI_API_KEY)

try:
    with open("rules.json", "r", encoding="utf-8") as f:
        rules = json.load(f)
except FileNotFoundError:
    rules = {}
    print("⚠ rules.json not found. Only Gemini will work.")

# -------------------- DATABASE CONNECTION --------------------
mydb = mysql.connector.connect(
    host="localhost",
    user="Manasvi",        # your MySQL username
    password="manasvi",    # your MySQL password
    database="ayursetu"    # your DB name
)

# -------------------- PAGES --------------------
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/login-page')
def login_page():
    return render_template('login.html')

@app.route('/register-page')
def register_page():
    return render_template('register.html')



# -------------------- LOGIN --------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    cursor = mydb.cursor(dictionary=True)

    table = None
    if role == "admin":
        table = "admins"
    elif role == "doctor":
        table = "doctors"
    elif role == "patient":
        table = "patients"
    else:
        return jsonify({"message": "Invalid role"}), 400

    cursor.execute(f"SELECT * FROM {table} WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()

    if user:
        token = secrets.token_hex(16)
        session['user'] = {
            "email": user["email"],
            "role": role,
            "token": token
        }

        return jsonify({"message": "Login successful", "token": token, "redirect": f"/dashboard/{role}"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# -------------------- REGISTER --------------------
# -------------------- REGISTER --------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fullName = data.get("fullName")   # Only one field now
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role")

    cursor = mydb.cursor(dictionary=True)

    if role == "admin":
        table = "admins"
        values = (fullName, email, phone, password)
        insert_query = f"""
            INSERT INTO {table} (fullName, email, phone, password)
            VALUES (%s, %s, %s, %s)
        """

    elif role == "doctor":
        table = "doctors"
        specialization = data.get("specialization")
        qualification = data.get("qualification")

        if not specialization or not qualification:
            return jsonify({"message": "Specialization and qualification required"}), 400

        values = (fullName, email, phone, password, specialization, qualification)
        insert_query = f"""
            INSERT INTO {table} (fullName, email, phone, password, specialization, qualification)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

    elif role == "patient":
        table = "patients"
        address = data.get("address")
        problem = data.get("problem")
        history = data.get("history")

        if not address or not problem:
            return jsonify({"message": "Address and problem required"}), 400

        values = (fullName, email, phone, password, address, problem, history)
        insert_query = f"""
            INSERT INTO {table} (fullName, email, phone, password, address, problem, history)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

    else:
        return jsonify({"message": "Invalid role"}), 400

    # Check if email already exists
    cursor.execute(f"SELECT * FROM {table} WHERE email=%s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"message": "Email already registered"}), 400

    cursor.execute(insert_query, values)
    mydb.commit()

    token = secrets.token_hex(16)
    session['user'] = {"email": email, "role": role, "token": token}

    return jsonify({
        "message": f"{role.capitalize()} registered successfully",
        "token": token,
        "redirect": f"/dashboard/{role}"
    }), 201

# -------------------- DASHBOARD API --------------------
@app.route('/dashboard', methods=['GET'])
def dashboard():
    if "user" in session:
        return jsonify({
            "message": f"Welcome {session['user']['email']}!",
            "role": session['user']['role']
        }), 200
    return jsonify({"message": "Unauthorized"}), 401
from datetime import datetime

@app.route('/api/stats')
def get_stats():
    cursor = mydb.cursor(dictionary=True)

    # Doctors
    cursor.execute("SELECT COUNT(*) AS total_doctors FROM doctors")
    total_doctors = cursor.fetchone()["total_doctors"]

    cursor.execute("""
        SELECT COUNT(*) AS new_doctors
        FROM doctors
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    """)
    new_doctors = cursor.fetchone()["new_doctors"]

    # Patients
    cursor.execute("SELECT COUNT(*) AS total_patients FROM patients")
    total_patients = cursor.fetchone()["total_patients"]

    cursor.execute("""
        SELECT COUNT(*) AS new_patients
        FROM patients
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    """)
    new_patients = cursor.fetchone()["new_patients"]

    cursor.close()
    return jsonify({
        "total_doctors": total_doctors,
        "new_doctors": new_doctors,
        "total_patients": total_patients,
        "new_patients": new_patients
    })

# -------------------- LOGOUT --------------------
@app.route('/logout', methods=['POST'])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out successfully"}), 200
@app.route('/api/doctor-profile', methods=['GET'])
def doctor_profile():
    if "user" not in session or session['user']['role'] != "doctor":
        return jsonify({"message": "Unauthorized"}), 401

    email = session['user']['email']
    cursor = mydb.cursor(dictionary=True)
    cursor.execute("SELECT id, fullName, email, phone, specialization, qualification, created_at FROM doctors WHERE email=%s", (email,))
    doctor = cursor.fetchone()
    cursor.close()

    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    return jsonify(doctor)

@app.route('/api/recent-activities', methods=['GET'])
def recent_activities():
    cursor = mydb.cursor(dictionary=True)

    # Fetch last 5 doctors
    cursor.execute("""
        SELECT fullName AS name, 'doctor' AS type, created_at
        FROM doctors
        ORDER BY created_at DESC
        LIMIT 5
    """)
    doctors = cursor.fetchall()

    # Fetch last 5 patients
    cursor.execute("""
        SELECT fullName AS name, 'patient' AS type, created_at
        FROM patients
        ORDER BY created_at DESC
        LIMIT 5
    """)
    patients = cursor.fetchall()

    cursor.close()

    # Merge & sort
    activities = doctors + patients
    activities.sort(key=lambda x: x["created_at"], reverse=True)

    return jsonify(activities)

#----------------------------------
@app.route('/index')
def index():
    return render_template('index.html')
#-------------------------------
@app.route('/dashboard/admin')
def admin_dashboard():
    if "user" in session and session['user']['role'] == "admin":
        return render_template('dashboards/admin.html', user=session['user'])
    return redirect(url_for('login_page'))

@app.route('/dashboard/doctor')
def doctor_dashboard():
    if "user" in session and session['user']['role'] == "doctor":
        return render_template('dashboards/doctor.html', user=session['user'])
    return redirect(url_for('login_page'))


# Get all patients (for dropdown)


# Add new schedule

# Get today's schedule for doctor
@app.route("/api/schedule/<int:doctor_id>")
def get_doctor_schedule(doctor_id):
    cursor = mydb.cursor(dictionary=True)
    sql = """
        SELECT ds.*, p.fullName as patient_name 
        FROM doctor_schedule ds
        JOIN patients p ON ds.patient_id = p.id
        WHERE ds.doctor_id=%s
        ORDER BY ds.schedule_date, ds.schedule_time
    """
    cursor.execute(sql, (doctor_id,))
    schedules = cursor.fetchall()
    cursor.close()
    return jsonify(schedules)
@app.route('/dashboard/patient')
def patient_dashboard():
    if "user" in session and session['user']['role'] == "patient":
        return render_template('dashboards/patient.html', user=session['user'])
    return redirect(url_for('login_page'))


@app.route("/api/add-schedule", methods=["POST"])


def add_schedule():
    data = request.get_json()
    cursor = mydb.cursor()
    sql = """
        INSERT INTO doctor_schedule
        (doctor_id, patient_id, schedule_date, schedule_time, prescription, dont_do, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data["doctor_id"],
        data["patient_id"],
        data["schedule_date"],
        data["schedule_time"],
        data.get("prescription", ""),
        data.get("dont_do", ""),
        "pending"
    )
    cursor.execute(sql, values)
    mydb.commit()
    cursor.close()
    return jsonify({"message": "Schedule added successfully"}), 201


# Get list of patients (for dropdown)
@app.route("/api/patients", methods=["GET"])
def get_patients():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, fullName FROM patients")
    patients = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(patients)

import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="Manasvi",        # your MySQL username
        password="manasvi",    # your MySQL password
        database="ayursetu"    # your DB name
    )

@app.route('/api/schedule/<int:doctor_id>', methods=['GET'])
def get_schedule(doctor_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT ds.id, ds.schedule_date, ds.schedule_time, ds.prescription, ds.dont_do, ds.status,
               p.fullName AS patient_name, p.phone, p.problem, p.id AS patient_id
        FROM doctor_schedule ds
        JOIN patients p ON ds.patient_id = p.id
        WHERE ds.doctor_id = %s
        ORDER BY ds.schedule_date, ds.schedule_time
    """
    cursor.execute(query, (doctor_id,))
    schedules = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(schedules)


@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "").lower().strip()

    # Rule-based lookup
    for key, answer in rules.items():
        if key in user_msg:
            return jsonify({"reply": answer})

    # Gemini fallback
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_msg)
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"reply": f"⚠ Error: {str(e)}"})



   

# -------------------- RUN SERVER --------------------
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
