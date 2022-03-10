import React from 'react'

export const ProjectTokenContext = React.createContext<string | undefined>(undefined)

export function ProjectTokenProvider(props: { children: React.ReactNode }) {
  const [projectToken, setProjectToken] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    setProjectToken(window.location.hash.slice(1))
    if (process.env.NODE_ENV === 'production') {
      window.location.hash = ''
    }
  }, [])
  return <ProjectTokenContext.Provider value={projectToken}>{props.children}</ProjectTokenContext.Provider>
}
