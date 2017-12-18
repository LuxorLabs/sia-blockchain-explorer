import * as React from 'react'
import * as classNames from 'classnames'
import * as styles from './TypeStandfirst.scss'

export interface Props {
  children?: React.ReactNode
}

export default function TypeHeading({ children }: Props) {
  const className = classNames(styles.TypeStandfirst)

  return <p className={className}>{children}</p>
}
