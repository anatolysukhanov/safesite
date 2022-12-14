import * as React from 'react'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { Button, Tooltip } from '@material-ui/core'
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'
import CloseIcon from '@material-ui/icons/Close'

import { PolygonIcon } from './../Geofence/SvgIcons'

import {
    TOGGLE_MEASURE_TOOL,
    START_MEASURE_DISTANCE,
    START_MEASURE_AREA,
    END_MEASURE,
} from './../../../actions/measure'

const RulerIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M1.39,18.36L3.16,16.6L4.58,18L5.64,16.95L4.22,15.54L5.64,14.12L8.11,16.6L9.17,15.54L6.7,13.06L8.11,11.65L9.53,13.06L10.59,12L9.17,10.59L10.59,9.17L13.06,11.65L14.12,10.59L11.65,8.11L13.06,6.7L14.47,8.11L15.54,7.05L14.12,5.64L15.54,4.22L18,6.7L19.07,5.64L16.6,3.16L18.36,1.39L22.61,5.64L5.64,22.61L1.39,18.36Z" />
        </SvgIcon>
    )
}

const DistanceIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M16,2V8H17.08L14.95,13H14.26L12,9.97V5H6V11H6.91L4.88,16H2V22H8V16H7.04L9.07,11H10.27L12,13.32V19H18V13H17.12L19.25,8H22V2M18,4H20V6H18M8,7H10V9H8M14,15H16V17H14M4,18H6V20H4" />
        </SvgIcon>
    )
}

const styles = theme => ({
    button: {
        padding: 0,
        width: 30,
        height: 30,
        minWidth: 30,
        boxSizing: 'border-box' as 'border-box',
        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
    },
})

interface MeasureProps {
    classes: any
    buttonClassName: any
    measure: any
    dispatch: any
}

interface MeasureState {}

class Measure extends React.Component<MeasureProps, MeasureState> {
    constructor(props: MeasureProps) {
        super(props)
    }

    handleMeasuringToolButtonClick = (): void => {
        this.props.dispatch({ type: TOGGLE_MEASURE_TOOL })
    }

    handleMeasureDistanceButtonClick = (): void => {
        if (
            this.props.measure.isMeasuring === true &&
            this.props.measure.mode === 'distance'
        ) {
            this.props.dispatch({ type: END_MEASURE })
        } else {
            this.props.dispatch({ type: START_MEASURE_DISTANCE })
        }
    }

    handleMeasureAreaButtonClick = (): void => {
        if (
            this.props.measure.isMeasuring === true &&
            this.props.measure.mode === 'area'
        ) {
            this.props.dispatch({ type: END_MEASURE })
        } else {
            this.props.dispatch({ type: START_MEASURE_AREA })
        }
    }

    render = (): React.ReactNode => {
        const { buttonClassName, classes, measure } = this.props
        return (
            <div className={buttonClassName}>
                {measure.isOpen ? (
                    <Button
                        className={classes.button}
                        onClick={this.handleMeasuringToolButtonClick}
                    >
                        <CloseIcon />
                    </Button>
                ) : (
                    <Tooltip title="Measuring Tool" aria-label="measuring tool">
                        <Button
                            className={classes.button}
                            onClick={this.handleMeasuringToolButtonClick}
                        >
                            <RulerIcon />
                        </Button>
                    </Tooltip>
                )}
                {measure.isOpen && (
                    <>
                        <Tooltip
                            title="Measure Distance"
                            aria-label="measure distance"
                        >
                            <Button
                                className={classes.button}
                                onClick={this.handleMeasureDistanceButtonClick}
                            >
                                {measure.isMeasuring &&
                                    measure.mode === 'distance' && (
                                        <DistanceIcon color="primary" />
                                    )}
                                {(!measure.isMeasuring ||
                                    measure.mode === 'area') && (
                                    <DistanceIcon />
                                )}
                            </Button>
                        </Tooltip>
                        <Tooltip title="Measure Area" aria-label="measure area">
                            <Button
                                className={classes.button}
                                onClick={this.handleMeasureAreaButtonClick}
                            >
                                {measure.isMeasuring &&
                                    measure.mode === 'area' && (
                                        <PolygonIcon color="primary" />
                                    )}
                                {(!measure.isMeasuring ||
                                    measure.mode === 'distance') && (
                                    <PolygonIcon />
                                )}
                            </Button>
                        </Tooltip>
                    </>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(Measure)
