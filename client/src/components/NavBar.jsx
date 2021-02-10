import React, { Component } from 'react'

import Logo from './Logo'
import Links from './Links'

import './NavBar.scss'

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      twitterId: this.props.twitterId || '',
      ip: this.props.ip || '',
      user: this.props.user || '',
    }
  }
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false, twitterId: '', user: '', })
  }
  render() {
    console.log('navbar', this.state)
    const { authenticated, twitterId, ip, user, } = this.state
    const name = user.name || ''
    const profileImageUrl = user.profileImageUrl || ''
    return (
      <div className="navbar container">
        <nav className="navbar__nav navbar navbar-expand-lg navbar-dark bg-white">
          <Logo />
          <Links
            authenticated={authenticated}
            twitterId={twitterId}
            ip={ip}
            user={user}
            handleNotAuthenticated={this._handleNotAuthenticated}
          />
          { name ?
            (
              <div className="navbar__name">{name}</div>
            ) : (
              <div></div>
            )
          }
          { profileImageUrl ?
            (
              <img className="navbar__pic" src={profileImageUrl} alt=""></img>
            ) : (
              <div></div>
            )
          }
          { ip ?
            (
              <div className="navbar__name">{ip}</div>
            ) : (
              <div></div>
            )
          }
        </nav>
      </div>
    )
  }
}

export default NavBar
