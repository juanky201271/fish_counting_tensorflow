import React, { Component } from 'react'
import { withRouter } from 'react-router'

import './Terms.scss'
import { labels as labels_es } from './Terms_es.js'
import { labels as labels_en } from './Terms_en.js'
import { labels as labels_fr } from './Terms_fr.js'
import { labels as labels_pt } from './Terms_pt.js'

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

class Terms extends Component {
    constructor(props) {
        super(props)
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
      console.log('terms state', this.state)
      console.log('terms props', this.props)

      return (
        <div className="terms">

          <div className="terms__wrapper">

            <div className="terms__header">
              <div className="terms__header--title">
                <strong>{this.state.labels['terms_title']}</strong>
              </div>
              <div className="terms__header--text">
                {this.state.labels['terms_text']}
              </div>
            </div>

          </div>

        </div>
      )
    }
}

export default withRouter(Terms)
