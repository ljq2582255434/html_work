from flask_cors import CORS
from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():  # 修改为register
    return render_template('register.html')

@app.route('/index')
def index_page():  # 修改为index_page
    return render_template('index.html')

@app.route('/getMultiTableData')
def get_multi_table_data():
    table_names = request.args.get('tables')  # 比如 "students,grades"
    if not table_names:
        return jsonify({'error': '缺少参数: tables'}), 400

    table_list = [name.strip() for name in table_names.split(',')]
    allowed_tables = ['students', 'grades']  # 安全白名单
    data = {}

    try:
        conn = sqlite3.connect('zjy.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

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
        print('X 查询出错:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
