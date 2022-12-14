import * as React from 'react'

import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon'

export const MarkerIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
        </SvgIcon>
    )
}

export const LineIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5" />
        </SvgIcon>
    )
}

export const PolygonIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17" />
        </SvgIcon>
    )
}

export const MarkerPlusIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M9,11.5A2.5,2.5 0 0,0 11.5,9A2.5,2.5 0 0,0 9,6.5A2.5,2.5 0 0,0 6.5,9A2.5,2.5 0 0,0 9,11.5M9,2C12.86,2 16,5.13 16,9C16,14.25 9,22 9,22C9,22 2,14.25 2,9A7,7 0 0,1 9,2M15,17H18V14H20V17H23V19H20V22H18V19H15V17Z" />
        </SvgIcon>
    )
}

export const LinePlusIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M15,3L15,7.59L7.59,15L3,15L3,21L9,21L9,16.42L16.42,9L21,9L21,3M17,5L19,5L19,7L17,7M5,17L7,17L7,19L5,19" />
            <g transform="matrix(1,0,0,1,0.0311701,12.0591)">
                <path d="M22,5L22,7L19,7L19,10L17,10L17,7L14,7L14,5L17,5L17,2L19,2L19,5L22,5Z" />
            </g>
        </SvgIcon>
    )
}

export const PolygonPlusIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M17,15.7V13H19V17L10,21L3,14L7,5H11V7H8.3L5.4,13.6L10.4,18.6L17,15.7M22,5V7H19V10H17V7H14V5H17V2H19V5H22Z" />
        </SvgIcon>
    )
}
