import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import detectBrowserLanguage from 'detect-browser-language'
import { withRouter } from 'react-router'

import { NavBar } from '../components'
import { SubmitFile, AboutUs } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import './normalize.css'
import './index.scss'

class App extends Component {
  constructor(props) {
    super(props)
    let lang = detectBrowserLanguage()
    this.state = {
      authenticated: false,
      twitterId: '',
      ip: '',
      user: '',
      isLoading: false,
      language: lang ? lang.split('-')[0] : 'es',
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
    const { authenticated, twitterId, ip, user, isLoading, language, } = this.state
    return (
      <div className="app">

            {!isLoading ?
               (
                 <>
                  <NavBar
                    authenticated={authenticated}
                    twitterId={twitterId}
                    ip={ip}
                    user={user}
                    language={language}
                  />
                  <Switch>
                    <Route path="/" exact render={() => <SubmitFile parentState={{ authenticated, twitterId, ip, user, language }} />} />
                    <Route path="/aboutus" exact render={() => <AboutUs parentState={{ authenticated, twitterId, ip, user, language }} />} />
                  </Switch>
                  <div className="app__footer">
                    <p>Copyright &copy;AIpeces</p>
                    <p>
                      Information:<br />
                      <a href="mailto:aipeces@disroot.org">aipeces@disroot.org</a>
                    </p>
                    <p> </p>
                  </div>
                </>
               )
               :
               (
                 <div> The App is loading... </div>
               )
            }

      </div>
    )
  }
}

export default withRouter(App)
