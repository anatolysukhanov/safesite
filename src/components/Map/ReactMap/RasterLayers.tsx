import { LayerType } from '../../../lib/map'
import * as React from 'react'

import { Source, Layer } from '@urbica/react-map-gl'

interface RasterLayersProps {
    layers: any
}

export const RasterLayers: React.FC<RasterLayersProps> = ({ layers }) => {
    {
        return layers.map(layer => {
            // show under CSL geometry and (importantly!) under users points
            let before = 'layers-polygon'
            if (
                layer.type === 'ImageServer' ||
                layer.layerType === LayerType.METROMAP
            ) {
                // reference-layer set in map style (in mapBox studio)
                // to ensure background under features
                before = 'background-images'
            }
            return (
                <React.Fragment key={layer.id}>
                    <Source
                        id={layer.id}
                        type="raster"
                        tileSize={256}
                        tiles={[layer.url]}
                    />
                    <Layer
                        id={layer.id}
                        type="raster"
                        source={layer.id}
                        before={before}
                    />
                </React.Fragment>
            )
        })
    }
}
