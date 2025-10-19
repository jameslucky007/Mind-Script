from flask import Flask, request, jsonify
import whisper
import os

app = Flask(__name__)
model = whisper.load_model("base") 

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)

    result = model.transcribe(filepath, fp16=False)
    return jsonify({"text": result["text"]})

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(port=5001, debug=True)
