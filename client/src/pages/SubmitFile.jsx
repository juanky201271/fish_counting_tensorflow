import React, { Component } from 'react'
//import axios from 'axios'
//import ReactTable from 'react-table-6'
import styled from 'styled-components'
import 'react-table-6/react-table.css'
import api from '../api'

const FullName = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    padding: 30px;
`
const WrapperHeader = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
    padding: 30px;
`
const WrapperFooter = styled.div.attrs({ className: 'form-group bg-white', })`
    margin: 0 30px;
    padding: 30px;
`
//const WrapperUrl = styled.a.attrs({ className: 'navbar-brand' })`
//  display: 'flex';
//`
const Label = styled.label`
    margin: 2px;
`
const LabelBold = styled.p`
    margin-left: 20px;
    font-weight: bold;
    color: red;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const ButtonUpload = styled.button.attrs({ className: `btn btn-primary`, })`
    margin: 15px 15px 15px 5px;
`
const ButtonProcess = styled.button.attrs({ className: `btn btn-success`, })`
    margin: 15px 15px 15px 5px;
`
const ButtonCancel = styled.button.attrs({ className: `btn btn-danger`, })`
    margin: 15px 15px 15px 5px;
`
//const Join = styled.div.attrs({ className: `btn btn-primary`, })`
//  cursor: pointer;
//`

//const CancelJoin = styled.div.attrs({ className: `btn btn-warning`, })`
//  cursor: pointer;
//`

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
            model: 'output_inference_graph_v1_purseiner3',
        }
        this.uploadInputRef = React.createRef()
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

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
      this.setState({ model: e.target.value })
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
    render() {
      console.log('submit file', this.state)
        const { isLoading, selectedFile, uploadedFile, total_fish, error } = this.state
        const type = this.state.selectedFile ? this.state.selectedFile.type.split('/')[0] : ''
        const imageData = this.fileData()

        return (
            <Wrapper>
              <WrapperHeader>
                <FullName>Select the model to use</FullName>
                <hr />
                <select name="models" id="listModels" onChange={this.handleList}>
                  <option selected value="output_inference_graph_v1_purseiner3">output_inference_graph_v1_purseiner3 - OLD</option>
                  <option value="my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8">my_faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8 - NEW</option>
                </select>
                <hr />
                <FullName>Select the File (Image/Video) to Process</FullName>
                <hr />
                <InputText
                    id="selectedFileInput"
                    type="file"
                    accept='image/*|video/*'
                    onChange={this.handleChangeInputUpload}
                    ref={this.uploadInputRef}
                    disabled={isLoading ? true : uploadedFile ? true : false}
                />
                {error && (
                  <LabelBold>{error}</LabelBold>
                )}
                <ButtonUpload id="uploadButton" onClick={this.handleUpload} ref={this.uploadButtonRef} disabled={isLoading ? true : selectedFile && !uploadedFile ? false : true} >Upload!</ButtonUpload>
                <Label>{'When the file is uploaded, you can Process/Count it.'}</Label>

                <ButtonProcess id="processVideoRoiButton" onClick={this.handleVideoRoiProcess} disabled={isLoading || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >ROI Video - Count Fish!</ButtonProcess>
                <ButtonProcess id="processVideoButton" onClick={this.handleVideoProcess} disabled={isLoading || total_fish !== null || type === 'image' ? true : uploadedFile ? false : true} >Video - Count Fish!</ButtonProcess>

                <ButtonProcess id="processWebcamButton" onClick={this.handleWebcamProcess} disabled={isLoading || total_fish !== null || type === 'image' || type === 'video' ? true : uploadedFile ? false : true} >Webcam - Count Fish!</ButtonProcess>
                <ButtonProcess id="processPictureButton" onClick={this.handlePictureProcess} disabled={isLoading || total_fish !== null || type === 'video' ? true : uploadedFile ? false : true} >Picture - Count Fish!</ButtonProcess>

                <ButtonCancel id="processButton" onClick={this.handleCancel} disabled={isLoading} >{total_fish !== null ? 'Another File' : 'Cancel'}</ButtonCancel>
              </WrapperHeader>
              <WrapperFooter>
                {isLoading ?
                  (
                    <h3>Counting Fish...</h3>
                  ) : (
                    <>{imageData}</>
                  )}
              </WrapperFooter>
            </Wrapper>
        )
    }
}

export default SubmitFile
