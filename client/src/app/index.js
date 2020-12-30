import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import { NavBar } from '../components'
import { SubmitFile } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

const Wrapper = styled.div`
  background: #f0f0f0;
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
    }
  }
  componentDidMount = async () => {
    this.setState({
      isLoading: true,
    })

    this.setState({
      isLoading: false,
    })
  }
  render() {
    console.log('app', this.state)
    const { authenticated, twitterId, ip, user, isLoading, } = this.state
    return (
      <Wrapper>
        <Router>

          {!isLoading ?
             (
               <>
                <NavBar
                  authenticated={authenticated}
                  twitterId={twitterId}
                  ip={ip}
                  user={user}
                />
                <Switch>
                  <Route path="/" exact component={SubmitFile} />
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
