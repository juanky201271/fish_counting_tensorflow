const errors = {
  only_valid_files: 'Por favor subir solo imágenes o videos',
  only_images: 'Por favor subir solo imágenes para la calibración',
  only_one_fish: 'Por favor subir una foto con un solo pez',
  long_process: 'Proceso muy complejo, esperar a que termine o cancelar',
  waiting: '... Puedes esperar o cancelar ...',
  error_process: 'El proceso ha fallado, intentar de nuevo en unos minutos',
  process_queue: 'Proceso lanzado, checkear la cola de procesos para ver su estado',
  max_size_file: 'Tamaño maximo de fichero 100 Mb',
  max_duration: 'Máxima duración 60 min',

};

const labels = {
  // fileData
  tit_down: 'DESCARGAS',
  tit_cola: 'COLA DE PROCESOS',
  tit_attention: '¡¡ATENCIÓN!!',
  tit_attention_text: 'Si la especie de tu foto o video no ha sido detectada, por favor continua cargando imágenes hasta que el sistema aprenda a identificarla. Si quieres acelerar el proceso envía un mensaje a',
  tit_processed: (type) => {
    return (type === 'image' ? 'Foto procesada' : 'Video procesado')
  },
  tit_table: 'Tabla de Especies/Tallas',
  tit_det_images: 'Imágenes detecciones individuales',
  tit_fil_details: (type) => {
    return (`FICHERO (${type === 'image' ?
      'foto' :
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
  tit_obj_det_tool: 'Aplicación de identificación, conteo y medida de peces',
  tit_select: 'Selecciona una foto o video para procesar',
  tit_upload: 'Cargar selección!',
  tit_sel_model: 'Selecciona el modelo más adecuado',
  tit_sel_placeholder: '<elige un modelo>',
  tit_minutes: '<segundos>',
  tit_inches: '<centímetros>',
  tit_typ_process: 'Define el tipo de proceso',
  tit_roi_hor_video: 'Video cinta transportadora horizontal',
  tit_roi_ver_video: 'Video cinta transportadora vertical',
  tit_web_cam: 'Cámara web',
  tit_video: 'Video estándar',
  tit_picture: 'Foto',
  tit_cancel: (total_fish) => {
    return (total_fish !== null ?
      'Limpiar!' :
      'Cancelar!'
    )
  },

  // calibration
  tit_calibration: 'CALIBRACIÓN',
  tit_tex_calibration: 'Las tallas de los peces están referenciadas a una distancia de la cámara de (150 cm) a 90º, con angulo de visión de 75º, si estos datos se modifican es necesario calibrar los cálculos.',
  tit_tex_sel_calibration: 'Para calibrar seleccionar una foto con un único pez e introducir su talla real en (cm)',
  tit_sel_calibration: 'Seleccionar la foto',
  tit_siz_calibration: 'Introducir la talla (cm)',
  tit_calibrate: 'Calibrar!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibración realizada correctamente: ${width_pxs_x_cm} pixels por (cm).`)
  },
  tit_recalibrate: 'Volver a calibrar!',
  tit_lab_results: 'Resultados',
  tit_lab_processing: 'Procesando...',
  tit_lab_sel_typ_process: 'Seleccionar el tipo de proceso...',
  tit_lab_upload: 'Subir el archivo o seleccionar la webcam...',
  tit_lab_sel_file: 'Seleccionar archivo o webcam para procesar...',
  tit_lab_sel_model: 'Seleccionar modelo para usar...',

  tit_webcam: 'Seleccionar tu Webcam o CCTV conectada',
  tit_select_webcam: 'Cargar selección!',
  tit_selected_webcam: 'Seleccionada',
  tit_camera: 'CÁMARA',
  tit_duration: 'Define la duración de la grabación',
  tit_webcam_no_found: 'Cámara no disponible',
  tit_or_you_can: 'o puedes',
  tit_device: 'Dispositivo',
  tit_recording: 'Grabando',

  waiting: 'Esperando',
  start: 'Inicio',
  detecting: 'Detectando',
  tracking: 'Seguimiento',
  drawing: 'Dibujando',
  saving: 'Grabando',
  reading: 'Leyendo',
  writing: 'Escribiendo',
  end: 'Fin',
  error: 'ERROR',
  tried: 'intento',
  times: 'veces',

};

export { errors, labels };
