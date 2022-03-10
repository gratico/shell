import React from 'react'
import styled from '@emotion/styled'
import { Flex, ThemeProvider, useTheme } from '@gratico/uikit'
import { Link, Title, Meta } from 'react-head'
import { ThemeDependency, Theme, ThemeParams, ThemeMeta } from '@gratico/theme-megapack'
import { graphql } from '@gratico/api'
import { useQuery } from 'urql'
import { Global } from '@emotion/react'

import {
  theme as defaultTheme,
  themeDependencies as defaultThemeDependencies,
} from '../../../../theme-megapack/src/dark'

function renderDependency(themeDependency: ThemeDependency, i: number) {
  if (themeDependency.type === 'font') {
    return <Link key={i} rel="stylesheet" href={themeDependency.url} />
  }
  return null
}

export function Head({ themeDependencies }: { themeDependencies: ThemeDependency[] }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return <>{mounted && themeDependencies ? themeDependencies.map(renderDependency) : null}</>
}

export function Layout(props: {
  children: (
    themeParams: ThemeParams,
    setThemeParams: (params: ThemeParams) => void,
    themes: ThemeMeta[],
  ) => React.ReactNode
}) {
  const [themeParams, setThemeParams] = React.useState<ThemeParams | {}>({})
  const [{ fetching: loading, data, error }] = useQuery<graphql.Query>({
    query: QUERY,
    variables: themeParams,
    requestPolicy: 'cache-and-network',
  })
  const themeDependencies = data?.kernel.getTheme?.payload?.themeDependencies
    ? data?.kernel.getTheme?.payload?.themeDependencies
    : defaultThemeDependencies
  const theme = data?.kernel.getTheme?.payload?.theme ? data?.kernel.getTheme?.payload?.theme : defaultTheme

  React.useEffect(() => {
    if (data?.kernel.getTheme?.packageName && data?.kernel.getTheme?.packageVersion && data?.kernel.getTheme?.themeId) {
      const params = {
        package_name: data.kernel.getTheme.packageName,
        package_version: data.kernel.getTheme.packageVersion,
        theme_id: data.kernel.getTheme.themeId,
      }
      setThemeParams({
        packageName: params.package_name,
        packageVersion: params.package_version,
        themeId: params.theme_id,
      })
      fetch('/hq/cockpit/set_theme', {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }, [data?.kernel.getTheme?.packageName, data?.kernel.getTheme?.packageVersion, data?.kernel.getTheme?.themeId])
  return (
    <>
      <Head themeDependencies={themeDependencies} />
      <ThemeProvider theme={theme as any}>
        <Meta name="theme-color" content={theme.colors.background} />
        <Global
          styles={(t: any) => {
            return {
              body: {
                fontFamily: theme.fonts.body,
              },
              'h1, h2, h3, h4, h5, h6': {
                fontFamily: theme.fonts.heading,
              },
              a: {
                ...theme.styles.a,
              },
              'a:hover': {
                textDecoration: 'underline',
              },
              'a:focus': {
                //                outline: 'none'
              },
              'a:active': {
                //                outline: 'none'
              },
              '*:focus': {
                outlineStyle: 'auto',
                outlineOffset: '-5px',
              },
              button: {
                ...theme.styles.button,
              },
              'button[disabled]': {
                opacity: 0.6,
                pointerEvents: 'none',
                cursor: 'not-allowed',
              },

              [`[role="button"]`]: {
                ...theme.styles.button,
              },
              input: {
                ...theme.styles.input,
              },
              '::-webkit-scrollbar': {
                width: '5px',
                height: '8px',
                backgroundColor: '#aaa',
              },
              '::-webkit-scrollbar-thumb': {
                width: '5px',
                height: '8px',
                backgroundColor: '#333',
              },
            }
          }}
        />
        {props.children(themeParams, setThemeParams, data?.kernel.getTheme?.payload?.themes || [])}
      </ThemeProvider>
    </>
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
// https://gratico.projects.www.grati.dev:3700/git/^github.com/gratico/adi/~/master/~/src/index.maker
const QUERY = `
  query ProjectThemeQuery($packageName: String, $packageVersion: String, $themeId: String) {
  kernel {
    getTheme(packageName: $packageName, packageVersion:$packageVersion, themeId: $themeId ) {
      id
      themeId
      packageName
      packageVersion
      payload
      themes
    }
  }
}
`
