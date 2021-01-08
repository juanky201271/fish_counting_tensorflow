#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf

# Object detection imports
from utils import backbone
from api import webcam_fish_counting_api

def webcam_fish_counting_process(url_input_video, folder):
# By default I use an "SSD with Mobilenet" model here. See the detection model zoo (https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) for a list of other models that can be run out-of-the-box with varying speeds and accuracies.
    detection_graph, category_index = backbone.set_model('output_inference_graph_v1_purseiner3', 'purseiner_label_map.pbtxt')

    is_color_recognition_enabled = 0

    r = webcam_fish_counting_api.object_counting_webcam(detection_graph, category_index, is_color_recognition_enabled, folder)

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
