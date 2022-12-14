import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import { GITHUB_GREY } from '../../../constants/colours'
import Value from '../../common/Value'

const styles = () =>
    createStyles({
        chart: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '8px',
            marginBottom: '16px',
            width: '100%',
        },
        header: {
            width: '96%',
            background: '#bbb',
            textAlign: 'center',
            color: '#fff',
            padding: '8px',
        },
        tableRow: {
            height: '32px',
        },
        tableCell: {
            color: GITHUB_GREY,
        },
    })

interface ChartProps extends WithStyles<typeof styles> {
    classes: any
    chart: any
}

interface ChartState {}

const TableDataCell = ({ classes, data }) => (
    <TableCell align="right" className={classes.tableCell}>
        <b>
            <Value value={data} />
        </b>
    </TableCell>
)
const TableHeaderCell = ({ classes, label }) => (
    <TableCell component="th" scope="row" className={classes.tableCell}>
        {label}
    </TableCell>
)

class Chart extends React.PureComponent<ChartProps, ChartState> {
    constructor(props: ChartProps) {
        super(props)
    }

    render(): React.ReactNode {
        const {
            classes,
            chart: { label, data },
        } = this.props

        return (
            <Paper className={classes.chart}>
                <div className={classes.header}>Load Out Location: {label}</div>
                <br />
                <Table className={classes.root}>
                    <TableBody>
                        <TableRow key={1} className={classes.tableRow}>
                            <TableHeaderCell
                                classes={classes}
                                label={'Number Of Loads'}
                            />
                            <TableDataCell
                                classes={classes}
                                data={data.numLoads}
                            />
                        </TableRow>
                        <TableRow key={2} className={classes.tableRow}>
                            <TableHeaderCell
                                classes={classes}
                                label={'Tonnage'}
                            />
                            <TableDataCell
                                classes={classes}
                                data={data.totalWeight}
                            />
                        </TableRow>
                        <TableRow key={3} className={classes.tableRow}>
                            <TableHeaderCell
                                classes={classes}
                                label={'Loads / hr'}
                            />
                            <TableDataCell
                                classes={classes}
                                data={data.loadsPerHour}
                            />
                        </TableRow>
                        <TableRow key={4} className={classes.tableRow}>
                            <TableHeaderCell
                                classes={classes}
                                label={'Trucks'}
                            />
                            <TableDataCell
                                classes={classes}
                                data={data.numTrucks}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

export default withStyles(styles)(Chart)
