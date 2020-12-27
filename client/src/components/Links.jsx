import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({ className: "collapse navbar-collapse" })``
const List = styled.div.attrs({ className: "navbar-nav mr-auto" })``
const Item = styled.div.attrs({ className: "collapse navbar-collapse text-dark" })``
const Log = styled.div.attrs({ className: "navbar-brand text-dark" })`
  cursor: pointer;
`

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
      <React.Fragment>
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
          <Log>Fish Counting</Log>
        </Link>
        <Collapse>
          <List>

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
              <Item>Submit Image/Video</Item>
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
                  <Item>My Bars</Item>
                </Link>
              ) : (
                <div></div>
              )
            }

          </List>
          {
            authenticated ? (
              <Log onClick={true ? null : this._handleLogoutClick}>
                Logout
              </Log>
            ) : (
              <Log onClick={true ? null : this._handleLoginClick}>
                Login
              </Log>
            )
          }
        </Collapse>
      </React.Fragment>
    )
  }
}

export default Links
