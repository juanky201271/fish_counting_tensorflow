import time
import os
from flask import Flask
from flask import request
from flask_cors import CORS
import purseiner_roi

uploaded = 'client/public/files_uploaded'
csv = 'client/public/files_csv_results'
video = 'client/public/files_video_results'

if os.path.isdir(uploaded) == False:
    os.mkdir(uploaded)

if os.path.isdir(csv) == False:
    os.mkdir(csv)

if os.path.isdir(video) == False:
    os.mkdir(video)

app = Flask(__name__)
CORS(app)

@app.route('/flask_api/time', methods=['GET'])
def get_current_time():
    return { 'time': time.time() }

@app.route('/flask_api/countfish', methods=['POST'])
def get_result_counting_fish():
    if request.method == 'POST':
        url_input_video = request.get_json()
        #print(url_input_video.get('url_input_video'))
        r = purseiner_roi.purseiner_roi_process(url_input_video.get('url_input_video'))
        #print(r)
        return r
