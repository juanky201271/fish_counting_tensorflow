const errors = {
  only_valid_files: 'Selecione apenas imagens ou vídeos para enviar',
  only_images: 'Carregue apenas imagens para calibração',
  only_one_fish: 'Selecione uma imagem com apenas um peixe',

};

const labels = {
  // fileData
  tit_down: 'TRANSFERÊNCIAS',
  tit_processed: (type) => {
    return ((type === 'image' ? 'Imagem' : 'Vídeo').concat(' processada'))
  },
  tit_table: 'Tabela de espécies/tamanho',
  tit_det_images: 'Imagens de detecções individuais',
  tit_fil_details: (type) => {
    return (`Detalhes do arquivo (${type === 'image' ? 'Imagem' : 'Vídeo'}):`)
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
  tit_select: 'Selecione (imagem / vídeo) para processar',
  tit_upload: 'Envio!',
  tit_sel_model: 'Selecione o modelo mais adequado',
  tit_sel_placeholder: '<Escolha um modelo>',
  tit_typ_process: 'Selecione o tipo de processo',
  tit_roi_video: 'Vídeo da esteira transportadora',
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
  tit_tex_sel_calibration: 'Para calibrar selecione uma imagem com um único peixe e insira seu tamanho real em (cm)',
  tit_sel_calibration: 'Selecione a imagem',
  tit_siz_calibration: 'Introduzir o tamanho (cm)',
  tit_calibrate: 'Calibrar!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibração bem-sucedida: ${width_pxs_x_cm} pixels por (cm).`)
  },
  tit_recalibrate: 'Recalibrar!',
  tit_lab_results: 'Resultados',
  tit_lab_processing: 'Em processamento...',
  tit_lab_sel_typ_process: 'Selecione o tipo de processo...',
  tit_lab_upload: 'Carregue o arquivo...',
  tit_lab_sel_file: 'Selecione o arquivo para processar...',
  tit_lab_sel_model: 'Selecione o modelo para usar...',
};

export { errors, labels };
