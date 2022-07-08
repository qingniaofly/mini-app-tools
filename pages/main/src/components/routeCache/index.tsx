import React, { FC, useContext } from "react"
import { Freeze } from '../reactFreeze'
import { UNSAFE_RouteContext as RouteContext, useOutlet } from 'react-router-dom'

interface IRouteCacheProps {
    freeze?: boolean
}

function RouteCache(props: React.PropsWithChildren<IRouteCacheProps>) {

    const matchedElement = useContext(RouteContext).outlet
    const outlet = useOutlet()
    console.log(matchedElement, outlet)
    // debugger
    return <Freeze freeze={false}>
        {
            props.children
        }
    </Freeze>
}


export default RouteCache