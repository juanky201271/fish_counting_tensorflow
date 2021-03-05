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
import purseiner_picture_calibration
import save_frozen_graph
import test_model_v2
import cv2
import boto3

app = Flask(__name__)
CORS(app)

@app.route('/flask_api/time', methods=['GET'])
def get_current_time():
    return { 'time': time.time() }

@app.route('/flask_api/videoroicountfishlocaly', methods=['POST'])
def get_result_video_roi_counting_fish_localy():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_roi.purseiner_roi_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)

@app.route('/flask_api/videoroicountfishawss3', methods=['POST'])
def get_result_video_roi_counting_fish_awss3():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = 'submits/' + url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_roi.purseiner_roi_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)


@app.route('/flask_api/picturecountfishlocaly', methods=['POST'])
def get_result_picture_counting_fish_localy():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_picture_counting.purseiner_picture_counting_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)

@app.route('/flask_api/picturecountfishawss3', methods=['POST'])
def get_result_picture_counting_fish_awss3():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = 'submits/' + url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_picture_counting.purseiner_picture_counting_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)


@app.route('/flask_api/videocountfishlocaly', methods=['POST'])
def get_result_video_counting_fish_localy():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_video_counting.purseiner_video_counting_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)

@app.route('/flask_api/videocountfishawss3', methods=['POST'])
def get_result_video_counting_fish_awss3():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = 'submits/' + url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        width_cms = url_input_video_and_dir.get('width_cms')
        width_pxs_x_cm = url_input_video_and_dir.get('width_pxs_x_cm')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_video_counting.purseiner_video_counting_process(video, folder_images, model, type, width_cms, width_pxs_x_cm)


@app.route('/flask_api/picturecalibrationfishlocaly', methods=['POST'])
def get_result_picture_calibration_fish_localy():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        cms = url_input_video_and_dir.get('cms')
        return purseiner_picture_calibration.purseiner_picture_calibration_process(video, model, type, cms)

@app.route('/flask_api/picturecalibrationfishawss3', methods=['POST'])
def get_result_picture_calibration_fish_awss3():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        cms = url_input_video_and_dir.get('cms')
        return purseiner_picture_calibration.purseiner_picture_calibration_process(video, model, type, cms)


@app.route('/flask_api/imagevideolocaly', methods=['POST'])
def get_image_video_localy():
    if request.method == 'POST':
        url_input_video = request.get_json()
        video = url_input_video.get('url_input_video')
        dir = url_input_video.get("dir")
        cam = cv2.VideoCapture(video)
        ret, frame = cam.read()
        #cv2.imshow('first frame', frame)
        #cv2.waitKey(0)
        if ret:
            name = dir + '/first_frame_video.png'
            cv2.imwrite(name, frame)
        else:
            name = ''
        cam.release()
        cv2.destroyAllWindows()
        return { 'name': name }

@app.route('/flask_api/imagevideoawss3', methods=['POST'])
def get_image_video_awss3():
    if request.method == 'POST':
        url_input_video = request.get_json()
        video = url_input_video.get('url_input_video')
        dir = 'submits/' + url_input_video.get("dir")
        cam = cv2.VideoCapture(video)
        ret, frame = cam.read()
        #cv2.imshow('first frame', frame)
        #cv2.waitKey(0)
        if ret:
            name = dir + '/first_frame_video.png'
            print(name)
            #cv2.imwrite(name, frame)
            s3 = boto3.client('s3')
            s3.upload_file(Bucket='aipeces', Key=name, Body=bytes(frame), ContentType='image/png', ACL='public-read')
        else:
            name = ''
        cam.release()
        cv2.destroyAllWindows()
        return { 'name': name }

"""
@app.route('/flask_api/webcamcountfish', methods=['POST'])
def get_result_webcam_counting_fish():
    if request.method == 'POST':
        url_input_video_and_dir = request.get_json()
        folder_images = url_input_video_and_dir.get("dir") + '/images'
        video = url_input_video_and_dir.get('url_input_video')
        model, type = url_input_video_and_dir.get('model').split('#')
        if os.path.isdir(folder_images) == False:
            os.mkdir(folder_images)
        return purseiner_webcam_counting.purseiner_webcam_counting_process(video, folder_images, model, type)

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
"""
