#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf
import glob, os
import shutil

from utils import backbone
from api import picture_fish_calibration_api
from api import picture_fish_calibration_api_v2
from shutil import make_archive
from pathlib import Path

def purseiner_picture_calibration_process(url_input_video, model, type, cms):
    #input_video = "./input_images_and_videos/3-convoyeur3 26-08-2019 03-00-02.jpg"

    detection_graph, category_index, version = backbone.set_model(model, 'label_map.pbtxt', type)

    is_color_recognition_enabled = 0

    print('VERSION: ' + version)

    if (type == 'frozen_inference_graph' and version == '1'):
        r =  picture_fish_calibration_api.single_image_object_counting_fig(url_input_video, detection_graph, category_index, is_color_recognition_enabled, cms)

    if (type == 'saved_model_root' or type == 'saved_model_dir'):
        if (version.split('.')[0] == '1'):
            r =  picture_fish_calibration_api.single_image_object_counting_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, cms)
        if (version.split('.')[0] == '2'):
            r =  picture_fish_calibration_api_v2.single_image_object_counting_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, cms)

    if (type == 'ckpt_dir' and version == '2'):
        r =  picture_fish_calibration_api_v2.single_image_object_counting_c(url_input_video, detection_graph, category_index, is_color_recognition_enabled, cms)

    return r
