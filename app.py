from flask_cors import CORS
from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)
CORS(app)  # 启用跨域

@app.route('/')
def index():
    return render_template('index.html')  # 确保你有 templates/index.html 文件

@app.route('/getTableData')
def get_table_data():
    table_name=request.args.get('table')  # 从URL参数中获取表名
    if not table_name:
        return jsonify({'error':'缺少参数: table'}),400

    try:
        conn=sqlite3.connect('zjy.db')
        conn.row_factory=sqlite3.Row  # 支持字段名取值
        cursor=conn.cursor()
        cursor.execute(f'SELECT * FROM {table_name}')
        rows=cursor.fetchall()
        conn.close()

        data=[dict(row)for row in rows]
        return jsonify(data)

    except Exception as e:
        print('X 获取数据出错:',e)
        return jsonify({'error':str(e)}),500

if __name__=='__main__':
    app.run(debug=True,port=5002)
