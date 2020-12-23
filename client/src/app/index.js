import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import { NavBar } from '../components'
import { BarsFind, MyBarsList } from '../pages'
import api from '../api'

import 'bootstrap/dist/css/bootstrap.min.css'

const Wrapper = styled.div`
  background: #bc4143;
  padding: 5px;
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      twitterId: '',
      ip: '',
      user: '',
      isLoading: false,
      last_find_id: '',
    }
  }
  componentDidMount = async () => {
    this.setState({
      isLoading: true,
    })

    var ip = ''
    await fetch("/api/auth/login/success", { // express
      method: "GET",
      credentials: "include",
      headers: {
        Accept:
        "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json()
        throw new Error("failed to authenticate user")
      })
      .then(responseJson => {
        ip = responseJson.ip
        if (responseJson.success === true) {
          this.setState({
            authenticated: true,
            twitterId: responseJson.user.twitterId,
            user: responseJson.user,
            ip: responseJson.ip,
          })
        } else {
          this.setState({
            authenticated: false,
            twitterId: '',
            user: '',
            ip: responseJson.ip,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })

      await this.addUserIp(ip)

      this.setState({
        isLoading: false,
      })
  }
  addUserIp = async (ip) => {
    if (ip) {
      const currentUser = await api.getUserByIp(ip).catch(err => console.log(err))
      if (!currentUser) {
        //console.log('New User')
        const payload = {
          ip: ip,
          votes: [],
        }
        const newUser = await api.insertUser(payload).catch(err => console.log(err))
        if (newUser) {
          //console.log('New User created')
          //done(null, newUser)
        } else {
          //console.log("New User don't created")
        }
      } else {
        //console.log('User exists')
      }
    } else {
      //console.log('IP empty')
    }
  }
  render() {
    console.log('app', this.state)
    const { authenticated, twitterId, ip, user, isLoading, } = this.state
    return (
      <Wrapper>
      <Router>

      {!isLoading ?
         authenticated ?
         (
           <>
            <NavBar
              authenticated={authenticated}
              twitterId={twitterId}
              ip={ip}
              user={user}
            />
            <Switch>
              <Route path="/" exact component={BarsFind} />
              <Route path="/mybars" exact component={MyBarsList} />
            </Switch>
          </>
         )
         :
         (
           <>
            <NavBar
              authenticated={authenticated}
              twitterId={twitterId}
              ip={ip}
              user={user}
            />
            <Switch>
              <Route path="/" exact component={BarsFind} />
            </Switch>
          </>
         )
         :
         (
           <div></div>
         )
      }

      </Router>
      </Wrapper>
    )
  }
}

export default App
