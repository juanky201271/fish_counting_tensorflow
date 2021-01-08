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
from shutil import make_archive
from pathlib import Path

def purseiner_picture_counting_process(url_input_video, folder):
    #input_video = "./input_images_and_videos/3-convoyeur3 26-08-2019 03-00-02.jpg"

    detection_graph, category_index = backbone.set_model('output_inference_graph_v1_purseiner3', 'purseiner_label_map.pbtxt')

    is_color_recognition_enabled = 0

    r =  picture_fish_counting_api.single_image_object_counting(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder)

    currPath = os.getcwd()
    f,tail = folder.split('/images')
    os.chdir(os.getcwd() + '/' + f)
    print(os.getcwd())
    shutil.make_archive(folder.split('/')[len(folder.split('/')) - 2] + '_images_zip_result', "zip", './images')

    for f in glob.glob(os.getcwd() + "./images/*"):
        os.remove(f)

    os.chdir(currPath)
    print(os.getcwd())

    return r
