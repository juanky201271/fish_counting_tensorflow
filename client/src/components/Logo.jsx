import React, { Component } from 'react'
import logo from '../assets/images/logo-white.png'

import './Logo.scss'

class Logo extends Component {
  render() {
    return (
      <div className="logo">
        <a className="logo__wrapper navbar-brand" href="/" target="_self">
          <img src={logo} width="240" height="50" alt="AI peces" />
        </a>
      </div>
    )
  }
}
export default Logo
