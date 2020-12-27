import React, { Component } from 'react'
import axios from 'axios'
import ReactTable from 'react-table-6'
import styled from 'styled-components'
import 'react-table-6/react-table.css'
import api from '../api'

const FullName = styled.h1.attrs({ className: 'h1', })``
const Wrapper = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const WrapperHeader = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const WrapperFooter = styled.div.attrs({ className: 'form-group bg-white', })`
    margin: 0 30px;
`
const WrapperUrl = styled.a.attrs({ className: 'navbar-brand' })`
  display: 'flex';
`
const Label = styled.label`
    margin: 2px;
`
const LabelBold = styled.label`
    margin-left: 20px;
    font-weight: bold;
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
const Join = styled.div.attrs({ className: `btn btn-primary`, })`
  cursor: pointer;
`

const CancelJoin = styled.div.attrs({ className: `btn btn-warning`, })`
  cursor: pointer;
`

class SubmitFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            selectedFile: '',
            uploadedFile: '',
            isLoading: false,
            authenticated: '',
            twitterId: '',
            ip: '',
            user: '',
        }
        this.uploadInputRef = React.createRef()
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

        this.setState({ isLoading: false })
    }
    handleChangeInputUpload = (event) => {
      this.setState({ selectedFile: event.target.files[0] })
    }
    handleUpload = async e => {

      // Create an object of formData
      const formData = new FormData()

      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFile,
        this.state.selectedFile.name
      )

      // Details of the uploaded file
      console.log(this.state.selectedFile)

      // Request made to the backend api
      // Send formData object
      //axios.post('api/2uploadfile', formData)
      await api.createUploadFile(formData)
        .then(res => {
          this.setState({ uploadedFile: res.data.path })
        })
        .catch(e => console.log(e))
    }
    handleProcess = async e => {
      const { uploadedFile } = this.state

      console.log(uploadedFile)
    }
    handleCancel = e => {
      this.setState({ uploadedFile: '', selectedFile: '' })
      this.uploadInputRef.current.value = ''
    }
    fileData = () => {
      if (this.state.selectedFile) {
        return (
          <div>
            <h2>File Details:</h2>
            <p>File Name: {this.state.selectedFile.name}</p>
            <p>File Type: {this.state.selectedFile.type}</p>
            <p>File Size: {this.state.selectedFile.size}</p>
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
      console.log('finds', this.state)
        const { isLoading, selectedFile, uploadedFile } = this.state
        const columns = [
            {
                Header: 'Bar',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  return (
                    <span>
                      <LabelBold>{ props.original.name }</LabelBold>
                    </span>
                  )
                }
            },

            {
                Header: 'Picture',
                accessor: '',
                Cell: function(props) {
                  return (
                      <span>
                        <WrapperUrl href={props.original.url} target="_blank">
                          <img src={props.original.image_url} width="100" height="100" alt={props.original.alias} />
                        </WrapperUrl>
                      </span>
                  )
                }
            },
            {
                Header: 'Address',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  const addressList = props.original.location.display_address.map((item, index) => <div key={item.trim()}>{item}</div>)
                  return (
                    <span>
                      {addressList}
                    </span>
                  )
                }
            },
            {
                Header: 'Phone Number',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  return (
                      <span>
                      { props.original.display_phone ?
                        (
                          <LabelBold>{ props.original.display_phone }</LabelBold>
                        ): (
                          <div></div>
                        )
                      }
                      </span>
                  )
                }
            },
            {
                Header: 'Info',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  const categoriesList = props.original.categories.map((item, index) => <div key={item.title.trim()}>{item.title}</div>)
                  return (
                      <span>
                        <LabelBold>{ props.original.is_closed ? 'Closed' : 'OPEN' }</LabelBold><br />
                        { props.original.review_count > 0 ?
                          (
                            <><Label>Reviews: </Label><LabelBold>{ props.original.review_count }</LabelBold><br /></>
                          ): (
                            <div></div>
                          )
                        }
                        { props.original.categories.length > 0 ?
                          (
                            <><Label>Categories: </Label><br />
                            <LabelBold>{categoriesList}</LabelBold><br /></>
                          ): (
                            <div></div>
                          )
                        }
                        { props.original.rating > 0 ?
                          (
                            <><Label>Rating: </Label><LabelBold>{ props.original.rating }</LabelBold><br /></>
                          ): (
                            <div></div>
                          )
                        }
                        { props.original.transactions.length > 0 ?
                          (
                            <><Label>Transactions: </Label><br />
                            <LabelBold>{ props.original.transactions.join(" / ") }</LabelBold><br /></>
                          ): (
                            <div></div>
                          )
                        }
                        { props.original.price ?
                          (
                            <><Label>Price: </Label><LabelBold>{ props.original.price }</LabelBold><br /></>
                          ): (
                            <div></div>
                          )
                        }
                      </span>
                  )
                }
            },
            {
                Header: 'Assistance',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  var list = {
                    twitterId: [],
                    name: [],
                    assist: [],
                  }
                  var found = false
                  var _id_found = ''
                  var assist_found = false
                  for (let i = 0; i < this.state.find.length; i++) {
                    if (this.state.find[i].businesses.bars_business_id === props.original.id) {
                      if (this.state.authenticated) {
                        if (this.state.find[i].businesses.twitterId === this.state.twitterId) {
                          found = true
                          _id_found = this.state.find[i].businesses._id
                          assist_found = this.state.find[i].businesses.assist
                        } else {
                          list.twitterId.push(this.state.find[i].businesses.twitterId)
                          list.name.push(this.state.find[i].businesses.users.name)
                          list.assist.push(this.state.find[i].businesses.assist)
                        }
                      } else {
                        list.twitterId.push(this.state.find[i].businesses.twitterId)
                        list.name.push(this.state.find[i].businesses.users.name)
                        list.assist.push(this.state.find[i].businesses.assist)
                      }
                    }
                  }
                  const namesList = list.name.map((item, index) => <div key={list.twitterId[index]}>{list.assist[index] ? item + ' (Confirmed)' : item + ' (Canceled)'}</div>)
                  return (
                      <span>
                      { !found && this.state.authenticated ?
                        (
                          <><br /></>
                        ) : assist_found && this.state.authenticated ?
                            (
                              <>
                                <LabelBold>I'll be there tonight.</LabelBold><br />
                              </>
                            ) : (
                              <LabelBold>{ this.state.authenticated ? "I've Canceled, I'm sorry." : "..."}</LabelBold>
                            )
                      }
                      { list.name.length > 0 ?
                        (
                          <><hr />
                          {namesList}</>
                        ) : (
                          <></>
                        )
                      }
                      </span>
                  )
                }.bind(this)
            },
        ]

        //let showTable = true
        //if (!json.businesses.length) {
        //    showTable = false
        //}

        return (
            <Wrapper>
              <WrapperHeader>
                <FullName>Select the File (Image/Video) to Process</FullName>
                <hr />
                <InputText
                    id="selectedFileInput"
                    type="file"
                    onChange={this.handleChangeInputUpload}
                    ref={this.uploadInputRef}
                />
                <ButtonUpload id="uploadButton" onClick={this.handleUpload} ref={this.uploadButtonRef} disabled={selectedFile && !uploadedFile ? false : true} >Upload!</ButtonUpload>
                <Label>{'When the file is uploaded, you can Process/Count it.'}</Label>
                <ButtonProcess id="processButton" onClick={this.handleProcess} disabled={uploadedFile ? false : true} >Count Fish!</ButtonProcess>
                <ButtonCancel id="processButton" onClick={this.handleCancel} >Cancel</ButtonCancel>
              </WrapperHeader>
              <WrapperFooter>
                {this.fileData()}
                {isLoading && (
                    <h3>Loading Data</h3>
                )}
              </WrapperFooter>
            </Wrapper>
        )
    }
}

export default SubmitFile
