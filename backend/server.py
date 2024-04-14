from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from PIL import Image
from flask_cors import CORS, cross_origin
from social_media import *
from google.generativeai.types import content_types
from collections.abc import Iterable
from helper_functions import parse_gemini_output


def tool_config_from_mode(mode: str, fns: Iterable[str] = ()):
    """Create a tool config with the specified function calling mode."""
    return content_types.to_tool_config(
        {"function_calling_config": {"mode": mode, "allowed_function_names": fns}}
    )

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)


social_media_funcs = [post_for_reddit, post_for_facebook, post_for_linkedin, post_for_twitter, post_for_discord, post_for_instagram]
available_funcs = ["post_for_reddit", "post_for_facebook", "post_for_linkedin", "post_for_twitter", "post_for_discord", "post_for_instagram"]


instructions = """
You are a social media posting assistant for users. You can help users post to the social media platforms mentioned. Also, take the temperature into account when generating the posts. 0.0 being more predictable while 1.0 being more experimental.

When given any context and an image, your task is to generate a fitting post or caption for each social media platform. Please provide the posts or captions in the following format:

Reddit: Your generated post for Reddit goes here.
Facebook: Your generated post for Facebook goes here.
Linkedin: Your generated post for Linkedin goes here.
Twitter: Your generated post for Twitter goes here.
Discord: Your generated post for Discord goes here.
Instagram: Your generated post for Instagram goes here.
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
        # filepath = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
        # print(f"FILENAME IS {file.filename}")
        # file.save(filepath)
        # img_upload = genai.upload_file(path=filepath, display_name=file.filename)
        # img_file = genai.get_file(name=file.filename)
        img_file = Image.open(file)
        chat = gem_model.start_chat(enable_automatic_function_calling=True)
        response = chat.send_message([f"Context: {context}, Temperature:{temp}", img_file], tool_config=tool_config_from_mode("any", available_funcs))
        filepath = f"{UPLOAD_FOLDER}/{file.filename}"
        file.save(filepath)
        return jsonify({'message': f'File uploaded successfully to {filepath}', 'description': parse_gemini_output(response.text)}), 200


if __name__ == '__main__':
    app.run(port=5000)  # Flask will run on port 5000
