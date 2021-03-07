import React, { Component } from 'react'
import { withRouter } from 'react-router'
import api from '../api'

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
            selectedFile: '',
            uploadedFile: '',
            firstImageVideo: '',
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
            errors: errors_lang[this.props.parentState.language],
            labels: labels_lang[this.props.parentState.language],
        }
        this.uploadInputRef = React.createRef()
        this.uploadInputRefCalibration = React.createRef()
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })
        await api.getModelsAwsS3()
                .then(res => {
                  console.log(res)
                  this.setState({ models: res.data.data })
                })
                .catch(err => {
                  console.log(err)
                })
        window.addEventListener('changeLanguage', this.changeLanguage);
        this.setState({ isLoading: false })
    }

    componentWillUnmount = async () => {
      window.removeEventListener('changeLanguage', this.changeLanguage);
    }

    changeLanguage = async ({ detail }) => {
      console.log(detail)
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
            error: this.state.errors['only_valid_files']
          },
          () => {
            setTimeout(() => { this.setState({ error: null }) }, 5000)
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
      await api.createDirAwsS3(dir)
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
      let uploadedFile = ''
      await api.createUploadFileAwsS3(formData, dir)
        .then(res => {
          console.log(res)
          uploadedFile = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + res.data.originalname
          this.setState({ uploadedFile: res.data.originalname })
        })
        .catch(e => console.log('Upload file ERROR: ', e))
      const type = this.state.selectedFile.type.split('/')[0]
      if (type === 'video') {
        await api.imageVideoAwsS3(uploadedFile, dir)
          .then(res => {
            this.setState({ firstImageVideo: res.data.name })
          })
          .catch(e => console.log('Image Video file ERROR: ', e))
      }

    }

    handleCalibration = async e => {
      if (!this.state.selectedFileCalibration || !this.state.cms || !this.state.model) {
        return;
      }
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
      await api.createUploadFileAwsS3(formData, dir)
        .then(res => {
          uploadedFileCalibration = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + res.data.originalname
          this.setState({ uploadedFileCalibration: res.data.originalname, resultFileCalibration: '', total_fishCalibration: null })
        })
        .catch(e => console.log('Upload Calibration file ERROR: ', e))

      await api.pictureCalibrationFishAwsS3(uploadedFileCalibration, this.state.model, this.state.cms)
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
                errorCalibration: this.state.errors['only_one_fish']
              },
              () => {
                setTimeout(() => { this.setState({ errorCalibration: null }) }, 5000)
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

    handleVideoRoiProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model, width_cms, width_pxs_x_cm } = this.state

      if (dir !== null) {
        await api.videoRoiCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  uploadedFile, dir, model, width_cms, width_pxs_x_cm)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Video Roi Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleVideoProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model, width_cms, width_pxs_x_cm } = this.state

      if (dir !== null) {
        await api.videoCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  uploadedFile, dir, model, width_cms, width_pxs_x_cm)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Video Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleWebcamProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model, width_cms, width_pxs_x_cm } = this.state

      if (dir !== null) {
        await api.webcamCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  uploadedFile, dir, model, width_cms, width_pxs_x_cm)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Webcam Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handlePictureProcess = async e => {
      this.setState({ isLoading: true })
      const { uploadedFile, dir, model, width_cms, width_pxs_x_cm } = this.state

      if (dir !== null) {
        await api.pictureCountFishAwsS3(process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  uploadedFile, dir, model, width_cms, width_pxs_x_cm)
          .then(res => {
            this.setState({ total_fish: res.data.total_fish })
          })
          .catch(e => console.log('Picture Count Fish ERROR: ', e))
      }

      this.setState({ isLoading: false })
    }

    handleCancel = e => {
      this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, })
      if (this.uploadInputRef.current) {
        this.uploadInputRef.current.value = ''
      }
    }

    handleCancelCalibration = e => {
      this.setState({ uploadedFileCalibration: '', selectedFileCalibration: '', resultFileCalibration: '', total_fishCalibration: null, cms: null, width_pxs_x_cm: null, })
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
      const file = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  this.state.uploadedFile
      const csv = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' +  this.state.uploadedFile + '_csv_result.csv'
      const video = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_video_result.mp4'
      const image = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_image_result.png'
      const zip = process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state._id + '_' + this.state.uploadedFile + '_images_zip_result.zip'
      if (this.state.total_fish !== null) {
        const type = this.state.selectedFile.type.split('/')[0] || ''
        return (
          <div className="submitfile__col">
            <div className="submitfile__title--green">
              {this.state.labels['tit_down']}
            </div>
            <hr />
            <div className="submitfile__col-67">
              <a className="submitfile__button-picture btn" id="processedFileButton" href={type === 'video' ? video : image} target="_blank">{this.state.labels['tit_processed'](type)}</a>
              <a className="submitfile__button-video btn" id="tableButton" href={csv} target="_blank">{this.state.labels['tit_table']}</a>
              <a className="submitfile__button-video btn" id="imagesButton" href={zip} target="_blank">{this.state.labels['tit_det_images']}</a>
            </div>
          </div>
        )
      } else if (this.state.uploadedFile !== '') {
        const type = this.state.selectedFile.type.split('/')[0] || ''
        return (
          <div className="submitfile__col">
            <div className="submitfile__title--green">
              {this.state.labels['tit_fil_details'](type)}
            </div>
            <hr />
            <div className="submitfile__col">
              <div className="submitfile__text">{this.state.labels['tit_fil_name'](this.state.selectedFile.name)}</div>
              <div className="submitfile__text">{this.state.labels['tit_fil_type'](this.state.selectedFile.type)}</div>
              <div className="submitfile__text">{this.state.labels['tit_fil_size'](this.state.selectedFile.size)}</div>
              <div className="submitfile__text--green">
                <a href={file} rel="noopener noreferrer" target="_blank">{this.state.labels['tit_dow_uploaded']}</a>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div></div>
        )
      }
    }

    imageData = () => {
      const image = this.state.uploadedFile ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile :
        ''
      const image_video = this.state.firstImageVideo ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/first_frame_video.png' :
        ''
      const imageCalibration = this.state.uploadedFileCalibration ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.uploadedFileCalibration :
        ''

      const imageResult = this.state.uploadedFile ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/' + this.state.uploadedFile + '_image_result.png' :
        ''
      const videoResult = this.state.firstImageVideo ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + 'submits/' + this.state.dir + '/last_frame_video.png' :
        ''
      const imageCalibrationResult = this.state.resultFileCalibration ?
        process.env.REACT_APP_AWS_Uploaded_FIle_URL_Link + this.state.resultFileCalibration :
        ''

      const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
      const typeCalibration = this.state.selectedFileCalibration ? this.state.selectedFileCalibration.type.split('/')[0] : ''

      if (this.state.total_fish !== null) {
        if (type === 'image') {
          return (
            <img src={imageResult} alt="" />
          )
        } else {
          return (
            <img src={videoResult} alt="" />
          )
        }
      } else if (this.state.uploadedFile) {
        if (type === 'image') {
          return (
            <img src={image} alt="" />
          )
        } else {
          return (
            <img src={image_video} alt="" />
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
      items.push(<option key={'empty#empty'} value={''}>{this.state.labels['tit_sel_placeholder']}</option>)
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
      console.log('submit file state', this.state)
      console.log('submit file props', this.props)
        const { isLoading, selectedFile, uploadedFile, total_fish, error, errorCalibration, model, selectedFileCalibration, uploadedFileCalibration, width_pxs_x_cm, resultFileCalibration, cms, } = this.state
        const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
        const fileData = this.fileData()
        const imageData = this.imageData()

        return (
            <div className="submitfile">
              <div className="submitfile__header form-group">

                <div className="submitfile__header--title">
                  {this.state.labels['tit_obj_det_tool']}
                </div>

                <div className="submitfile__header--upload-file">
                  <div className="submitfile__col-67">
                    <div className="submitfile__title">{this.state.labels['tit_select']}</div>
                    <input
                        className="submitfile__header--upload-file--input-file form-control"
                        id="selectedFileInput"
                        type="file"
                        accept='image/*|video/*'
                        onChange={this.handleChangeInputUpload}
                        ref={this.uploadInputRef}
                        disabled={isLoading || !model ? true : uploadedFile ? true : false}
                    />
                  </div>
                  <div className="submitfile__col-33">
                    <button className="submitfile__button-upload btn" id="uploadButton" onClick={this.handleUpload} ref={this.uploadButtonRef} disabled={isLoading || !model ? true : selectedFile && !uploadedFile ? false : true} >{this.state.labels['tit_upload']}</button>
                  </div>
                </div>
                <div className="submitfile__header--error">
                  {error && (
                    <div className="submitfile__header--error--label-red">{error}</div>
                  )}
                </div>

                <div className="submitfile__header--select-model">
                  <div className="submitfile__title">{this.state.labels['tit_sel_model']}</div>
                  <select name="models" id="listModels" onChange={this.handleList} disabled={isLoading}>
                    {this.createSelectItems()}
                  </select>
                </div>

                <div className="submitfile__header--buttons">
                  <div className="submitfile__title">
                    {this.state.labels['tit_typ_process']}
                  </div>

                  <div className="submitfile__row-buttons">
                    <div className="submitfile__row-67">
                      <div className="submitfile__col-50">
                        <button className="submitfile__button-video btn" id="processVideoRoiButton" onClick={this.handleVideoRoiProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >{this.state.labels['tit_roi_video']}</button>
                        <button className="submitfile__button-video btn" id="processWebcamButton" onClick={this.handleWebcamProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' || type === 'video' ? true : uploadedFile ? false : true} >{this.state.labels['tit_web_cam']}</button>
                      </div>

                      <div className="submitfile__col-50">
                        <button className="submitfile__button-video btn" id="processVideoButton" onClick={this.handleVideoProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >{this.state.labels['tit_video']}</button>
                        <button className="submitfile__button-picture btn" id="processPictureButton" onClick={this.handlePictureProcess} disabled={isLoading || !model || total_fish !== null || type === 'video' ? true : uploadedFile ? false : true} >{this.state.labels['tit_picture']}</button>
                      </div>
                    </div>

                    <div className="submitfile__col-33-buttons">
                      <button className="submitfile__button-cancel btn" id="processButton" onClick={this.handleCancel} disabled={isLoading || !model} >{this.state.labels['tit_cancel'](total_fish)}</button>
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
                        <div className="submitfile__col-67">
                          <div className="submitfile__text--green">{this.state.labels['tit_sel_calibration']}</div>
                          <input
                              className="submitfile__header--calibration--input-file form-control"
                              id="selectedFileInputCalibration"
                              type="file"
                              accept='image/*|video/*'
                              onChange={this.handleChangeInputUploadCalibration}
                              ref={this.uploadInputRefCalibration}
                              disabled={isLoading || (uploadedFileCalibration && !resultFileCalibration) || !model ? true : false}
                          />
                          <div className="submitfile__text--green">{this.state.labels['tit_siz_calibration']}</div>
                          <input
                              className="submitfile__header--calibration--input-number form-control"
                              id="InputNumberCalibration"
                              type="number"
                              onChange={this.handleChangeInputNumberCalibration}
                              disabled={isLoading || (uploadedFileCalibration && !resultFileCalibration) || !model ? true : false}
                          />
                        </div>
                        <div className="submitfile__col-33">
                          <button className="submitfile__button-calibration btn" id="calibrationButton" onClick={this.handleCalibration} ref={this.calibrationButtonRef} disabled={isLoading || !model ? true : selectedFileCalibration && cms && (!uploadedFileCalibration || resultFileCalibration)  ? false : true} >{this.state.labels['tit_calibrate']}</button>
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
                    isLoading ?
                      <>{this.state.labels['tit_lab_processing']}</>
                    :
                      uploadedFile ?
                        <>{this.state.labels['tit_lab_sel_typ_process']}</>
                      :
                        selectedFile ?
                          <>{this.state.labels['tit_lab_upload']}</>
                        :
                          model ?
                            <>{this.state.labels['tit_lab_sel_file']}</>
                          :
                            <>{this.state.labels['tit_lab_sel_model']}</>
                  }
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

export default withRouter(SubmitFile)
