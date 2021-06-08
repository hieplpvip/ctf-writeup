import json
from flask import Flask, render_template, request

app = Flask(__name__)

with open("flag.txt", "r") as f:
    flag = f.read()


@app.route("/")
def index():
    file_list = glob.glob("characters/*")
    file_list.sort()
    character_list = []
    for file in file_list:
        with open(file, "r") as f:
            character = json.loads(f.read())
        character_list.append(character)
    return render_template("index.html", character_list=character_list)


@app.route("/character")
def character():
    slug = request.args.get("name")
    with open("characters/" + slug, "r") as f:
        data = f.read()
    if flag in data:
        return "No flag for you! Checkmate!"
    return render_template("character.html", data=data)


if __name__ == "__main__":
    app.run("0.0.0.0", 3000, debug=True)
