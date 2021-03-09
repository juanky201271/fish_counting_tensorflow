#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th January 2018
#----------------------------------------------

import tensorflow as tf
import csv, os
import cv2
import io
import numpy as np
import json
import six
import urllib
from six import BytesIO
from utils import visualization_utils as vis_util
import boto3
import PIL.Image as Image
from io import StringIO

def single_image_object_counting_fig(input_picture, detection_graph, category_index, is_color_recognition_enabled, width_cms, width_pxs_x_cm):
    total_passed_fish = 0
    counting_mode = ""
    csv_line = ""
    sizes = []

    _, name_file = input_picture.split('amazonaws.com/')
    name_file_csv = name_file + '_csv_result.csv'
    name_file_picture = name_file + '_image_result.png'
    folder_images = name_file + '/images'

    # initialize .csv
    f = StringIO()
    csv_line = \
    'Specie,Score,Size'
    csv.writer(f).writerows([csv_line.split(',')])

    with detection_graph.as_default():
      with tf.compat.v1.Session(graph=detection_graph) as sess:
        image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
        detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
        detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
        detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
        num_detections = detection_graph.get_tensor_by_name('num_detections:0')

        resp = urllib.request.urlopen(input_picture.replace(" ", "%20"))
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        input_frame = cv2.imdecode(image, cv2.IMREAD_COLOR)
        #input_frame = cv2.imread(input_picture)
        image_np_expanded = np.expand_dims(input_frame, axis=0)

        (boxes, scores, classes, num) = sess.run(
        [detection_boxes, detection_scores, detection_classes, num_detections],
        feed_dict={image_tensor: image_np_expanded})

    # insert information text to video frame
    font = cv2.FONT_HERSHEY_SIMPLEX

    # Visualization of the results of a detection.
    total_passed_fish, csv_line, counting_mode, sizes = vis_util.visualize_boxes_and_labels_on_single_image_array(1, input_frame, 1, is_color_recognition_enabled, np.squeeze(boxes), np.squeeze(classes).astype(np.int32), np.squeeze(scores), category_index, use_normalized_coordinates=True, folder=folder_images)

    print(sizes)

    total_passed_fish = len(sizes)

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

    image_pil = Image.fromarray(np.uint8(input_frame))
    output = six.BytesIO()
    image_pil.save(output, format='PNG')
    png_string = output.getvalue()
    output.close()
    session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
    s3 = session.client('s3')
    s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=name_file_picture, Body=png_string, ContentType='image/png', ACL='public-read')

    #cv2.imwrite(name_file_picture, input_frame)

    #calculate cms
    sizes_cms = []
    if (width_pxs_x_cm != None):
        for size in sizes:
            pxs = int(size.split(',')[2].split(".")[0])
            cms = int(pxs / width_pxs_x_cm)
            sizes_cms.append(size.split(',')[0] + ',' + size.split(',')[1] + ',' + str(cms))
    else:
        for size in sizes:
            pxs = int(size.split(',')[2].split(".")[0])
            cms = int((width_cms * pxs) / int(input_frame.shape[1]))
            sizes_cms.append(size.split(',')[0] + ',' + size.split(',')[1] + ',' + str(cms))

    print(sizes_cms)

    for size in sizes_cms:
        csv_line = \
        str(size)
        csv.writer(f).writerows([csv_line.split(',')])

    session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
    s3 = session.client('s3')
    s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=name_file_csv, Body=f.getvalue(), ContentType='text/csv', ACL='public-read')
    f.close()

    #cv2.imshow('fish detection picture',input_frame)
    #cv2.waitKey(0)

    cv2.destroyAllWindows()
    return { 'total_fish': total_passed_fish }

def single_image_object_counting_sm(input_picture, detection_model, category_index, is_color_recognition_enabled, width_cms, width_pxs_x_cm):
    total_passed_fish = 0
    counting_mode = ""
    csv_line = ""
    sizes = []

    detect_fn = detection_model.signatures['serving_default']

    _, name_file = input_picture.split('amazonaws.com/')
    name_file_csv = name_file + '_csv_result.csv'
    name_file_picture = name_file + '_image_result.png'
    folder_images = name_file + '/images'

    # initialize .csv
    f = StringIO()
    csv_line = \
    'Specie,Score,Size'
    csv.writer(f).writerows([csv_line.split(',')])

    resp = urllib.request.urlopen(input_picture.replace(" ", "%20"))
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    input_frame = cv2.imdecode(image, cv2.IMREAD_COLOR)
    #input_frame = cv2.imread(input_picture)

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
    total_passed_fish, csv_line, counting_mode, sizes = vis_util.visualize_boxes_and_labels_on_single_image_array(1, input_frame, 1, is_color_recognition_enabled, detections['detection_boxes'], detections['detection_classes'], detections['detection_scores'], category_index, use_normalized_coordinates=True, folder=folder_images)

    print(sizes)

    total_passed_fish = len(sizes)

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

    image_pil = Image.fromarray(np.uint8(input_frame))
    output = six.BytesIO()
    image_pil.save(output, format='PNG')
    png_string = output.getvalue()
    output.close()
    session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
    s3 = session.client('s3')
    s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=name_file_picture, Body=png_string, ContentType='image/png', ACL='public-read')

    #cv2.imwrite(name_file_picture, input_frame)

    #calculate cms
    sizes_cms = []
    if (width_pxs_x_cm != None):
        for size in sizes:
            pxs = int(size.split(',')[2].split(".")[0])
            cms = int(pxs / width_pxs_x_cm)
            sizes_cms.append(size.split(',')[0] + ',' + size.split(',')[1] + ',' + str(cms))
    else:
        for size in sizes:
            pxs = int(size.split(',')[2].split(".")[0])
            cms = int((width_cms * pxs) / int(input_frame.shape[1]))
            sizes_cms.append(size.split(',')[0] + ',' + size.split(',')[1] + ',' + str(cms))

    print(sizes_cms)

    for size in sizes_cms:
        csv_line = \
        str(size)
        csv.writer(f).writerows([csv_line.split(',')])

    session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
    s3 = session.client('s3')
    s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=name_file_csv, Body=f.getvalue(), ContentType='text/csv', ACL='public-read')
    f.close()

    #cv2.imshow('fish detection picture',input_frame)
    #cv2.waitKey(0)

    cv2.destroyAllWindows()
    return { 'total_fish': total_passed_fish }
