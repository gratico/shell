import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { IKernel, IProject, IUser } from '@gratico/sdk'

export const Nav = (props: { viewer?: IUser; project?: IProject; kernel?: IKernel; path?: string }) => {
  return (
    <NavWrapper>
      <div>
        <a href="https://www.grati.co">
          <img src="https://cdn.www.grati.co/versions/v10/favicons/894397+%281%29.png" />
        </a>
      </div>
      <div style={{ padding: '0 10px' }}>
        <Link to={'/'}>{props.project ? props.project.slug : null}</Link>
      </div>
      <div data-header={'true'}>{props.path}</div>
      <div>
        <div>
          <a href="https://www.grati.co">{props.viewer ? props.viewer.username : 'anonymous'}</a>
        </div>
      </div>
    </NavWrapper>
  )
}
const NavWrapper = styled.div`
  padding: 2px 5px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  > div[data-header] {
    padding: 0 10px;
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  > div:first-of-type a img {
    width: 30px;
    height: 30px;
    display: block;
    margin-right: 0px;
  }
  > div:last-of-type {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
  }
`
