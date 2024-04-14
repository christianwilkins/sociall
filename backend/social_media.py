"""
File that contains the Gemini Functions for each social media we are supporting
"""


def post_for_twitter(context: str):
    """
    Based on the context provided, write a fitting tweet
    """
    print(f"Based on this context: {context}, write a tweet that is perfectly fit for posting on Twitter.")


def post_for_instagram(context: str):
    """
    Based on the context provided, write a fitting Instagram post that is a little informal.
    """
    print(f"Based on the context: {context}, give a nice caption for Instagram.")

def post_for_facebook(context: str):
    """
    Based on the context provided, write a fitting Facebook post that is kind of old-fashioned
    """
    print(f"A fitting post for Facebook based on the context: {context}. It would basically appeal to older people")


