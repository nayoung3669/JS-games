from flask import Flask, render_template, request, redirect, jsonify
from pymongo import MongoClient

import certifi
app = Flask(__name__, static_url_path='/static')

ca = certifi.where()


# 회원 정보를 저장할 변수
client = MongoClient('mongodb+srv://doyoung:1234@cluster0.uxlvcaa.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)

db = client['dbsparta']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mainpage')
def mainpage():
    return render_template('mainpage.html')

@app.route('/api/register', methods=['POST'])
def register():
    username = request.form['username']
    userId = request.form['userId']
    password = request.form['password']
    print("=========")
    print(username, userId, password)
    print("=========")

    
    # 회원 정보를 MongoDB에 저장
    user = {'username': username, 'id': userId, 'password': password}
    try:
        db.users.insert_one(user)
        return jsonify({"status" : "success", "msg" : "회원 가입 성공."})
    except:
        return jsonify({"status" : "error","msg" : "에러가 발생했습니다."})

@app.route('/api/login', methods=['POST'])
def login():
    userId = request.form['userId']
    password = request.form['password']
    
    
    # 회원 정보를 MongoDB에 저장
    user = db.users.find_one({'id': userId, 'password': password})
    if user is not None:
        return jsonify({"status" : "success", "msg" : "로그인 성공."})
    else :
        return jsonify({"status" : "error","msg" : "로그인 실패."})

@app.route('/signIn')
def signIn():
    return redirect('/')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5001, debug=True)