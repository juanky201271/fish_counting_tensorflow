// juanky201271 - AIPeces - 2021

import React, { Component } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import detectBrowserLanguage from 'detect-browser-language'
import { withRouter } from 'react-router'

import { NavBar, Logo } from '../components'
import { SubmitFile, AboutUs, Terms, Privacy } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'
import './normalize.css'
import './index.scss'

import { labels as labels_es } from './index_es.js'
import { labels as labels_en } from './index_en.js'
import { labels as labels_fr } from './index_fr.js'
import { labels as labels_pt } from './index_pt.js'

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

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
      labels: labels_lang[lang ? lang.split('-')[0] : 'es'],
    }
  }

  componentDidMount = async () => {
    this.setState({
      isLoading: true,
    })
    window.addEventListener('changeLanguage', this.changeLanguage);
    this.setState({
      isLoading: false,
    })
  }

  componentWillUnmount = async () => {
    window.removeEventListener('changeLanguage', this.changeLanguage);
  }

  changeLanguage = async ({ detail }) => {
    console.log(detail)
    this.setState({
      language: detail,
      labels: labels_lang[detail],
    })
  }

  render() {
    console.log('app state', this.state)
    console.log('app props', this.props)
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
                    <Route path="/terms" exact render={() => <Terms parentState={{ authenticated, twitterId, ip, user, language }} />} />
                    <Route path="/privacy" exact render={() => <Privacy parentState={{ authenticated, twitterId, ip, user, language }} />} />
                  </Switch>
                  <div className="app__footer">
                    <div className="app__footer--left">
                      <Logo />
                      <p>{this.state.labels['tit_copy']}</p>
                    </div>
                    <div className="app__footer--right">
                      <div className="app__footer--right-left">

                        <div className="app__footer--right-left-link-green">
                          <Link to={{ pathname: "/aboutus" }}>
                            {this.state.labels['tit_abo_us']}
                          </Link>
                        </div>
                        <div className="app__footer--right-left-link-white">
                          <Link to={{ pathname: "/terms" }}>
                            {this.state.labels['tit_ter_conditions']}
                          </Link>
                        </div>
                        <div className="app__footer--right-left-link-white">
                          <Link to={{ pathname: "/privacy" }}>
                            {this.state.labels['tit_pri_policy']}
                          </Link>
                        </div>

                      </div>
                      <div className="app__footer--right-right">
                        <div className="app__footer--right-right-rect-blue"></div>
                        <div>
                          <p>
                            {this.state.labels['tit_email']}<br />
                            <a href="mailto:info@aipeces.io">info@aipeces.io</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="app__footer">
                    <div className="app__footer--text">
                      {this.state.labels['tit_inspired']}
                    </div>
                  </div> */}
                </>
               )
               :
               (
                 <div>{this.state.labels['tit_loading']}</div>
               )
            }

      </div>
    )
  }
}

export default withRouter(App)
