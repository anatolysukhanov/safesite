import * as React from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles'
import Chart from './Chart'

const styles = () =>
    createStyles({
        container: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '16px',
        },
    })

const ChartContainer = ({ classes, charts }) => {
    return (
        <div className={classes.container}>
            {charts.map(chart => (
                <Chart key={chart.id} chart={chart} />
            ))}
        </div>
    )
}

export default withStyles(styles)(ChartContainer)
