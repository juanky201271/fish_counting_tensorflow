#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf
import glob, os
import boto3

from utils import backbone
from api import webcam_fish_counting_api
from api import webcam_fish_counting_api_v2
from pathlib import Path
from zipfile import ZipFile, ZipInfo
from io import BytesIO

def purseiner_webcam_counting_process(url_input_video, model, type):
# By default I use an "SSD with Mobilenet" model here. See the detection model zoo (https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) for a list of other models that can be run out-of-the-box with varying speeds and accuracies.
    detection_graph, category_index, version = backbone.set_model(model, 'label_map.pbtxt', type)

    is_color_recognition_enabled = 0

    if (type == 'frozen_inference_graph'):
        r = webcam_fish_counting_api.object_counting_webcam(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder)

    if (type != 'frozen_inference_graph'):
        r = webcam_fish_counting_api_v2.object_counting_webcam(url_input_video, detection_graph, category_index, is_color_recognition_enabled, folder)

    _, dir_zip = url_input_video.split('amazonaws.com/')
    name_file_zip = dir_zip + '_images_zip_result.zip'
    dir_images = dir_zip + '/images'
    session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
    s3 = session.client('s3')
    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=os.environ.get("AWS_BUCKET"), Prefix=dir_images)

    archive = BytesIO()
    for page in pages:
        if ('Contents' in page):
            for obj_key in page['Contents']:
                obj = s3.get_object(Bucket=os.environ.get("AWS_BUCKET"), Key=obj_key['Key'])
                s3.delete_object(Bucket=os.environ.get("AWS_BUCKET"), Key=obj_key['Key'])
                _, name = obj_key['Key'].split('/images/object')
                name = 'object' + name
                image = obj['Body'].read()
                print(name)
                with ZipFile(archive, 'a') as zip_archive:
                    zip_archive.writestr(name, image)

    s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=name_file_zip, Body=archive.getvalue(), ContentType='application/zip', ACL='public-read')
    archive.close()

    return r
