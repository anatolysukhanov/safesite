import * as React from 'react'
import { withStyles } from '@material-ui/core'
import { Source, Layer, Marker } from '@urbica/react-map-gl'
import {
    MOVE_AREA_VERTEX,
    MOVE_DISTANCE_VERTEX,
} from '../../../actions/measure'
import { GITHUB_GREY } from '../../../constants/colours'

interface MeasureLayersProps {
    measureSourceGeoJSON: any
    measure: any
    classes: any
    dispatch: any
}

const styles = theme => ({
    marker: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        color: 'blue',
        cursor: 'pointer',
        background: 'white',
        border: '2px solid blue',
    },
})

const MeasureLayers: React.FC<MeasureLayersProps> = props => {
    const { measureSourceGeoJSON, measure, classes, dispatch } = props

    const { isMeasuring, mode, vertices, isClosedArea } = measure

    if (!(isMeasuring && vertices)) return null

    function onDragEnd(index, lngLat) {
        dispatch({
            type: mode === 'area' ? MOVE_AREA_VERTEX : MOVE_DISTANCE_VERTEX,
            payload: {
                index: index,
                coordinates: {
                    longitude: lngLat.lng,
                    latitude: lngLat.lat,
                },
            },
        })
    }

    const Distance = () => {
        if (mode !== 'distance') return null
        return (
            <>
                <Layer
                    id="measure-distance"
                    type="line"
                    source="measure"
                    layout={{
                        'line-cap': 'round',
                        'line-join': 'round',
                    }}
                    paint={{
                        'line-color': 'blue',
                        'line-width': 2,
                    }}
                    filter={['in', '$type', 'LineString']}
                />
                <Layer
                    id="measure-labels"
                    type="symbol"
                    source="measure"
                    layout={{
                        'text-field': '{text}',
                        'text-size': 14,
                        'symbol-placement': 'point',
                        'text-justify': 'auto',
                        'text-radial-offset': 0.5,
                        'text-variable-anchor': ['top-left'],
                    }}
                    paint={{
                        'text-color': 'black',
                        'text-halo-color': 'white',
                        'text-halo-width': 2,
                        'text-halo-blur': 0.5,
                    }}
                    filter={['in', '$type', 'Point']}
                />
            </>
        )
    }

    const Area = () => {
        if (mode !== 'area') return null
        return (
            <>
                {isClosedArea && (
                    <>
                        <Layer
                            id="measure-area"
                            type="fill"
                            source="measure"
                            paint={{
                                'fill-color': 'blue',
                                'fill-opacity': 0.1,
                            }}
                            filter={['in', '$type', 'Polygon']}
                        />
                    </>
                )}
                <Layer
                    id="measure-area-line"
                    type="line"
                    source="measure"
                    layout={{
                        'line-cap': 'round',
                        'line-join': 'round',
                    }}
                    paint={{
                        'line-color': 'blue',
                        'line-width': 2,
                    }}
                />
                <Layer
                    id="measure-labels"
                    type="symbol"
                    source="measure"
                    layout={{
                        'text-field': '{text}',
                        'text-size': 14,
                    }}
                    paint={{
                        'text-color': GITHUB_GREY,
                        'text-halo-color': '#fff',
                        'text-halo-width': 2,
                        'text-halo-blur': 0.5,
                    }}
                    filter={['in', '$type', 'Point']}
                />
            </>
        )
    }

    return (
        <>
            <Source id="measure" type="geojson" data={measureSourceGeoJSON} />
            <Distance />
            <Area />
            {vertices.map((vertex, i) => {
                return (
                    <Marker
                        key={i}
                        longitude={vertex.longitude}
                        latitude={vertex.latitude}
                        onDragEnd={lngLat => onDragEnd(i, lngLat)}
                        draggable
                    >
                        <div className={classes.marker} />
                    </Marker>
                )
            })}
        </>
    )
}

export default withStyles(styles)(MeasureLayers)
