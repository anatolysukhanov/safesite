import * as React from 'react'

import {
    Button,
    ListItem,
    ListItemText,
    Tooltip,
    IconButton,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { yellow, green, grey } from '@material-ui/core/colors'
import EditIcon from '@material-ui/icons/Edit'

import {
    selectFeature,
    DELETE_FEATURE,
    RESTORE_FEATURE,
    EDIT_FEATURE,
    UNSELECT_FEATURE,
} from './../../../actions/geofence'

import { MarkerIcon, LineIcon, PolygonIcon } from './SvgIcons'
import { toggleLayerOn, toggleLayerOff } from '../../../actions/map'

const styles = theme => ({
    normal: {
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        minHeight: 46,
        '&$selected, &$selected:hover, &$selected:focus': {
            backgroundColor: yellow[50],
        },
        '&:hover, &:focus': {
            backgroundColor: 'transparent',
        },
    },
    updated: {
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        minHeight: 46,
        backgroundColor: green[50],
        '&$selected, &$selected:hover, &$selected:focus': {
            backgroundColor: yellow[50],
        },
        '&:hover, &:focus': {
            backgroundColor: green[50],
        },
    },
    deleted: {
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        minHeight: 46,
        color: 'rgba(0,0,0,0.25)',
        '&:hover, &:focus': {
            backgroundColor: grey[300],
        },
    },
    selected: {
        backgroundColor: yellow[50],
    },
    button: {
        padding: 0,
        width: 40,
        height: 40,
        minWidth: 40,
    },
    disabled: {
        color: 'rgba(0,0,0,0.25)',
        background: 'rgba(244,244,244,0.5)',
        boxShadow: 'none',
    },
    toggledOff: {
        boxShadow: 'none',
        color: 'rgba(0,0,0,0.25)',
        width: 35,
        height: 35,
    },
    listItemText: {
        padding: '0 16px',
    },
})

interface FeatureProps {
    classes: any
    feature: any
    dispatch: any
}

interface FeatureState {}

class Feature extends React.Component<FeatureProps, FeatureState> {
    constructor(props: FeatureProps) {
        super(props)
    }

    handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        if (!this.props.feature.isDeleted) {
            if (this.props.feature.isVisible) {
                this.props.dispatch(toggleLayerOn(this.props.feature.id))
            } else {
                this.props.dispatch(toggleLayerOff(this.props.feature.id))
            }
        }
    }

    handleSelect = () => {
        if (!this.props.feature.isDeleted) {
            if (this.props.feature.isSelected) {
                this.props.dispatch({ type: UNSELECT_FEATURE })
            } else {
                this.props.dispatch(selectFeature(this.props.feature))
            }
        }
    }

    handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        this.props.dispatch({
            type: EDIT_FEATURE,
            payload: {
                feature: this.props.feature,
            },
        })
    }

    handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        if (this.props.feature.isDeleted) {
            this.props.dispatch({
                type: RESTORE_FEATURE,
                payload: {
                    id: this.props.feature.id,
                },
            })
        } else {
            this.props.dispatch({
                type: DELETE_FEATURE,
                payload: {
                    id: this.props.feature.id,
                },
            })
        }
    }

    render = (): React.ReactNode => {
        const { classes, feature } = this.props
        const disabledClass = feature.isDeleted ? classes.disabled : null
        const toggledOffClass = !feature.isVisible ? classes.toggledOff : null
        const buttonClasses = `${classes.button} ${disabledClass} ${toggledOffClass}`
        return (
            <ListItem
                button
                onClick={this.handleSelect}
                selected={feature.isSelected}
                classes={
                    feature.isDeleted
                        ? {
                              root: classes.deleted,
                          }
                        : feature.isEdited || feature.isNew
                        ? {
                              root: classes.updated,
                              selected: classes.selected,
                          }
                        : {
                              root: classes.normal,
                              selected: classes.selected,
                          }
                }
            >
                <Tooltip title="Toggle" aria-label="toggle" placement="left">
                    <Button
                        variant="contained"
                        className={buttonClasses}
                        onClick={this.handleToggle}
                    >
                        {feature.geometry.type === 'Polygon' && <PolygonIcon />}
                        {feature.geometry.type === 'LineString' && <LineIcon />}
                        {feature.geometry.type === 'Point' && <MarkerIcon />}
                    </Button>
                </Tooltip>
                <ListItemText
                    disableTypography={true}
                    classes={{
                        root: classes.listItemText,
                    }}
                    primary={<b>{feature.properties.name}</b>}
                    secondary={
                        <div>
                            {feature.geometry.type === 'LineString' && (
                                <div>{feature.properties.area} m</div>
                            )}
                            {feature.geometry.type === 'Polygon' && (
                                <div>
                                    {feature.properties.area} m<sup>2</sup>
                                </div>
                            )}
                        </div>
                    }
                />
                <IconButton color="default" onClick={this.handleEdit}>
                    <EditIcon />
                </IconButton>
                {feature.isDeleted ? (
                    <Button
                        size="small"
                        color="primary"
                        onClick={this.handleDelete}
                    >
                        RESTORE
                    </Button>
                ) : (
                    <Button
                        size="small"
                        color="secondary"
                        onClick={this.handleDelete}
                    >
                        DELETE
                    </Button>
                )}
            </ListItem>
        )
    }
}

export default withStyles(styles)(Feature)
