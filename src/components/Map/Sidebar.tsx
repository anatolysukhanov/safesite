import * as React from 'react'

import classNames from 'classnames'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import {
    createStyles,
    Button,
    Divider,
    Drawer,
    IconButton,
    Tabs,
    Tab,
    Toolbar,
} from '@material-ui/core'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar'
import LayersIcon from '@material-ui/icons/Layers'
import ChartsIcon from '@material-ui/icons/ShowChart'

import {
    toggleLayerOff,
    toggleLayerOn,
    MAP_TOGGLE_CHART_OFF,
    MAP_TOGGLE_CHART_ON,
} from '../../actions/map'

import ChartContainer from './Sidebar/ChartContainer'
import MuiTreeMenu from './Sidebar/MuiTreeMenu'
import Users from './Sidebar/Users'

export const SIDEBAR_WIDTH_LARGE = 20
export const SIDEBAR_WIDTH_MEDIUM = 25
export const SIDEBAR_WIDTH_SMALL = 30

const styles = theme =>
    createStyles({
        root: {},
        drawer: {
            [theme.breakpoints.down('md')]: {
                width: `${SIDEBAR_WIDTH_SMALL}vw`,
            },
            [theme.breakpoints.up('lg')]: {
                width: `${SIDEBAR_WIDTH_MEDIUM}vw`,
            },
            [theme.breakpoints.up('xl')]: {
                width: `${SIDEBAR_WIDTH_LARGE}vw`,
            },

            flexShrink: 0,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginRight: 0,
        },
        drawerShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            [theme.breakpoints.down('md')]: {
                marginRight: `-${SIDEBAR_WIDTH_SMALL}vw`,
            },
            [theme.breakpoints.up('lg')]: {
                marginRight: `-${SIDEBAR_WIDTH_MEDIUM}vw`,
            },
            [theme.breakpoints.up('xl')]: {
                marginRight: `-${SIDEBAR_WIDTH_LARGE}vw`,
            },
        },
        drawerPaper: {
            [theme.breakpoints.down('md')]: {
                width: `${SIDEBAR_WIDTH_SMALL}vw`,
            },
            [theme.breakpoints.up('lg')]: {
                width: `${SIDEBAR_WIDTH_MEDIUM}vw`,
            },
            [theme.breakpoints.up('xl')]: {
                width: `${SIDEBAR_WIDTH_LARGE}vw`,
            },
            top: 0,
            bottom: 0,
            overflow: 'hidden',
        },
        drawerButton: {
            position: 'absolute',
            top: '2px',
            left: '2px',
            background: '#fff',
        },
        toolbarRoot: {
            minHeight: 'inherit',
            justifyContent: 'space-between',
        },
        tabsRoot: {
            flex: 1,
        },
        tabWrapper: {
            flexDirection: 'row',
        },
        tabIcon: {
            paddingRight: '10px',
        },
        tabLabelIcon: {
            minHeight: '50px',
            minWidth: 'auto',
            width: 'auto',
        },
        tabContent: {
            overflowY: 'auto',
        },
    })

interface SidebarProps extends WithStyles<typeof styles> {
    classes: any
    users: Array<any>
    treeData: Array<any>
    chartTreeData: Array<any>
    chartData: Array<any>
    dispatch: any
}

interface SidebarState {
    open: boolean
    value: string
}
class Sidebar extends React.Component<SidebarProps, SidebarState> {
    constructor(props: SidebarProps) {
        super(props)
        this.state = {
            open: true,
            value: 'users',
        }
    }

    handleDrawerOpen = () => {
        this.setState({ open: true })
    }

    handleDrawerClose = () => {
        this.setState({ open: false })
    }

    handleChange = (event: React.ChangeEvent<{}>, value: any): void => {
        this.setState({ value })
    }

    handleLayerTreeToggle = (key, isVisible) => {
        if (isVisible) {
            this.props.dispatch(toggleLayerOff(key))
        } else {
            this.props.dispatch(toggleLayerOn(key))
        }
    }

    handleChartTreeToggle = (key, isVisible) => {
        if (isVisible) {
            this.props.dispatch({
                type: MAP_TOGGLE_CHART_OFF,
                payload: key,
            })
        } else {
            this.props.dispatch({
                type: MAP_TOGGLE_CHART_ON,
                payload: key,
            })
        }
    }

    render(): React.ReactNode {
        const {
            classes,
            users,
            treeData,
            chartTreeData,
            chartData,
            dispatch,
        } = this.props
        const { open, value } = this.state

        return (
            <React.Fragment>
                <Drawer
                    className={classNames(classes.drawer, {
                        [classes.drawerShift]: !open,
                    })}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <Toolbar
                            disableGutters
                            classes={{
                                root: classes.toolbarRoot,
                            }}
                        >
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Tabs
                                className={classes.tabsRoot}
                                value={value}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                            >
                                <Tab
                                    icon={
                                        <DirectionsCarIcon
                                            classes={{
                                                root: classes.tabIcon,
                                            }}
                                        />
                                    }
                                    label="USERS"
                                    classes={{
                                        wrapper: classes.tabWrapper,
                                        labelIcon: classes.tabLabelIcon,
                                    }}
                                    value="users"
                                />
                                <Tab
                                    icon={
                                        <LayersIcon
                                            classes={{
                                                root: classes.tabIcon,
                                            }}
                                        />
                                    }
                                    label="LAYERS"
                                    classes={{
                                        wrapper: classes.tabWrapper,
                                        labelIcon: classes.tabLabelIcon,
                                    }}
                                    value="layers"
                                />
                                {chartTreeData && (
                                    <Tab
                                        icon={
                                            <ChartsIcon
                                                classes={{
                                                    root: classes.tabIcon,
                                                }}
                                            />
                                        }
                                        label="CHARTS"
                                        classes={{
                                            wrapper: classes.tabWrapper,
                                            labelIcon: classes.tabLabelIcon,
                                        }}
                                        value="charts"
                                    />
                                )}
                            </Tabs>
                        </Toolbar>
                        <Divider />
                    </div>
                    <div className={classes.tabContent}>
                        {value === 'users' && (
                            <Users users={users} dispatch={dispatch} />
                        )}
                        {value === 'layers' && (
                            <>
                                <MuiTreeMenu
                                    data={treeData}
                                    dispatch={dispatch}
                                    toggleHandler={this.handleLayerTreeToggle}
                                />
                            </>
                        )}
                        {value === 'charts' && (
                            <>
                                <MuiTreeMenu
                                    data={chartTreeData}
                                    toggleHandler={this.handleChartTreeToggle}
                                    dispatch={dispatch}
                                />
                                <ChartContainer charts={chartData} />
                            </>
                        )}
                    </div>
                </Drawer>
                {!open && (
                    <Button
                        variant="contained"
                        onClick={this.handleDrawerOpen}
                        className={classes.drawerButton}
                    >
                        <DirectionsCarIcon
                            color="primary"
                            className={classes.icon}
                        />
                        &nbsp;&nbsp;/&nbsp;&nbsp;
                        <LayersIcon color="primary" className={classes.icon} />
                    </Button>
                )}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Sidebar)
