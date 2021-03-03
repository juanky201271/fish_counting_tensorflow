const errors = {
  only_valid_files: 'Please select only images or videos to upload',
  only_images: 'Please upload only images for calibration',
  only_one_fish: 'Please select an image with just one fish',

};

const labels = {
  // fileData
  tit_down: 'DOWNLOADS',
  tit_processed: (type) => {
    return ('Processed ' + type)
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
  tit_tex_calibration: 'The fish sizes are referenced at a distance from the camera of (150 cm = 60 in) at 90º, with a viewing angle of 75º, if these data are modified it is necessary to calibrate the calculations.',
  tit_tex_sel_calibration: 'To calibrate select an image with a single fish and enter its real size in (cm / in)',
  tit_sel_calibration: 'Select an image',
  tit_siz_calibration: 'Introduce size (cm / in)',
  tit_calibrate: 'Calibrate!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibration successful: ${width_pxs_x_cm} pixels per (cm / in).`)
  },
  tit_recalibrate: 'Recalibrate!',
  tit_lab_results: 'Results',
  tit_lab_processing: 'Processing...',
  tit_lab_sel_typ_process: 'Select the type of process...',
  tit_lab_upload: 'Upload the file...',
  tit_lab_sel_file: 'Select file to process...',
  tit_lab_sel_model: 'Select model to use...',
};

export { errors, labels };