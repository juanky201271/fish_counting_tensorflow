import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Links.scss'

class Links extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      twitterId: this.props.twitterId || '',
      ip: this.props.ip || '',
      user: this.props.user || '',
    }
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
    console.log('links', this.state)
    const { authenticated, twitterId, ip, user, } = this.state
    return (
      <div className="links">
        <Link to={{ pathname: "/",
                    state: {
                      authenticated: authenticated,
                      twitterId: twitterId,
                      ip: ip,
                      user: user,
                    }
                  }}
          className="navbar-brand"
        >
          <div className="navbar__log navbar-brand text-dark">Fish Counting</div>
        </Link>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav mr-auto">

            <Link to={{ pathname: "/",
                        state: {
                          authenticated: authenticated,
                          twitterId: twitterId,
                          ip: ip,
                          user: user,
                        }
                      }}
              className="nav-link"
            >
              <div className="collapse navbar-collapse text-dark">Submit Image/Video</div>
            </Link>

            {
              authenticated ? (
                <Link to={{ pathname: "/mybars",
                            state: {
                              authenticated: authenticated,
                              twitterId: twitterId,
                              ip: ip,
                              user: user,
                            }
                          }}
                  className="nav-link"
                >
                  <div className="collapse navbar-collapse text-dark">My Bars</div>
                </Link>
              ) : (
                <div></div>
              )
            }

          </div>
          {
            authenticated ? (
              <div className="navbar__log navbar-brand text-dark" onClick={true ? null : this._handleLogoutClick}>
                Logout
              </div>
            ) : (
              <div className="navbar__log navbar-brand text-dark" onClick={true ? null : this._handleLoginClick}>
                Login
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default Links
