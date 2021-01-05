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

# Helper code
def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width,
            3)).astype(np.uint8)

# Variables
total_passed_fish = 0  # using it to count fish

def object_counting(input_video, detection_graph, category_index, is_color_recognition_enabled):
        total_passed_fish = 0

        name_file_dict = input_video.split('\\')
        name_file_csv = 'client/public/files_csv_results/' + name_file_dict[len(name_file_dict) - 1] + '_csv_result.csv'
        name_file_video = 'client/public/files_video_results/' + name_file_dict[len(name_file_dict) - 1] + '_video_result.avi'

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
        height = 0
        width = 0
        with detection_graph.as_default():
          with tf.compat.v1.Session(graph=detection_graph) as sess:
            # Definite input and output Tensors for detection_graph
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

            # Each box represents a part of the image where a particular object was detected.
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

            # Each score represent how level of confidence for each of the objects.
            # Score is shown on the result image, together with the class label.
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')

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

                # Actual detection.
                (boxes, scores, classes, num) = sess.run(
                    [detection_boxes, detection_scores, detection_classes, num_detections],
                    feed_dict={image_tensor: image_np_expanded})

                # insert information text to video frame
                font = cv2.FONT_HERSHEY_SIMPLEX

                # Visualization of the results of a detection.
                counter, csv_line, counting_mode = vis_util.visualize_boxes_and_labels_on_image_array(cap.get(1),
                                                                                                      input_frame,
                                                                                                      1,
                                                                                                      is_color_recognition_enabled,
                                                                                                      np.squeeze(boxes),
                                                                                                      np.squeeze(classes).astype(np.int32),
                                                                                                      np.squeeze(scores),
                                                                                                      category_index,
                                                                                                      use_normalized_coordinates=True,
                                                                                                      line_thickness=4)


                total_passed_fish = total_passed_fish + counter

                print(counter)

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

                #cv2.imshow('fish detection', input_frame)

                output_movie.write(input_frame)
                #cv2.imshow('object counting',input_frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("**********go out frames")
                    break

                if csv_line != 'not_available':
                    with open('detected_fishes.csv', 'a') as f:
                        writer = csv.writer(f)
                        (counting_mode, size) = \
                            csv_line.split(',')
                        writer.writerows([csv_line.split(',')])


            cap.release()
            output_movie.release()
            cv2.destroyAllWindows()
            return { 'total_fish': total_passed_fish }