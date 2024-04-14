from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from PIL import Image
from flask_cors import CORS, cross_origin

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

gem_model = genai.GenerativeModel("models/gemini-pro-vision")


UPLOAD_FOLDER = 'uploads'

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

@app.route('/upload' , methods=['POST'])
def upload():
    """ The backend function that handles the uploading of images to the Gemini API """
    if "file" not in request.files:
        return "No file part", 400

    file = request.files["file"]
    context = request.form.get("context")
    temp = request.form.get("tone")

    if file.filename == "":
        return "No selected file", 400
    if file:
        # If we have the file, we want to make Gemini describe it
        img_file = Image.open(file)
        response = gem_model.generate_content([f"Describe this image according to the given context: {context}", img_file])
        filepath = f"{UPLOAD_FOLDER}/{file.filename}"
        file.save(filepath)
        return jsonify({'message': f'File uploaded successfully to {filepath}', 'description': response.text}), 200


if __name__ == '__main__':
    app.run(port=5000)  # Flask will run on port 5000
