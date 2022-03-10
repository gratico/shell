import React from 'react'
import styled from '@emotion/styled'
import { Route, Switch } from 'react-router'
import { Client, Provider } from 'urql'
import { Flex } from '@gratico/uikit'
import { Project } from './project'

import { Layout as ThemeLayout } from '../../../shell/src/components/layout/index'

function Layout() {
  return (
    <ThemeLayout>
      {(themeParams, setThemeParams, themes) => {
        return (
          <>
            <Container>
              <BodyContainer data-spatial-container="true">
                <Switch>
                  <Route
                    path="/"
                    render={() => {
                      return <Project />
                    }}
                  />
                </Switch>
              </BodyContainer>
              <Flex></Flex>
            </Container>
          </>
        )
      }}
    </ThemeLayout>
  )
}

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 'main';
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const BodyContainer = styled.div`
  padding: 0;
  grid-area: main;
  position: relative;
  --spatial-navigation-contain: contain;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-grow: 1;
  overflow: auto;
`

export function RootLayout(props: { client: Client }) {
  return (
    <Provider value={props.client}>
      <Layout />
    </Provider>
  )
}
