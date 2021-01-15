import time
import os, os.path
from flask import Flask
from flask import request
from flask_cors import CORS
from pathlib import Path
import purseiner_roi
import purseiner_video_counting
import purseiner_webcam_counting
import purseiner_picture_counting
import save_frozen_graph
import test_model_v2

app = Flask(__name__)
CORS(app)

@app.route('/flask_api/time', methods=['GET'])
def get_current_time():
    return { 'time': time.time() }

@app.route('/flask_api/videoroicountfish', methods=['POST'])
def get_result_video_roi_counting_fish():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model = url_input_video_and_dir.get('model')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_roi.purseiner_roi_process(video, folder_images, model)

@app.route('/flask_api/videocountfish', methods=['POST'])
def get_result_video_counting_fish():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model = url_input_video_and_dir.get('model')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_video_counting.purseiner_video_counting_process(video, folder_images, model)

@app.route('/flask_api/webcamcountfish', methods=['POST'])
def get_result_webcam_counting_fish():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model = url_input_video_and_dir.get('model')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_webcam_counting.purseiner_webcam_counting_process(video, folder_images, model)

@app.route('/flask_api/picturecountfish', methods=['POST'])
def get_result_picture_counting_fish():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model = url_input_video_and_dir.get('model')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_picture_counting.purseiner_picture_counting_process(video, folder_images, model)

@app.route('/flask_api/savefrozengraph')
def get_save_frozen_graph():
    save_frozen_graph.save_frozen_graph_process()
    return { 'result': 'ok' }

@app.route('/flask_api/testmodelv2ckpt')
def get_test_model_v2_ckpt():
    test_model_v2.test_model_v2_ckpt_process()
    return { 'result': 'ok' }

@app.route('/flask_api/testmodelv2savedmodel')
def get_test_model_v2_saved_model():
    test_model_v2.test_model_v2_saved_model_process()
    return { 'result': 'ok' }
