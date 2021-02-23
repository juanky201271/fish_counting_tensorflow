#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf
import glob, os
import shutil

from utils import backbone
from api import picture_fish_counting_api
from api import picture_fish_counting_api_v2
from shutil import make_archive
from pathlib import Path

def purseiner_picture_counting_process(url_input_video, folder, model, type, width_cms, width_pxs_x_cm):
    #input_video = "./input_images_and_videos/3-convoyeur3 26-08-2019 03-00-02.jpg"

    detection_graph, category_index, version = backbone.set_model(model, 'label_map.pbtxt', type)

    is_color_recognition_enabled = 0

    print('VERSION: ' + version)

    if (type == 'frozen_inference_graph' and version == '1'):
        r =  picture_fish_counting_api.single_image_object_counting_fig(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm)

    if (type == 'saved_model_root' or type == 'saved_model_dir'):
        if (version.split('.')[0] == '1'):
            r =  picture_fish_counting_api.single_image_object_counting_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm)
        if (version.split('.')[0] == '2'):
            r =  picture_fish_counting_api_v2.single_image_object_counting_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm)

    if (type == 'ckpt_dir' and version == '2'):
        r =  picture_fish_counting_api_v2.single_image_object_counting_c(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm)

    currPath = os.getcwd()
    f,tail = folder.split('/images')
    os.chdir(os.getcwd() + '/' + f)
    shutil.make_archive(folder.split('/')[len(folder.split('/')) - 2] + '_images_zip_result', "zip", './images')

    for f in glob.glob(os.getcwd() + "./images/*"):
        os.remove(f)
    os.rmdir("images")

    os.chdir(currPath)

    return r
