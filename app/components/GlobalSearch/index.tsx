import * as React from 'react'
import * as classNames from 'classnames'
import { isDevelopment } from 'utilities/env'
import TextField from '../TextField'
import * as styles from './GlobalSearch.scss'
import { extendObservable, observe } from 'mobx'
import { withRouter } from 'react-router-dom'
import store from './store'
import { observer } from 'mobx-react'
import Helmet from 'react-helmet'

interface Props {
  showMobile?: boolean
  defaultValue?: string
  history: any
  onClose?(): void
  onOpen?(): void
}

interface State {
  showSearchMobile: boolean
  message: {
    show: boolean
    title: string
    description: string
  }
  showOpenKeyShortcutHint: boolean
}

@observer
class GlobalSearch extends React.Component<Props, State> {
  public unsubscribeListener
  public textFieldNode: HTMLInputElement
  public state: State

  private helpers

  constructor(props) {
    super(props)
    this.state = {
      showSearchMobile: props.showMobile || false,
      message: {
        show: false,
        title: '',
        description: ''
      },
      showOpenKeyShortcutHint: true
    }
    this.onGetNode = this.onGetNode.bind(this)
    this.focus = this.focus.bind(this)
    this.handleMobxChange = this.handleMobxChange.bind(this)
  }

  public componentWillReceiveProps({ showMobile }) {
    this.setState({
      showSearchMobile: showMobile
    })
    if (showMobile) {
      this.focus()
    }
  }

  public focus() {
    setTimeout(() => this.textFieldNode.focus(), 0)
  }

  public componentDidMount() {
    this.unsubscribeListener = observe(store, change => {
      if (!change) {
        return
      }
      this.handleMobxChange()
    })
  }

  public handleMobxChange() {
    this.setState({ showOpenKeyShortcutHint: false })
    this.textFieldNode.focus()
  }

  public componentWillUnmount() {
    this.textFieldNode.removeEventListener('keydown', this.handleOnKeyDown)
    this.unsubscribeListener()
  }

  public onGetNode(node) {
    this.textFieldNode = node
    this.textFieldNode.addEventListener('keydown', this.handleOnKeyDown)
  }

  public render() {
    const { showSearchMobile } = this.state
    const resultsBoxNode = this.getResultsBoxNode()

    const wrapperClassName = classNames(
      styles.Wrapper,
      showSearchMobile && styles.WrapperVisibleMobile
    )

    return (
      <div className={wrapperClassName} role="search" onKeyUp={this.handleKeyUp}>
        {/* TODO Add Meta Tags */}
        <Helmet title="Block" />
        <div className={styles.SearchInput}>
          {/* Todo: point to the ID of the currently active result on aria-activedescendant */}
          <TextField
            type="search"
            placeholder="Wallet address, txid, or blockheight"
            onFocus={this.doSearch}
            onChange={this.doSearch}
            onBlur={this.hideResults}
            getHelpers={this.handleGotHelpers}
            getNode={this.onGetNode}
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            role="combobox"
            aria-label="Search Sia Explorer"
            value={this.props.defaultValue}
          />
          <button className={styles.CancelButton} onClick={this.doDefaultClose}>
            Cancel
          </button>
        </div>
        {resultsBoxNode}
      </div>
    )
  }

  private handleKeyUp = evt => {
    // escape key
    if (evt.keyCode === 27) {
      this.close()
    }
  }

  // tslint:disable-next-line:prefer-function-over-method
  private handleOnKeyDown = evt => {
    // up or down arrow key
    if (evt.keyCode === 38 || evt.keyCode === 40) {
      // Prevent the default behaviour on up/down arrow key presses
      // which moves the cursor at the beginning and end of the field
      evt.preventDefault()
    }
    if (evt.keyCode === 13) {
      this.searchSia(evt.target.value)
    }
  }

  private getResultsBoxNode = () => {
    const { message } = this.state

    if (message.show) {
      const node = (
        <div className={styles.Message}>
          {message.title && <div className={styles.MessageTitle}>{message.title}</div>}
          {message.description && (
            <div
              className={styles.MessageSubline}
              dangerouslySetInnerHTML={{ __html: message.description }}
            />
          )}
        </div>
      )
      return <div className={styles.SearchBox}>{node}</div>
    }
  }

  private searchSia = (address: string) => {
    if (this.validBlockHeight(address)) {
      this.props.history.push(`/block/${address}`)
    } else {
      this.props.history.push(`/hashes/${address}`)
    }
  }

  private validBlockHeight = input => Number.isInteger(parseInt(input, 10))

  private doSearch = e => {
    const { onOpen, showMobile } = this.props
    const { showOpenKeyShortcutHint } = this.state
    const query = this.textFieldNode.value

    // Search here

    if (onOpen) {
      onOpen()
    }
  }

  private doDefaultClose = () => {
    this.close()
  }

  private close = (doClear = true) => {
    const { onClose } = this.props
    if (doClear) {
      this.helpers.clear()
    }
    if (onClose) {
      onClose()
    }
  }

  private handleGotHelpers = helpers => {
    this.helpers = helpers
  }

  private hideResults = () => {
    if (isDevelopment) {
      return
    }
    if (!this.state.showSearchMobile) {
      this.close(false)
    }
  }

  private showMessage = message => {
    message.show = true
    this.setState({
      message
    })
  }
}

export default withRouter(GlobalSearch)
