import React from 'react'
import { graphql } from '@gratico/api'
import { useQuery } from 'urql'
import { ErrorComponent } from '@gratico/uikit'
import { WorkspaceComponent } from '../../index'
import { Route, useParams } from 'react-router'
import { bootViewportKernel } from '@gratico/kernel'
import { IKernel, IProject, IUser } from '@gratico/sdk'
import { Buffer } from '../../components/buffer'

export function BufferGitPage(props: { kernel: IKernel }) {
  const { kernel } = props
  const params = useParams<{ file: string; repo: string; branch: string }>()
  const fileParams = {
    type: 'git' as 'git',
    repo: params.repo,
    branch: params.branch,
    file: params.file,
  }
  // TODO fix it later
  return <Buffer fileParams={fileParams as any} kernel={kernel} />
}
export function BufferLocalPage(props: { kernel: IKernel }) {
  const { kernel } = props
  const params = useParams<{ file: string }>()
  const fileParams = {
    type: '~' as '~',
    path: '/' + '~',
    file: params.file,
  }
  return <Buffer fileParams={fileParams} kernel={kernel} />
}

export interface IProps {
  viewer?: IUser
  project: IProject
  children: (kernel: IKernel) => React.ReactNode
}
export function ProjectComponent(props: IProps) {
  const [kernel, setKernel] = React.useState<undefined | IKernel>(undefined)
  const boot = async (props: IProps) => {
    const k = await bootViewportKernel({ viewer: props.viewer, project: props.project })
    console.log(k)
    setKernel(k)
  }
  React.useEffect(() => {
    boot(props)
  }, [])
  return (
    <WorkspaceComponent kernel={kernel} viewer={props.viewer} project={props.project}>
      {kernel && props.children(kernel)}
    </WorkspaceComponent>
  )
}

export function Project() {
  const [{ fetching: loading, data, error }] = useQuery<graphql.Query>({
    query: QUERY,
    variables: {
      slug: 'gratico',
    },
    requestPolicy: 'cache-and-network',
  })
  return loading ? (
    <span>...</span>
  ) : error ? (
    <ErrorComponent error={error} />
  ) : data && data.kernel && data.kernel.getProject ? (
    <ProjectComponent viewer={data.kernel.user} project={data.kernel.getProject}>
      {(kernel) => (
        <>
          <Route path={'/git/:host/:repo*/~/:branch*/~/:file*'}>
            <BufferGitPage kernel={kernel} />
          </Route>
          <Route path={'/~/:file*'}>
            <BufferLocalPage kernel={kernel} />
          </Route>
        </>
      )}
    </ProjectComponent>
  ) : (
    <ErrorComponent error={new Error('Failed to load')} />
  )
}
// https://gratico.projects.www.grati.dev:3700/git/^github.com/gratico/adi/~/master/~/src/index.maker
const QUERY = `
  query ProjectWorkspaceBootQuery {
    kernel {
      viewer {
        id
      }
      user {
        id
        username
      }
      getProject {
        id
        slug
      }
    }
  }
`
