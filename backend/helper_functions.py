import json

def parse_gemini_output(output: str) -> dict:
    """
    Parse the output from the Gemini API and return a JSON with the social media posts
    """
    lines = output.split("\n")
    result = {}
    for line in lines:
        if line.startswith("Reddit:"):
            result["Reddit"] = {"description": line[len("Reddit:"):].strip()}
        elif line.startswith("Facebook:"):
            result["Facebook"] = {"description": line[len("Facebook:"):].strip()}
        elif line.startswith("Linkedin:"):
            result["Linkedin"] = {"description": line[len("Linkedin:"):].strip()}
        elif line.startswith("Twitter:"):
            result["Twitter"] = {"description": line[len("Twitter:"):].strip()}
        elif line.startswith("Discord:"):
            result["Discord"] = {"description": line[len("Discord:"):].strip()}
        elif line.startswith("Instagram:"):
            result["instagram"] = {"description": line[len("Instagram:"):].strip()}


    return json.dumps(result)