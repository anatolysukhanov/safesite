import matchSorter from 'match-sorter'
import * as React from 'react'

import {
    prop,
    groupBy,
    values,
    includes,
    append,
    without,
    mapObjIndexed,
    pipe,
    sortBy,
} from 'ramda'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel'

import UserRole from './UserRole'

const styles = theme => ({
    root: {},
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
})

interface UsersProps {
    classes: any
    users: any
    dispatch: any
}

interface UsersState {
    searchTerm: ''
    collapsedRoles: []
}

class Users extends React.PureComponent<UsersProps, UsersState> {
    constructor(props: UsersProps) {
        super(props)
        this.state = {
            searchTerm: '',
            collapsedRoles: [],
        }
    }

    handleTextChange = searchTerm => {
        this.setState({ searchTerm })
    }

    cancelSearch = (event: any): void => {
        this.setState({
            searchTerm: '',
        })
    }

    handleExpand = (groupName: string, event: any, expanded: boolean): void => {
        if (expanded) {
            this.setState({
                collapsedRoles: without([groupName], this.state.collapsedRoles),
            })
        } else {
            this.setState({
                collapsedRoles: append(groupName, this.state.collapsedRoles),
            })
        }
    }

    render() {
        const { classes, users, dispatch } = this.props

        const { searchTerm, collapsedRoles } = this.state

        const filteredUsers = matchSorter(users, searchTerm, {
            keys: ['name', 'plant_id', 'role'],
        })
        let roles = []

        if (filteredUsers.length > 0) {
            roles = pipe(
                groupBy(prop('role')),
                mapObjIndexed((users, role) => ({
                    name: role,
                    users: users,
                    expanded: !includes(role, collapsedRoles),
                })),
                values,
                sortBy(prop('name')),
            )(filteredUsers)
        }

        return (
            <div className={classes.root}>
                <Paper className={classes.paper} elevation={1}>
                    <IconButton
                        className={classes.iconButton}
                        aria-label="Search"
                    >
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="Find users by name or ID"
                        onChange={e => {
                            this.handleTextChange(e.target.value)
                        }}
                        value={this.state.searchTerm}
                    />
                    {searchTerm && (
                        <IconButton
                            color="primary"
                            className={classes.iconButton}
                            aria-label="Directions"
                            onClick={this.cancelSearch}
                        >
                            <CancelIcon />
                        </IconButton>
                    )}
                </Paper>
                {roles.map((role, i) => {
                    return (
                        <UserRole
                            handleExpand={this.handleExpand.bind(
                                this,
                                role.name,
                            )}
                            expanded={role.expanded}
                            key={role.name}
                            role={role.name}
                            users={role.users}
                            dispatch={dispatch}
                        />
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(Users)
