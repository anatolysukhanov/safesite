import * as React from 'react'

import {
    blue,
    cyan,
    green,
    grey,
    orange,
    pink,
    red,
    yellow,
} from '@material-ui/core/colors'

import { Source, Layer } from '@urbica/react-map-gl'

interface GeoJSONLayersProps {
    layersGeoJSON: any
    popupFeature: any
}

export class GeoJSONLayers extends React.Component<GeoJSONLayersProps> {
    constructor(props: GeoJSONLayersProps) {
        super(props)
    }

    render = (): React.ReactNode => {
        const { layersGeoJSON, popupFeature } = this.props
        return (
            <>
                <Source id="layers" type="geojson" data={layersGeoJSON} />
                <Layer
                    id="layers-polygon" // referenced by raster-layers for ordering
                    source="layers"
                    type="fill"
                    paint={{
                        'fill-opacity': 0,
                    }}
                    filter={['==', '$type', 'Polygon']}
                />
                <Layer
                    id="layers-polygon-line"
                    type="line"
                    source="layers"
                    paint={{
                        'line-width': 2,
                        'line-color': 'black',
                    }}
                    filter={['==', '$type', 'Polygon']}
                />
                <Layer
                    id="layers-linestring"
                    type="line"
                    source="layers"
                    filter={['==', '$type', 'LineString']}
                />
                <Layer
                    id="layers-point"
                    type="circle"
                    source="layers"
                    paint={{
                        'circle-radius': 6,
                        'circle-color': [
                            'case',
                            ['==', ['get', 'observationType'], 'Anomaly'],
                            pink[500],
                            ['==', ['get', 'observationType'], 'Environment'],
                            green[500],
                            ['==', ['get', 'observationType'], 'Incident'],
                            red[500],
                            ['==', ['get', 'observationType'], 'Near miss'],
                            orange[500],
                            ['==', ['get', 'observationType'], 'Progress'],
                            cyan[500],
                            ['==', ['get', 'observationType'], 'Property'],
                            yellow[700],
                            ['==', ['get', 'observationType'], 'Quality'],
                            blue[900],
                            blue[500],
                        ],
                        'circle-stroke-width': 1,
                        'circle-stroke-color': 'black',
                    }}
                    filter={['==', '$type', 'Point']}
                />
                {popupFeature.id && popupFeature.layer.type === 'circle' && (
                    <Layer
                        id="point-popup"
                        type="circle"
                        source="layers"
                        paint={{
                            'circle-radius': 7,
                            'circle-color': blue['A700'],
                        }}
                        filter={['==', '$id', popupFeature.id]}
                    />
                )}
                {popupFeature.id && popupFeature.layer.type === 'line' && (
                    <Layer
                        id="line-popup"
                        type="line"
                        source="layers"
                        paint={{
                            'line-width': 3,
                            'line-color': blue['A700'],
                        }}
                        filter={['==', '$id', popupFeature.id]}
                    />
                )}
            </>
        )
    }
}
