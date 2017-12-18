import * as React from 'react'
import { classNames } from '@shopify/react-utilities/styles' // + variationName

import LayoutContainer from '../LayoutContainer'

import * as styles from './PageFooter.scss'
import TypeHeading from 'components/TypeHeading'

export default function PageFooter() {
  const className = classNames(styles.PageFooter)

  return (
    <footer className={className}>
      <LayoutContainer type="footer">
        <div className={styles.Content}>Made by Luxor.</div>
        <div className={styles.Content}>Version 0.2 </div>
      </LayoutContainer>
    </footer>
  )
}
