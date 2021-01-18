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

def purseiner_roi_process(url_input_video, folder, model, type):
    #input_video = "api_flask/input_images_and_videos/27-08-2019-03-25.avi"

    detection_graph, category_index, version = backbone.set_model(model, 'label_map.pbtxt', type)

    fps = 1.00 # change it with your input video fps
    width = 1280 # change it with your input video width
    height = 720 # change it with your input vide height
    is_color_recognition_enabled = 0 # set it to 1 for enabling the color prediction for the detected objects
    roi = 685 # roi line position
    deviation = 1280 # the constant that represents the object counting area

    print('VERSION: ' + version)

    if (type == 'frozen_inference_graph' and version == '1'):
        r = roi_fish_counting_api.cumulative_object_counting_x_axis_fig(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects

    if (type == 'saved_model_root' or type == 'saved_model_dir'):
        if (version.split('.')[0] == '1'):
            r = roi_fish_counting_api.cumulative_object_counting_x_axis_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects
        if (version.split('.')[0] == '2'):
            r = roi_fish_counting_api_v2.cumulative_object_counting_x_axis_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects

    if (type == 'ckpt_dir' and version == '2'):
        r = roi_fish_counting_api_v2.cumulative_object_counting_x_axis_c(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, folder) # counting all the objects

    currPath = os.getcwd()
    f,tail = folder.split('/images')
    os.chdir(os.getcwd() + '/' + f)
    shutil.make_archive(folder.split('/')[len(folder.split('/')) - 2] + '_images_zip_result', "zip", './images')

    for f in glob.glob(os.getcwd() + "./images/*"):
        os.remove(f)
    os.rmdir("images")

    os.chdir(currPath)

    return r
