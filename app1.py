from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allows React to talk to Flask

# ── LOGIN ──────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data['email']
    password = data['password']

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (email, password)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "user_id": user['id'],
            "name":    user['name'],
            "role":    user['role'],
            "dept":    user['department']
        })
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401


# ── APPLY LEAVE ────────────────────────────────────────
@app.route('/api/apply', methods=['POST'])
def apply_leave():
    data       = request.get_json()
    user_id    = data['user_id']
    leave_type = data['leave_type']
    from_date  = data['from_date']
    to_date    = data['to_date']
    reason     = data['reason']

    from_dt = datetime.strptime(from_date, "%Y-%m-%d")
    to_dt   = datetime.strptime(to_date,   "%Y-%m-%d")
    days    = (to_dt - from_dt).days + 1

    if days < 1:
        return jsonify({"success": False, "message": "Invalid dates"}), 400

    conn   = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO leaves (user_id, leave_type, from_date, to_date, days, reason) VALUES (%s,%s,%s,%s,%s,%s)",
        (user_id, leave_type, from_date, to_date, days, reason)
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Leave applied successfully"})


# ── GET MY LEAVES (employee) ───────────────────────────
@app.route('/api/my-leaves/<int:user_id>', methods=['GET'])
def my_leaves(user_id):
    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM leaves WHERE user_id=%s ORDER BY applied_on DESC",
        (user_id,)
    )
    leaves = cursor.fetchall()
    conn.close()

    # convert dates to string so React can read them
    for l in leaves:
        l['from_date']   = str(l['from_date'])
        l['to_date']     = str(l['to_date'])
        l['applied_on']  = str(l['applied_on'])

    return jsonify(leaves)


# ── GET ALL LEAVES (admin) ─────────────────────────────
@app.route('/api/all-leaves', methods=['GET'])
def all_leaves():
    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT l.*, u.name as emp_name, u.department
        FROM leaves l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.applied_on DESC
    """)
    leaves = cursor.fetchall()
    conn.close()

    for l in leaves:
        l['from_date']  = str(l['from_date'])
        l['to_date']    = str(l['to_date'])
        l['applied_on'] = str(l['applied_on'])

    return jsonify(leaves)


# ── APPROVE / DECLINE (admin) ──────────────────────────
@app.route('/api/action/<int:leave_id>', methods=['POST'])
def action(leave_id):
    data   = request.get_json()
    status = data['status']   # 'approved' or 'declined'
    note   = data.get('note', '')

    conn   = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE leaves SET status=%s, admin_note=%s WHERE id=%s",
        (status, note, leave_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True})


if __name__ == '__main__':
    app.run(debug=True, port=5000)