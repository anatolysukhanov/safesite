import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'

import {
    Button,
    Input,
    ListItem,
    ListItemText,
    Switch,
    CircularProgress,
} from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'

import { GITHUB_GREY } from '../../../constants/colours'
import {
    MAP_CENTER,
    MAP_COLLAPSE_GROUP,
    MAP_EXPAND_GROUP,
    expandAction,
} from '../../../actions/map'

import { ToggleState } from '../../../lib/map'

import { LineIcon, MarkerIcon, PolygonIcon } from '../Geofence/SvgIcons'

// instead of import to remove Typescript / React warnings
// JSX element class does not support attributes because it does not have a 'props' property
const TreeMenu = require('react-simple-tree-menu').default

const styles = () =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            border: 'thin',
            borderStyle: 'solid solid none solid',
            '&:last-child': {
                borderStyle: 'solid solid solid solid',
            },
            borderColor: grey[400],
            padding: '5px',
            width: '100%',
            minHeight: '4em',
            fontSize: '0.9rem',
        },
        menuHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem',
            '&:div': {
                flex: 1,
            },
        },
        itemText: {
            fontSize: '0.9rem',
            position: 'relative',
            color: GITHUB_GREY,
        },
        legend: {
            position: 'absolute',
            left: '-2em',
        },
        button: {
            position: 'absolute',
            top: '-0.7em',
            left: '-3em',
            width: 40,
            height: 40,
            minWidth: 40,
        },
    })
const DEFAULT_PADDING = 2 // all items get this
const LEVEL_SPACE = 1.25 // add extra padding for each level nested
const ToggleIcon = ({ on }) => (
    <span style={{ marginLeft: '-1.6em' }}>
        {on ? (
            <i className="fa fa-fw fa-chevron-down" />
        ) : (
            <i className="fa fa-fw fa-chevron-right" />
        )}
    </span>
) //TODO Mui icons

const Legend = ({ legend, geometry, centerMap, classes }) => {
    if (legend === 'spinner') {
        return (
            <CircularProgress
                className={classes.legend}
                size={20}
                color="inherit"
            />
        )
    }
    if (legend === 'error') {
        return (
            <ErrorIcon
                color="error"
                fontSize="small"
                className={classes.legend}
            />
        )
    }
    if (geometry) {
        switch (geometry.type) {
            case 'Polygon':
                return (
                    <Button
                        className={classes.button}
                        onClick={() => centerMap(geometry)}
                    >
                        <PolygonIcon />
                    </Button>
                )
            case 'LineString':
                return (
                    <Button
                        className={classes.button}
                        onClick={() => centerMap(geometry)}
                    >
                        <LineIcon />
                    </Button>
                )
            case 'Point':
                return (
                    <Button
                        className={classes.button}
                        onClick={() => centerMap(geometry)}
                    >
                        <MarkerIcon />
                    </Button>
                )
        }
    }
    if (legend) {
        return (
            <img
                src={`data:${legend.contentType};base64, ${legend.imageData}`}
                title={legend.name}
                className={classes.legend}
            />
        )
    }
    return null
}
// wrapper around the MUI components in order to pass props
// https://github.com/iannbing/react-simple-tree-menu/blob/master/stories/index.stories.js
const MenuListItem = ({
    // tree menu props
    level = 0,
    hasNodes,
    isOpen,
    label,
    searchTerm,
    openNodes,
    toggleNode,
    matchSearch,
    focused,
    active,
    // our props
    classes,
    mapKey,
    isVisible,
    toggleState,
    toggleItem,
    centerMap,
    expandGroup,
    showToggle,
    legend,
    geometry,
    ...props
}) => (
    <ListItem
        {...props}
        className={classes.root}
        style={{
            padding: `0.5em 0 0.5em ${DEFAULT_PADDING +
                (hasNodes ? 0 : 0) +
                level * LEVEL_SPACE}rem`,
        }}
    >
        <ListItemText
            onClick={e => {
                hasNodes && toggleNode && toggleNode()
                expandGroup()
                e.stopPropagation()
            }}
            classes={{ primary: classes.itemText }}
        >
            {hasNodes && (
                <div style={{ display: 'inline-block' }}>
                    <ToggleIcon on={isOpen} />
                </div>
            )}
            {label}
            <Legend
                legend={legend}
                geometry={geometry}
                centerMap={centerMap}
                classes={classes}
            />
        </ListItemText>
        {showToggle && (
            <Switch
                checked={isVisible}
                color={toggleState === ToggleState.ON ? 'primary' : 'secondary'}
                onChange={() => toggleItem(mapKey, !isVisible)}
            />
        )}
    </ListItem>
)

interface LayerProps extends WithStyles<typeof styles> {
    data: any
    toggleHandler: any
    dispatch: any
}

interface LayerState {
    layers: any
}

/* Expects data in the following format
        const treeData = [
        {
            key: 'first-level-node-1',
            label: 'Node 1 at the first level',
            ..., // any other props you need, e.g. url
            nodes: [
            {
                key: 'second-level-node-1',
                label: 'Node 1 at the second level',
                nodes: [
                {
                    key: 'third-level-node-1',
                    label: 'Last node of the branch',
                    nodes: [] // you can remove the nodes property or leave it as an empty array
                },
                ],
            },
            ],
        },
        {
            key: 'first-level-node-2',
            label: 'Node 2 at the first level',
        },
        ];
*/
class MuiTreeMenu extends React.PureComponent<LayerProps, LayerState> {
    onToggleExpand = (key, expanded) => {
        this.props.dispatch(
            expandAction(expanded ? MAP_COLLAPSE_GROUP : MAP_EXPAND_GROUP, key),
        )
    }

    render(): React.ReactNode {
        const { classes, data, toggleHandler, dispatch } = this.props
        return (
            <TreeMenu data={data} debounceTime={125}>
                {({ reset, items, search }) => (
                    <>
                        <div className={classes.menuHeader}>
                            <Input
                                onChange={e => search(e.target.value)}
                                placeholder="Search..."
                            />
                            <Button onClick={reset} color="primary">
                                CLOSE ALL
                            </Button>
                        </div>
                        {items.map(
                            ({ key, mapKey, isVisible, isOpen, ...props }) => {
                                return (
                                    <MenuListItem
                                        {...props}
                                        key={mapKey}
                                        mapKey={mapKey}
                                        classes={classes}
                                        isVisible={isVisible}
                                        isOpen={isOpen}
                                        toggleItem={() =>
                                            toggleHandler(mapKey, isVisible)
                                        }
                                        centerMap={geometry =>
                                            dispatch({
                                                type: MAP_CENTER,
                                                payload: geometry,
                                            })
                                        }
                                        expandGroup={() =>
                                            this.onToggleExpand(mapKey, isOpen)
                                        }
                                    />
                                )
                            },
                        )}
                    </>
                )}
            </TreeMenu>
        )
    }
}

export default withStyles(styles)(MuiTreeMenu)
