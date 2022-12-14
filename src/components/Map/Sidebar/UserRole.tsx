import * as React from 'react'

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import User from './User'

const styles = theme => ({
    summary: {
        paddingLeft: '10px',
    },
    details: {
        padding: '0 5px 5px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    list: {
        padding: 0,
        width: '100%',
    },
})

interface UserRoleProps {
    classes: any
    key: number | string
    role: any
    users: any
    handleExpand: any
    expanded: boolean
    dispatch: any
}

interface UserRoleState {}

class UserRole extends React.Component<UserRoleProps, UserRoleState> {
    constructor(props: UserRoleProps) {
        super(props)
    }

    render(): React.ReactNode {
        const {
            classes,
            key,
            role,
            users,
            handleExpand,
            expanded,
            dispatch,
        } = this.props

        return (
            <ExpansionPanel
                key={key}
                expanded={expanded}
                onChange={handleExpand}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.summary}
                >
                    <Typography className={classes.heading}>{role}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <List className={classes.list}>
                        {users.map((user, i) => {
                            return (
                                <User key={i} user={user} dispatch={dispatch} />
                            )
                        })}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export default withStyles(styles)(UserRole)
