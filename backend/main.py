from flask import Flask, request, send_from_directory, render_template

app = Flask(__name__)

@app.route("/")
def hello():
    return "Donald Trump Bingo."