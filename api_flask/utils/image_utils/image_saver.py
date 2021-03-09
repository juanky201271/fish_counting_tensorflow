import cv2
import os
import six
import numpy as np
import boto3
import PIL.Image as Image
from six import BytesIO

vehicle_count = [0]

def save_image(source_image, folder):
	if (folder != None):
		image_pil = Image.fromarray(np.uint8(source_image))
		output = six.BytesIO()
		image_pil.save(output, format='PNG')
		png_string = output.getvalue()
		output.close()
		session = boto3.session.Session( aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION") )
		s3 = session.client('s3')
		s3.put_object(Bucket=os.environ.get("AWS_BUCKET"), Key=folder + "/object" + str(len(vehicle_count)) + ".png", Body=png_string, ContentType='image/png', ACL='public-read')

		#cv2.imwrite(folder + "/object" + str(len(vehicle_count)) + ".png", source_image)
		vehicle_count.insert(0,1)
