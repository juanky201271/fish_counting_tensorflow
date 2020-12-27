import React, { Component } from 'react'
import styled from 'styled-components'
import logo from '../logo.svg'
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
      </>
    )
  }
}
export default Logo
