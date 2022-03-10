import React from 'react'
import styled from '@emotion/styled'

export function createIcon(jsx: React.ReactNode) {
  return function Icon({ size = 25 }: { size?: number }) {
    return (
      <IconContainer
        style={{
          width: size,
          height: size
        }}
      >
        {jsx}
      </IconContainer>
    )
  }
}

const IconContainer = styled.span`
  position: relative;
  display: inline-block;
  > svg {
    width: 100%;
    height: 100%;
    position: absolute;
  }
`
