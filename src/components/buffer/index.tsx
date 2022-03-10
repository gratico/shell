import React from 'react'
import styled from '@emotion/styled'
import { IKernel, FileParams } from '@gratico/sdk'

//import { Mantra } from '@gratico/mantra'
import { ProseMirror } from '@gratico/prosemirror'
import pify from 'pify'

//https://gratico.projects.www.grati.local:3700/git/gratico/adi/^/master/~/src/index.maker

export interface BufferProps {
  kernel: IKernel
  fileParams: FileParams
}

export function Buffer(props: BufferProps) {
  const [loaded, setLoaded] = React.useState(false)
  const loadFile = async (props: BufferProps) => {
    const { kernel } = props
    console.log(props)

    setLoaded(true)
  }
  React.useEffect(() => {
    loadFile(props)
  }, [])

  return (
    <$Container>
      {true && (
        <ProseMirror
          fileParams={props.fileParams}
          kernel={props.kernel}
          value={[]}
          onChange={(ast: any) => null}
        ></ProseMirror>
      )}
    </$Container>
  )
}

const $Container = styled.div`
  padding: 0px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
`
