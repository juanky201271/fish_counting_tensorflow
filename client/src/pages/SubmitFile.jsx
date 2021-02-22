import React, { Component } from 'react'
import api from '../api'

import './SubmitFile.scss'

class SubmitFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: '',
            uploadedFile: '',
            isLoading: false,
            authenticated: '',
            twitterId: '',
            ip: '',
            user: '',
            total_fish: null,
            _id: null,
            dir: null,
            error: null,
            errorCalibration: null,
            model: '',
            models: null,
            selectedFileCalibration: '',
            uploadedFileCalibration: '',
            resultFileCalibration: '',
            total_fishCalibration: null,
            cms: null,
            width_cms: 250, // without calibration
            width_pxs_x_cm: null, // with calibration
        }
        this.uploadInputRef = React.createRef()
        this.uploadInputRefCalibration = React.createRef()
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })
        await api.getModels()
                .then(res => {
                  this.setState({ models: res.data.data })
                })
                .catch(err => {
                  console.log(err)
                })
        this.setState({ isLoading: false })
    }

    handleChangeInputUpload = (event) => {
      const file = event.target.files[0]
      if (!['image', 'video'].includes(file.type.split('/')[0])) {
        event.preventDefault()
        this.uploadInputRef.current.value = ''
        this.setState(
          {
            error: 'Please select only images or videos to upload'
          },
          () => {
            setTimeout(() => { this.setState({ error: null }) }, 10000)
          }
        )
        return
      }

      this.setState({ selectedFile: file })
    }

    handleChangeInputUploadCalibration = (event) => {
      const file = event.target.files[0]
      if (!['image', 'video'].includes(file.type.split('/')[0])) {
        event.preventDefault()
        this.uploadInputRefCalibration.current.value = ''
        this.setState(
          {
            errorCalibration: 'Please select only images or videos to upload'
          },
          () => {
            setTimeout(() => { this.setState({ errorCalibration: null }) }, 10000)
          }
        )
        return
      }

      this.setState({ selectedFileCalibration: file })
    }

    handleUpload = async e => {
      const name = "File_" + Date.now() + '_' + this.state.selectedFile.name
      let _id
      const payload = this.payload(name)
      await api.createSubmit(payload)
        .then(res => {
          this.setState({ _id: res.data._id })
          _id = res.data._id
        })
        .catch(e => console.log('create submit ERROR: ', e))

      const dir = _id + "_" + name
      await api.createDir(dir)
        .then(res => {
          this.setState({ dir: dir })
        })
        .catch(e => console.log('create Dirs ERROR: ', e))

      // Create an object of formData
      const formData = new FormData()
      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFile,
        name
      )
      await api.createUploadFile(formData, dir)
        .then(res => {
          this.setState({ uploadedFile: res.data.path })
        })
        .catch(e => console.log('Upload file ERROR: ', e))
    }

    handleCalibration = async e => {
      if (!this.state.selectedFileCalibration || !this.state.cms || !this.state.model) return;
      this.setState({ isLoading: true })
      const name = "FileCalibration_" + Date.now() + '_' + this.state.selectedFileCalibration.name
      const dir = ''
      let uploadedFileCalibration = ''

      // Create an object of formData
      const formData = new FormData()
      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFileCalibration,
        name
      )
      await api.createUploadFile(formData, dir)
        .then(res => {
          uploadedFileCalibration = res.data.path
          this.setState({ uploadedFileCalibration: res.data.path })
        })
        .catch(e => console.log('Upload Calibration file ERROR: ', e))

      await api.pictureCalibrationFish(uploadedFileCalibration, 'client/public/submits/', this.state.model, this.state.cms)
        .then(res => {
          console.log(res.data)
          this.setState({
            total_fishCalibration: res.data.total_fish,
            width_pxs_x_cm: res.data.width_pxs_x_cm === '' ? null : res.data.width_pxs_x_cm,
            resultFileCalibration: res.data.resultFileCalibration,
          })
          if (res.data.total_fish !== null && (res.data.total_fish > 1 || res.data.total_fish === 0)) {
            this.setState(
              {
                errorCalibration: 'Please select an image with just one fish.'
              },
              () => {
                setTimeout(() => { this.setState({ errorCalibration: null }) }, 10000)
              }
            )
          }
        })
        .catch(e => console.log('Picture Calibration Fish ERROR: ', e))

      this.setState({ isLoading: false })
    }

    payload = (name) => {
      const type = this.state.selectedFile.type.split('/')[0]
      if (type === 'video') {
        return {
          file: name,
          type: type,
          file_csv_result: name + '_csv_result.csv',
          file_video_result: name + '_video_result.avi',
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

    handleVideoRoiProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model, width_cms, width_pxs_x_cm } = this.state

      if (dir !== null) {
        await api.videoRoiCountFish(uploadedFile, 'client/public/submits/' + dir, model)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Video Roi Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleVideoProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model } = this.state

      if (dir !== null) {
        await api.videoCountFish(uploadedFile, 'client/public/submits/' + dir, model)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Video Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleWebcamProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model } = this.state

      if (dir !== null) {
        await api.webcamCountFish(uploadedFile, 'client/public/submits/' + dir, model)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Webcam Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handlePictureProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model } = this.state

      if (dir !== null) {
        await api.pictureCountFish(uploadedFile, 'client/public/submits/' + dir, model)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Picture Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleCancel = e => {
      this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, uploadedFileCalibration: '', selectedFileCalibration: '', total_fishCalibration: null, cms: null, width_pxs_x_cm: null, })
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
      if (this.uploadInputRefCalibration.current) {
        this.uploadInputRefCalibration.current.value = ''
      }
    }

    handleList = e => {
      if (!e.target.value) {
        this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, model: '', })
        this.uploadInputRef.current.value = ''
      } else {
        this.setState({ model: e.target.value })
      }
    }

    handleChangeInputNumberCalibration = e => {
      this.setState({ cms: e.target.value })
    }

    fileData = () => {
      const file_arr = this.state.uploadedFile.split('\\')

      const file = '/submits/' + this.state.dir + '/' +  file_arr[file_arr.length - 1]
      const csv = '/submits/' + this.state.dir + '/' +  file_arr[file_arr.length - 1] + '_csv_result.csv'
      const video = '/submits/' + this.state.dir + '/' + file_arr[file_arr.length - 1] + '_video_result.avi'
      const image = '/submits/' + this.state.dir + '/' + file_arr[file_arr.length - 1] + '_image_result.png'
      const zip = '/submits/' + this.state.dir + '/' + this.state._id + '_' + file_arr[file_arr.length - 1] + '_images_zip_result.zip'
      if (this.state.selectedFile) {
        const type = this.state.selectedFile.type.split('/')[0] || ''
        return (
          <div>
            <h2>File Details ({type}):</h2>
            <hr />
            <p>File Name: {this.state.selectedFile.name}</p>
            <p>File Type: {this.state.selectedFile.type}</p>
            <p>File Size: {this.state.selectedFile.size}</p>
            {this.state.uploadedFile && (
              <>
              <hr />
              <a href={file} rel="noopener noreferrer" target="_blank">Uploaded File</a>
              </>
            )}
            {this.state.total_fish !== null && (
              <>
              <hr />
              <p><strong>Total Fish: {this.state.total_fish}</strong></p>
              <hr />
              <a href={csv} rel="noopener noreferrer" target="_blank">CSV Result File</a>
              <br />
              <a href={type === 'video' ? video : image} rel="noopener noreferrer" target="_blank">{type === 'video' ? 'Video AVI' : 'Image PNG'} Result File</a>
              <br />
              <a href={zip} rel="noopener noreferrer" target="_blank">Object Detected Images ZIP Result File</a>
              </>
            )}
          </div>
        )
      } else {
        return (
          <div>
            <br />
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        )
      }
    }

    imageData = () => {
      const file_arr = this.state.uploadedFile ? this.state.uploadedFile.split('\\') : []
      const file_arrCalibration = this.state.uploadedFileCalibration ? this.state.uploadedFileCalibration.split('\\') : []
      const file_arrCalibrationResult = this.state.resultFileCalibration ? this.state.resultFileCalibration.split('\\') : []

      const image = file_arr[file_arr.length - 1] ?
        '/submits/' + this.state.dir + '/' + file_arr[file_arr.length - 1] :
        ''
      const imageCalibration = file_arrCalibration[file_arrCalibration.length - 1] ?
        '/submits/' + file_arrCalibration[file_arrCalibration.length - 1] :
        ''

      const imageResult = file_arr[file_arr.length - 1] ?
        '/submits/' + this.state.dir + '/' + file_arr[file_arr.length - 1] + '_image_result.png' :
        ''
      const imageCalibrationResult = file_arrCalibrationResult[file_arrCalibrationResult.length - 1] ?
        '/submits/' + file_arrCalibrationResult[file_arrCalibrationResult.length - 1] :
        ''

      const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
      const typeCalibration = this.state.selectedFileCalibration ? this.state.selectedFileCalibration.type.split('/')[0] : ''

      if (this.state.total_fish !== null) {
        if (type === 'image') {
          return (
            <img src={imageResult} alt="" />
          )
        }
      } else if (this.state.uploadedFile) {
        if (type === 'image') {
          return (
            <img src={image} alt="" />
          )
        }
      } else if (this.state.total_fishCalibration !== null) {
        if (typeCalibration === 'image') {
          return (
            <img src={imageCalibrationResult} alt="" />
          )
        }
      } else if (this.state.uploadedFileCalibration) {
        if (typeCalibration === 'image') {
          return (
            <img src={imageCalibration} alt="" />
          )
        }
      } else {
        return (
          <div></div>
        )
      }
    }

    createSelectItems = () => {
      const { models } = this.state
      let items = []
      items.push(<option key={'empty#empty'} value={''}>{'<choose a model>'}</option>)
      if (models) {
        models.forEach((model, i) => {
          if (model.saved_model_root) {
            items.push(<option key={model.model + '#saved_model_root'} value={model.model + '#saved_model_root'}>{model.model + ' - saved_model (root)'}</option>)
          }
          if (model.saved_model_dir) {
            items.push(<option key={model.model + '#saved_model_dir'} value={model.model + '#saved_model_dir'}>{model.model + ' - saved_model (dir)'}</option>)
          }
          if (model.frozen_inference_graph) {
            items.push(<option key={model.model + '#frozen_inference_graph'} value={model.model + '#frozen_inference_graph'}>{model.model + ' - frozen_inference_graph'}</option>)
          }
          //if (model.ckpt_root) {
          //  items.push(<option key={model.model + '#ckpt_root'} value={model.model + '#ckpt_root'}>{model.model + ' - checkpoints (root)'}</option>)
          //}
          if (model.ckpt_dir) {
            items.push(<option key={model.model + '#ckpt_dir'} value={model.model + '#ckpt_dir'}>{model.model + ' - checkpoints (dir)'}</option>)
          }
        })
      }
      return items
    }

    render() {
      console.log('submit file', this.state)
        const { isLoading, selectedFile, uploadedFile, total_fish, error, errorCalibration, model, selectedFileCalibration, uploadedFileCalibration, width_pxs_x_cm, } = this.state
        const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
        const fileData = this.fileData()
        const imageData = this.imageData()

        return (
            <div className="submitfile">
              <div className="submitfile__header form-group">

                <div className="submitfile__header--title">
                  Object detection tool
                </div>

                <div className="submitfile__header--upload-file">
                  <div className="submitfile__col-67">
                    <div className="submitfile__title">Select (picture/video) to process</div>
                    <input
                        className="submitfile__header--upload-file--input-text form-control"
                        id="selectedFileInput"
                        type="file"
                        accept='image/*|video/*'
                        onChange={this.handleChangeInputUpload}
                        ref={this.uploadInputRef}
                        disabled={isLoading || !model ? true : uploadedFile ? true : false}
                    />
                  </div>
                  <div className="submitfile__col-33">
                    <button className="submitfile__button-upload btn" id="uploadButton" onClick={this.handleUpload} ref={this.uploadButtonRef} disabled={isLoading || !model ? true : selectedFile && !uploadedFile ? false : true} >Upload!</button>
                  </div>
                </div>
                <div className="submitfile__header--error">
                  {error && (
                    <div className="submitfile__header--error--label-red">{error}</div>
                  )}
                </div>

                <div className="submitfile__header--select-model">
                  <div className="submitfile__title">Select the model to use</div>
                  <select name="models" id="listModels" onChange={this.handleList}>
                    {this.createSelectItems()}
                  </select>
                </div>

                <div className="submitfile__header--buttons">
                  <div className="submitfile__title">
                    {'Select the type of process'}
                  </div>

                  <div className="submitfile__row">
                    <div className="submitfile__col-33">
                      <button className="submitfile__button-video btn" id="processVideoRoiButton" onClick={this.handleVideoRoiProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >ROI Video</button>
                      <button className="submitfile__button-video btn" id="processWebcamButton" onClick={this.handleWebcamProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' || type === 'video' ? true : uploadedFile ? false : true} >Webcam</button>
                    </div>

                    <div className="submitfile__col-33">
                      <button className="submitfile__button-video btn" id="processVideoButton" onClick={this.handleVideoProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >Video</button>
                      <button className="submitfile__button-picture btn" id="processPictureButton" onClick={this.handlePictureProcess} disabled={isLoading || !model || total_fish !== null || type === 'video' ? true : uploadedFile ? false : true} >Picture</button>
                    </div>

                    <div className="submitfile__col-33">
                      <button className="submitfile__button-cancel btn" id="processButton" onClick={this.handleCancel} disabled={isLoading || !model} >{total_fish !== null ? 'Clear' : 'Cancel'}</button>
                    </div>
                  </div>
                </div>
                <div className="submitfile__header--calibration">
                  <div className="submitfile__title--green">
                    CALIBRACIÓN
                  </div>
                  <hr />
                  {!width_pxs_x_cm ? (
                    <>
                      <div className="submitfile__text">
                        Las tallas de los peces están referenciadas a una distancia de la cámara de 150 cm a 90º, con angulo de visión de 75º, si estos datos se modifican es necesario calibrar los cálculos.
                      </div>
                      <div className="submitfile__text">
                        Para calibrar seleccionar una imagen con un único pez e introducir su talla real en cm
                      </div>
                      <div className="submitfile__row">
                        <div className="submitfile__col-67">
                          <div className="submitfile__text--green">Select the file</div>
                          <input
                              className="submitfile__header--calibration--input-text form-control"
                              id="selectedFileInputCalibration"
                              type="file"
                              accept='image/*|video/*'
                              onChange={this.handleChangeInputUploadCalibration}
                              ref={this.uploadInputRefCalibration}
                              disabled={isLoading || uploadedFileCalibration ? true : false}
                          />
                          <div className="submitfile__text--green">Introducir la talla (cm)</div>
                          <input
                              className="submitfile__header--calibration--input-number form-control"
                              id="InputNumberCalibration"
                              type="number"
                              onChange={this.handleChangeInputNumberCalibration}
                              disabled={isLoading || uploadedFileCalibration ? true : false}
                          />
                        </div>
                        <div className="submitfile__col-33">
                          <button className="submitfile__button-calibration btn" id="calibrationButton" onClick={this.handleCalibration} ref={this.calibrationButtonRef} disabled={isLoading ? true : selectedFileCalibration && !uploadedFileCalibration ? false : true} >Calibrate!</button>
                        </div>
                      </div>
                      <div className="submitfile__header--error">
                        {errorCalibration && (
                          <div className="submitfile__header--error--label-red">{errorCalibration}</div>
                        )}
                      </div>
                    </>
                  )
                    :
                  (
                    <div className="submitfile__text">
                      Calibración realizada correctamente: {width_pxs_x_cm} pixels por cm.
                    </div>
                  )}
                </div>
              </div>
              <div className="submitfile__header-right form-group">
                <div className="submitfile__header-right--title">
                {isLoading ?
                  (
                    <>Counting Fish...</>
                  ) : (
                    <>Select file to process...</>
                  )}
                </div>

                <div className="submitfile__header-right--image">
                  {imageData}
                </div>

                <div className="submitfile__header-right--file">
                  {fileData}
                </div>
              </div>
            </div>
        )
    }
}

export default SubmitFile
