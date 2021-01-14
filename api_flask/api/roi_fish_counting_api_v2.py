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

# Helper code
def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width,
            3)).astype(np.uint8)

@tf.function
def detect_fn(image, detection_model):
    """Detect objects in image."""

    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)

    return detections, prediction_dict, tf.reshape(shapes, [-1])

# Variables
total_passed_fish = 0  # using it to count fish

def cumulative_object_counting_x_axis(input_video, detection_model, category_index, is_color_recognition_enabled, roi, deviation, folder):
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

        # input video
        cap = cv2.VideoCapture(input_video)

        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        output_movie = cv2.VideoWriter(name_file_video, fourcc, fps, (width, height))

        total_passed_fish = 0
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
                print("**********end of the video file")
                break

            input_frame = frame.copy()

            # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
            image_np_expanded = np.expand_dims(input_frame, axis=0)

            input_tensor = tf.convert_to_tensor(image_np_expanded, dtype=tf.float32)
            detections, predictions_dict, shapes = detect_fn(input_tensor, detection_model)

            # insert information text to video frame
            font = cv2.FONT_HERSHEY_SIMPLEX

            # Visualization of the results of a detection.
            counter, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_image_array_x_axis(cap.get(1),
                                                                                                         input_frame,
                                                                                                         1,
                                                                                                         is_color_recognition_enabled,
                                                                                                         np.squeeze(detections['detection_boxes']),
                                                                                                         np.squeeze(detections['detection_classes']).astype(np.int32),
                                                                                                         np.squeeze(detections['detection_scores']),
                                                                                                         category_index,
                                                                                                         x_reference=roi,
                                                                                                         deviation=deviation,
                                                                                                         use_normalized_coordinates=True,
                                                                                                         line_thickness=4,
                                                                                                         folder=folder)

            """
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
            counter = 0
            csv_line = 'not_available'
            counting_mode = ''
            """

            # when the vehicle passed over line and counted, make the color of ROI line green
            if counter == 1:
                cv2.line(input_frame, (roi, 0), (roi, height), (0, 0xFF, 0), 5)
            else:
                cv2.line(input_frame, (roi, 0), (roi, height), (0, 0, 0xFF), 5)

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
                #with open('detected_fishes.csv', 'a') as f:
                    writer = csv.writer(f)
                    (counting_mode, size) = \
                        csv_line.split(',')
                    writer.writerows([csv_line.split(',')])

        cap.release()
        output_movie.release()
        cv2.destroyAllWindows()
        return { 'total_fish': total_passed_fish }
