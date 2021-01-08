import cv2
import os

vehicle_count = [0]

def save_image(source_image, folder):
	cv2.imwrite(folder + "/object" + str(len(vehicle_count)) + ".png", source_image)
	vehicle_count.insert(0,1)
