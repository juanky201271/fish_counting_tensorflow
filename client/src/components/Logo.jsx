import React, { Component } from 'react'
import { withRouter } from 'react-router'
import logo from '../assets/images/logo-white.png'

import './Logo.scss'

class Logo extends Component {
  render() {
    return (
      <div className="logo">
        <a className="logo__wrapper navbar-brand" href="/" target="_self">
          <img src={logo} width="240px" height="50px" alt="AI peces" />
        </a>
      </div>
    )
  }
}
export default withRouter(Logo)
