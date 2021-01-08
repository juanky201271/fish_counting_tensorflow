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

total_passed_fish = 0

def single_image_object_counting(input_video, detection_graph, category_index, is_color_recognition_enabled, folder):
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

        with detection_graph.as_default():
          with tf.compat.v1.Session(graph=detection_graph) as sess:
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            input_frame = cv2.imread(input_video)
            image_np_expanded = np.expand_dims(input_frame, axis=0)
            (boxes, scores, classes, num) = sess.run(
            [detection_boxes, detection_scores, detection_classes, num_detections],
            feed_dict={image_tensor: image_np_expanded})

        # insert information text to video frame
        font = cv2.FONT_HERSHEY_SIMPLEX

        # Visualization of the results of a detection.
        total_passed_fish, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_single_image_array(1,input_frame,
                                                                                              1,
                                                                                              is_color_recognition_enabled,
                                                                                              np.squeeze(boxes),
                                                                                              np.squeeze(classes).astype(np.int32),
                                                                                              np.squeeze(scores),
                                                                                              category_index,
                                                                                              use_normalized_coordinates=True,
                                                                                              line_thickness=4,
                                                                                              folder=folder)


        total_passed_fish = str(len(counting_mode))
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
                (class_name, size) = \
                csv_line.split(',')
                writer.writerows([csv_line.split(',')])

        cv2.destroyAllWindows()
        return { 'total_fish': total_passed_fish }