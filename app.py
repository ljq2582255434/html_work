from flask_cors import CORS
from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/index')
def index_page():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    student_id = data.get('student_id')
    password = data.get('password')

    if not student_id or not password:
        return jsonify({'success': False, 'message': '学号或密码不能为空'}), 400

    try:
        conn = sqlite3.connect('zjy.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM students WHERE student_id=?', (student_id,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': '该学号已注册'})

        cursor.execute('INSERT INTO students (student_id, student_name, password) VALUES (?, ?, ?)', (student_id, '', password))

        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print('注册出错:', e)
        return jsonify({'success': False, 'message': '服务器内部错误'}), 500

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    student_id = data.get('student_id')
    password = data.get('password')

    if not student_id or not password:
        return jsonify({'success': False, 'message': '缺少学号或密码'}), 400

    conn = sqlite3.connect('zjy.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students WHERE student_id=? AND password=?', (student_id, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        student_name = user[1]  # student_name 是第二列
        is_admin = (student_id == "24560641340" and password == "2582255434")
        return jsonify({'success': True, 'student_name': student_name, 'is_admin': is_admin})
    else:
        return jsonify({'success': False, 'message': '学号或密码错误'}), 401

@app.route('/saveStudentGrade', methods=['POST', 'OPTIONS'])
def save_student_grade():
    if request.method == 'OPTIONS':
        # 预检请求直接返回 200
        return jsonify({'message': 'CORS preflight OK'}), 200

    data = request.get_json()
    student_id = data.get('student_id')
    course_name = data.get('course')
    grade = data.get('score')
    

    if not student_id or not course_name or grade is None:
        return jsonify({'success': False, 'message': '参数不完整'}), 400

    try:
        conn = sqlite3.connect('zjy.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT OR REPLACE INTO grades (student_id, course, score) VALUES (?, ?, ?)',
            (student_id, course_name, grade)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print('保存成绩出错:', e)
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/getMultiTableData')
def get_multi_table_data():
    student_id = request.args.get('student_id')
    is_admin = request.args.get('is_admin') == 'true'

    print("is_admin:", is_admin)
    print("student_id:", student_id)

    if not student_id:
        return jsonify({'error': '缺少学号'}), 400

    table_names = request.args.get('tables')
    if not table_names:
        return jsonify({'error': '缺少参数: tables'}), 400

    table_list = [name.strip() for name in table_names.split(',')]
    allowed_tables = ['students', 'grades']
    data = {}

    try:
        conn = sqlite3.connect('zjy.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        if not is_admin:
            # 获取学生成绩
            cursor.execute('SELECT * FROM grades WHERE student_id=?', (student_id,))
            grades = cursor.fetchall()
            data['grades'] = [dict(row) for row in grades]

            # 获取学生基本信息
            cursor.execute('SELECT student_id, student_name FROM students WHERE student_id=?', (student_id,))
            student = cursor.fetchone()
            if student:
                data['students'] = [dict(student)]
        else:
            for table in table_list:
                if table not in allowed_tables:
                    data[table] = {'error': f'非法表名: {table}'}
                    continue
                cursor.execute(f'SELECT * FROM {table}')
                rows = cursor.fetchall()
                data[table] = [dict(row) for row in rows]

        conn.close()
        return jsonify(data)

    except Exception as e:
        print('查询出错:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
