import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import './Links.scss'

import { labels as labels_es } from './Links_es.js'
import { labels as labels_en } from './Links_en.js'
import { labels as labels_fr } from './Links_fr.js'
import { labels as labels_pt } from './Links_pt.js'

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

class Links extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      twitterId: this.props.twitterId || '',
      ip: this.props.ip || '',
      user: this.props.user || '',
      language: this.props.language || '',
      labels: labels_lang[this.props.language],
    }
  }

  componentDidMount = async () => {
    window.addEventListener('changeLanguage', this.changeLanguage);
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

  _handleLogoutClick = async () => {
    window.open("/api/auth/logout", "_self")
    this.props.handleNotAuthenticated()
    this.setState({ authenticated: false, twitterId: '', user: '', })
  }

  _handleLoginClick = async () => {
    window.open("/api/auth/twitter", "_self")
  }

  render() {
    console.log('links state', this.state)
    console.log('links props', this.props)
    const { authenticated, } = this.state
    return (
      <div className="links">
        <Link to={{ pathname: "/" }}
          className="navbar-brand"
        >
          <div className="links__log navbar__log navbar-brand">{this.state.labels['tit_det_tool']}</div>
        </Link>

        <Link to={{ pathname: "/aboutus" }}
          className="navbar-brand"
        >
          <div className="links__log navbar__log navbar-brand">{this.state.labels['tit_about_us']}</div>
        </Link>

        {
          authenticated ? (
            <Link to={{ pathname: "/mybars" }}
              className="navbar-brand"
            >
              <div className="links__log navbar__log navbar-brand">{this.state.labels['tit_something']}</div>
            </Link>
          ) : (
            <div></div>
          )
        }

        {
          authenticated ? (
            <div style={{ display: 'none' }} className="links__log navbar__log navbar-brand" onClick={true ? null : this._handleLogoutClick}>
              {this.state.labels['tit_logout']}
            </div>
          ) : (
            <div style={{ display: 'none' }} className="links__log navbar__log navbar-brand" onClick={true ? null : this._handleLoginClick}>
              {this.state.labels['tit_login']}
            </div>
          )
        }
      </div>
    )
  }
}

export default withRouter(Links)
