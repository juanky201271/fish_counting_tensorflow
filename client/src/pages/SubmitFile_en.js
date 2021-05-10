const errors = {
  only_valid_files: 'Please select only images or videos to upload',
  only_images: 'Please upload only images for calibration',
  only_one_fish: 'Please select an image with just one fish',
  long_process: 'Very complex process, wait for it to finish or cancel',
  waiting: '... You can wait or cancel ...',
  error_process: 'The process has failed, try again in a few minutes',
  process_queue: 'Process launched, check the process queue to see its status',
  max_size_file: 'Maximum file size 30 Mb',

};

const labels = {
  // fileData
  tit_down: 'DOWNLOADS',
  tit_cola: 'PROCESS QUEUE',
  tit_attention: 'ATTENTION!!',
  tit_attention_text: 'If the species of your photo or video has not been detected, please continue uploading images until the system learns to identify it. If you want to speed up the process send a message to',
  tit_processed: (type) => {
    return ((type === 'image' ? 'Processed ' : 'Processed ') + type)
  },
  tit_table: 'Species/Size table',
  tit_det_images: 'Individual detections images',
  tit_fil_details: (type) => {
    return (`File details (${type}):`)
  },
  tit_fil_name: (name) => {
    return ('Name: ' + name)
  },
  tit_fil_type: (type) => {
    return ('Type: ' + type)
  },
  tit_fil_size: (size) => {
    return ('Size: ' + size)
  },
  tit_dow_uploaded: 'Uploaded file',

  // header
  tit_obj_det_tool: 'Fish Identification, Counting and Measurement App',
  tit_select: 'Select an (image/video) to process',
  tit_upload: 'Upload!',
  tit_sel_model: 'Select the most suitable model',
  tit_sel_placeholder: '<choose a model>',
  tit_typ_process: 'Select the type of process',
  tit_roi_video: 'Conveyor belt video',
  tit_web_cam: 'Webcam',
  tit_video: 'Standard video',
  tit_picture: 'Image',
  tit_cancel: (total_fish) => {
    return (total_fish !== null ?
      'Clear!' :
      'Cancel!'
    )
  },

  // calibration
  tit_calibration: 'CALIBRATION',
  tit_tex_calibration: 'The fish sizes are referenced at a distance from the camera of (60 in) at 90º, with a viewing angle of 75º, if these data are modified it is necessary to calibrate the calculations.',
  tit_tex_sel_calibration: 'To calibrate select an image with a single fish and enter its real size in (in)',
  tit_sel_calibration: 'Select an image',
  tit_siz_calibration: 'Introduce size (in)',
  tit_calibrate: 'Calibrate!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibration successful: ${width_pxs_x_cm} pixels per (in).`)
  },
  tit_recalibrate: 'Recalibrate!',
  tit_lab_results: 'Results',
  tit_lab_processing: 'Processing...',
  tit_lab_sel_typ_process: 'Select the type of process...',
  tit_lab_upload: 'Upload the file...',
  tit_lab_sel_file: 'Select file to process...',
  tit_lab_sel_model: 'Select model to use...',

  tit_webcam: 'Using a connected WebCam or CCTV',
  tit_select_webcam: 'Select!',
  tit_selected_webcam: 'Selected',
  tit_camera: 'Camera',

  waiting: 'Waiting',
  start: 'Start',
  detecting: 'Detecting',
  tracking: 'Tracking',
  drawing: 'Drawing',
  saving: 'Saving',
  reading: 'Reading',
  writing: 'Writting',
  end: 'End',
  error: 'ERROR',
  tried: 'tried',
  times: 'times',

};

export { errors, labels };
