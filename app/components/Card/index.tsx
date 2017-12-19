import * as React from 'react'
import * as classNames from 'classnames'
import { variationName } from 'utilities/styles'
import Section from './Section'

import * as styles from './Card.scss'

type CardType = 'main' | 'home' | '404'

export interface Props {
  type?: CardType
  children?: React.ReactNode
}

export default class Card extends React.Component<Props, {}> {
  public static Section = Section

  public render() {
    const { type, children } = this.props

    const className = classNames(styles.Card, type && styles[variationName('type', type)])

    return <section className={className}>{children}</section>
  }
}

export { Card }
