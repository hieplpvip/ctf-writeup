
from flask import Flask
from flask import request
from flask import render_template_string

app = Flask(__name__)

@app.errorhandler(404)
def hello(e):
    return render_template_string(f'<h1>Sorry {request.path} is under construction. Please try again later</h1>'), 404

if __name__ == '__main__':
    app.run(port=5000)
