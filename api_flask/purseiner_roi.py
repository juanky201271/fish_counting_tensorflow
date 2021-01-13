#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf
import glob, os
import shutil

from utils import backbone
from api import roi_fish_counting_api
from api import roi_fish_counting_api_v2
from shutil import make_archive
from pathlib import Path

def purseiner_roi_process(url_input_video, folder, model):
    #input_video = "api_flask/input_images_and_videos/27-08-2019-03-25.avi"

    detection_graph, category_index = backbone.set_model(model, 'purseiner_label_map.pbtxt')

    fps = 1.00 # change it with your input video fps
    width = 1280 # change it with your input video width
    height = 720 # change it with your input vide height
    is_color_recognition_enabled = 0 # set it to 1 for enabling the color prediction for the detected objects
    roi = 685 # roi line position
    deviation = 1280 # the constant that represents the object counting area

    if (model == 'output_inference_graph_v1_purseiner3'):
        r = roi_fish_counting_api.cumulative_object_counting_x_axis(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects

    if (model == 'my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8'):
        r = roi_fish_counting_api_v2.cumulative_object_counting_x_axis(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects

    currPath = os.getcwd()
    f,tail = folder.split('/images')
    os.chdir(os.getcwd() + '/' + f)
    shutil.make_archive(folder.split('/')[len(folder.split('/')) - 2] + '_images_zip_result', "zip", './images')

    for f in glob.glob(os.getcwd() + "./images/*"):
        os.remove(f)
    os.rmdir("images")

    os.chdir(currPath)

    return r
