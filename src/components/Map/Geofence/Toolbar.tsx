import * as React from 'react'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'
import { Button, Grid, Tooltip } from '@material-ui/core'

import { DRAW_POINT, DRAW_LINE, DRAW_POLYGON } from '../../../actions/geofence'

import { MarkerPlusIcon, LinePlusIcon, PolygonPlusIcon } from './SvgIcons'

const styles = theme => ({
    addIcons: {
        padding: 8,
    },
    button: {
        padding: 0,
        width: 40,
        height: 40,
        minWidth: 40,
        marginRight: 8,
        '&:hover, &:focus': {
            color: blue[600],
            background: '#fff',
        },
    },
    selected: {
        backgroundColor: blue[600],
        '&:hover, &:focus': {
            backgroundColor: blue[600],
        },
    },
})

interface ToolbarProps {
    classes: any
    drawMode: string
    dispatch: any
}

interface ToolbarState {}

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
    constructor(props: ToolbarProps) {
        super(props)
    }

    handleMarkerClick = () => {
        this.props.dispatch({ type: DRAW_POINT })
    }

    handleLineClick = () => {
        this.props.dispatch({ type: DRAW_LINE })
    }

    handlePolygonClick = () => {
        this.props.dispatch({ type: DRAW_POLYGON })
    }

    render = (): React.ReactNode => {
        const { classes, drawMode } = this.props
        return (
            <Grid
                container
                direction="row"
                alignItems="center"
                alignContent="center"
                className={classes.addIcons}
            >
                <Grid item>
                    <Tooltip title="Add Marker" aria-label="add marker">
                        <Button
                            variant="contained"
                            className={classNames(classes.button, {
                                [classes.selected]: drawMode === 'draw_point',
                            })}
                            onClick={this.handleMarkerClick}
                        >
                            <MarkerPlusIcon color="inherit" />
                        </Button>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Draw Line" aria-label="draw line">
                        <Button
                            variant="contained"
                            className={classNames(classes.button, {
                                [classes.selected]:
                                    drawMode === 'draw_line_string',
                            })}
                            onClick={this.handleLineClick}
                        >
                            <LinePlusIcon color="inherit" />
                        </Button>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Draw Polygon" aria-label="draw polygon">
                        <Button
                            variant="contained"
                            className={classNames(classes.button, {
                                [classes.selected]: drawMode === 'draw_polygon',
                            })}
                            onClick={this.handlePolygonClick}
                        >
                            <PolygonPlusIcon color="inherit" />
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Toolbar)
