import * as React from 'react'
import { browserHistory } from 'react-router-dom'
import * as classNames from 'classnames'
import * as styles from './TypeContainer.scss'

export interface Props {
  children?: React.ReactNode
}

function handleWrapperClick(evt: any) {
  const { target } = evt

  if (target.tagName !== 'A') {
    return
  }

  const href = target.getAttribute('href')
  const isExternal = /^https?\:\/\//.test(href)
  const isHashLink = /^\#.+/.test(href)

  if (!isExternal && !isHashLink) {
    evt.preventDefault()
    browserHistory.push(href)
  }
}

export default function TypeContainer({ children }: Props) {
  const className = classNames(styles.TypeContainer)

  return (
    <article onClick={handleWrapperClick} className={className}>
      {children}
    </article>
  )
}
