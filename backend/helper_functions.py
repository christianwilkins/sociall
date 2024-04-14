import json

def parse_gemini_output(output: str) -> dict:
    """
    Parse the output from the Gemini API and return a JSON with the social media posts
    """
    lines = output.split("\n")
    result = {}
    for line in lines:
        if line.startswith("Twitter:"):
            result["twitter"] = {"description": line[len("Twitter:"):].strip()}
        elif line.startswith("Instagram:"):
            result["instagram"] = {"description": line[len("Instagram:"):].strip()}
        elif line.startswith("Facebook:"):
            result["facebook"] = {"description": line[len("Facebook:"):].strip()}
            
    return json.dumps(result)