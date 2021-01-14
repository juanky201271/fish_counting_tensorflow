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

def purseiner_picture_counting_process(url_input_video, folder, model):
    #input_video = "./input_images_and_videos/3-convoyeur3 26-08-2019 03-00-02.jpg"

    detection_graph, category_index = backbone.set_model(model, 'purseiner_label_map.pbtxt')

    is_color_recognition_enabled = 0

    if (model == 'output_inference_graph_v1_purseiner3'):
        r =  picture_fish_counting_api.single_image_object_counting(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder)

    if (model == 'my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8'):
        r =  picture_fish_counting_api_v2.single_image_object_counting(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder)

    currPath = os.getcwd()
    f,tail = folder.split('/images')
    os.chdir(os.getcwd() + '/' + f)
    shutil.make_archive(folder.split('/')[len(folder.split('/')) - 2] + '_images_zip_result', "zip", './images')

    for f in glob.glob(os.getcwd() + "./images/*"):
        os.remove(f)
    os.rmdir("images")

    os.chdir(currPath)

    return r
