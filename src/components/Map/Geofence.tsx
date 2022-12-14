import * as React from 'react'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import PencilIcon from '@material-ui/icons/Create'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { blue, grey } from '@material-ui/core/colors'
import CloseIcon from '@material-ui/icons/Close'

import Toolbar from './Geofence/Toolbar'
import Features from './Geofence/Features'
import Form from './Geofence/Form'

import {
    saveLayers,
    OPEN_GEOFENCE,
    CLOSE_GEOFENCE,
    SAVE_CHANGES,
    DISCARD_CHANGES,
    // RESET_FEATURE,
} from './../../actions/geofence'

const drawerWidth = 370

const styles = theme => ({
    geofenceTools: {
        zIndex: 2,
        position: 'absolute' as 'absolute',
        top: '40px',
        right: -drawerWidth,
        width: drawerWidth,
        height: 'calc(100vh - 44px)',
        backgroundColor: 'white',
        transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    geofenceToolsShift: {
        marginRight: drawerWidth,
        transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    editButton: {
        padding: 0,
        width: 30,
        height: 30,
        minWidth: 30,
        boxSizing: 'border-box' as 'border-box',
        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
    },
    toolbar: {
        height: '50px',
        padding: 8,
        backgroundColor: blue[600],
    },
    toolbarIcon: {
        color: grey[50],
    },
    hr: {
        border: 0,
        height: '1px',
        marginTop: 0,
        marginBottom: 0,
        background: grey[400],
    },
    saveButton: {
        marginLeft: 0,
    },
    outlinedPrimary: {
        color: grey[50],
    },
})

interface GeofenceProps {
    classes: any
    buttonClassName: any
    geofence: any
    dispatch: any
}

interface GeofenceState {}

class Geofence extends React.Component<GeofenceProps, GeofenceState> {
    constructor(props: GeofenceProps) {
        super(props)
    }

    handleDrawerOpen = () => {
        this.props.dispatch({ type: OPEN_GEOFENCE })
    }

    handleSaveChanges = () => {
        this.props.dispatch({ type: CLOSE_GEOFENCE })
    }

    handleDrawerClose = () => {
        this.props.dispatch({ type: CLOSE_GEOFENCE })
    }

    handleDialogSave = async () => {
        // TODO this should be an thunk action, not call API direct
        this.props.dispatch(saveLayers())
    }

    handleDialogDiscard = () => {
        this.props.dispatch({ type: DISCARD_CHANGES })
    }

    render = (): React.ReactNode => {
        const {
            classes,
            buttonClassName,
            geofence: {
                layers,
                isOpen,
                isSaveDialogOpen,
                drawMode,
                form: { isOpen: isFormOpen, mode, feature },
            },
            dispatch,
        } = this.props

        return (
            <React.Fragment>
                <div className={buttonClassName}>
                    <Button
                        onClick={this.handleDrawerOpen}
                        className={classes.editButton}
                    >
                        <PencilIcon />
                    </Button>
                </div>
                <div
                    className={classNames(classes.geofenceTools, {
                        [classes.geofenceToolsShift]: isOpen,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                        justify="space-between"
                        className={classes.toolbar}
                    >
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                classes={{
                                    root: classes.saveButton,
                                    outlinedPrimary: classes.outlinedPrimary,
                                }}
                                onClick={this.handleSaveChanges}
                            >
                                SAVE CHANGES
                            </Button>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={this.handleDrawerClose}>
                                <CloseIcon className={classes.toolbarIcon} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Toolbar drawMode={drawMode} dispatch={dispatch} />
                    <Dialog
                        open={isSaveDialogOpen}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {'Save changes?'}
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={this.handleDialogDiscard}
                                color="primary"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={this.handleDialogSave}
                                variant="contained"
                                color="primary"
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <hr className={classes.hr} />
                    <Features features={layers} dispatch={dispatch} />
                </div>
                {isFormOpen && (
                    <Form
                        mode={mode}
                        feature={feature}
                        dispatch={dispatch}
                    ></Form>
                )}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Geofence)
