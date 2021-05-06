// juanky201271 - AIPeces - 2021

import React, { Component } from 'react'
import Select from 'react-select'
import { withRouter } from 'react-router'

import Logo from './Logo'
import Links from './Links'

import './NavBar.scss'

import es from '../assets/images/es.jpg'
import en from '../assets/images/en.jpg'
import fr from '../assets/images/fr.jpg'
import pt from '../assets/images/pt.jpg'

const languages = [
  { value: 'es', label: (
    <div className="app-navbar__language">
      <img src={es} alt="Spanish" width="20px" />
    </div>
  ) },
  { value: 'en', label: (
    <div className="app-navbar__language">
      <img src={en} alt="English" width="20px" />
    </div>
  ) },
  { value: 'fr', label: (
    <div className="app-navbar__language">
      <img src={fr} alt="French" width="20px" />
    </div>
  ) },
  { value: 'pt', label: (
    <div className="app-navbar__language">
      <img src={pt} alt="Portuguese" width="20px" />
    </div>
  ) }
]

const languageStyle = {
  control: (provided, state) => ({
    ...provided,
    width: '80px',
    minWidth: '80px',
    height: '20px',
    minHeight: '20px',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    top: '17%',
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    marginTop: '2px',
    marginBottom: '20px',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingRight: '8px',
    paddingLeft: '8px',
    transform: 'translateY(-50%)',
  }),
  menu: (provided, state) => ({
    ...provided,
    width: '80px',
    minWidth: '80px',
    padding: '0px',
    margin: '0px',
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: '0px',
    margin: '0px',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '0px',
    paddingLeft: '5px',
    margin: '0px',
    height: '20px',
    minHeight: '20px',
    '.app-navbar__language': {
      transform: 'translateY(-5px)',
    },
  }),
}

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.props.authenticated || '',
      twitterId: this.props.twitterId || '',
      ip: this.props.ip || '',
      user: this.props.user || '',
      language: languages.filter(l => l.value === this.props.language)[0] || languages[0],
    }
  }
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false, twitterId: '', user: '', })
  }
  handleList = language => {
    window.dispatchEvent(
      new CustomEvent('changeLanguage', {
        detail: language.value,
      })
    )
    this.setState({ language: language })
  }
  render() {
    console.log('navbar state', this.state)
    console.log('navbar props', this.props)
    const { authenticated, twitterId, ip, user, language, } = this.state
    const name = user.name || ''
    const profileImageUrl = user.profileImageUrl || ''
    return (
      <div className="app-navbar">
        <div className="app-navbar__logo-and-select">
          <Logo />
          <div className="app-navbar__select">
            <Select
              value={language}
              onChange={this.handleList}
              options={languages}
              placeholder=""
              styles={languageStyle}
            />
          </div>
        </div>
        <nav className="app-navbar__nav">

          <Links
            authenticated={authenticated}
            twitterId={twitterId}
            ip={ip}
            user={user}
            language={language.value}
            handleNotAuthenticated={this._handleNotAuthenticated}
          />
          { name ?
            (
              <div className="app-navbar__name">{name}</div>
            ) : (
              <div></div>
            )
          }
          { profileImageUrl ?
            (
              <img className="app-navbar__pic" src={profileImageUrl} alt=""></img>
            ) : (
              <div></div>
            )
          }
          { ip ?
            (
              <div className="app-navbar__name">{ip}</div>
            ) : (
              <div></div>
            )
          }
        </nav>
      </div>
    )
  }
}

export default withRouter(NavBar)
