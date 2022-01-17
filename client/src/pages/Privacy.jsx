// juanky201271 - AIPeces - 2021

import React, { Component } from 'react'
import { withRouter } from 'react-router'

import './Privacy.scss'
import { labels as labels_es } from './Privacy_es.js'
import { labels as labels_en } from './Privacy_en.js'
import { labels as labels_fr } from './Privacy_fr.js'
import { labels as labels_pt } from './Privacy_pt.js'

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

class Privacy extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            isLoading: false,
            authenticated: '',
            twitterId: '',
            ip: '',
            user: '',
            labels: labels_lang[this.props.parentState.language],
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })
        window.addEventListener('changeLanguage', this.changeLanguage);
        this.setState({ isLoading: false })
    }

    componentWillUnmount = async () => {
      window.removeEventListener('changeLanguage', this.changeLanguage);
    }

    changeLanguage = async ({ detail }) => {
      console.log(detail)
      this.setState({
        labels: labels_lang[detail],
      })
    }

    render() {
      console.log('privacy state', this.state)
      console.log('privacy props', this.props)

      return (
        <div className="privacy">

          <div className="privacy__wrapper">

            <div className="privacy__header">
              <div className="privacy__header--title">
                <strong>{this.state.labels['privacy_title']}</strong>
              </div>
              <div className="privacy__header--text">
                {this.state.labels['privacy_text']}
              </div>
            </div>

          </div>

        </div>
      )
    }
}

export default withRouter(Privacy)
