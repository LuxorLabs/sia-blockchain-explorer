import * as React from 'react'
import * as classNames from 'classnames'
import { variationName } from 'utilities/styles'
import Icon from '../Icon'
import SearchIcon from 'svg/SearchIcon.svg'
import CloseIcon from 'svg/SearchCloseIcon.svg'

import * as styles from './TextField.scss'

type TextFieldSize = 'small'

interface Helpers {
  clear(): void
}

export interface Props {
  id?: string
  name?: string
  value?: string
  placeholder?: string
  size?: TextFieldSize
  disabled?: boolean
  type?: string
  autoComplete?: string
  autoCorrect?: string
  autoCapitalize?: string
  role?: string
  spellCheck?: boolean
  onFocus?(): void
  onBlur?(): void
  onChange?(selected: string): void
  getNode?(node: React.ReactNode): void
  getHelpers?(helpers: Helpers): void
}

interface State {
  showClearButton: boolean
}

export default class TextField extends React.Component<Props, State> {
  public state: State = {
    showClearButton: false
  }

  private node: HTMLInputElement | null = null

  constructor(props) {
    super(props)
  }

  public componentWillMount() {
    const { getHelpers } = this.props
    if (getHelpers) {
      getHelpers({
        clear: this.clear
      })
    }
    // We have to bind this instead of arrow func for some reason. Look into later.
    this.handleChange = this.handleChange.bind(this)
    this.clear = this.clear.bind(this)
    this.handleRef = this.handleRef.bind(this)
  }

  public render() {
    const { size, disabled, type, onChange, getHelpers, getNode, ...otherProps } = this.props

    const className = classNames(
      styles.TextField,
      type && type === 'search' && styles.SearchField,
      size && styles[variationName('size', size)]
    )

    return (
      <div className={styles.Wrapper}>
        <input
          type={type}
          className={className}
          onChange={this.handleChange}
          ref={this.handleRef}
          disabled={disabled}
          {...otherProps}
        />
        {this.state.showClearButton ? (
          <div className={styles.ClearButton} onClick={this.clear}>
            <Icon src={CloseIcon.id} size="7" />
          </div>
        ) : null}
      </div>
    )
  }

  private clear() {
    if (this.node instanceof HTMLInputElement) {
      this.node.value = ''
      this.setState({ showClearButton: false })
      this.node.focus()
    }
  }

  private handleRef(node) {
    console.log('handleRef')
    this.node = node
    const { getNode } = this.props
    if (!getNode) {
      return
    }
    getNode(node)
  }

  private handleChange({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) {
    const { onChange, type } = this.props

    if (type === 'search') {
      this.setState({ showClearButton: value.length > 0 })
    }

    if (!onChange) {
      return
    }

    onChange(value)
  }
}
