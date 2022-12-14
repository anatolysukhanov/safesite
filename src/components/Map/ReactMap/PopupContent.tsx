import * as React from 'react'

import { withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { fromCamel, capitalize } from '../../../lib/strings'

const styles = theme => ({
    root: {
        width: '220px',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    hr: {
        border: 0,
        height: '1px',
        marginTop: '5px',
        marginBottom: '5px',
        background: grey[400],
    },
})

interface PopupContentProps {
    classes: any
    type?: string
    properties?: any
}

interface PopupContentState {}

class PopupContent extends React.Component<
    PopupContentProps,
    PopupContentState
> {
    constructor(props: PopupContentProps) {
        super(props)
    }

    render = (): React.ReactNode => {
        const { classes, properties } = this.props

        let {
            type,
            name,
            plantId,
            role,
            description,
            purpose,
            speedLimit,
            observationType,
            geometryType,
            area,
        } = properties

        if (speedLimit === '') speedLimit = 'none'

        if (type === 'user') {
            return (
                <div className={classes.root}>
                    <div>
                        <b>{name}</b>
                    </div>
                    <div>
                        <hr className={classes.hr} />
                    </div>
                    {plantId && <div>Plant ID: {plantId}</div>}
                    {role && <div>Role: {role}</div>}
                </div>
            )
        } else {
            return (
                <div className={classes.root}>
                    <div>
                        <b>{name}</b>
                    </div>
                    <div>
                        <hr className={classes.hr} />
                    </div>
                    {description && <div>{description}</div>}
                    {purpose && (
                        <div>Purpose: {capitalize(fromCamel(purpose))}</div>
                    )}
                    {speedLimit && <div>Speed Limit: {speedLimit}</div>}
                    {observationType && <div>Type: {observationType}</div>}
                    {geometryType === 'LineString' && (
                        <div>Length: {area} m</div>
                    )}
                    {geometryType === 'Polygon' && (
                        <div>
                            Area: {area} m<sup>2</sup>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default withStyles(styles)(PopupContent)
