import React, { Component } from 'react'
import { withRouter } from 'react-router'
import api from '../api'

import './AboutUs.scss'
import { labels as labels_es } from './AboutUs_es.js'
import { labels as labels_en } from './AboutUs_en.js'
import { labels as labels_fr } from './AboutUs_fr.js'
import { labels as labels_pt } from './AboutUs_pt.js'

const labels_lang = {
  'es': labels_es,
  'en': labels_en,
  'fr': labels_fr,
  'pt': labels_pt
}

class AboutUs extends Component {
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
      console.log('about us file state', this.state)
      console.log('about us file props', this.props)

      return (
        <div className="aboutus">

          <div className="aboutus__wrapper">
            <div className="aboutus__header form-group">
              <div className="aboutus__header--title">
                {this.state.labels['who_we_are']}
                <hr />
              </div>
              <div className="aboutus__header--who-we-are">
                {this.state.labels['who_we_are_text']}
              </div>
            </div>
            <div className="aboutus__header-right form-group">
              <div className="aboutus__header-right--title">
                {this.state.labels['what_do_we_do']}
                <hr />
              </div>
              <div className="aboutus__header-right--what-do-we-do">
                {this.state.labels['what_do_we_do_text']}
              </div>
            </div>
          </div>

          <div className="aboutus__wrapper">
            <div className="aboutus__our-products">
              {this.state.labels['our_products']}
              <hr />
            </div>
          </div>

          <div className="aboutus__wrapper">
            <div className="aboutus__col-33">
              <div className="aboutus__col-33--left">
                {this.state.labels['obj_det_tool']}
              </div>
              <div className="aboutus__text">
                {this.state.labels['obj_det_tool_text']}
              </div>
            </div>
            <div className="aboutus__col-33">
              <div className="aboutus__col-33--middle">
                {this.state.labels['blo_tool']}
              </div>
              <div className="aboutus__text">
                {this.state.labels['blo_tool_text']}
              </div>
            </div>
            <div className="aboutus__col-33">
              <div className="aboutus__col-33--right">
                {this.state.labels['rec_tool']}
              </div>
              <div className="aboutus__text">
                {this.state.labels['rec_tool_text']}
              </div>
            </div>
          </div>

        </div>
      )
    }
}

export default withRouter(AboutUs)
