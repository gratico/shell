import React from 'react'
import styled from '@emotion/styled'
import { IKernel, IProject, IUser } from '@gratico/sdk'
import { SlidingPanels, Box, useTheme } from '@gratico/uikit'

import { Hydra } from '../hydra/index'
import { Nav } from '../nav'

export function Stage(props: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = React.useState<null | 'sidebar' | 'panels'>(null)
  const rightWidth = (width: number) => Math.min(width / 2, 250)
  const leftWidth = (width: number) => Math.min(width / 2, 250)
  const mainWidth = (width: number) => (width <= 600 ? width - 0 : width - 0)
  return (
    <SlidingPanels
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      padding={20}
      {...{
        rightWidth,
        leftWidth,
        mainWidth,
        breakpointWidth: (w) => rightWidth(w) + leftWidth(w) + 250,
      }}
    >
      <$Sidebar></$Sidebar>
      <$Registry></$Registry>
      <$Canvas key="a">
        <Box backgroundColor={'background'} sx={{ flex: 1, border: '1px solid' }}>
          {props.children}
        </Box>
      </$Canvas>
    </SlidingPanels>
  )
}

const $Canvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`
const $Sidebar = styled.div`
  border-right: 1px solid #ddd;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const $Registry = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export interface IProps {
  viewer?: IUser
  project: IProject
  children: React.ReactNode
  kernel?: IKernel
}

export const WorkspaceComponent = (props: IProps) => {
  const { kernel } = props
  return (
    <$Container>
      {false && (
        <$Header>
          <Nav {...{ ...props }} kernel={kernel || undefined} />
        </$Header>
      )}
      <$Body>
        <Stage>{props.children}</Stage>
      </$Body>
      <$Hydra>{kernel && <Hydra kernel={kernel} />}</$Hydra>
    </$Container>
  )
}

const $Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const $Header = styled.div``

const $Body = styled.div`
  flex: 1;
  position: relative;
`

const $Hydra = styled.div`
  border-top: 1px solid #ddd;
`
