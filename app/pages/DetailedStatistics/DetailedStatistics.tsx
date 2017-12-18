import * as React from 'react'
import LayoutContainer from 'components/LayoutContainer'
import { Card as MainCard } from 'components/Card'
import TypeHeading from 'components/TypeHeading'
import {
  Card,
  Stack,
  Badge,
  ResourceList,
  TextStyle,
  Thumbnail,
  EmptyState,
  SkeletonPage,
  SkeletonBodyText,
  Spinner,
  SkeletonDisplayText,
  Layout
} from '@shopify/polaris'
import { Link, withRouter } from 'react-router-dom'
import { RowDataType } from 'components/Table/StatisticsTable'
import * as styles from './DetailedStatistics.scss'

import * as blockMock from '../../../mock/block.json'
import * as txMock from '../../../mock/hashtx.json'
import * as fcMock from '../../../mock/hashfile.json'
import * as walletMock from '../../../mock/hashunlock.json'

import ReactTable from 'react-table'
import { StatisticsTable } from 'components/Table'

import { fetchBlock, fetchHash } from 'lib/api'
import { hastingsToSC } from 'lib/formatters'
import TypeContainer from 'components/TypeContainer'

export interface DetailedStatisticsStateProps {
  type: string
  block: any
  transaction: any
  transactions: any[]
  error: boolean
}

export interface DetailedStatisticsProps {
  match?: any
  location?: any
  history?: any
}

class DetailedStatistics extends React.Component<
  DetailedStatisticsProps,
  DetailedStatisticsStateProps
> {
  public state = {
    error: false,
    type: 'Unknown',
    // TODO: create empty block typing
    block: null,
    // TODO: tx typing
    transaction: null,
    transactions: null
  }
  public async componentDidMount() {
    const { location: { pathname } } = this.props
    try {
      if (pathname.includes('block')) {
        const { match: { params: { height } } } = this.props
        const { data } = await fetchBlock(height)
        const { blocks } = data
        this.setState({
          type: 'block',
          block: blocks[0],
          // TODO: TX can be null e.g. height 12345
          transactions: blocks[0].transactions
        })
      } else {
        const { match: { params: { hash } } } = this.props
        const { data } = await fetchHash(hash)
        this.setState({
          type: data.hashtype,
          block: data.block,
          transaction: data.transaction,
          transactions: data.transactions
        })
      }
    } catch (err) {
      this.setState({
        error: true
      })
    }
  }

  public linkHash = hash => `/hashes/${hash}`
  public linkHeight = height => `/block/${height}`
  public blockDataMap = (block): RowDataType[] => {
    const makeBlockLink = blockheight => `/block/${blockheight}`
    const height = block.height
    const numOfTx = block.transactions ? block.transactions.length : 0
    const outputTotal = block.siacoinoutputcount
    const maturityTimestamp = block.maturitytimestamp
    const difficulty = block.difficulty
    const minerId = block.minerpayoutids[0]
    const totalTransactions = block.transactioncount
    const scInputCount = block.siacoininputcount
    const scOutputCount = block.siacoinoutputcount
    const fileContractCount = block.filecontractcount
    const fileContractRevisionCount = block.filecontractrevisioncount
    const storageProofCount = block.storageproofcount
    const activeContractsCost = block.activecontractcost
    const activeContractsSize = block.activecontractsize
    const totalContractCost = block.totalcontractcost
    const totalContractSize = block.totalcontractsize

    return [
      {
        title: 'Height',
        data: <Link to={makeBlockLink(block.height)}>{height}</Link>
      },
      {
        title: 'Number of Transactions',
        data: numOfTx
      },
      {
        title: 'Output Total',
        data: outputTotal
      },
      {
        title: 'Maturity Timestamp',
        data: maturityTimestamp
      },
      {
        title: 'Difficulty',
        data: difficulty
      },
      {
        title: 'Miner UTXO',
        data: <Link to={this.linkHash(minerId)}>{minerId}</Link>
      },
      {
        title: 'Running Transaction Count',
        data: totalTransactions
      },
      {
        title: 'Running Total of Inputs',
        data: scInputCount
      },
      {
        title: 'Running Total of Outputs',
        data: scOutputCount
      },
      {
        title: 'Running Total of File Contracts',
        data: fileContractCount
      },
      {
        title: 'Running Revision Count',
        data: fileContractRevisionCount
      },
      {
        title: 'Running Proof Count',
        data: storageProofCount
      },
      {
        title: 'Active Contract Cost',
        data: hastingsToSC(activeContractsCost)
      },
      {
        title: 'Active Contract Size',
        data: activeContractsSize
      },
      {
        title: 'Total Contract Cost',
        data: hastingsToSC(totalContractCost)
      },
      {
        title: 'Total Contract Size',
        data: totalContractSize
      }
    ]
  }
  public blockHashesMap = (block): RowDataType[] => {
    const hash = block.blockid
    const parent = block.rawblock.parentid
    const nextBlock = block.height + 1
    const blockReward = block.rawblock.minerpayouts[0].value
    return [
      {
        title: 'Hash',
        data: <Link to={this.linkHash(hash)}>{hash}</Link>
      },
      {
        title: 'Previous Block',
        data: <Link to={this.linkHash(parent)}>{parent}</Link>
      },
      {
        title: 'Next Block Height',
        data: <Link to={this.linkHeight(nextBlock)}>{nextBlock}</Link>
      },
      {
        title: 'Block Reward',
        data: hastingsToSC(blockReward)
      }
    ]
  }
  public txDataMap = (tx): RowDataType[] => {
    const { rawtransaction } = tx
    const height = tx.height
    // Fix
    const confirmations = 12231231 - height
    const inputAddresses = rawtransaction.siacoininputs.map(i => (
      <Link to={i.parentid} key={i.parentid}>
        {i.parentid}
      </Link>
    ))
    const outputAddresses = rawtransaction.siacoinoutputs.map(i => (
      <Link to={i.unlockhash} key={i.unlockhash}>
        {i.unlockhash}
      </Link>
    ))
    const txValue = tx.siacoininputoutputs
      ? tx.siacoininputoutputs.map(io => parseInt(io.value, 10)).reduce((x, y) => x + y)
      : null
    return [
      {
        title: 'Height',
        data: <Link to={this.linkHeight(height)}>{height}</Link>
      },
      {
        title: 'Confirmations',
        data: confirmations
      },
      {
        title: 'Output Reference(s)',
        data: inputAddresses
      },

      {
        title: 'Transaction Value',
        data: hastingsToSC(txValue)
      }
    ]
  }
  public outputDataMap = (tx): RowDataType[] => {
    const { rawtransaction } = tx
    const height = tx.height
    // Fix
    const confirmations = 12231231 - height
    const inputAddresses = rawtransaction.siacoininputs.map(i => (
      <Link to={i.parentid} key={i.parentid}>
        {i.parentid}
      </Link>
    ))
    const outputAddresses = rawtransaction.siacoinoutputs.map(i => (
      <Link to={i.unlockhash} key={i.unlockhash}>
        {i.unlockhash}
      </Link>
    ))
    const txValue = tx.siacoininputoutputs
      ? tx.siacoininputoutputs.map(io => parseInt(io.value, 10)).reduce((x, y) => x + y)
      : null
    return [
      {
        title: 'Height',
        data: <Link to={this.linkHeight(height)}>{height}</Link>
      },
      {
        title: 'Confirmations',
        data: confirmations
      },
      {
        title: 'Output Reference(s)',
        data: inputAddresses
      },
      {
        title: 'Transaction Value',
        data: hastingsToSC(txValue)
      }
    ]
  }
  public sfDataMap = (tx): RowDataType[] => {
    const { rawtransaction } = tx
    const height = tx.height
    // Fix
    const confirmations = 12231231 - height
    const inputAddresses = rawtransaction.siafundinputs.map(i => (
      <Link to={i.parentid} key={i.parentid}>
        {i.parentid}
      </Link>
    ))
    const outputAddresses = rawtransaction.siafundoutputs.map(i => (
      <Link to={i.unlockhash} key={i.unlockhash}>
        {i.unlockhash}
      </Link>
    ))
    const txValue = tx.siafundinputoutputs
      ? tx.siafundinputoutputs.map(io => parseInt(io.value, 10)).reduce((x, y) => x + y)
      : null
    return [
      {
        title: 'Height',
        data: <Link to={this.linkHeight(height)}>{height}</Link>
      },
      {
        title: 'Confirmations',
        data: confirmations
      },
      {
        title: 'Output Reference(s)',
        data: inputAddresses
      },
      {
        title: 'New Unlock Addresse(s)',
        data: outputAddresses
      },
      {
        title: 'Siafund Value',
        data: txValue
      }
    ]
  }
  public unlockHashDataMap = (w): RowDataType[] => {
    const walletValue = w
      .map(t => t.siacoininputoutputs.map(x => parseInt(x.value, 10)).reduce((z, o) => z + o))
      .reduce((x, y) => x + y)
    const transactionIds = w.map(t => t.id)
    return [
      {
        title: 'Wallet Value',
        data: walletValue
      },
      {
        title: 'Transactions',
        data: transactionIds
      }
    ]
  }
  public render() {
    let renderMe
    let cardTitle
    let hashID
    const { block, transactions, transaction, type, error } = this.state
    let cardSection = (
      <Card.Section>
        <Stack>
          <Badge>Block</Badge>
          <Badge>Main Chain</Badge>
          <Badge>Mined by Luxor</Badge>
        </Stack>
      </Card.Section>
    )

    if (block || transactions || transaction) {
      switch (type) {
        case 'blockid':
        case 'block':
          const blockReward = hastingsToSC(block.rawblock.minerpayouts[0].value)
          cardSection = (
            <Card.Section>
              <Stack>
                <Badge>{type}</Badge>
                <Badge>Main Chain</Badge>
                <Badge>{`Block Reward ${blockReward}`}</Badge>
              </Stack>
            </Card.Section>
          )
          cardTitle = `Block ${block.height}`
          hashID = block.blockid
          const blockTableData: RowDataType[] = this.blockDataMap(block)
          const nextPrevBlockData: RowDataType[] = this.blockHashesMap(block)
          renderMe = (
            <Card title={cardTitle}>
              <Card.Section>
                <Link to={this.linkHash(hashID)}>{hashID}</Link>
              </Card.Section>
              {cardSection}
              <Card.Section>
                <TypeHeading level={3}>Detailed Block Summary</TypeHeading>
                <div className={styles.DetailedStatisticsBlock}>
                  <StatisticsTable name="Summary" striped data={blockTableData} />
                </div>
                <div className={styles.NextHashBlock}>
                  <StatisticsTable name="Hash & Mining Details" fixed data={nextPrevBlockData} />
                </div>
              </Card.Section>
            </Card>
          )
          break
        case 'unlockhash':
          // Unlock hash related
          const wallet = transactions
          const walletTableData = this.unlockHashDataMap(wallet)
          cardTitle = 'Wallet Address'
          hashID = this.props.match.params.hash
          renderMe = (
            <Card title={cardTitle}>
              <Card.Section>
                <Link to={this.linkHash(hashID)}>{hashID}</Link>
              </Card.Section>
              {cardSection}
              <Card.Section>
                <TypeHeading level={3}>Wallet Summary</TypeHeading>
                <StatisticsTable
                  name="Summary of Wallet Address"
                  striped
                  fixed
                  data={walletTableData}
                />
              </Card.Section>
            </Card>
          )
          break
        case 'transactionid':
          // Tx related
          const tx = transaction
          const tsTableData: RowDataType[] = this.txDataMap(tx)
          cardTitle = 'Transaction ID'
          hashID = this.props.match.params.hash
          renderMe = (
            <Card title={cardTitle}>
              <Card.Section>
                <Link to={this.linkHash(hashID)}>{hashID}</Link>
              </Card.Section>
              {cardSection}
              <Card.Section>
                <TypeHeading level={3}>Siacoin Transaction Summary</TypeHeading>
                <StatisticsTable
                  name="Summary of Transaction ID"
                  striped
                  fixed
                  data={tsTableData}
                />
              </Card.Section>
            </Card>
          )
          break
        case 'siafundoutputid':
          // SF related
          const sf = transactions[0]
          const sfTableData: RowDataType[] = this.sfDataMap(sf)
          cardTitle = 'Siafund Output'
          hashID = this.props.match.params.hash
          renderMe = (
            <Card title={cardTitle}>
              <Card.Section>
                <Link to={this.linkHash(hashID)}>{hashID}</Link>
              </Card.Section>
              {cardSection}
              <Card.Section>
                <TypeHeading level={3}>Siafund Transaction Summary</TypeHeading>
                <StatisticsTable
                  name="Summary of Siafund Output"
                  striped
                  fixed
                  data={sfTableData}
                />
              </Card.Section>
            </Card>
          )
          break
        case 'siacoinoutputid':
          // Tx related
          const sc = transactions[0]
          const scTableData: RowDataType[] = this.outputDataMap(sc)
          cardTitle = 'Siacoin Output'
          hashID = this.props.match.params.hash
          renderMe = (
            <Card title={cardTitle}>
              <Card.Section>
                <Link to={this.linkHash(hashID)}>{hashID}</Link>
              </Card.Section>
              {cardSection}
              <Card.Section>
                <TypeHeading level={3}>Siacoin Output Transaction Summary</TypeHeading>
                <StatisticsTable
                  name="Summary of Siacoin Output"
                  striped
                  fixed
                  data={scTableData}
                />
              </Card.Section>
            </Card>
          )
          break
        case 'filecontractid':
          // File contract related
          const fc = transactions[0]
          // FIX ME
          const fcTableData: RowDataType[] = this.txDataMap(fc)
          renderMe = (
            <Card.Section>
              <TypeHeading level={3}>File Contract Summary</TypeHeading>
              <StatisticsTable name="Summary of File Contract" striped fixed data={fcTableData} />
            </Card.Section>
          )
      }
    } else {
      renderMe = (
        <Card title="Loading">
          <Card.Section>
            <SkeletonBodyText />
          </Card.Section>
          {cardSection}
          <Card.Section>
            <SkeletonDisplayText size="medium" />
            <Layout.Section>
              <SkeletonBodyText />
            </Layout.Section>
            <Layout.Section>
              <SkeletonBodyText />
            </Layout.Section>
            <Layout.Section>
              <SkeletonBodyText />
            </Layout.Section>
          </Card.Section>
        </Card>
      )
    }

    if (error) {
      renderMe = (
        <LayoutContainer>
          <Card>
            <Card.Section>
              <TypeContainer>
                <div className={styles.Content}>
                  <h1>Hash not found {':<'}</h1>
                  <p>
                    We couldn't find anything. The tx may have not been indexed yet, or there are
                    simply no transactions from your address.
                  </p>
                  <p>
                    <Link to="/">Go back to the homepage</Link>.
                  </p>
                </div>
              </TypeContainer>
            </Card.Section>
          </Card>
        </LayoutContainer>
      )
    }

    return (
      <LayoutContainer>
        <MainCard type="main">{renderMe}</MainCard>
      </LayoutContainer>
    )
  }
}

export default withRouter(DetailedStatistics)
