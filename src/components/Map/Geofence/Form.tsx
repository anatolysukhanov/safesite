import * as React from 'react'

import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { FORM_CANCEL, saveForm } from './../../../actions/geofence'

import { LinePlusIcon, MarkerPlusIcon, PolygonPlusIcon } from './SvgIcons'
import { purposes } from '../../../lib/map'

const styles = theme => ({
    icon: {
        marginRight: '10px',
    },
})

interface State {
    name: string
    description: string
    purpose: string
    speedLimit: string
}

interface DialogProps {
    classes: any
    mode: string
    feature: any
    dispatch: any
}

interface DialogState {
    name: string
    description: string
    purpose: string
    speedLimit: string
}

class Form extends React.PureComponent<DialogProps, DialogState> {
    constructor(props: DialogProps) {
        super(props)
        this.state = {
            name: this.props.feature.properties.name || '',
            description: this.props.feature.properties.description || '',
            purpose: this.props.feature.properties.purpose || 'none',
            speedLimit: this.props.feature.properties.speedLimit || '',
        }
    }

    handleCancel = () => {
        this.props.dispatch({
            type: FORM_CANCEL,
        })
    }

    handleSave = () => {
        const { name, description, purpose, speedLimit } = this.state
        this.props.dispatch(
            saveForm({
                name,
                description,
                purpose,
                speedLimit,
            }),
        )
    }

    handleChange = (name: keyof State) => (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        this.setState({
            [name]: event.target.value,
        } as Pick<State, keyof State>)
    }

    render = (): React.ReactNode => {
        const {
            classes,
            mode,
            feature: {
                geometry: { type },
            },
        } = this.props
        const { name, description, purpose, speedLimit } = this.state
        return (
            <Dialog open={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        alignContent="center"
                    >
                        {type === 'Polygon' && (
                            <React.Fragment>
                                <Grid item className={classes.icon}>
                                    <PolygonPlusIcon color="inherit" />
                                </Grid>
                                <Grid item>
                                    {mode === 'new' ? (
                                        <Typography>Add new polygon</Typography>
                                    ) : (
                                        <Typography>Edit polygon</Typography>
                                    )}
                                </Grid>
                            </React.Fragment>
                        )}
                        {type === 'Point' && (
                            <React.Fragment>
                                <Grid item className={classes.icon}>
                                    <MarkerPlusIcon color="inherit" />
                                </Grid>
                                <Grid item>
                                    {mode === 'new' ? (
                                        <Typography>Add new point</Typography>
                                    ) : (
                                        <Typography>Edit point</Typography>
                                    )}
                                </Grid>
                            </React.Fragment>
                        )}
                        {type === 'LineString' && (
                            <React.Fragment>
                                <Grid item className={classes.icon}>
                                    <LinePlusIcon color="inherit" />
                                </Grid>
                                <Grid item>
                                    {mode === 'new' ? (
                                        <Typography>Add new line</Typography>
                                    ) : (
                                        <Typography>Edit line</Typography>
                                    )}
                                </Grid>
                            </React.Fragment>
                        )}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <form autoComplete="off">
                        <TextField
                            id="name"
                            label="Enter a name (required)"
                            type="text"
                            required={true}
                            value={name}
                            onChange={this.handleChange('name')}
                            margin="dense"
                            fullWidth
                        />
                        <TextField
                            id="description"
                            label="Add a description (optional)"
                            type="text"
                            value={description}
                            onChange={this.handleChange('description')}
                            margin="dense"
                            fullWidth
                        />
                        {type === 'Polygon' && (
                            <TextField
                                id="select-purpose"
                                select
                                label="Purpose"
                                value={purpose}
                                onChange={this.handleChange('purpose')}
                                margin="normal"
                            >
                                {purposes.map(option => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                        {type === 'Polygon' && (
                            <TextField
                                id="speedLimit"
                                label="Speed Limit (km/hr)"
                                type="text"
                                value={speedLimit}
                                onChange={this.handleChange('speedLimit')}
                                margin="dense"
                                fullWidth
                            />
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={this.handleSave}
                        variant="contained"
                        color="primary"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(Form)
