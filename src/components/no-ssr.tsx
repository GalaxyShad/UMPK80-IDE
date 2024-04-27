import dynamic from 'next/dynamic'
import React, {HTMLProps, ReactNode} from 'react'

const NoSsr = (props: HTMLProps<ReactNode>) => (
  <React.Fragment>{props.children}</React.Fragment>
)

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false
})