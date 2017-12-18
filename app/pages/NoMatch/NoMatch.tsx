import * as React from 'react'
import { Link } from 'react-router-dom'

import Card from 'components/Card'
import LayoutContainer from 'components/LayoutContainer'
import TypeContainer from 'components/TypeContainer'

import * as styles from './NoMatch.scss'

export default class NoMatch extends React.Component<{}, {}> {
  public state = {
    title: '404'
  }

  public render() {
    return (
      <main id="MainContent" role="main">
        <LayoutContainer>
          <Card type="404">
            <Card.Section>
              <TypeContainer>
                <div className={styles.Content}>
                  <h1>{this.state.title}</h1>
                  <p>
                    Oops! Something went wrong and the page you were looking for couldn’t be
                    displayed. Try the <Link to="/">home page</Link>.
                  </p>
                </div>
              </TypeContainer>
            </Card.Section>
          </Card>
        </LayoutContainer>
      </main>
    )
  }
}
