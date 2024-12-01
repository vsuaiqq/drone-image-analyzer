import os
import subprocess
from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
import shutil
from flask_cors import CORS  # Импортируем CORS
import sys

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех источников

UPLOAD_FOLDER = 'uploads/'
RESULTS_FOLDER = 'static/results/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return 'Welcome to the YOLOv9 Image Processing API!'

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format"})
    
    filename = secure_filename(file.filename)
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(image_path)
    raw_confidence = request.form.get('threshold')
    print(f"Raw confidence: {raw_confidence}")
    sys.stdout.flush()

    confidence_threshold = float(request.form.get('threshold', 0.1))
    
    result_image_path = run_yolov9_detection(image_path, confidence_threshold)
    
    return send_file(result_image_path, mimetype='image/png', as_attachment=True)

def run_yolov9_detection(file_name, confidence_threshold):
    command = [
        'python', os.path.expanduser('src/model/detect.py'),
        '--img', '1280',
        '--conf', str(confidence_threshold),  # Confidence threshold
        '--weights', os.path.expanduser('src/model/runs/train/exp9/weights/best.pt'),
        '--source', file_name,
        '--project', os.path.expanduser('src/results/'),  # Output directory
        '--name', 'results',  # Folder name for results
        '--exist-ok'
    ]
    subprocess.run(command, check=True)
    
    result_image_path = os.path.join(os.path.expanduser('src/results/results'), os.path.basename(file_name)) 
    
    final_result_path = os.path.join(RESULTS_FOLDER, f'{os.path.splitext(os.path.basename(file_name))[0]}_processed_image.png')
    shutil.move(result_image_path, final_result_path)
    
    return final_result_path

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
