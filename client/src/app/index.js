import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { SubmitFile } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

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
      <div className="app app__wrapper">
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
                  {/* <Route path="/aboutus" exact component={AboutUs} /> */}
                </Switch>
              </>
             )
             :
             (
               <div> The App is loading... </div>
             )
          }

        </Router>
      </div>
    )
  }
}

export default App
