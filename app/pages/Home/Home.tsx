import * as React from 'react'
import * as styles from './Home.scss'

import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import LayoutContainer from 'components/LayoutContainer'
import TypeHeading from 'components/TypeHeading'
import Card from 'components/Card'
import {
  CalloutCard,
  DescriptionList,
  TextStyle,
  SkeletonDisplayText,
  TextStyle
} from '@shopify/polaris'
import { fetchLatest } from 'lib/api'
import StatList from './StatList'

const mockedData = [
  {
    hash: '098d15238be15347718fa9dfce6e8cbf2dfbbdf7d68c143f6c61233a60479e62',
    height: 123123
  },
  {
    hash: '098d15238be15347718fa9dfce6e8cbf2dfbbdf7d68c143f6c61233a60479e62',
    height: 123123
  },
  {
    hash: '098d15238be15347718fa9dfce6e8cbf2dfbbdf7d68c143f6c61233a60479e62',
    height: 123123
  },
  {
    hash: '098d15238be15347718fa9dfce6e8cbf2dfbbdf7d68c143f6c61233a60479e62',
    height: 123123
  },
  {
    hash: '098d15238be15347718fa9dfce6e8cbf2dfbbdf7d68c143f6c61233a60479e62',
    height: 123123
  }
]

@inject('main')
@observer
class Home extends React.Component {
  public state = {
    block: null
  }
  public async componentDidMount() {
    const { data } = await fetchLatest()
    if (data) {
      this.setState({
        block: data
      })
    }
    // Error handling TODO
  }
  public mapHashHeight = block => {
    const tx = block.transactions
    const fc: any[] = []
    const sco: any[] = []
    const sfo: any[] = []
    tx.forEach(t => {
      if (t.filecontractids) {
        fc.push({
          hash: t.id,
          height: t.height
        })
      } else if (t.siacoininputoutputs) {
        sco.push({
          hash: t.id,
          height: t.height
        })
      } else if (t.siafundinputoutputs) {
        sfo.push({
          hash: t.id,
          height: t.height
        })
      }
    })
    return {
      fc: fc.splice(0, 10),
      sco: sco.splice(0, 10),
      sfo: sfo.splice(0, 10)
    }
  }
  public render() {
    const { block } = this.state
    let sco = null
    let sfo = null
    let fc = null
    let blockheight = <SkeletonDisplayText size="small" />
    if (block) {
      const data = this.mapHashHeight(block)
      sco = data.sco
      sfo = data.sfo
      fc = data.fc
      blockheight = (
        <TypeHeading level={4}>
          <span>Latest Block Height: </span>
          <Link to={`/block/${block.height}`}>{block.height}</Link>
        </TypeHeading>
      )
    }
    return (
      <div>
        <LayoutContainer>
          {/* <div className={styles.HomeAlert}>
            <TextStyle>
              Sia Explorer is currently experiencing some load issues. If you can't find your hash,
              or are having trouble loading the block, you can try{' '}
              <a href="https://explorer.siahub.info/" target="_blank">
                Siahub Explorer
              </a>
            </TextStyle>
          </div> */}
          <Card type="home">
            <Card.Section>
              <TypeHeading level={3}>Welcome to the Sia Explorer</TypeHeading>
              {blockheight}
              <div className={styles.Stat}>
                <StatList title="Latest 10 File Contracts" items={fc} />
                <StatList key={2} title="Latest 10 Siacoin Transactions" items={sco} />
              </div>
            </Card.Section>
          </Card>
        </LayoutContainer>
      </div>
    )
  }
}

export default Home
