import * as React from 'react'

import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import { green, amber, grey, red } from '@material-ui/core/colors'
import { ListItem, ListItemText, Switch, Button } from '@material-ui/core'

import { userIconNameFromUserRole } from './../../../lib/map'

import { toggleUserOn, toggleUserOff, MAP_CENTER } from '../../../actions/map'

const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        border: 'thin',
        borderLeftWidth: '10px',
        borderStyle: 'solid solid none solid',
        '&:last-child': {
            borderStyle: 'solid solid solid solid',
        },
        borderColor: grey[400],
        padding: '5px',
        width: '100%',
    },
    good: {
        'border-left-color': green[500],
    },
    warning: {
        'border-left-color': amber[600],
    },
    departed: {
        'border-left-color': grey[600],
    },
    bad: {
        'border-left-color': red[500],
    },
    button: { width: '2.5rem', height: '2.5rem' },
    icon: {
        width: '2.5rem',
        height: '2.5rem',
        paddingLeft: '10px',
    },
    listItemText: {
        padding: '0 16px',
    },
})

interface UserProps {
    classes: any
    user: any
    dispatch: any
}

interface UserState {}

class User extends React.PureComponent<UserProps, UserState> {
    constructor(props: UserProps) {
        super(props)
    }

    onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            this.props.dispatch(toggleUserOn(this.props.user.id))
        } else {
            this.props.dispatch(toggleUserOff(this.props.user.id))
        }
    }

    handleUserClick = (): void => {
        const { user } = this.props
        if (user.lat !== null) {
            this.props.dispatch({
                type: MAP_CENTER,
                payload: {
                    type: 'Point',
                    coordinates: [user.lng, user.lat],
                },
            })
        }
    }

    render(): React.ReactNode {
        const { classes, user } = this.props

        const iconUrl =
            'public/images/icons/png/' +
            userIconNameFromUserRole(user.role) +
            '.png'

        return (
            <ListItem
                className={classNames(classes.root, classes[user.status])}
            >
                <Button
                    className={classes.button}
                    onClick={this.handleUserClick}
                >
                    <img className={classes.icon} src={iconUrl} />
                </Button>
                <ListItemText
                    disableTypography={true}
                    classes={{
                        root: classes.listItemText,
                    }}
                    primary={
                        <div>
                            <b>{user.name}</b>{' '}
                            {user.plant_id && <>({user.plant_id})</>}
                        </div>
                    }
                    secondary={
                        <div>
                            {user.lastReported && (
                                <div>Last reported: {user.lastReported}</div>
                            )}
                        </div>
                    }
                />
                {user.lat !== null && (
                    <Switch
                        checked={user.isVisible}
                        color="primary"
                        onChange={this.onSwitchChange}
                    />
                )}
            </ListItem>
        )
    }
}

export default withStyles(styles)(User)
