import React, { Component } from 'react'
import styled from 'styled-components'
import logo from '../logo.svg'
const logoYelp = 'https://s24.q4cdn.com/143307695/files/design/client-logo.svg'
const Wrapper = styled.a.attrs({ className: 'navbar-brand' })`
  display: 'flex';
`
class Logo extends Component {
  render() {
    return (
      <>
        <Wrapper href="https://reactjs.org/" target="_blank">
          <img src={logo} width="50" height="50" alt="NightLife Coordination App - FreeCodeCamp" />
        </Wrapper>
        <Wrapper href="https://yelp.com/" target="_blank">
          <img src={logoYelp} width="50" height="50" alt="NightLife Coordination App - FreeCodeCamp" />
        </Wrapper>
      </>
    )
  }
}
export default Logo
