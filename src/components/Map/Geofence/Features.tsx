import * as React from 'react'

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'

import Feature from './Feature'

const styles = theme => ({
    list: {
        padding: 8,
        overflowY: 'auto' as 'auto',
        height: 'calc(100vh - 146px)',
    },
    text: {
        marginBottom: 8,
        fontSize: '0.875rem',
    },
})

interface FeaturesProps {
    classes: any
    features: Array<any>
    dispatch: any
}

interface FeaturesState {}

class Features extends React.Component<FeaturesProps, FeaturesState> {
    constructor(props: FeaturesProps) {
        super(props)
    }

    render = (): React.ReactNode => {
        const { classes, features, dispatch } = this.props
        return (
            <List className={classes.list}>
                <Typography className={classes.text}>
                    Select feature to edit
                </Typography>
                {/* NOT all layers have geometries (e.g. pseudo layers) */}
                {features &&
                    features.map((feature, i) =>
                        feature.geometry ? (
                            <Feature
                                key={i}
                                feature={feature}
                                dispatch={dispatch}
                            />
                        ) : null,
                    )}
            </List>
        )
    }
}

export default withStyles(styles)(Features)
