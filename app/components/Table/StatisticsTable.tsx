import * as React from 'react'
import * as classNames from 'classnames'
import * as styles from './StatisticsTable.scss'

export interface RowDataType {
  title: string
  data: any
}
export interface StatisticsTableProps {
  striped?: boolean
  fixed?: boolean
  name: string
  data: RowDataType[]
}

export default class StatisticsTable extends React.Component<StatisticsTableProps, {}> {
  public render() {
    const { striped, data, fixed, name } = this.props
    const TableClass = classNames(
      styles.StatisticsTable,
      striped && styles.isStriped,
      fixed && styles.isFixed
    )
    const TableRowClass = classNames(styles.StatisticsTableRow)

    const mappedRows = data.map(({ title, data }, i) => (
      <tr key={i} className={TableRowClass}>
        <td>{title}</td>
        <td>{data}</td>
      </tr>
    ))

    return (
      <div className={TableClass}>
        <table>
          <tbody>
            <tr>
              <th colSpan={2}>{name}</th>
            </tr>
            {mappedRows}
          </tbody>
        </table>
      </div>
    )
  }
}
