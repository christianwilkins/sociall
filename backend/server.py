from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

@app.route('/upload' , methods=['POST'])
def upload_file():
    if "file" not in request.files:
        return "No file part", 400

    file = request.files["file"]
    if file.filename == "":
        return "No selected file", 400
    if file:
        filepath = f"{UPLOAD_FOLDER}/{file.filename}"
        file.save(filepath)
        return f'File uploaded successfully to {filepath}', 200

if __name__ == '__main__':
    app.run(port=5000)  # Flask will run on port 5000
