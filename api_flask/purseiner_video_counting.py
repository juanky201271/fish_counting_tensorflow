import tensorflow as tf

from utils import backbone
from api import video_fish_counting_api

def purseiner_video_counting_process(url_input_video):
    #input_video = "./input_images_and_videos/27-08-2019-03-25.avi"

    detection_graph, category_index = backbone.set_model('output_inference_graph_v1_purseiner3', 'purseiner_label_map.pbtxt')

    is_color_recognition_enabled = 0

    return video_fish_counting_api.object_counting(url_input_video, detection_graph, category_index, is_color_recognition_enabled)