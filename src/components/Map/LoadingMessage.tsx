import * as React from 'react'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import { createStyles, Typography } from '@material-ui/core'

const styles = theme =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '39px', // banner height
            left: '370px', //same as Panel width
            right: '0px',
            padding: '5px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            zIndex: 1,
        },
    })

interface LayerProps extends WithStyles<typeof styles> {
    classes: any
    message: string
}
interface LayerState {}

class LoadingMessage extends React.PureComponent<LayerProps, LayerState> {
    constructor(props: LayerProps) {
        super(props)
    }
    render(): React.ReactNode {
        const { classes, message } = this.props
        return <Typography className={classes.root}>{message}</Typography>
    }
}

export default withStyles(styles)(LoadingMessage)
