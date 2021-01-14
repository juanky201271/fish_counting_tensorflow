import glob, os, tarfile, urllib
import tensorflow as tf
from utils import label_map_util
from tensorflow.python.platform import gfile
from tensorflow.core.protobuf import saved_model_pb2
from tensorflow.python.util import compat
from object_detection.utils import config_util
from object_detection.builders import model_builder

def set_model(model_name, label_name):
	model_found = 0

	for file in glob.glob("api_flask/*"):
		if (file.split('\\')[1] == model_name):
			model_found = 1

	# What model to download.
	model_name = model_name
	model_file = model_name + '.tar.gz'
	download_base = 'http://download.tensorflow.org/models/object_detection/'

	# List of the strings that is used to add correct label for each box.
	path_to_labels = os.path.join('api_flask/data', label_name)

	num_classes = 90

	# Download Model if it has not been downloaded yet
	if (model_found == 0):
		opener = urllib.request.URLopener()
		opener.retrieve(download_base + model_file, model_file)
		tar_file = tarfile.open(model_file)
		for file in tar_file.getmembers():
		  file_name = os.path.basename(file.name)
		  if 'frozen_inference_graph.pb' in file_name:
		    tar_file.extract(file, os.getcwd())

	# Path to frozen detection graph. This is the actual model that is used for the object detection.
	if (model_name == 'output_inference_graph_v1_purseiner3'):
		path_to_ckpt = 'api_flask/' + model_name + '/frozen_inference_graph.pb'
		# Load a (frozen) Tensorflow model into memory.
		detection_graph = tf.Graph()
		with detection_graph.as_default():
		  od_graph_def = tf.compat.v1.GraphDef()
		  with tf.compat.v2.io.gfile.GFile(path_to_ckpt, 'rb') as fid:
		    serialized_graph = fid.read()
		    od_graph_def.ParseFromString(serialized_graph)
		    tf.import_graph_def(od_graph_def, name='')

	if (model_name == 'my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8'):
		path_to_ckpt = 'api_flask/' + model_name + '/pipeline.config'
		model_dir = 'api_flask/' + model_name + '/checkpoint'
		# Load a (saved) Tensorflow model into memory.
		configs = config_util.get_configs_from_pipeline_file(path_to_ckpt)
		model_config = configs['model']
		detection_graph = model_builder.build(model_config=model_config, is_training=False)
		# Restore checkpoint
		ckpt = tf.compat.v2.train.Checkpoint(model=detection_graph)
		ckpt.restore(os.path.join(model_dir, 'ckpt-0')).expect_partial()

	#if (model_name == 'my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8'):
	#	path_to_ckpt = 'api_flask/' + model_name + '/saved_model/saved_model.pb'
	#	# Load a (frozen) Tensorflow model into memory.
	#	siono = tf.saved_model.contains_saved_model('api_flask/' + model_name + '/saved_model')
	#	print(siono)
	#	detection_graph = tf.Graph()
	#	with detection_graph.as_default():
	#	    with gfile.FastGFile(path_to_ckpt, 'rb') as fid:
	#	        data = compat.as_bytes(fid.read())
	#	        sm = saved_model_pb2.SavedModel()
	#	        sm.ParseFromString(data)
	#	        tf.import_graph_def(sm.meta_graphs[0].graph_def)

# Loading label map
# Label maps map indices to category names, so that when our convolution network predicts 5, we know that this corresponds to airplane. Here I 		use internal utility functions, but anything that returns a dictionary mapping integers to appropriate string labels would be fine
	label_map = label_map_util.load_labelmap(path_to_labels)
	categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=num_classes, use_display_name=True)
	category_index = label_map_util.create_category_index(categories)

	return detection_graph, category_index
