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
            model: '',
            models: null,
        }
        this.uploadInputRef = React.createRef()
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
            setTimeout(() => { this.setState({ error: null }) }, 3000)
          }
        )
        return
      }

      this.setState({ selectedFile: file })
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
      const { uploadedFile, dir, model } = this.state

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
      this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, })
      this.uploadInputRef.current.value = ''
    }
    handleList = e => {
      if (!e.target.value) {
        this.setState({ uploadedFile: '', selectedFile: '', total_fish: null, model: '', })
        this.uploadInputRef.current.value = ''
      } else {
        this.setState({ model: e.target.value })
      }
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
        const { isLoading, selectedFile, uploadedFile, total_fish, error, model } = this.state
        const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
        const imageData = this.fileData()

        return (
            <div className="submitfile submitfile__wrapper">
              <div className="submitfile__header form-group">
                <div className="h1">Select the model to use</div>
                <hr />
                <select name="models" id="listModels" onChange={this.handleList}>
                  {this.createSelectItems()}
                </select>
                <hr />
                <div className="h1">Select the File (Image/Video) to Process</div>
                <hr />
                <input
                    className="submitfile__input-text form-control"
                    id="selectedFileInput"
                    type="file"
                    accept='image/*|video/*'
                    onChange={this.handleChangeInputUpload}
                    ref={this.uploadInputRef}
                    disabled={isLoading || !model ? true : uploadedFile ? true : false}
                />
                {error && (
                  <div className="submitfile__label-bold">{error}</div>
                )}
                <button className="submitfile__button btn btn-primary" id="uploadButton" onClick={this.handleUpload} ref={this.uploadButtonRef} disabled={isLoading || !model ? true : selectedFile && !uploadedFile ? false : true} >Upload!</button>
                <div className="submitfile__label">{'When the file is uploaded, you can Process/Count it.'}</div>

                <button className="submitfile__button btn btn-success" id="processVideoRoiButton" onClick={this.handleVideoRoiProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >ROI Video - Count Fish!</button>
                <button className="submitfile__button btn btn-success" id="processVideoButton" onClick={this.handleVideoProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >Video - Count Fish!</button>

                <button className="submitfile__button btn btn-success" id="processWebcamButton" onClick={this.handleWebcamProcess} disabled={isLoading || !model || total_fish !== null || type === 'image' || type === 'video' ? true : uploadedFile ? false : true} >Webcam - Count Fish!</button>
                <button className="submitfile__button btn btn-success" id="processPictureButton" onClick={this.handlePictureProcess} disabled={isLoading || !model || total_fish !== null || type === 'video' ? true : uploadedFile ? false : true} >Picture - Count Fish!</button>

                <button className="submitfile__button btn btn-danger" id="processButton" onClick={this.handleCancel} disabled={isLoading || !model} >{total_fish !== null ? 'Another File' : 'Cancel'}</button>
              </div>
              <div className="submitfile__footer form-group bg-white">
                {isLoading ?
                  (
                    <h3>Counting Fish...</h3>
                  ) : (
                    <>{imageData}</>
                  )}
              </div>
            </div>
        )
    }
}

export default SubmitFile
