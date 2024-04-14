from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from PIL import Image
from flask_cors import CORS, cross_origin
from social_media import post_for_twitter, post_for_instagram, post_for_facebook
from google.generativeai.types import content_types
from collections.abc import Iterable


def tool_config_from_mode(mode: str, fns: Iterable[str] = ()):
    """Create a tool config with the specified function calling mode."""
    return content_types.to_tool_config(
        {"function_calling_config": {"mode": mode, "allowed_function_names": fns}}
    )

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)


social_media_funcs = [post_for_twitter, post_for_instagram, post_for_facebook]
available_funcs = ["post_for_twitter", "post_for_instagram", "post_for_facebook"]


instructions = """
You are a social media posting assistant for users. You can help users post to Twitter and Instagram.
Based on any context and image the user provides, you are to return a fitting post or caption for each 
social media platform according to the following JSON format:

{
    "twitter": {
        "description":
    },
    "instagram": {
        "description":
    },
    "facebook": {
        "description":
    }
}

Also, for each JSON key, the value should be in double quotes. Make sure there are no SINGLE QUOTES. 
Everything should be in proper JSON format, that is, in DOUBLE QUOTES.
"""
gem_model = genai.GenerativeModel("models/gemini-1.5-pro-latest", tools=social_media_funcs, system_instruction=instructions)



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
        chat = gem_model.start_chat(enable_automatic_function_calling=True)
        response = chat.send_message([f"Context: {context}", img_file], tool_config=tool_config_from_mode("any", available_funcs))
        filepath = f"{UPLOAD_FOLDER}/{file.filename}"
        file.save(filepath)
        return jsonify({'message': f'File uploaded successfully to {filepath}', 'description': response.text}), 200


if __name__ == '__main__':
    app.run(port=5000)  # Flask will run on port 5000
