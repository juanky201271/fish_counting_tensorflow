import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div` padding: 0 40px 40px 40px; `
const WrapperHeader = styled.div.attrs({ className: 'form-group', })`
    margin: 0 30px;
`
const WrapperFooter = styled.div.attrs({ className: 'form-group bg-white', })`
    margin: 0 30px;
`
const WrapperUrl = styled.a.attrs({ className: 'navbar-brand' })`
  display: 'flex';
`
const LabelUrl = styled.label` margin: 5px; cursor: pointer; `
const Title = styled.h1.attrs({ className: 'h1', })``
const Delete = styled.div.attrs({ className: `btn btn-danger`, })` cursor: pointer; `
const Label = styled.label` margin: 2px; `
const LabelBold = styled.label`
    margin-left: 20px;
    font-weight: bold;
`
const CancelJoin = styled.div.attrs({ className: `btn btn-warning`, })`
  cursor: pointer;
`

class CancelJoinBar extends Component {
  CancelJoinUser = async event => {
    event.preventDefault()
    const { _id, _this, } = this.props
    if (window.confirm(`Do tou want to CANCEL your assistance to this bar tonight?`,)) {

      const payload = {
        assist: false,
      }
      await api.updateBarById(_id, payload)
        .catch(error => {
          console.log(error)
        })

      _this.setState(state => {
        var barMore = []
        state.bars.map((item, index) => {
          if (item._id === _id) {
            return barMore.push({
              _id: item._id,
              find_id: item.find_id,
              bars_business_id: item.bars_business_id,
              name: item.name,
              image_url: item.image_url,
              url: item.url,
              display_address: item.display_address,
              display_phone: item.display_phone,
              ip: item.ip,
              twitterId: item.twitterId,
              date: item.date,
              assist: false,
            })
          } else {
            return barMore.push(item)
          }
        })
        return {
          bars: barMore,
        }
      })

      //window.location.href = '/'
    }
  }
  render() {
    return <CancelJoin onClick={this.CancelJoinUser}>Cancel tonight!</CancelJoin>
  }
}

class DeleteBar extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const { _id, _this, } = this.props
    if (window.confirm(`Do tou want to delete the record ${_id} permanently?`,)) {

      await api.deleteBarById(_id)
      .catch(error => {
        console.log(error)
      })

      _this.setState(state => {
        var barMore = []
        state.bars.map((item, index) => {
          if (item._id === _id) {
            return null
          } else {
            return barMore.push(item)
          }
        })
        return {
          bars: barMore,
        }
      })

      //window.location.href = '/'
    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class MyBarsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bars: [],
            columns: [],
            isLoading: false,
        }
    }
    componentDidMount = async () => {
      this.setState({ isLoading: true })

      const { twitterId } = this.props.location.state
      await api.getBarsByTwitterId(twitterId)
        .then(bars => {
          this.setState({
              bars: bars.data.data,
              isLoading: false,
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({
            isLoading: false,
          })
        })


    }
    render() {
      console.log('my bars', this.state)
        const { bars, isLoading } = this.state
        const columns = [
            {
                Header: 'Search',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  return (
                      <span>
                        <><Label>Categories: {props.original.find_id.categories}</Label><br />
                        <Label>Search: {props.original.find_id.location}</Label><br />
                        <Label>Lenguaje: {props.original.find_id.locale}</Label></>
                      </span>
                  )
                }
            },
            {
                Header: 'Bar',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  return (
                      <span>
                        <WrapperUrl href={props.original.url} target="_blank">
                          <LabelUrl>{props.original.name}</LabelUrl>
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
                  const addressList = props.original.display_address.split("/").map((item, index) => <div key={item.trim()}>{item}</div>)
                  return (
                      <span>
                        {addressList}
                      </span>
                  )
                }
            },
            {
                Header: 'Phone',
                accessor: 'display_phone',
                filterable: true,
                style: { 'white-space': 'unset' },
            },
            {
                Header: 'Assistance',
                accessor: '',
                style: { 'white-space': 'unset' },
                Cell: function(props) {
                  return (
                      <span>
                      { props.original.assist ?
                        (
                          <><LabelBold>I'll be there tonight.</LabelBold><br />
                          <CancelJoinBar _id={props.original._id}
                                         _this={this}
                                         /></>
                        ) : (
                          <LabelBold>I've Canceled, I'm sorry.</LabelBold>
                        )
                      }
                      </span>
                  )
                }.bind(this)
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteBar
                              _id={props.original._id}
                              authenticated={this.props.location.state.authenticated}
                              twitterId={this.props.location.state.twitterId}
                              ip={this.props.location.state.ip}
                              user={this.props.location.state.user}
                              _this={this} />
                        </span>
                    )
                }.bind(this),
            },
        ]

        let showTable = true
        if (!bars.length) {
            showTable = false
        }

        return (
            <Wrapper>
              <WrapperHeader>
                <Title>My Bars</Title>
              </WrapperHeader>
              <WrapperFooter>
                {showTable && !isLoading && (
                    <ReactTable
                        data={bars}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}

                {!showTable && (
                    <hr />
                )}

                {isLoading && (
                    <h3>Loading Bars</h3>
                )}
              </WrapperFooter>
            </Wrapper>
        )
    }
}

export default MyBarsList
