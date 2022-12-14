import * as React from 'react'

import { withSize } from 'react-sizeme'

import bbox from '@turf/bbox'

import MapGL, {
    Viewport,
    Image,
    Popup,
    NavigationControl,
    TrafficControl,
    Marker,
} from '@urbica/react-map-gl'
import Draw from '@urbica/react-map-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './mapbox-gl-traffic.css'

import MeasureLayers from './ReactMap/MeasureLayers'
import PopupContent from './ReactMap/PopupContent'

import {
    MAP_RESET_TOGGLE_LAYER,
    MAP_RESET_TOGGLE_USER,
    MAP_CLICK_FEATURE,
    MAP_CLOSE_POPUP,
    MAP_CENTER,
} from './../../actions/map'

import {
    ADD_DISTANCE_VERTEX,
    ADD_AREA_VERTEX,
    CLOSE_AREA,
} from '../../actions/measure'

import { userIconUrls } from '../../lib/map'

import { DRAW_CREATE, DRAW_UPDATE, DRAW_CANCEL } from './../../actions/geofence'
import { RasterLayers } from './ReactMap/RasterLayers'
import { GeoJSONLayers } from './ReactMap/GeoJSONLayers'
import { UserLayers } from './ReactMap/UserLayers'

const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYW90ZWFzdHVkaW9zIiwiYSI6IkpWRG1DanMifQ.n_qwTIutVxuoHFzQsw085A'

import clsx from 'clsx'
import { loadCSS } from 'fg-loadcss'
import { makeStyles } from '@material-ui/core/styles'
import { yellow } from '@material-ui/core/colors'
import Icon from '@material-ui/core/Icon'

const useStyles = makeStyles(theme => ({
    root: {
        '& > .fa': {
            margin: theme.spacing(2),
        },
    },
    iconHover: {
        margin: theme.spacing(2),
        color: yellow[800],
    },
}))

function FontAwesome() {
    const classes = useStyles()

    React.useEffect(() => {
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        )
    }, [])

    return (
        <div className={classes.root}>
            <Icon
                className={clsx(classes.iconHover, 'fas fa-map-marker-alt')}
            />
        </div>
    )
}

interface MapProps {
    project: any
    usersGeoJSON: any
    layersGeoJSON: any
    selectedFeature: any
    rasterLayers: any
    arcGISToken: any
    drawOptions: any
    popup: any
    dispatch: any
    token: string
    measure: any
    measureSourceGeoJSON: any
    center: any
}

interface MapState {
    showPopup: boolean
    tileUrls: {}
    popup?: {
        featureId: number
        layerId: string
        latitude: number
        longitude: number
        properties?: any
    }
    viewport: {
        latitude: number
        longitude: number
        zoom: number
        bearing?: number
        pitch?: number
    }
    before: any
}

const SizeAware = withSize({ noPlaceholder: true, monitorHeight: true })(
    (props => props.children) as React.ComponentType<any>,
)

class ReactMap extends React.Component<MapProps, MapState> {
    reactMap: any
    isSingleClick: Boolean = true

    constructor(props: any) {
        super(props)
        this.reactMap = React.createRef()
        this.state = {
            tileUrls: {},
            showPopup: false,
            viewport: {
                latitude: props.project.centroid.coordinates[0],
                longitude: props.project.centroid.coordinates[1],
                zoom: 11,
            },
            before: {
                red: 'green',
                green: 'blue',
                blue: undefined,
            },
        }
    }

    componentDidMount(): void {
        const map = this.reactMap.current.getMap()
        map.once('load', () => {
            const [minLat, minLng, maxLat, maxLng] = bbox(
                this.props.project.bboxPoints,
            )
            map.fitBounds([[minLng, minLat], [maxLng, maxLat]])
            map.maxParallelImageRequests = 4
        })
    }

    shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        // shouldn't update while a new feature is being drawn
        const isBeingDrawn =
            this.props.drawOptions.mode.startsWith('draw_') &&
            nextProps.drawOptions.mode.startsWith('draw_')

        // shouldn't update when a feature is selected and can be changed (vertices can be moved, new vertices can be added, the feature can be moved)
        const isBeingChanged =
            (this.props.drawOptions.mode === 'direct_select' &&
                nextProps.drawOptions.mode === 'direct_select') ||
            (this.props.drawOptions.mode === 'simple_select' &&
                nextProps.drawOptions.mode === 'simple_select' &&
                this.props.drawOptions.modeOptions &&
                nextProps.drawOptions.modeOptions &&
                this.props.drawOptions.modeOptions.featureIds &&
                nextProps.drawOptions.modeOptions.featureIds)

        if (isBeingDrawn || isBeingChanged) {
            return false
        } else {
            return true
        }
    }

    componentDidUpdate = (prevProps: any): void => {
        const { center } = this.props
        if (center !== prevProps.center) {
            const map = this.reactMap.current.getMap()
            const [minLat, minLng, maxLat, maxLng] = bbox(center)
            map.fitBounds([[minLat, minLng], [maxLat, maxLng]], {
                padding: {
                    top: 50,
                    bottom: 50,
                    left: 0,
                    right: 0,
                },
            })
        }
    }

    componentWillUnmount = (): void => {
        this.props.dispatch({ type: MAP_RESET_TOGGLE_LAYER, payload: 0 })
        this.props.dispatch({ type: MAP_RESET_TOGGLE_USER, payload: 0 })
    }

    updateViewport = (viewport: Viewport): void => {
        this.setState({ viewport })
    }

    getQueryFeatures(x, y): any[] {
        return this.reactMap.current
            .getMap()
            .queryRenderedFeatures([[x - 5, y - 5], [x + 5, y + 5]], {
                layers: [
                    'layers-polygon-line',
                    'layers-linestring',
                    'layers-point',
                    'users-points',
                    'users-clusters',
                ],
            })
    }

    onMousemove = (event: any) => {
        if (
            !this.props.drawOptions.mode.startsWith('draw_') &&
            this.props.measure.isMeasuring !== true
        ) {
            const features = this.getQueryFeatures(event.point.x, event.point.y)
            if (features.length > 0) {
                this.reactMap.current.getMap().getCanvas().style.cursor =
                    'pointer'
            } else {
                this.reactMap.current.getMap().getCanvas().style.cursor = ''
            }
        }
    }

    onMapClick = (event: any) => {
        if (
            this.props.measure.isMeasuring === true &&
            this.props.measure.mode === 'area' &&
            this.props.measure.isClosedArea === false
        ) {
            this.isSingleClick = true
            setTimeout(() => {
                if (this.isSingleClick) {
                    this.props.dispatch({
                        type: ADD_AREA_VERTEX,
                        payload: {
                            coordinates: {
                                longitude: event.lngLat.lng,
                                latitude: event.lngLat.lat,
                            },
                        },
                    })
                }
            }, 250)
        } else if (
            this.props.measure.isMeasuring === true &&
            this.props.measure.mode === 'distance'
        ) {
            this.props.dispatch({
                type: ADD_DISTANCE_VERTEX,
                payload: {
                    coordinates: {
                        longitude: event.lngLat.lng,
                        latitude: event.lngLat.lat,
                    },
                },
            })
        } else {
            const clusters = this.reactMap.current
                .getMap()
                .queryRenderedFeatures(event.point, {
                    layers: ['users-clusters'],
                })
            if (clusters.length > 0) {
                const clusterId = clusters[0].properties.cluster_id,
                    pointCount = clusters[0].properties.point_count,
                    clusterSource = this.reactMap.current
                        .getMap()
                        .getSource('users')
                clusterSource.getClusterLeaves(
                    clusterId,
                    pointCount,
                    0,
                    (err, features) => {
                        if (!err) {
                            this.props.dispatch({
                                type: MAP_CENTER,
                                payload: {
                                    type: 'FeatureCollection',
                                    features,
                                },
                            })
                        }
                    },
                )
            } else if (!this.props.drawOptions.mode.startsWith('draw_')) {
                const features = this.getQueryFeatures(
                    event.point.x,
                    event.point.y,
                )
                if (features.length > 0) {
                    this.props.dispatch({
                        type: MAP_CLICK_FEATURE,
                        payload: {
                            longitude: event.lngLat.lng,
                            latitude: event.lngLat.lat,
                            feature: features[0],
                        },
                    })
                }
            }
        }
    }

    onMapDblclick = (event: any) => {
        if (
            this.props.measure.isMeasuring === true &&
            this.props.measure.mode === 'area' &&
            this.props.measure.isClosedArea === false
        ) {
            this.isSingleClick = false
            this.props.dispatch({
                type: CLOSE_AREA,
                payload: {
                    coordinates: {
                        longitude: event.lngLat.lng,
                        latitude: event.lngLat.lat,
                    },
                },
            })
        }
    }

    onPopupClose = (event: any): void => {
        this.props.dispatch({
            type: MAP_CLOSE_POPUP,
        })
    }

    onDrawCreate = (event: any) => {
        this.props.dispatch({
            type: DRAW_CREATE,
            payload: { feature: event.features[0] },
        })
    }

    onDrawUpdate = (event: any) => {
        this.props.dispatch({
            type: DRAW_UPDATE,
            payload: { feature: event.features[0] },
        })
    }

    onDrawModeChange = (event: any) => {
        if (this.props.drawOptions.mode.startsWith('draw_')) {
            this.props.dispatch({
                type: DRAW_CANCEL,
            })
        }
    }

    resizeMap = () => {
        this.reactMap.current.getMap().resize()
    }

    transformRequest = (url, resourceType) => {
        if (resourceType === 'Tile' && url.startsWith(global.Uplink.URL)) {
            return {
                url,
                headers: { Authorization: 'Bearer ' + this.props.token },
            }
        }
        if (
            resourceType === 'Tile' &&
            url.startsWith('https://thegisserver.lendlease.com')
        ) {
            return {
                url: url + `&token=${this.props.arcGISToken.token}`,
            }
        }
    }

    render = (): React.ReactNode => {
        const { viewport } = this.state
        const {
            usersGeoJSON,
            layersGeoJSON,
            selectedFeature: { geojson: selectedFeatureGeoJSON },
            drawOptions,
            popup: { isOpen: isPopupOpen, longitude, latitude, feature },
            measure,
            measureSourceGeoJSON,
        } = this.props
        const { isMeasuring, mode: measureMode, isClosedArea } = measure
        return (
            <SizeAware onSize={this.resizeMap}>
                <MapGL
                    {...viewport}
                    ref={this.reactMap}
                    trackResize={false}
                    style={{
                        flexGrow: 1,
                    }}
                    mapStyle="mapbox://styles/aoteastudios/ck0epaqs807po1dmpvciiat9l"
                    accessToken={MAPBOX_ACCESS_TOKEN}
                    onViewportChange={this.updateViewport}
                    onMousemove={this.onMousemove}
                    transformRequest={this.transformRequest}
                    cursorStyle={
                        (isMeasuring === true && measureMode === 'distance') ||
                        (measureMode === 'area' && isClosedArea === false) ||
                        drawOptions.mode.startsWith('draw_')
                            ? 'crosshair'
                            : 'grab'
                    }
                    doubleClickZoom={false}
                    onClick={this.onMapClick}
                    onDblclick={this.onMapDblclick}
                >
                    <Image
                        id="user-label-bg"
                        image={'/public/images/background.png'}
                    />
                    {userIconUrls().map(i => (
                        <Image key={i.name} id={i.name} image={i.url} />
                    ))}
                    <Marker
                        longitude={172.611608505249}
                        latitude={-43.5570488007351}
                    >
                        <FontAwesome></FontAwesome>
                    </Marker>
                    <RasterLayers layers={this.props.rasterLayers} />
                    <GeoJSONLayers
                        layersGeoJSON={layersGeoJSON}
                        popupFeature={feature}
                    />
                    <UserLayers usersGeoJSON={usersGeoJSON} />
                    <MeasureLayers
                        measure={measure}
                        dispatch={this.props.dispatch}
                        measureSourceGeoJSON={measureSourceGeoJSON}
                    />
                    <NavigationControl
                        showCompass
                        showZoom
                        position="top-right"
                    />
                    <TrafficControl />
                    <Draw
                        combineFeaturesControl={false}
                        lineStringControl={false}
                        pointControl={false}
                        polygonControl={false}
                        trashControl={false}
                        uncombineFeaturesControl={false}
                        data={selectedFeatureGeoJSON}
                        mode={drawOptions.mode}
                        modeOptions={drawOptions.modeOptions}
                        onDrawCreate={this.onDrawCreate}
                        onDrawUpdate={this.onDrawUpdate}
                        onDrawModeChange={this.onDrawModeChange}
                    />
                    {isPopupOpen && (
                        <Popup
                            longitude={longitude}
                            latitude={latitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={this.onPopupClose}
                            anchor="top"
                        >
                            <PopupContent
                                properties={feature.properties}
                            ></PopupContent>
                        </Popup>
                    )}
                </MapGL>
            </SizeAware>
        )
    }
}

export default ReactMap
