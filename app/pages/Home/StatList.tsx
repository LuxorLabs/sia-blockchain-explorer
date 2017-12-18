import * as React from 'react'
import * as styles from './Home.scss'
import TypeHeading from 'components/TypeHeading'
import { Link } from 'react-router-dom'
import { CalloutCard, DescriptionList, TextStyle, SkeletonBodyText } from '@shopify/polaris'

export interface HashHeight {
  hash: string
  height: number
}

export interface Props {
  title: string
  items?: HashHeight[] | null
}

export default ({ title, items }: Props) => {
  let renderMe
  if (items) {
    const mappedList = items.map(({ hash, height }, i) => {
      return (
        <li className={styles.StatLine} key={i}>
          <span className={styles.StatHash}>
            <Link to={`/hashes/${hash}`}>{hash}</Link>
          </span>
          <span className={styles.StatBlockHeight}>{height}</span>
        </li>
      )
    })
    renderMe = <ul className={styles.StatList}>{mappedList}</ul>
  } else {
    renderMe = <SkeletonBodyText />
  }
  return (
    <div className={styles.StatBlock}>
      <TypeHeading level={4}>{title}</TypeHeading>
      {renderMe}
    </div>
  )
}
