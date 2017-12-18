import * as React from 'react'
import * as classNames from 'classnames'
import * as styles from './Card.scss'

export interface Props {
  children?: React.ReactNode
}

export default function Section({ children }: Props) {
  const className = classNames(styles.Section)

  return <div className={className}>{children}</div>
}
