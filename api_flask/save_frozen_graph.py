import tensorflow as tf
from tensorflow import keras
from tensorflow.python.framework.convert_to_constants import convert_variables_to_constants_v2
import numpy as np
from object_detection.utils import config_util
from object_detection.builders import model_builder


def save_frozen_graph_process():
    #path of the directory where you want to save your model
    frozen_out_path = 'api_flask/my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8'

    # name of the .pb file
    frozen_graph_filename = "frozen_graph"

    #model = tf.saved_model.load('api_flask/my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model')
    model = tf.keras.models.load_model('api_flask/my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model')

    # Load pipeline config and build a detection model
    #configs = config_util.get_configs_from_pipeline_file('api_flask/my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/pipeline.config')
    #model_config = configs['model']
    #model = model_builder.build(model_config=model_config, is_training=False)


    print(model.tensorflow_version)
    print(model)

    # Convert Keras model to ConcreteFunction
    full_model = tf.function(lambda x: model(x))
    full_model = full_model.get_concrete_function(tf.TensorSpec(model.inputs[0].shape, model.inputs[0].dtype))

    # Get frozen ConcreteFunction
    frozen_func = convert_variables_to_constants_v2(full_model)
    frozen_func.graph.as_graph_def()

    layers = [op.name for op in frozen_func.graph.get_operations()]
    print("-" * 60)
    print("Frozen model layers: ")
    for layer in layers:
        print(layer)

    print("-" * 60)
    print("Frozen model inputs: ")
    print(frozen_func.inputs)
    print("Frozen model outputs: ")
    print(frozen_func.outputs)

    # Save frozen graph to disk
    tf.io.write_graph(graph_or_graph_def=frozen_func.graph,
                      logdir=frozen_out_path,
                      name=f"{frozen_graph_filename}.pb",
                      as_text=False)
                      # Save its text representation
    tf.io.write_graph(graph_or_graph_def=frozen_func.graph,
                      logdir=frozen_out_path,
                      name=f"{frozen_graph_filename}.pbtxt",
                      as_text=True)
    return null
