const errors = {
  only_valid_files: 'Por favor subir solo imágenes o videos',
  only_images: 'Por favor subir solo imágenes para la calibración',
  only_one_fish: 'Por favor subir una imagen con un solo pez',

};

const labels = {
  // fileData
  tit_down: 'DESCARGAS',
  tit_processed: (type) => {
    return (type === 'image' ?
      'imagen procesada' :
      'video procesado')
  },
  tit_table: 'Tabla de Especies/Tallas',
  tit_det_images: 'Imágenes detecciones individuales',
  tit_fil_details: (type) => {
    return (`Detalles del fichero (${type === 'image' ?
      'imagen' :
      'video'
    }):`)
  },
  tit_fil_name: (name) => {
    return ('Nombre: ' + name)
  },
  tit_fil_type: (type) => {
    return ('Tipo: ' + type)
  },
  tit_fil_size: (size) => {
    return ('Tamaño: ' + size)
  },
  tit_dow_uploaded: 'Fichero cargado',

  // header
  tit_obj_det_tool: 'Herramienta para detectar objetos',
  tit_select: 'Selecciona una imagen o video para procesar',
  tit_upload: 'Cargar archivo!',
  tit_sel_model: 'Selecciona el modelo más adecuado',
  tit_sel_placeholder: '<elige un modelo>',
  tit_typ_process: 'Seleccionar el tipo de Proceso',
  tit_roi_video: 'Video cinta transportadora',
  tit_web_cam: 'Cámara web',
  tit_video: 'Video estándar',
  tit_picture: 'Imagen',
  tit_cancel: (total_fish) => {
    return (total_fish !== null ?
      'Limpiar' :
      'Cancelar'
    )
  },

  // calibration
  tit_calibration: 'CALIBRACIÓN',
  tit_tex_calibration: 'Las tallas de los peces están referenciadas a una distancia de la cámara de (150 cm = 60 in) a 90º, con angulo de visión de 75º, si estos datos se modifican es necesario calibrar los cálculos.',
  tit_tex_sel_calibration: 'Para calibrar seleccionar una imagen con un único pez e introducir su talla real en (cm / in)',
  tit_sel_calibration: 'Seleccionar la imagen',
  tit_siz_calibration: 'Intruducir la talla (cm / in)',
  tit_calibrate: 'Calibrar!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibración realizada correctamente: ${width_pxs_x_cm} pixels por (cm / in).`)
  },
  tit_recalibrate: 'Volver a calibrar!',
  tit_lab_results: 'Resultados',
  tit_lab_processing: 'Procesando...',
  tit_lab_sel_typ_process: 'Seleccionar el tipo de proceso...',
  tit_lab_upload: 'Subir el archivo...',
  tit_lab_sel_file: 'Seleccionar archivo para procesar...',
};

export { errors, labels };
