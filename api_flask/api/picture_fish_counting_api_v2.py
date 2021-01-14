#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th January 2018
#----------------------------------------------

import tensorflow as tf
import csv
import cv2
import numpy as np
from utils import visualization_utils as vis_util
from object_detection.utils import visualization_utils as viz_utils

@tf.function
def detect_fn(image, detection_model):
    """Detect objects in image."""

    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)

    return detections, prediction_dict, tf.reshape(shapes, [-1])

total_passed_fish = 0

def single_image_object_counting(input_video, detection_model, category_index, is_color_recognition_enabled, folder):
        total_passed_fish = 0

        name_file_dict = input_video.split('\\')
        f,tail = folder.split('/images')
        name_file_csv = f + '/' + name_file_dict[len(name_file_dict) - 1] + '_csv_result.csv'
        name_file_video = f + '/' + name_file_dict[len(name_file_dict) - 1] + '_video_result.avi'

        # initialize .csv
        with open(name_file_csv, 'w') as f:
        #with open('detected_fishes.csv', 'w') as f:
            writer = csv.writer(f)
            csv_line = \
                'Species/Size'
            writer.writerows([csv_line.split(',')])

        speed = "waiting..."
        direction = "waiting..."
        size = "waiting..."
        color = "waiting..."
        counting_mode = "..."

        input_frame = cv2.imread(input_video)
        image_np_expanded = np.expand_dims(input_frame, axis=0)

        input_tensor = tf.convert_to_tensor(image_np_expanded, dtype=tf.float32)
        detections, predictions_dict, shapes = detect_fn(input_tensor, detection_model)

        # insert information text to video frame
        font = cv2.FONT_HERSHEY_SIMPLEX

        # Visualization of the results of a detection.
        #total_passed_fish, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_single_image_array(1,input_frame,
        #                                                                                      1,
        #                                                                                      is_color_recognition_enabled,
        #                                                                                      np.squeeze(boxes),
        #                                                                                      np.squeeze(classes).astype(np.int32),
        #                                                                                      np.squeeze(scores),
        #                                                                                      category_index,
        #                                                                                      use_normalized_coordinates=True,
        #                                                                                      line_thickness=4,
        #                                                                                      folder=folder)


        label_id_offset = 1
        viz_utils.visualize_boxes_and_labels_on_image_array(
              input_frame,
              detections['detection_boxes'][0].numpy(),
              (detections['detection_classes'][0].numpy() + label_id_offset).astype(int),
              detections['detection_scores'][0].numpy(),
              category_index,
              use_normalized_coordinates=True,
              max_boxes_to_draw=200,
              min_score_thresh=.5,
              agnostic_mode=False,
        )
        csv_line = 'not_available'
        counting_mode = ''

        #total_passed_fish = str(len(counting_mode))
        cv2.rectangle(input_frame, (0, 0), (295, 80), (180, 132, 109), -1)
        cv2.putText(
            input_frame,
            ' Cumulative detected fishes:     ' + str(total_passed_fish),
            (4, 23),
            font,
            0.45,
            (0xFF, 0xFF, 0xFF),
            1,
            cv2.FONT_HERSHEY_SIMPLEX,
            )
        cv2.putText(
            input_frame,
            ' Detected species: ' + counting_mode,
            (4, 43),
            font,
            0.45,
            (0xFF, 0xFF, 0xFF),
            1,
            cv2.FONT_HERSHEY_SIMPLEX,
            )

        cv2.putText(
            input_frame,
            ' Size: ' + size,
            (4, 63),
            font,
            0.45,
            (0xFF, 0xFF, 0xFF),
            1,
            cv2.FONT_HERSHEY_COMPLEX_SMALL,
            )

        cv2.imshow('tensorflow_object counting_api',input_frame)
        cv2.waitKey(0)

        if csv_line != 'not_available':
            with open(name_file_csv, 'a') as f:
                writer = csv.writer(f)
                (counting_mode, size) = \
                csv_line.split(',')
                writer.writerows([csv_line.split(',')])

        cv2.destroyAllWindows()
        return { 'total_fish': total_passed_fish }
