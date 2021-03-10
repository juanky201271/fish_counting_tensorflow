#----------------------------------------------
#--- Author         : Ahmet Ozlu
#--- Mail           : ahmetozlu93@gmail.com
#--- Date           : 27th July 2019
#----------------------------------------------

import tensorflow as tf
import glob, os
import boto3

from utils import backbone
from api import roi_fish_counting_api
from api import roi_fish_counting_api_v2
from pathlib import Path
from zipfile import ZipFile, ZipInfo
from io import BytesIO

def purseiner_roi_process(url_input_video, model, type, width_cms, width_pxs_x_cm):

    detection_graph, category_index, version = backbone.set_model(model, 'label_map.pbtxt', type)

    fps = 1.00 # change it with your input video fps
    width = 1280 # change it with your input video width
    height = 720 # change it with your input vide height
    is_color_recognition_enabled = 0 # set it to 1 for enabling the color prediction for the detected objects
    roi = 685 # roi line position
    deviation = 1280 # the constant that represents the object counting area

    print('VERSION: ' + version)

    if (type == 'frozen_inference_graph' and version == '1'):
        r = roi_fish_counting_api.cumulative_object_counting_x_axis_fig(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, width_cms, width_pxs_x_cm) # counting all the objects

    if (type == 'saved_model_root' or type == 'saved_model_dir'):
        if (version.split('.')[0] == '1'):
            r = roi_fish_counting_api.cumulative_object_counting_x_axis_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, width_cms, width_pxs_x_cm) # counting all the objects
        if (version.split('.')[0] == '2'):
            r = roi_fish_counting_api_v2.cumulative_object_counting_x_axis_sm(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, width_cms, width_pxs_x_cm) # counting all the objects

    if (type == 'ckpt_dir' and version == '2'):
        r = roi_fish_counting_api_v2.cumulative_object_counting_x_axis_c(url_input_video, detection_graph, category_index, is_color_recognition_enabled, roi, deviation, width_cms, width_pxs_x_cm) # counting all the objects

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
