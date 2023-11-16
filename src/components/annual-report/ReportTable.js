import { Table, TableCell, TableCellHead, TableRowHead } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ReportTable.module.css'

// These are basically UI components with some config and styles to match the
// look of the existing report.
// I tried to keep the names short since they're used a lot

export const ReportCell = (props) => <TableCell dense {...props} />

export const ReportCellHead = (props) => <TableCellHead dense {...props} />

export const ReportRowHead = ({ className, ...props }) => (
    <TableRowHead className={cx(styles.tableRowHead, className)} {...props} />
)
ReportRowHead.propTypes = { className: PropTypes.string }

export const ReportTable = ({ className, ...props }) => (
    <Table
        suppressZebraStriping
        className={cx(styles.reportTable, className)}
        {...props}
    />
)
ReportTable.propTypes = { className: PropTypes.string }
