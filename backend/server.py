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
        response = gem_model.generate_content([f"Hello Gemini, I am working on creating a LinkedIn post that showcases my recent professional achievements. Attached is a photo of me receiving an award at our annual industry conference. I'd like you to help me draft a post that highlights this achievement, emphasizes the significance of the award within the tech industry, and reflects my gratitude towards my team and the organization. I aim to share my personal growth in this role and inspire my network with the importance of innovation and teamwork. Please ensure the language is professional yet engaging, suitable for a LinkedIn audience. Include a call to action that encourages my network to strive for excellence in their own fields. {context}", img_file])
        filepath = f"{UPLOAD_FOLDER}/{file.filename}"
        file.save(filepath)
        return jsonify({'message': f'File uploaded successfully to {filepath}', 'description': response.text}), 200


if __name__ == '__main__':
    app.run(port=5000)  # Flask will run on port 5000
