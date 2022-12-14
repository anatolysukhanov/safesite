import * as React from 'react'

import { Source, Layer } from '@urbica/react-map-gl'

interface UserLayersProps {
    usersGeoJSON: any
}

export class UserLayers extends React.Component<UserLayersProps> {
    constructor(props: UserLayersProps) {
        super(props)
    }

    render = (): React.ReactNode => {
        const { usersGeoJSON } = this.props
        return (
            <>
                <Source
                    id="users"
                    type="geojson"
                    data={usersGeoJSON}
                    cluster={true}
                    clusterMaxZoom={16}
                    clusterRadius={32}
                />
                <Layer
                    id="users-points"
                    type="symbol"
                    source="users"
                    filter={['!has', 'point_count']}
                    layout={{
                        'icon-image': ['get', 'iconName'],
                        'icon-allow-overlap': true,
                        'icon-size': {
                            stops: [[10, 0.05], [14, 2 * 0.05]],
                        },
                        'icon-anchor': 'bottom',
                    }}
                />
                <Layer
                    id="users-labels"
                    type="symbol"
                    source="users"
                    filter={['!has', 'point_count']}
                    layout={{
                        'icon-offset': [-100, -100],
                        'icon-image': 'user-label-bg',
                        'icon-allow-overlap': true,
                        'icon-anchor': 'top',
                        'icon-text-fit': 'both',
                        'icon-text-fit-padding': [5, 7.5, 0, 7.5],
                        'text-field': [
                            'case',
                            ['!=', ['get', 'plantId'], null],
                            ['get', 'plantId'],
                            ['get', 'name'],
                        ],
                        'text-font': ['B612 Bold', 'Overpass Regular'],
                        'text-anchor': 'top',
                        'text-size': 12,
                        'text-allow-overlap': true,
                    }}
                    paint={{
                        'text-translate': [0, 2],
                        'icon-translate': [0, 2],
                        'icon-translate-anchor': 'viewport',
                        'text-translate-anchor': 'viewport',
                        'text-color': '#FFFFFF',
                    }}
                />
                <Layer
                    id="users-clusters"
                    source="users"
                    type="circle"
                    filter={['has', 'point_count']}
                    paint={{
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            50,
                            '#f1f075',
                            200,
                            '#f28cb1',
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            50,
                            30,
                            200,
                            40,
                        ],
                    }}
                />
                <Layer
                    id="users-cluster-count"
                    source="users"
                    type="symbol"
                    filter={['has', 'point_count']}
                    layout={{
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['B612 Bold', 'Arial Unicode MS Bold'],
                        'text-size': 14,
                    }}
                    paint={{
                        'text-translate': [0, 4],
                        'icon-translate-anchor': 'viewport',
                        'text-translate-anchor': 'viewport',
                    }}
                />
            </>
        )
    }
}
