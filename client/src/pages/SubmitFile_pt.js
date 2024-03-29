const errors = {
  only_valid_files: 'Selecione apenas fotos ou vídeos para enviar',
  only_images: 'Carregue apenas fotos para calibração',
  only_one_fish: 'Selecione uma foto com apenas um peixe',
  long_process: 'Processo muito complexo, aguarde a conclusão ou cancele',
  waiting: '... Você pode espere ou cancele ...',
  error_process: 'O processo falhou, tente novamente em alguns minutos',
  process_queue: 'Processo iniciado, verifique a fila de processo para ver seu status',
  max_size_file: 'Tamanho máximo do arquivo 100 Mb',
  max_duration: 'Duração máxima 60 min',

};

const labels = {
  // fileData
  tit_down: 'TRANSFERÊNCIAS',
  tit_cola: 'PROCESS QUEUE',
  tit_attention: 'ATENÇÃO!!',
  tit_attention_text: 'Se a espécie de sua foto ou vídeo não foi detectada, continue enviando fotos até que o sistema aprenda a identificá-la. Se você quiser agilizar o processo, envie uma mensagem para',
  tit_processed: (type) => {
    return ((type === 'image' ? 'Foto' : 'Vídeo').concat(' processada'))
  },
  tit_table: 'Tabela de espécies/tamanho',
  tit_det_images: 'Fotos de detecções individuais',
  tit_fil_details: (type) => {
    return (`ARQUIVO (${type === 'image' ? 'Foto' : 'Vídeo'}):`)
  },
  tit_fil_name: (name) => {
    return ('Nome: ' + name)
  },
  tit_fil_type: (type) => {
    return ('Modelo: ' + type)
  },
  tit_fil_size: (size) => {
    return ('Tamanho: ' + size)
  },
  tit_dow_uploaded: 'Arquivo carregado',

  // header
  tit_obj_det_tool: 'Aplicativo de identificação, contagem e medição de peixes',
  tit_select: 'Selecione (foto / vídeo) para processar',
  tit_upload: 'Upload de seleção!',
  tit_sel_model: 'Selecione o modelo mais adequado',
  tit_sel_placeholder: '<Escolha um modelo>',
  tit_minutes: '<segundos>',
  tit_inches: '<centímetros>',
  tit_typ_process: 'Defina o tipo de processo',
  tit_roi_hor_video: 'Vídeo horizontal esteira transportadora',
  tit_roi_ver_video: 'Vídeo vertical esteira transportadora',
  tit_web_cam: 'Webcam',
  tit_video: 'Vídeo padrão',
  tit_picture: 'Foto',
  tit_cancel: (total_fish) => {
    return (total_fish !== null ?
      'Limpar!' :
      'Cancelar!'
    )
  },

  // calibration
  tit_calibration: 'CALIBRAÇÃO',
  tit_tex_calibration: 'Os tamanhos dos peixes são referenciados a uma distância da câmera de (150 cm) a 90º, com um ângulo de visão de 75º, se estes dados forem modificados é necessário calibrar os cálculos.',
  tit_tex_sel_calibration: 'Para calibrar selecione uma foto com um único peixe e insira seu tamanho real em (cm)',
  tit_sel_calibration: 'Selecione a foto',
  tit_siz_calibration: 'Introduzir o tamanho (cm)',
  tit_calibrate: 'Calibrar!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibração bem-sucedida: ${width_pxs_x_cm} pixels por (cm).`)
  },
  tit_recalibrate: 'Recalibrar!',
  tit_lab_results: 'Resultados',
  tit_lab_processing: 'Em processamento...',
  tit_lab_sel_typ_process: 'Selecione o tipo de processo...',
  tit_lab_upload: 'Carregue o arquivo ou selecione a webcam...',
  tit_lab_sel_file: 'Selecione o arquivo ou webcam para processar...',
  tit_lab_sel_model: 'Selecione o modelo para usar...',

  tit_webcam: 'Selecione sua webcam ou CCTV conectado',
  tit_select_webcam: 'Upload de seleção!',
  tit_selected_webcam: 'Selecionado',
  tit_camera: 'CÂMERA',
  tit_duration: 'Define a duração da gravação',
  tit_webcam_no_found: 'Câmera não disponível',
  tit_or_you_can: 'ou você pode',
  tit_device: 'Dispositivo',
  tit_recording: 'Gravação',

  waiting: 'Esperando',
  start: 'Começar',
  detecting: 'Detecção',
  tracking: 'Rastreamento',
  drawing: 'Desenho',
  saving: 'Salvando',
  reading: 'Lendo',
  writing: 'Escrevendo',
  end: 'Fim',
  error: 'ERRO',
  tried: 'tentou',
  times: 'vezes',

};

export { errors, labels };
