const errors = {
  only_valid_files: 'Veuillez sélectionner uniquement des images ou des vidéos à télécharger',
  only_images: "Veuillez télécharger uniquement des images pour l'étalonnage",
  only_one_fish: 'Veuillez sélectionner une image avec un seul poisson',
  long_process: "Processus très complexe, attendez qu'il se termine ou annulez",
  waiting: '... Tu peux attendre ou annuler ...',
  error_process: 'Le processus a échoué, réessayez dans quelques minutes',
  process_queue: "Processus lancé, vérifiez la file d'attente du processus pour voir son état",
  max_size_file: 'Taille maximale du fichier 30 Mb',

};

const labels = {
  // fileData
  tit_down: 'TÉLÉCHARGEMENTS',
  tit_cola: 'FILE DE PROCESSUS',
  tit_processed: (type) => {
    return ((type === 'image' ? 'image' : 'vidéo').concat(' traitée'))
  },
  tit_table: 'Tableau des espèces / tailles',
  tit_det_images: 'Images de détections individuelles',
  tit_fil_details: (type) => {
    return (`Détails du fichier (${type === 'image' ? 'image' : 'vidéo'}):`)
  },
  tit_fil_name: (name) => {
    return ('Nom: ' + name)
  },
  tit_fil_type: (type) => {
    return ('Taper: ' + type)
  },
  tit_fil_size: (size) => {
    return ('Taille: ' + size)
  },
  tit_dow_uploaded: 'Fichier téléchargé',

  // header
  tit_obj_det_tool: "Application d'identification, de comptage et de mesure des poissons",
  tit_select: 'Sélectionnez une image à traiter',
  tit_upload: 'Télécharger!',
  tit_sel_model: 'Sélectionnez le modèle le plus adapté',
  tit_sel_placeholder: '<choisi un modèle>',
  tit_typ_process: 'Sélectionnez le type de processus',
  tit_roi_video: 'Vidéo de la bande transporteuse',
  tit_web_cam: 'Webcam',
  tit_video: 'Vidéo standard',
  tit_picture: 'Photo',
  tit_cancel: (total_fish) => {
    return (total_fish !== null ?
      'Dégager!' :
      'Annuler!'
    )
  },

  // calibration
  tit_calibration: 'ÉTALONNAGE',
  tit_tex_calibration: 'Les tailles de poisson sont référencées à une distance de la caméra de (150 cm) à 90 °, avec un angle de vue de 75 °, si ces données sont modifiées il est nécessaire de calibrer les calculs.',
  tit_tex_sel_calibration: 'Pour calibrer, sélectionnez une image avec un seul poisson et entrez sa taille réelle en (cm)',
  tit_sel_calibration: "Sélectionnez l'image",
  tit_siz_calibration: 'Mettre la taille (cm)',
  tit_calibrate: 'Étalonner!',
  tit_ok_calibration: (width_pxs_x_cm) => {
    return (`Calibration réussie: ${width_pxs_x_cm} pixels par (cm).`)
  },
  tit_recalibrate: 'Recalibrer!',
  tit_lab_results: 'Résultats',
  tit_lab_processing: 'Traitement...',
  tit_lab_sel_typ_process: 'Sélectionnez le type de processus...',
  tit_lab_upload: 'Téléchargez le fichier...',
  tit_lab_sel_file: 'Sélectionnez le fichier à traiter...',
  tit_lab_sel_model: 'Sélectionnez le modèle à utiliser...',

  waiting: 'Attendant',
  start: 'Début',
  detecting: 'Détecter',
  tracking: 'Le suivi',
  drawing: 'Dessin',
  saving: 'Économie',
  reading: 'Lecture de la vidéo',
  writing: 'Écriture de cadres',
  end: 'Finir',
  error: 'ERREUR',
  tried: 'a tenté',
  times: 'fois',

};

export { errors, labels };
