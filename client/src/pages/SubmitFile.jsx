// juanky201271 - AIPeces - 2021

import React, { Component } from 'react'
import Webcam from 'react-webcam'
import { withRouter } from 'react-router'
import api from '../api'
import { socket, socketPy } from '../components'

import alert from '../assets/images/alert.png'

import './SubmitFile.scss'
import { errors as errors_es, labels as labels_es } from './SubmitFile_es.js'
import { errors as errors_en, labels as labels_en } from './SubmitFile_en.js'
import { errors as errors_fr, labels as labels_fr } from './SubmitFile_fr.js'
import { errors as errors_pt, labels as labels_pt } from './SubmitFile_pt.js'

const errors_lang = {
  'es': errors_es,
  'en': errors_en,
  'fr': errors_fr,
  'pt': errors_pt
}

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

class SubmitFile extends Component {
  constructor(props) {
      super(props)
      this.state = {
        render: null,
        isLoading: false,
        authenticated: '',
        twitterId: '',
        ip: '',
        user: '',

        selectedFile: '',
        uploadedFile: '',
        total_fish: null,
        _id: null,
        _id_webcam: null,
        dir: null,
        dir_webcam: null,
        errorUpload: null,
        errorWebcam: null,
        cancelarWaiting: false,

        model: '',
        models: null,

        selectedFileCalibration: '',
        uploadedFileCalibration: '',
        resultFileCalibration: '',
        total_fishCalibration: null,
        errorCalibration: null,
        cancelarWaitingCalibration: false,
        log: 'waiting',
        info: '',
        cms: null,
        width_cms: 250, // without calibration
        width_pxs_x_cm: null, // with calibration

        errors: errors_lang[this.props.parentState.language],
        labels: labels_lang[this.props.parentState.language],

        cola: [],

        optUpload: false,
        optWebcam: false,
        label: null,
        deviceId: null,
        durationWebcam: null,
        selectedWebcam: false,
        webcamRecording: false,
      }
      this.uploadInputRef = React.createRef()
      this.uploadInputRefCalibration = React.createRef()
      this.processVideoRoiButtonRef = React.createRef()
      this.processVideoButtonRef = React.createRef()
      this.processPictureButtonRef = React.createRef()
      this.webcamRef = React.createRef()
      this.interval = null
      this.intervalCalibration = null

      this.intervals = []
      this.pressButton = null

      this.inter = null
      this.i = 0
      this.send_i = 0
      this.frames = []

      socket.on("logging", params => {
        const cola = this.state.cola || []
        //console.log('log:', cola.length, cola)
        //console.log('params:', params)
        if (cola.length > 0) {
          for (let i = 0; i < cola.length; i++) {
            const uploadedFileState = cola[i].uploadedFile ? 'submits/' + cola[i].dir + '/' + cola[i].uploadedFile : ''
            const nameState = cola[i].name ? 'submits/' + cola[i].dir_webcam + '/' + cola[i].name : ''
            const selectedFileState = cola[i].selectedFile ? cola[i].selectedFile.type.split('/')[0] : ''
            if ((params.uploadedFile === uploadedFileState || params.uploadedFile === nameState) && cola[i].log !== 'end') {
              // si ya esta finalizado no hacer nada
              // si ha dado error pero al final el proceso se lanza, recibir las notificaciones, ¿por qué no?
              let incremento
              if (selectedFileState === 'video' || params.uploadedFile === nameState) {
                //video o webcam
                if (params.action === 'start') {
                  cola[i].porc = 5
                /*} else if (params.action === 'reading') {
                  if (cola[i].porc < 100) {
                    cola[i].porc = cola[i].porc + 5
                  }
                  // si es webcam empezar a lanzar los frames
                  if (params.uploadedFile === nameState) {
                    this.sendWebcamFrames(nameState, cola[i].durationWebcam)
                  }*/
                } else if (params.action === 'cameraoff') {
                  this.setState({
                    label: null,
                    deviceId: null,
                    durationWebcam: '',
                    selectedWebcam: false,
                    webcamRecording: false
                  })
                } else if (params.action === 'iframeoff') {
                  cola[i].iframe = false
                  this.setState({
                    label: null,
                    deviceId: null,
                    durationWebcam: '',
                    selectedWebcam: false,
                    webcamRecording: false
                  })
                } else if (params.action === 'end') {
                  cola[i].porc = 100
                  this.setState({
                    label: null,
                    deviceId: null,
                    durationWebcam: '',
                    selectedWebcam: false,
                    webcamRecording: false
                  })
                } else if (params.action === 'detecting' || params.action === 'tracking' || params.action === 'drawing' || params.action === 'writing') {
                  //const n_frames = parseInt(params.info.split('/')[0])
                  const t_frames = parseInt(params.info.split('/')[1])
                  incremento = (80 / t_frames) / 3
                  //sumar incremento
                  if (cola[i].porc < 90) {
                    cola[i].porc = cola[i].porc + incremento
                  }
                } else {
                  //sumar 5
                  if (cola[i].porc < 100) {
                    cola[i].porc = cola[i].porc + 5
                  }
                }
                //console.log('......video........', params.action, params.info, cola[i].porc, incremento ? incremento : 0)
              } else {
                //image
                if (params.action === 'start') {
                  cola[i].porc = 5
                } else if (params.action === 'end') {
                  cola[i].porc = 100
                  if (this.intervals[i]) {
                    clearTimeout(this.intervals[i])
                    this.intervals[i] = null
                  }
                } else if (params.action === 'detecting') {
                  //sumar 2
                  if (cola[i].porc < 90) {
                    cola[i].porc = cola[i].porc + 2
                  } else {
                    clearTimeout(this.intervals[i])
                    this.intervals[i] = null
                  }
                } else {
                  //sumar 5
                  if (cola[i].porc < 100) {
                    cola[i].porc = cola[i].porc + 5
                  } else {
                    clearTimeout(this.intervals[i])
                    this.intervals[i] = null
                  }
                }
              }

              if (params.action !== 'cameraoff' && params.action !== 'iframeoff') {
                cola[i].log = params.action
                cola[i].info = params.info === 'error' ? params.info : params.info ? ' {' + params.info + '}' : ''
              }

              this.setState(
                { cola: cola },
                function() {
                  if (params.action === 'detecting' && selectedFileState === 'image') { // solo detecting e imagen
                    this.intervals[i] = setTimeout(function() { this.porcentaje(i) }.bind(this), 1000)
                  }
                }
              )
            }
            //else {
            //  console.log('socket no match', params)
            //}
          }
        }
        if (this.state.uploadedFileCalibration) {
          const uploadedFileCalibrationState = 'submits/' + this.state.uploadedFileCalibration
          if (params.uploadedFile === uploadedFileCalibrationState) {
            this.setState({ log: params.action, info: params.info ? ' {' + params.info + '}' : '' })
          } else {
            console.log('socket no match calibration', params)
          }
        }

      })
      socket.on('queueing', par => {
        const cola = this.state.cola || []

        console.log('socket queue', par)

        if (cola.length > 0) {
          for (let i = 0; i < cola.length; i++) {
            const par_key = cola[i].dir_webcam ? cola[i].dir_webcam.replace('_', '').replace('_', '') : ''
            if (par.key === par_key) {
              console.log('imagen encolada de vuelta', par.contador)
              // mando 2 frames
              this.send_i += 1
              this.sendFrame(this.send_i)
              //send_i += 1
              //sendFrame(send_i)
            }
          }
        }
      })

  }

  sendSnapshot = (iii, par_key, par_frames) => {
    if (iii > par_frames) {
      clearInterval(this.inter)
      this.inter = null
      this.setState({
        label: null,
        deviceId: null,
        durationWebcam: '',
        selectedWebcam: false,
        webcamRecording: false
      })
      return
    }

    let dataURL = this.webcamRef.current.getScreenshot()
    this.frames[iii] =  { key: par_key, image: dataURL, url_callback: process.env.REACT_APP_URL_CALLBACK_QUEUE }

    console.log('saving frame num:', iii, 'of', par_frames)
  }

  sendFrame = (send_iii, par_frames) => {
    if (send_iii > par_frames) {
      return
    }
    let frame = this.frames[send_iii] || null
    if (frame !== null) {
      socketPy.emit('input image', frame)
      this.frames[send_iii] = null
      console.log('frame num:', send_iii, 'of', par_frames)
    } else {
      console.log('...NO frame num:', send_iii, 'of', par_frames)
      let that = this
      setTimeout(function () {
        that.sendFrame(that.send_i, par_frames)
      }, 1000)
    }
  }

  porcentaje = i => {
    const cola = this.state.cola || []
    const action = cola[i].log
    //sumar 2 cada segundo
    if (cola[i].porc < 90) {
      if (cola[i].log === 'detecting') {
        cola[i].porc = cola[i].porc + 2
      } else {
        clearTimeout(this.intervals[i])
        this.intervals[i] = null
        cola[i].porc = 90
      }
    } else {
      clearTimeout(this.intervals[i])
      this.intervals[i] = null
    }
    //console.log('......image........', cola[i].log, cola[i].porc)
    const porc = cola[i].porc
    this.setState(
      { cola: cola },
      function() {
        if (action === 'detecting' && porc < 90) {
          this.intervals[i] = setTimeout(function() { this.porcentaje(i) }.bind(this), 1000)
        }
      }
    )
  }

  sendWebcamFrames = async (name, durationWebcam) => {
    if (this.webcamRef.current) {
      const frames = Math.floor(parseFloat(durationWebcam) * 25)
      console.log(durationWebcam, name, frames)
      let image_base64, image_buffer
      for (let i = 0; i < frames; i++) {
        image_base64 = this.webcamRef.current.getScreenshot()
        image_buffer = Buffer.from(image_base64, 'base64')
        console.log('sending frame', i, 'of', frames, image_base64, image_buffer)
        // sendWebcamFrameBuf
        api.sendWebcamFrameB64(name, image_base64)
          .then(r => {
            console.log('send frame: ' + i + ' response: ', r)
          })
          .catch(e => {
            console.log('send frame: ' + i + ' ERROR: ', e)
          })
      }
      console.log('sending frame null')
      // sendWebcamFrameBuf
      api.sendWebcamFrameB64(name, '')
        .then(r => {
          console.log('send frame null response: ', r)
        })
        .catch(e => {
          console.log('send frame null ERROR: ', e)
        })

      this.setState({
        label: null,
        deviceId: null,
        durationWebcam: '',
        selectedWebcam: false,
        webcamRecording: false
      })
    }
  }

  componentDidMount = () => {
      this.setState({ isLoading: true })
      //await api.getModelsAwsS3()
      //        .then(res => {
      //          this.setState({ models: res.data.data })
      //        })
      //        .catch(err => {
      //          console.log(err)
      //        })
      if (process.env.REACT_APP_CURR_MODEL_1) {
        this.setState({
          models: [
            {
              ckpt_dir: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'ckpt_dir' ? true : false,
              frozen_inference_graph: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'frozen_inference_graph' ? true : false,
              saved_model_dir: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'saved_model_dir' ? true : false,
              saved_model_root: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'saved_model_root' ? true : false,
              model: process.env.REACT_APP_CURR_MODEL_0.split('#')[0],
              model_txt: process.env.REACT_APP_CURR_MODEL_0.split('#')[2],
            },
            {
              ckpt_dir: process.env.REACT_APP_CURR_MODEL_1.split('#')[1] === 'ckpt_dir' ? true : false,
              frozen_inference_graph: process.env.REACT_APP_CURR_MODEL_1.split('#')[1] === 'frozen_inference_graph' ? true : false,
              saved_model_dir: process.env.REACT_APP_CURR_MODEL_1.split('#')[1] === 'saved_model_dir' ? true : false,
              saved_model_root: process.env.REACT_APP_CURR_MODEL_1.split('#')[1] === 'saved_model_root' ? true : false,
              model: process.env.REACT_APP_CURR_MODEL_1.split('#')[0],
              model_txt: process.env.REACT_APP_CURR_MODEL_1.split('#')[2],
            }
          ]
        })
      } else {
        this.setState({
          models: [
            {
              ckpt_dir: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'ckpt_dir' ? true : false,
              frozen_inference_graph: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'frozen_inference_graph' ? true : false,
              saved_model_dir: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'saved_model_dir' ? true : false,
              saved_model_root: process.env.REACT_APP_CURR_MODEL_0.split('#')[1] === 'saved_model_root' ? true : false,
              model: process.env.REACT_APP_CURR_MODEL_0.split('#')[0],
              model_txt: process.env.REACT_APP_CURR_MODEL_0.split('#')[2],
            }
          ]
        })
      }

      window.addEventListener('changeLanguage', this.changeLanguage)
      this.setState({ isLoading: false })
  }

  componentWillUnmount = () => {
    window.removeEventListener('changeLanguage', this.changeLanguage)
  }

  changeLanguage = ({ detail }) => {
    this.setState({
      errors: errors_lang[detail],
      labels: labels_lang[detail],
    })
  }

  handleChangeInputUpload = (event) => {
    const file = event.target.files[0]
    if (!['image', 'video'].includes(file.type.split('/')[0])) {
      event.preventDefault()
      this.uploadInputRef.current.value = ''
      this.setState(
        {
          errorUpload: this.state.errors['only_valid_files']
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
        }
      )
      return
    }

    this.setState({ selectedFile: file })
  }

  handleChangeInputUploadCalibration = (event) => {
    const file = event.target.files[0]
    if (!['image'].includes(file.type.split('/')[0])) {
      event.preventDefault()
      this.uploadInputRefCalibration.current.value = ''
      this.setState(
        {
          errorCalibration: this.state.errors['only_images']
        },
        () => {
          setTimeout(() => { this.setState({ errorCalibration: null }) }, 5000)
        }
      )
      return
    }

    this.setState({ selectedFileCalibration: file })
  }

  handleUpload = async e => {

    if (this.state.selectedFile.size > 100000000) { // 100 mb.
      this.setState(
        {
          errorUpload: this.state.errors['max_size_file'],
          uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
        }
      )
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
      return
    }

    this.setState({ isLoading: true, log: 'waiting', })

    const name = "File_" + Date.now() + '_' + this.state.selectedFile.name
    let _id, dir
    let is_error = false
    const payload = this.payload(name)
    await api.createSubmit(payload)
      .then(async res => {
        this.setState({ _id: res.data._id, dir: res.data._id + "_" + name })
        _id = res.data._id
        dir = res.data._id + "_" + name
        const payload2 = this.payload(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + _id + "_" + name + '/' + name)
        await api.updateSubmit(_id, payload2)
          .then()
          .catch(e => {
            console.log('update submit ERROR: ', e)
            is_error = true
          })
      })
      .catch(e => {
        console.log('create submit ERROR: ', e)
        is_error = true
      })

    //let uploadedFile = ''

    if (!is_error) {
      // Create an object of formData
      const formData = new FormData()
      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFile,
        name
      )
      await api.createUploadFileAwsS3(formData, dir)
        .then(res => {
          //uploadedFile = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + res.data.originalname
          this.setState({ uploadedFile: res.data.originalname })
        })
        .catch(e => {
          console.log('Upload file ERROR: ', e)
          is_error = true
        })
    }

    if (this.processVideoRoiButtonRef.current) {
      this.processVideoRoiButtonRef.current.style.backgroundColor = '#83a8bc'
    }
    if (this.processVideoButtonRef.current) {
      this.processVideoButtonRef.current.style.backgroundColor = '#83a8bc'
    }
    if (this.processPictureButtonRef.current) {
      this.processPictureButtonRef.current.style.backgroundColor = '#83a8bc'
    }
    this.pressButton = null
/*
    if (!is_error) {
      const type = this.state.selectedFile.type.split('/')[0]
      if (type === 'video') {
        await api.imageVideoAwsS3(uploadedFile)
          .then(res => {
            this.setState({ render: 'now : ' + Date.now() })
          })
          .catch(e => console.log('Image Video file ERROR: ', e))
      }
    }
*/

    this.setState({ isLoading: false })
  }

  handleCalibration = async e => {
    if (!this.state.selectedFileCalibration || !this.state.cms || !this.state.model) {
      return
    }
    if (this.state.cms <= 0) {
      return
    }

    if (this.state.selectedFileCalibration.size > 30000000) {
      this.setState(
        {
          errorCalibration: this.state.errors['max_size_file'],
          uploadedFileCalibration: '', selectedFileCalibration: '', resultFileCalibration: '', total_fishCalibration: null, cms: null, width_pxs_x_cm: null, isLoading: false, cancelarWaitingCalibration: false,
        },
        () => {
          setTimeout(() => { this.setState({ errorCalibration: null }) }, 5000)
        }
      )
      if (this.uploadInputRefCalibration.current) {
        this.uploadInputRefCalibration.current.value = ''
      }
      return
    }

    this.setState({ isLoading: true, log: 'waiting', })

    const name = "FileCalibration_" + Date.now() + '_' + this.state.selectedFileCalibration.name
    const dir = ''
    let uploadedFileCalibration = ''
    let is_error = false

    // Create an object of formData
    const formData = new FormData()
    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFileCalibration,
      name
    )
    await api.createUploadFileAwsS3(formData, dir)
      .then(res => {
        uploadedFileCalibration = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + res.data.originalname
        this.setState({ uploadedFileCalibration: res.data.originalname, resultFileCalibration: '', total_fishCalibration: null })
      })
      .catch(e => {
        console.log('Upload Calibration file ERROR: ', e)
        is_error = true
      })

    if (!is_error) {
      api.pictureCalibrationFishAwsS3(uploadedFileCalibration, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + this.state.model, this.state.cms)
        .then(res => {
          this.setState({
            total_fishCalibration: res.data.total_fish,
            width_pxs_x_cm: res.data.width_pxs_x_cm === '' ? null : res.data.width_pxs_x_cm,
            resultFileCalibration: res.data.resultFileCalibration, isLoading: false,
          },
          () => {
            setTimeout(() => { this.setState({ uploadedFileCalibration:'', resultFileCalibration:''  }) }, 5000)
          }
        )
          if (res.data.total_fish !== null && (res.data.total_fish > 1 || res.data.total_fish === 0)) {
            this.setState(
              {
                errorCalibration: this.state.errors['only_one_fish'],
              },
              () => {
                setTimeout(() => { this.setState({ errorCalibration: null, uploadedFileCalibration:'', resultFileCalibration:''  }) }, 5000)
              }
            )
          }
        })
        .catch(e => {
          console.log('Picture Calibration Fish ERROR: ', e)

          if (e.request.timeout === 29000) {
            this.setState({
              errorCalibration: this.state.errors['long_process'], //isLoading: false,
              cancelarWaitingCalibration: true,
            },
            () => {
              setTimeout(() => { this.setState({ errorCalibration: null }) }, 5000)
            })
            this.intervalCalibration = setInterval(this.s3DemonCalibration, 5000)
          } else {
            this.setState({
              errorCalibration: this.state.errors['error_process'], uploadedFileCalibration: '', selectedFileCalibration: '', resultFileCalibration: '', total_fishCalibration: null, cms: null, width_pxs_x_cm: null, isLoading: false, cancelarWaitingCalibration: false,
            },
            () => {
              setTimeout(() => { this.setState({ errorCalibration: null }) }, 5000)
            })
            if (this.uploadInputRefCalibration.current) {
              this.uploadInputRefCalibration.current.value = ''
            }
            clearInterval(this.intervalCalibration)
          }

        })
    }

  }

  payload = (name) => {
    const type = this.state.optUpload ? this.state.selectedFile.type.split('/')[0] : 'webcam'
    if (type === 'video' || type === 'webcam') {
      return {
        file: name,
        type: type,
        file_csv_result: name + '_csv_result.csv',
        file_video_result: name + '_video_result.mp4',
        file_images_zip_result: name + '_images_zip_result.zip'
      }
    } else {
      return {
        file: name,
        type: type,
        file_csv_result: name + '_csv_result.csv',
        file_image_result: name + '_image_result.png',
        file_images_zip_result: name + '_images_zip_result.zip'
      }
    }
  }

  handleVideoRoiProcess = e => {
    this.setState({ isLoading: true })
    const { selectedFile, uploadedFile, _id, dir, model, width_cms, width_pxs_x_cm } = this.state

    if (dir !== null) {
      if (this.processVideoRoiButtonRef.current) {
        this.processVideoRoiButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoRoiButton'
      }
      api.videoRoiCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + dir + '/' + uploadedFile, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + model, width_cms, width_pxs_x_cm)
        .then(res => {
          //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
        })
        .catch(e => {
          console.log('Video Roi Count Fish ERROR: ', e.response, e.request, e.message, e)

          this.reRunProcess(uploadedFile)

          //if (e.request.timeout === 29000) {
          //  this.setState({
          //    error: this.state.errors['long_process'], //isLoading: false,
          //    cancelarWaiting: true,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  this.interval = setInterval(this.s3Demon, 5000)
          //} else {
          //  this.setState({
          //    error: this.state.errors['error_process'], uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  if (this.uploadInputRef.current) {
          //    this.uploadInputRef.current.value = ''
          //  }
          //  clearInterval(this.interval)
          //}

        })
      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'videoRoiCountFishAwsS3',
          selectedFile: selectedFile,
          uploadedFile: uploadedFile,
          total_fish: 0,
          _id: _id,
          dir: dir,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          log: 'waiting',
          info: '',
          times: 1,
        }
      )
      this.setState({
          errorUpload: this.state.errors['process_queue'], uploadedFile: '', selectedFile: '', total_fish: null, cancelarWaiting: false, cola: cola,
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
      })
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
    }
    this.setState({ isLoading: false })
  }

  handleVideoProcess = e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { selectedFile, uploadedFile, _id, dir, model, width_cms, width_pxs_x_cm } = this.state

    if (dir !== null) {
      if (this.processVideoButtonRef.current) {
        this.processVideoButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoButton'
      }
      api.videoCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + dir + '/' + uploadedFile, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + model, width_cms, width_pxs_x_cm)
        .then(res => {
          //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
        })
        .catch(e => {
          console.log('Video Count Fish ERROR: ', e.response, e.request, e.message, e)

          this.reRunProcess(uploadedFile)

          //if (e.request.timeout === 29000) {
          //  this.setState({
          //    error: this.state.errors['long_process'], //isLoading: false,
          //    cancelarWaiting: true,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  this.interval = setInterval(this.s3Demon, 5000)
          //} else {
          //  this.setState({
          //    error: this.state.errors['error_process'], uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  if (this.uploadInputRef.current) {
          //    this.uploadInputRef.current.value = ''
          //  }
          //  clearInterval(this.interval)
          //}

        })
      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'videoCountFishAwsS3',
          selectedFile: selectedFile,
          uploadedFile: uploadedFile,
          total_fish: 0,
          _id: _id,
          dir: dir,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          log: 'waiting',
          info: '',
          times: 1,
        }
      )
      this.setState({
          errorUpload: this.state.errors['process_queue'], uploadedFile: '', selectedFile: '', total_fish: null, cancelarWaiting: false, cola: cola,
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
      })
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
    }
    this.setState({ isLoading: false })
  }

  getImageDimensions = (file) => {
    return new Promise (function (resolved, rejected) {
      var i = new Image()
      i.onload = function(){
        resolved({w: i.width, h: i.height})
      }
      i.onerror = rejected
      i.src = file
    })
  }

  getImageSrc = (file) => {
    return new Promise (function (resolved, rejected) {
      var i = new Image()
      i.onload = function(){
        resolved({src: i.src})
      }
      i.onerror = rejected
      i.src = file
    })
  }

  handleVideoRoiProcessWebcam = async e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { _id_webcam, dir_webcam, model, width_cms, width_pxs_x_cm, durationWebcam, deviceId, } = this.state
    const name = 'Webcam_' + dir_webcam.split('_Webcam_')[1]

    if (dir_webcam !== null) {
      if (this.processVideoRoiButtonRef.current) {
        this.processVideoRoiButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoRoiButton'
      }
      const img = this.webcamRef.current.getScreenshot()
      let width, height
      await this.getImageDimensions(img)
        .then(data => {
          //console.log(data)
          width = data.w
          height = data.h
        })
        .catch(err => {
          console.log('Webcam dim image ERROR: ', err.response, err.request, err.message, err)
        })
      api.webcamVideoRoiCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + dir_webcam + '/' + name, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + model, width_cms, width_pxs_x_cm, 0, durationWebcam, width, height)
        .then(res => {
          //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
        })
        .catch(e => {
          console.log('Webcam Video Roi Count Fish ERROR: ', e.response, e.request, e.message, e)

          this.reRunProcess(name)

          //if (e.request.timeout === 29000) {
          //  this.setState({
          //    error: this.state.errors['long_process'], //isLoading: false,
          //    cancelarWaiting: true,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  this.interval = setInterval(this.s3Demon, 5000)
          //} else {
          //  this.setState({
          //    error: this.state.errors['error_process'], uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  if (this.uploadInputRef.current) {
          //    this.uploadInputRef.current.value = ''
          //  }
          //  clearInterval(this.interval)
          //}

        })
      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'webcamVideoRoiCountFishAwsS3',
          total_fish: 0,
          _id_webcam: _id_webcam,
          dir_webcam: dir_webcam,
          name: name,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          durationWebcam: durationWebcam,
          deviceId: deviceId,
          width: width,
          height: height,
          log: 'waiting',
          info: '',
          times: 1,
        }
      )
      this.setState({
          errorWebcam: this.state.errors['process_queue'], total_fish: null, cancelarWaiting: false, cola: cola, webcamRecording: true,
        },
        () => {
          let that = this
          setTimeout(() => { this.setState({ errorWebcam: null }) }, 5000)
          this.inter = setInterval(function () {
            that.i += 1
            const par_key = dir_webcam.replace('_', '').replace('_', '')
            const par_frames = durationWebcam * 25
            that.sendSnapshot(that.i, par_key, par_frames)
          }, 40)
          setTimeout(function () {
            that.send_i += 1
            const par_frames = durationWebcam * 25
            that.sendFrame(that.send_i, par_frames)
          }, 1000)
      })
    }
    this.setState({ isLoading: false })
  }

  handleVideoRoiProcessWebcamIframe = async e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { _id_webcam, dir_webcam, model, width_cms, width_pxs_x_cm, durationWebcam, deviceId, } = this.state
    const name = 'Webcam_' + dir_webcam.split('_Webcam_')[1]

    if (dir_webcam !== null) {
      if (this.processVideoRoiButtonRef.current) {
        this.processVideoRoiButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoRoiButton'
      }
      const img = this.webcamRef.current.getScreenshot()
      let width, height
      await this.getImageDimensions(img)
        .then(data => {
          //console.log(data)
          width = data.w
          height = data.h
        })
        .catch(err => {
          console.log('Webcam dim image ERROR: ', err.response, err.request, err.message, err)
        })

      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'webcamvideoroicountfishawss3iframesockets',
          total_fish: 0,
          _id_webcam: _id_webcam,
          dir_webcam: dir_webcam,
          name: name,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          durationWebcam: durationWebcam,
          deviceId: deviceId,
          width: width,
          height: height,
          log: 'waiting',
          info: '',
          times: 1,
          iframe: true,
        }
      )
      this.setState({
          errorWebcam: this.state.errors['process_queue'], total_fish: null, cancelarWaiting: false, cola: cola, webcamRecording: true,
        },
        () => {
          setTimeout(() => { this.setState({ errorWebcam: null }) }, 5000)
          //const msec = durationWebcam * 1000
          //setTimeout(() => { this.setState({ label: null, deviceId: null, durationWebcam: '', selectedWebcam: false, webcamRecording: false }) }, msec)
      })
    }
    this.setState({ isLoading: false })
  }

  handleVideoProcessWebcam = async e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { _id_webcam, dir_webcam, model, width_cms, width_pxs_x_cm, durationWebcam, deviceId, } = this.state
    const name = 'Webcam_' + dir_webcam.split('_Webcam_')[1]

    if (dir_webcam !== null) {
      if (this.processVideoButtonRef.current) {
        this.processVideoButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoButton'
      }
      const img = this.webcamRef.current.getScreenshot()
      let width, height
      await this.getImageDimensions(img)
        .then(data => {
          //console.log(data)
          width = data.w
          height = data.h
        })
        .catch(err => {
          console.log('Webcam dim image ERROR: ', err.response, err.request, err.message, err)
        })
      api.webcamVideoCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + dir_webcam + '/' + name, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + model, width_cms, width_pxs_x_cm, 0, durationWebcam, width, height)
        .then(res => {
          //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
        })
        .catch(e => {
          console.log('Webcam Video Count Fish ERROR: ', e.response, e.request, e.message, e)

          this.reRunProcess(name)

          //if (e.request.timeout === 29000) {
          //  this.setState({
          //    error: this.state.errors['long_process'], //isLoading: false,
          //    cancelarWaiting: true,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  this.interval = setInterval(this.s3Demon, 5000)
          //} else {
          //  this.setState({
          //    error: this.state.errors['error_process'], uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  if (this.uploadInputRef.current) {
          //    this.uploadInputRef.current.value = ''
          //  }
          //  clearInterval(this.interval)
          //}

        })
      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'webcamVideoCountFishAwsS3',
          total_fish: 0,
          _id_webcam: _id_webcam,
          dir_webcam: dir_webcam,
          name: name,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          durationWebcam: durationWebcam,
          deviceId: deviceId,
          width: width,
          height: height,
          log: 'waiting',
          info: '',
          times: 1,
        }
      )
      this.setState({
          errorWebcam: this.state.errors['process_queue'], total_fish: null, cancelarWaiting: false, cola: cola, webcamRecording: true,
        },
        () => {
          let that = this
          setTimeout(() => { this.setState({ errorWebcam: null }) }, 5000)
          this.inter = setInterval(function () {
            that.i += 1
            const par_key = dir_webcam.replace('_', '').replace('_', '')
            const par_frames = durationWebcam * 25
            that.sendSnapshot(that.i, par_key, par_frames)
          }, 40)
          setTimeout(function () {
            that.send_i += 1
            const par_frames = durationWebcam * 25
            that.sendFrame(that.send_i, par_frames)
          }, 1000)
      })
    }
    this.setState({ isLoading: false })
  }

  handleVideoProcessWebcamIframe = async e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { _id_webcam, dir_webcam, model, width_cms, width_pxs_x_cm, durationWebcam, deviceId, } = this.state
    const name = 'Webcam_' + dir_webcam.split('_Webcam_')[1]

    if (dir_webcam !== null) {
      if (this.processVideoButtonRef.current) {
        this.processVideoButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processVideoButton'
      }
      const img = this.webcamRef.current.getScreenshot()
      let width, height
      await this.getImageDimensions(img)
        .then(data => {
          //console.log(data)
          width = data.w
          height = data.h
        })
        .catch(err => {
          console.log('Webcam dim image ERROR: ', err.response, err.request, err.message, err)
        })

      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'webcamvideocountfishawss3iframesockets',
          total_fish: 0,
          _id_webcam: _id_webcam,
          dir_webcam: dir_webcam,
          name: name,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          durationWebcam: durationWebcam,
          deviceId: deviceId,
          width: width,
          height: height,
          log: 'waiting',
          info: '',
          times: 1,
          iframe: true,
        }
      )
      this.setState({
          errorWebcam: this.state.errors['process_queue'], total_fish: null, cancelarWaiting: false, cola: cola, webcamRecording: true,
        },
        () => {
          setTimeout(() => { this.setState({ errorWebcam: null }) }, 5000)
          //const msec = durationWebcam * 1000
          //setTimeout(() => { this.setState({ label: null, deviceId: null, durationWebcam: '', selectedWebcam: false, webcamRecording: false,  }) }, msec)
      })
    }
    this.setState({ isLoading: false })
  }

  handlePictureProcess = e => {
    this.setState({ isLoading: true, log: 'waiting', })
    const { selectedFile, uploadedFile, _id, dir, model, width_cms, width_pxs_x_cm } = this.state

    if (dir !== null) {
      if (this.processPictureButtonRef.current) {
        this.processPictureButtonRef.current.style.backgroundColor = '#d68977'
        this.pressButton = 'processPictureButton'
      }
      api.pictureCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + dir + '/' + uploadedFile, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + model, width_cms, width_pxs_x_cm)
        .then(res => {
          //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
        })
        .catch(e => {
          console.log('Picture Count Fish ERROR: ', e.response, e.request, e.message, e)

          this.reRunProcess(uploadedFile)

          //if (e.request.timeout === 29000) {
          //  this.setState({
          //    error: this.state.errors['long_process'], //isLoading: false,
          //    cancelarWaiting: true,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  this.interval = setInterval(this.s3Demon, 5000)
          //} else {
          //  this.setState({
          //    error: this.state.errors['error_process'], uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false,
          //  },
          //  () => {
          //    setTimeout(() => { this.setState({ error: null }) }, 5000)
          //  })
          //  if (this.uploadInputRef.current) {
          //    this.uploadInputRef.current.value = ''
          //  }
          //  clearInterval(this.interval)
          //}

        })
      // lo añado a la cola de procesos
      const cola = this.state.cola || []
      this.intervals.push(null)
      cola.push(
        {
          api: 'pictureCountFishAwsS3',
          selectedFile: selectedFile,
          uploadedFile: uploadedFile,
          total_fish: 0,
          _id: _id,
          dir: dir,
          model: model,
          width_cms: width_cms,
          width_pxs_x_cm: width_pxs_x_cm,
          log: 'waiting',
          info: '',
          times: 1,
        }
      )
      this.setState({
          errorUpload: this.state.errors['process_queue'], uploadedFile: '', selectedFile: '', total_fish: null, cancelarWaiting: false, cola: cola,
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
      })
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
    }
    this.setState({ isLoading: false })
  }

  reRunProcess = uploadedFile_name => {
    const cola = this.state.cola || []

    for (let i = 0; i < cola.length; i++) {
      const uploadedFile = cola[i].uploadedFile || ''
      const name = cola[i].name || ''
      if (uploadedFile_name === uploadedFile || uploadedFile_name === name) {
        if (cola[i].log === 'waiting') {
          if (cola[i].times >= 6) {
            cola[i].info = 'error'
            this.setState({ cola: cola })
            return
          }
          cola[i].info = this.state.labels['tried'] + ' ' + cola[i].times  + ' / 5 ' + this.state.labels['times']
          cola[i].times += 1
          this.setState({ cola: cola })

          // es diferente llamada para webcam - que lo sepas.
          //api[cola[i].api](process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + cola[i].dir + '/' + cola[i].uploadedFile, 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + cola[i].model, cola[i].width_cms, cola[i].width_pxs_x_cm)
          //  .then(res => {
              //this.setState({ total_fish: res.data.total_fish, isLoading: false, })
          //  })
          //  .catch(e => {
          //    console.log('Rerun Process ERROR: ', e.response, e.request, e.message, e)

          //    this.reRunProcess(uploadedFile)

          //  })

          // voy a simular el lanzamiento del proceso, 29 segundos despues.
          setTimeout(function () {
            this.reRunProcess(uploadedFile)
          }.bind(this), 29000)

        } else {
          return
        }
      }
    }

  }

/*
  s3Demon = async () => {
    this.setState({
      error: this.state.errors['waiting'],
    },
    () => {
      setTimeout(() => { this.setState({ error: null }) }, 2000)
    })
    console.log('buscando en s3')
    const csv = 'submits/' + this.state.dir + '/' +  this.state.uploadedFile + '_csv_result.csv'
    const video = 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_video_result.mp4'
    const image = 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_image_result.png'
    const zip = 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_images_zip_result.zip'
    const type = this.state.selectedFile.type.split('/')[0] || ''
    let csv_exists = false
    let video_exists = false
    let image_exists = false
    let zip_exists = false
    await api.fileExitsAwsS3({ bucket: process.env.REACT_APP_AWS_BUCKET, file: csv })
      .then(res => {
        csv_exists = res.data.success
      })
      .catch(err => {
        console.log('object csv exits error - ', err)
      })
    if (type === 'image') {
      await api.fileExitsAwsS3({ bucket: process.env.REACT_APP_AWS_BUCKET, file: image })
        .then(res => {
          image_exists = res.data.success
        })
        .catch(err => {
          console.log('object image exits error - ', err)
        })
    } else {
      await api.fileExitsAwsS3({ bucket: process.env.REACT_APP_AWS_BUCKET, file: video })
        .then(res => {
          video_exists = res.data.success
        })
        .catch(err => {
          console.log('object video exits error - ', err)
        })
    }
    await api.fileExitsAwsS3({ bucket: process.env.REACT_APP_AWS_BUCKET, file: zip })
      .then(res => {
        zip_exists = res.data.success
      })
      .catch(err => {
        console.log('object zip exits error - ', err)
      })

    if (type === 'image') {
      if (csv_exists && image_exists && zip_exists) {
        this.setState({ isLoading: false, total_fish: 0, cancelarWaiting: false, })
        clearInterval(this.interval)
      }
    } else {
      if (csv_exists && video_exists && zip_exists) {
        this.setState({ isLoading: false, total_fish: 0, cancelarWaiting: false, })
        clearInterval(this.interval)
      }
    }
    console.log(csv_exists, video_exists, image_exists, zip_exists)
  }
*/

  s3DemonCalibration = async () => {
    this.setState({
      errorCalibration: this.state.errors['waiting'],
    },
    () => {
      setTimeout(() => { this.setState({ errorCalibration: null }) }, 2000)
    })
    console.log('buscando en s3')
    const image_filter = 'submits/' + this.state.uploadedFileCalibration

    let image_filter_exists = false
    let resultFileCalibration = ''
    let total_fishCalibration = ''
    let width_pxs_x_cm = ''
    await api.fileExitsFilterAwsS3({ bucket: process.env.REACT_APP_AWS_BUCKET, filter: image_filter })
      .then(res => {
        image_filter_exists = res.data.success
        resultFileCalibration = res.data.resultFileCalibration || ''
        total_fishCalibration = res.data.total_fishCalibration || ''
        width_pxs_x_cm = res.data.width_pxs_x_cm || ''
      })
      .catch(err => {
        console.log('object image filter exits error - ', err)
      })

    if (image_filter_exists) {
      this.setState({ isLoading: false, total_fishCalibration: total_fishCalibration,
      width_pxs_x_cm: width_pxs_x_cm === '' ? null : width_pxs_x_cm,
      resultFileCalibration: resultFileCalibration, cancelarWaitingCalibration: false, })
      clearInterval(this.intervalCalibration)
    }

    //console.log(image_filter_exists)
  }

  handleCancel = e => {
    this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, isLoading: false, cancelarWaiting: false, optUpload: false, optWebcam: false, label: null, deviceId: null, selectedWebcam: false, durationWebcam: null, webcamRecording: null })
    if (this.uploadInputRef.current) {
      this.uploadInputRef.current.value = ''
    }
    clearInterval(this.interval)
  }

  handleCancelCalibration = e => {
    this.setState({ uploadedFileCalibration: '', selectedFileCalibration: '', resultFileCalibration: '', total_fishCalibration: null, cms: null, width_pxs_x_cm: null, isLoading: false, cancelarWaitingCalibration: false, })
    if (this.uploadInputRefCalibration.current) {
      this.uploadInputRefCalibration.current.value = ''
    }
    clearInterval(this.intervalCalibration)
  }

  handleList = e => {
    if (!e.target.value) {
      this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, model: '', optUpload: false, optWebcam: false, })
      this.uploadInputRef.current.value = ''
    } else {
      this.setState({ model: e.target.value })
    }
  }

  handleChangeInputNumberCalibration = e => {
    this.setState({ cms: e.target.value })
  }

  handleChangeInputNumberDurationWebcam = e => {
    if (e.target.value > 3600) {
      e.preventDefault()
      this.setState(
        {
          errorUpload: this.state.errors['max_duration']
        },
        () => {
          setTimeout(() => { this.setState({ errorUpload: null }) }, 5000)
        }
      )
      return
    } else {
      this.setState({ durationWebcam: e.target.value })
    }
  }

  fileData = () => {
    const file = this.state.uploadedFile ? process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  this.state.uploadedFile : ''
    if (this.state.optUpload && this.state.selectedFile) {
      const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
      return (
        <div className="submitfile__header-right--file submitfile__col">
          <div className="submitfile__title--green">
            {this.state.labels['tit_fil_details'](type ? type : '---')}
          </div>
          <hr />
          <div className="submitfile__header-right--file submitfile__col">
            <div className="submitfile__text">{this.state.labels['tit_fil_name'](this.state.selectedFile ? this.state.selectedFile.name : '---')}</div>
            <div className="submitfile__text">{this.state.labels['tit_fil_type'](this.state.selectedFile ? this.state.selectedFile.type : '---')}</div>
            <div className="submitfile__text">{this.state.labels['tit_fil_size'](this.state.selectedFile ? this.state.selectedFile.size : '---')}</div>
            {file && (
              <div className="submitfile__text--green">
                <a href={file} rel="noopener noreferrer" target="_blank">{this.state.labels['tit_dow_uploaded']}</a>
              </div>
            )}
          </div>
        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  webcamData = () => {
    if (this.state.optWebcam && this.state.durationWebcam && this.state.selectedWebcam) {

      if (!this.state.deviceId && !this.state.label) {
        navigator.mediaDevices.enumerateDevices()
          .then(mediaDevices => {
            var label, deviceId
            mediaDevices.forEach((item, i) => {
              if (item.kind === 'videoinput') {
                if (!label && !deviceId) {
                  label = item.label
                  deviceId = item.deviceId
                  if (this.state.label !== item.label || this.state.deviceId !== item.deviceId) {
                    this.setState({
                      label: 'Selected Camera', //item.label,
                      deviceId: '0', //item.deviceId,
                    })
                  }
                }
              }
            })
          })
          .catch(err => {
            console.log('media devices error: ', err)
          })
      }

      //if (!this.state.label) {
      //  setTimeout(function() {
      //    this.setState({
      //      render: Date.now(),
      //    })
      //  }.bind(this), 1000)
      //}

      return (
        <div className="submitfile__header-right--file submitfile__col">
          <div className="submitfile__title--green">
            {this.state.labels['tit_camera']}
          </div>
          <hr />
          <div className="submitfile__col">
            {this.state.deviceId && (
              <>
                {this.state.selectedWebcam && (
                  <Webcam
                    className={this.state.webcamRecording ? "submitfile__header--box-webcam-red" : "submitfile__header--box-webcam"}
                    audio={false}
                    ref={this.webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ deviceId: this.state.deviceId }}
                    forceScreenshotSourceSize={true}
                  />
                )}
                {/*!this.state.selectedWebcam && (
                  <div className="submitfile__header--box-webcam-border"></div>
                )*/}
                <div>
                  <span>{this.state.labels['tit_device'] + (this.state.deviceId ? ' ' + this.state.deviceId : ' 0') + (this.state.label ? ' - ' + this.state.label : '')}</span><span style={{ color: 'red' }}>{this.state.webcamRecording ? ' - ' + this.state.labels['tit_recording'] : ''}</span>
                </div>
              </>
            )}
            {!this.state.deviceId && (
              <div className="submitfile__text--green">
                {this.state.labels['tit_webcam_no_found']}
              </div>
            )}
          </div>
        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  imageData = () => {
    //const image = this.state.uploadedFile ?
    //  process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile :
    //  ''
    //const image_video = this.state.uploadedFile ?
    //  process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_first_frame_video.png' :
    //  ''
    const imageCalibration = this.state.uploadedFileCalibration ?
      process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.uploadedFileCalibration :
      ''

    //const imageResult = this.state.uploadedFile ?
    //  process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_image_result.png' :
    //  ''
    //const videoResult = this.state.uploadedFile ?
    //  process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_last_frame_video.png' :
    //  ''
    const imageCalibrationResult = this.state.resultFileCalibration ?
      process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + this.state.resultFileCalibration :
      ''

    //const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
    const typeCalibration = this.state.selectedFileCalibration ? this.state.selectedFileCalibration.type.split('/')[0] : ''

    //if (this.state.total_fish !== null) {
    //  if (type === 'image') {
    //    return (
    //      <img src={imageResult} alt="" />
    //    )
    //  } else {
    //    return (
    //      <img src={videoResult} alt="" />
    //    )
    //  }
    //} else if (this.state.uploadedFile) {
    //  if (type === 'image') {
    //    return (
    //      <img src={image} alt="" />
    //    )
    //  } else {
    //    return (
    //      <img src={image_video} alt="" />
    //    )
    //  }
    //} else

    if (this.state.total_fishCalibration !== null) {
      if (typeCalibration === 'image') {
        return (
          <div className="submitfile__header-right--image">
            <img src={imageCalibrationResult} alt="" />
          </div>
        )
      }
    } else if (this.state.uploadedFileCalibration) {
      if (typeCalibration === 'image') {
        return (
          <div className="submitfile__header-right--image">
            <img src={imageCalibration} alt="" />
          </div>
        )
      }
    } else {
      return (
        null
      )
    }
  }

  colaData = () => {
    if (this.state.cola.length > 0) {
      return (
        <div className="submitfile__header-right--file submitfile__col">
          <div className="submitfile__title--green">
            {this.state.labels['tit_cola']}
          </div>
          <div className="submitfile__attention">
            <div className="submitfile__attention--image"><img src={alert} alt="AI peces" /></div>
            <div className="submitfile__attention--text">
              <span className="submitfile__text--green"><strong>{this.state.labels['tit_attention'] + ' '}</strong></span>
              {this.state.labels['tit_attention_text'] + ' '}
              <span className="submitfile__text--green"><a href="mailto:info@aipeces.io">info@aipeces.io</a></span>
            </div>
          </div>
          {this.state.cola.map(
            ele => {
              //const w = { alignSelf: 'flex-start', width: ele.porc ? ele.porc : '0%', marginLeft: '5px', marginTop: '5px' }
              const w = { alignSelf: 'flex-start', width: ele.porc ? Number(ele.porc.toFixed(2)).toString() + '%' : '0%', marginTop: '5px' }
              const c = { color: ele.log === 'waiting' || (ele.log === 'end' && ele.info === 'error') ? 'red' : ele.log === 'end' ? 'green' : 'black' }
              //const url_iframe = process.env.REACT_APP_FLASK_API + '/' + ele.api + '?url_input_video=' + process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + ele.dir_webcam + '/' + ele.name + '&model=' + 's3://' + process.env.REACT_APP_AWS_BUCKET + '/models/' + ele.model.split('#')[0] +  '&width_cms=' + ele.width_cms + '&width_pxs_x_cm=' + ele.width_pxs_x_cm + '&deviceid=' + ele.deviceId + '&duration=' + ele.durationWebcam + '&width=' + ele.width + '&height=' + ele.height + '&url_callback=' + process.env.REACT_APP_URL_CALLBACK
              //const iframe = ele.iframe || false
              //console.log('url webcam', url_iframe)
              return (<>
                <div className="submitfile__col">
                  <strong>
                    {(ele.uploadedFile || ele.name) + ' - '}
                    <span style={c}>{this.state.labels[ele.log] + (ele.info === 'error' ? ' - ' + this.state.labels['error'] : ele.info ? ' - ' + ele.info : '')}</span>
                    {' - ' + (ele.porc ? Number(ele.porc.toFixed(2)).toString() + '%' : '0%')}
                  </strong>
                </div>
                <div className="submitfile__col">
                  {ele.log === 'end' && ele.info !== 'error' ? this.colaFileData(ele) : ''}
                </div>

                {/*(ele.log !== 'end' && ele.name && iframe === true) && (
                  <iframe style={{ display: 'none' }} src={url_iframe} height="500" width="100%" title="webcam python" allow="camera; microphone;"></iframe>
                )*/}

                {/* <div className="submitfile__row"> */}
                  {/* <div style={{ fontSize: '10px' }}>{ele.porc}</div> */}
                  <div style={w}>
                    <hr style={{ borderTop: '5px solid #0091a8' }} />
                  </div>
                {/* </div> */}
                {/* <hr /> */}
              </>)
            })
          }
        </div>
      )
    } else {
      return (
        null
      )
    }

  }

  colaFileData = (state) => {
    const file = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + state.dir + '/' + state.uploadedFile
    const csv = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + (state.dir ? state.dir : state.dir_webcam) + '/' + (state.uploadedFile ? state.uploadedFile : state.name) + '_csv_result.csv'
    const video = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + (state.dir ? state.dir : state.dir_webcam) + '/' + (state.uploadedFile ? state.uploadedFile : state.name) + '_video_result.mp4'
    const image = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + state.dir + '/' + state.uploadedFile + '_image_result.png'
    const zip = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + (state.dir ? state.dir : state.dir_webcam) + '/' + (state.uploadedFile ? state.uploadedFile : state.name) + '_images_zip_result.zip'
    if (state.total_fish !== null) {
      const type = state.selectedFile ? state.selectedFile.type.split('/')[0] : 'video'
      return (
        <div className="submitfile__row-buttons-queue">
          <a className="submitfile__button-video btn" id="processedFileButton" href={type === 'video' ? video : image} target="_blank" rel="noopener noreferrer">{this.state.labels['tit_processed'](type)}</a>
          <a className="submitfile__button-video btn" id="tableButton" href={csv} target="_blank" rel="noopener noreferrer">{this.state.labels['tit_table']}</a>
          <a className="submitfile__button-video btn" id="imagesButton" href={zip} target="_blank" rel="noopener noreferrer">{this.state.labels['tit_det_images']}</a>
        </div>
      )
    } else if (state.uploadedFile !== '') {
      const type = state.selectedFile ? state.selectedFile.type.split('/')[0] : 'video'
      return (
        <div className="submitfile__col">
          <div className="submitfile__title--green">
            {this.state.labels['tit_fil_details'](type)}
          </div>
          <hr />
          <div className="submitfile__col">
            <div className="submitfile__text">{this.state.labels['tit_fil_name'](state.selectedFile.name)}</div>
            <div className="submitfile__text">{this.state.labels['tit_fil_type'](state.selectedFile.type)}</div>
            <div className="submitfile__text">{this.state.labels['tit_fil_size'](state.selectedFile.size)}</div>
            <div className="submitfile__text--green">
              <a href={file} rel="noopener noreferrer" target="_blank">{this.state.labels['tit_dow_uploaded']}</a>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        null
      )
    }
  }

  createSelectItems = () => {
    const { models } = this.state
    let items = []
    items.push(<option key={'#'} value={''}>{this.state.labels['tit_sel_placeholder']}</option>)
    if (models) {
      models.forEach((model, i) => {
        items.push(<option key={model.model + '#saved_model_root'} value={model.model + '#saved_model_root'}>{model.model_txt}</option>)
      })
    }
    return items
  }

  handleOnMouseOver = (ref, txt) => {
    if (txt !== this.pressButton) {
      ref.current.style.backgroundColor = '#d68977'
    }
  }

  handleOnMouseOut = (ref, txt) => {
    if (txt !== this.pressButton) {
      ref.current.style.backgroundColor = '#83a8bc'
    }
  }

  handleOptUpload = (e) => {
    if (this.state.model && !this.state.optUpload) {
      //e.preventDefault()
      this.setState({ optUpload: true, optWebcam: false })
    }
  }

  handleOptWebcam = (e) => {
    if (this.state.model && !this.state.optWebcam) {
      //e.preventDefault()
      this.setState({ optWebcam: true, optUpload: false })
    }
  }

  handleWebcam = async (e) => {
    if (this.state.model && this.state.optWebcam) {
      if (this.state.durationWebcam <= 0) {
        return
      }

      this.setState({ isLoading: true, log: 'waiting', })

      const name = "Webcam_" + Date.now()
      let _id_webcam
      //let dir_webcam
      //let is_error = false
      const payload = this.payload(name)
      await api.createSubmit(payload)
        .then(async res => {
          this.setState({ _id_webcam: res.data._id, dir_webcam: res.data._id + "_" + name })
          _id_webcam = res.data._id
          //dir_webcam = res.data._id + "_" + name
          const payload2 = this.payload(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + _id_webcam + "_" + name + '/' + name)
          await api.updateSubmit(_id_webcam, payload2)
            .then()
            .catch(e => {
              console.log('update submit ERROR: ', e)
              //is_error = true
            })
        })
        .catch(e => {
          console.log('create submit ERROR: ', e)
          //is_error = true
        })

      if (this.processVideoRoiButtonRef.current) {
        this.processVideoRoiButtonRef.current.style.backgroundColor = '#83a8bc'
      }
      if (this.processVideoButtonRef.current) {
        this.processVideoButtonRef.current.style.backgroundColor = '#83a8bc'
      }
      if (this.processPictureButtonRef.current) {
        this.processPictureButtonRef.current.style.backgroundColor = '#83a8bc'
      }
      this.pressButton = null

      this.setState({ isLoading: false, selectedWebcam: true })
    }
  }

  render() {
    console.log('submit file state', this.state)
    //console.log('submit file props', this.props)
    const { isLoading, selectedFile, uploadedFile, total_fish, errorUpload, errorWebcam, errorCalibration, model, selectedFileCalibration, uploadedFileCalibration, width_pxs_x_cm, resultFileCalibration, cms, cancelarWaiting, cancelarWaitingCalibration, log, info, optUpload, optWebcam, durationWebcam, selectedWebcam, webcamRecording, } = this.state
    const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
    const fileData = this.fileData()
    const imageData = this.imageData()
    const colaData = this.colaData()
    const webcamData = this.webcamData()

    return (
      <div className="submitfile">
        <div className="submitfile__header form-group">

          <div className="submitfile__header--title">
            {this.state.labels['tit_obj_det_tool']}
          </div>

          <div className="submitfile__header--select-model">
            <div className="submitfile__numero">1</div>
            <div className="submitfile__numero-peque">1</div>
            <div className="submitfile__col">
              <div className="submitfile__title">{this.state.labels['tit_sel_model']}</div>
              <select name="models" id="listModels" onChange={this.handleList} disabled={isLoading}>
                {this.createSelectItems()}
              </select>
            </div>
          </div>

          <div className={"submitfile__header--upload-file--webcam"}>

            <div className="submitfile__numero-2">2</div>
            <div className="submitfile__numero-peque">2</div>
            <div className="submitfile__col-75">
              <div className={optUpload ? "opt-selected" : "opt-no-selected"} onClick={this.handleOptUpload}>
                <div className="submitfile__col">
                  <div className="submitfile__title">{this.state.labels['tit_select']}</div>
                  <input
                      className="submitfile__header--upload-file--input-file form-control"
                      id="selectedFileInput"
                      type="file"
                      accept='image/*|video/*'
                      onChange={this.handleChangeInputUpload}
                      ref={this.uploadInputRef}
                      disabled={isLoading || webcamRecording || !model ? true : !optUpload ? false : !uploadedFile && optUpload ? false : true}
                  />
                </div>
              </div>

              <div className="submitfile__text--green">{'...' + this.state.labels['tit_or_you_can']}</div>

              <div className={optWebcam ? "opt-selected" : "opt-no-selected"} onClick={this.handleOptWebcam}>
                <div className="submitfile__col">
                  <div className="submitfile__title">{this.state.labels['tit_webcam']}</div>
                  <div className="submitfile__row">
                    <label className="submitfile__text">{this.state.labels['tit_duration'] + ': '}</label>
                    <input
                        className="submitfile__header--box-webcam--input-number form-control"
                        id="InputNumberDurationWebcam"
                        type="number"
                        value={durationWebcam ? durationWebcam : ''}
                        onChange={this.handleChangeInputNumberDurationWebcam}
                        disabled={isLoading || webcamRecording || !model ? true : !optWebcam ? false : !selectedWebcam && optWebcam ? false : true}
                        placeholder={this.state.labels['tit_minutes']}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="submitfile__col-25--upload-file--webcam">

              {(optUpload && selectedFile) && (
                <div className="submitfile__col">
                  <button
                    className="submitfile__button-upload btn"
                    id="uploadButton"
                    onClick={optUpload ? this.handleUpload : this.handleOptUpload}
                    ref={this.uploadButtonRef}
                    disabled={isLoading || webcamRecording || !model ? true : !optUpload ? false : selectedFile && !uploadedFile && optUpload ? false : true}
                  >
                    {this.state.labels['tit_upload']}
                  </button>
                </div>
              )}

              {(optWebcam && durationWebcam) && (
                <div className="submitfile__col">
                  <button
                    className="submitfile__button-upload btn"
                    id="webcamButton"
                    onClick={optWebcam ? this.handleWebcam : this.handleOptWebcam}
                    ref={this.webcamButtonRef}
                    disabled={isLoading || webcamRecording || !model ? true : !optWebcam ? false : durationWebcam && !selectedWebcam && optWebcam ? false : true}
                  >
                    {this.state.labels['tit_select_webcam']}
                  </button>
                </div>
              )}

            </div>

          </div>
          <div className="submitfile__header--error-upload-file--webcam">
            <div className="submitfile__header--error-upload-file--webcam--label-red">
              {errorUpload ? errorUpload : ''}
              {errorWebcam ? errorWebcam : ''}
            </div>
          </div>

          <div className="submitfile__header--buttons">
            <div className="submitfile__numero">3</div>
            <div className="submitfile__numero-peque">3</div>
            <div className="submitfile__col">
              <div className="submitfile__title">
                {this.state.labels['tit_typ_process']}
              </div>

              <div className="submitfile__row-buttons">
                <div className="submitfile__row-75">
                  <div className="submitfile__col-50">
                    <button
                      className="submitfile__button-video btn"
                      id="processVideoRoiButton"
                      ref={this.processVideoRoiButtonRef}
                      onMouseOver={() => this.handleOnMouseOver(this.processVideoRoiButtonRef, 'processVideoRoiButton')}
                      onMouseOut={() => this.handleOnMouseOut(this.processVideoRoiButtonRef, 'processVideoRoiButton')}
                      onClick={optUpload ? this.handleVideoRoiProcess : optWebcam ? this.handleVideoRoiProcessWebcam : null}
                      disabled={isLoading || webcamRecording || !model || total_fish !== null || (type === 'image' && optUpload) ? true : (uploadedFile && optUpload) || (selectedWebcam && optWebcam) ? false : true}
                    >
                      {this.state.labels['tit_roi_video']}
                    </button>

                    <button
                      className="submitfile__button-video btn"
                      id="processVideoButton"
                      ref={this.processVideoButtonRef}
                      onMouseOver={() => this.handleOnMouseOver(this.processVideoButtonRef, 'processVideoButton')}
                      onMouseOut={() => this.handleOnMouseOut(this.processVideoButtonRef, 'processVideoButton')}
                      onClick={optUpload ? this.handleVideoProcess : optWebcam ? this.handleVideoProcessWebcam : null}
                      disabled={isLoading || webcamRecording || !model || total_fish !== null || (type === 'image' && optUpload) ? true : (uploadedFile && optUpload) || (selectedWebcam && optWebcam) ? false : true}
                    >
                      {this.state.labels['tit_video']}
                    </button>
                  </div>

                  <div className="submitfile__col-50">
                    <button
                      className="submitfile__button-video btn"
                      id="processPictureButton"
                      ref={this.processPictureButtonRef}
                      onMouseOver={() => this.handleOnMouseOver(this.processPictureButtonRef, 'processPictureButton')}
                      onMouseOut={() => this.handleOnMouseOut(this.processPictureButtonRef, 'processPictureButton')}
                      onClick={this.handlePictureProcess}
                      disabled={isLoading || webcamRecording || !model || total_fish !== null || type === 'video' ? true : uploadedFile && optUpload ? false : true}
                    >
                      {this.state.labels['tit_picture']}
                    </button>
                  </div>
                </div>

                <div className="submitfile__col-25-buttons">
                  <button className="submitfile__button-cancel btn" id="cancelButton" onClick={this.handleCancel} disabled={(isLoading || webcamRecording || !model) && !cancelarWaiting} >{this.state.labels['tit_cancel'](total_fish)}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="submitfile__header--calibration">
            <div className="submitfile__title--green">
              {this.state.labels['tit_calibration']}
            </div>
            <hr />
            {!width_pxs_x_cm ? (
              <>
                <div className="submitfile__text">
                  {this.state.labels['tit_tex_calibration']}
                </div>
                <div className="submitfile__text">
                  {this.state.labels['tit_tex_sel_calibration']}
                </div>
                <div className="submitfile__row">
                  <div className="submitfile__col-75">
                    <div className="submitfile__text--green">{this.state.labels['tit_sel_calibration']}</div>
                    <input
                        className="submitfile__header--calibration--input-file form-control"
                        id="selectedFileInputCalibration"
                        type="file"
                        accept='image/*|video/*'
                        onChange={this.handleChangeInputUploadCalibration}
                        ref={this.uploadInputRefCalibration}
                        disabled={isLoading || webcamRecording || (uploadedFileCalibration && !resultFileCalibration) || !model ? true : false}
                    />
                    <div className="submitfile__text--green">{this.state.labels['tit_siz_calibration']}</div>
                    <input
                        className="submitfile__header--calibration--input-number form-control"
                        id="InputNumberCalibration"
                        type="number"
                        value={cms ? cms : ''}
                        onChange={this.handleChangeInputNumberCalibration}
                        disabled={isLoading || webcamRecording || (uploadedFileCalibration && !resultFileCalibration) || !model ? true : false}
                        placeholder={this.state.labels['tit_inches']}
                    />
                  </div>
                  <div className="submitfile__col-25">
                    <button className="submitfile__button-calibration btn" id="calibrationButton" onClick={this.handleCalibration} ref={this.calibrationButtonRef} disabled={isLoading || webcamRecording || !model ? true : selectedFileCalibration && cms && (!uploadedFileCalibration || resultFileCalibration)  ? false : true} >{this.state.labels['tit_calibrate']}</button>
                    <button className="submitfile__button-cancel btn" id="cancelCalibrationButton" onClick={this.handleCancelCalibration} disabled={(isLoading || webcamRecording || !model) && !cancelarWaitingCalibration} >{this.state.labels['tit_cancel'](total_fish)}</button>
                  </div>
                </div>
                <div className="submitfile__header--error">
                  <div className="submitfile__header--error--label-red">{errorCalibration ? errorCalibration : ''}</div>
                </div>
              </>
            )
              :
            (
              <>
                <div className="submitfile__text">
                  {this.state.labels['tit_ok_calibration'](width_pxs_x_cm)}
                </div>
                <div className="submitfile__text--green">
                  <a onClick={this.handleCancelCalibration}>{this.state.labels['tit_recalibrate']}</a>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="submitfile__header-right form-group">
          <div className="submitfile__header-right--title">
            {total_fish ?
              <>{this.state.labels['tit_lab_results']}</>
            :
              isLoading || webcamRecording ?
                <>{this.state.labels['tit_lab_processing'] + ' [' + this.state.labels[log] + info + ']'}</>
              :
                uploadedFile || selectedWebcam ?
                  <>{this.state.labels['tit_lab_sel_typ_process']}</>
                :
                  selectedFile || durationWebcam ?
                    <>{this.state.labels['tit_lab_upload']}</>
                  :
                    model ?
                      <>{this.state.labels['tit_lab_sel_file']}</>
                    :
                      <>{this.state.labels['tit_lab_sel_model']}</>
            }
          </div>

          {imageData}

          {fileData}

          {webcamData}

          {colaData}

        </div>
      </div>
    )
  }
}

export default withRouter(SubmitFile)
