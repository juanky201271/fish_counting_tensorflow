#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th January 2018
#----------------------------------------------

import matplotlib
import cv2
import csv
import io
import os, glob
import scipy.misc
import numpy as np
from six import BytesIO
from PIL import Image, ImageDraw, ImageFont

import tensorflow as tf

from object_detection.utils import label_map_util
from object_detection.utils import config_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder

from utils import visualization_utils as vis_util

def object_counting_sm(input_video, detection_model, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm):
        total_passed_fish = 0
        detect_fn = detection_model

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

        # input video
        cap = cv2.VideoCapture(input_video)

        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        output_movie = cv2.VideoWriter(name_file_video, fourcc, fps, (width, height))

        speed = "waiting..."
        direction = "waiting..."
        size = "waiting..."
        color = "waiting..."
        counting_mode = "..."
        width_heigh_taken = True

        # for all the frames that are extracted from input video
        print ("**********writing frames")
        while(cap.isOpened()):
            ret, frame = cap.read()

            if not  ret:
                print("**********end of the video file...")
                break

            input_frame = frame

            # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
            image_np_expanded = np.expand_dims(input_frame, axis=0)

            # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
            input_tensor = tf.convert_to_tensor(image_np_expanded)

            detections = detect_fn(input_tensor)

            # All outputs are batches tensors.
            # Convert to numpy arrays, and take index [0] to remove the batch dimension.
            # We're only interested in the first num_detections.
            num_detections = int(detections.pop('num_detections'))
            detections = {key: value[0, :num_detections].numpy()
                          for key, value in detections.items()}
            detections['num_detections'] = num_detections

            # detection_classes should be ints.
            detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

            # insert information text to video frame
            font = cv2.FONT_HERSHEY_SIMPLEX

            # Visualization of the results of a detection.
            counter, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_image_array(cap.get(1),
                                                                                                  input_frame,
                                                                                                  1,
                                                                                                  is_color_recognition_enabled,
                                                                                                  detections['detection_boxes'],
                                                                                                  detections['detection_classes'],
                                                                                                  detections['detection_scores'],
                                                                                                  category_index,
                                                                                                  use_normalized_coordinates=True,
                                                                                                  line_thickness=4,
                                                                                                  folder=folder)


            total_passed_fish = total_passed_fish + counter

            # insert information text to video frame
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
                cv2.FONT_HERSHEY_COMPLEX_SMALL,
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

            cv2.imshow('fish detection', input_frame)

            output_movie.write(input_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("**********go out frames")
                break

            if csv_line != 'not_available':
                with open(name_file_csv, 'a') as f:
                    writer = csv.writer(f)
                    (counting_mode, size) = \
                        csv_line.split(',')
                    writer.writerows([csv_line.split(',')])

        cap.release()
        output_movie.release()
        cv2.destroyAllWindows()
        return { 'total_fish': total_passed_fish }

def get_model_detection_function_c(model):
  """Get a tf.function for detection."""

  @tf.function
  def detect_fn(image):
    """Detect objects in image."""

    image, shapes = model.preprocess(image)
    prediction_dict = model.predict(image, shapes)
    detections = model.postprocess(prediction_dict, shapes)

    return detections

  return detect_fn

def object_counting_c(input_video, detection_model, category_index, is_color_recognition_enabled, folder, width_cms, width_pxs_x_cm):
        total_passed_fish = 0
        detect_fn = get_model_detection_function_c(detection_model)

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

        # input video
        cap = cv2.VideoCapture(input_video)

        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        output_movie = cv2.VideoWriter(name_file_video, fourcc, fps, (width, height))

        speed = "waiting..."
        direction = "waiting..."
        size = "waiting..."
        color = "waiting..."
        counting_mode = "..."
        width_heigh_taken = True

        # for all the frames that are extracted from input video
        print ("**********writing frames")
        while(cap.isOpened()):
            ret, frame = cap.read()

            if not  ret:
                print("**********end of the video file...")
                break

            input_frame = frame

            # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
            image_np_expanded = np.expand_dims(input_frame, axis=0)

            # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
            input_tensor = tf.convert_to_tensor(image_np_expanded)

            detections = detect_fn(input_tensor)

            # All outputs are batches tensors.
            # Convert to numpy arrays, and take index [0] to remove the batch dimension.
            # We're only interested in the first num_detections.
            num_detections = int(detections.pop('num_detections'))
            detections = {key: value[0, :num_detections].numpy()
                          for key, value in detections.items()}
            detections['num_detections'] = num_detections

            # detection_classes should be ints.
            detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

            label_id_offset = 1

            # insert information text to video frame
            font = cv2.FONT_HERSHEY_SIMPLEX

            # Visualization of the results of a detection.
            counter, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_image_array(cap.get(1),
                                                                                                  input_frame,
                                                                                                  1,
                                                                                                  is_color_recognition_enabled,
                                                                                                  detections['detection_boxes'],
                                                                                                  detections['detection_classes'] + label_id_offset,
                                                                                                  detections['detection_scores'],
                                                                                                  category_index,
                                                                                                  use_normalized_coordinates=True,
                                                                                                  line_thickness=4,
                                                                                                  folder=folder)


            total_passed_fish = total_passed_fish + counter

            # insert information text to video frame
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
                cv2.FONT_HERSHEY_COMPLEX_SMALL,
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

            cv2.imshow('fish detection', input_frame)

            output_movie.write(input_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("**********go out frames")
                break

            if csv_line != 'not_available':
                with open(name_file_csv, 'a') as f:
                    writer = csv.writer(f)
                    (counting_mode, size) = \
                        csv_line.split(',')
                    writer.writerows([csv_line.split(',')])

        cap.release()
        output_movie.release()
        cv2.destroyAllWindows()
        return { 'total_fish': total_passed_fish }
