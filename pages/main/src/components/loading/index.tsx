import React, { memo } from "react"
import classNames from "classnames"
import "./index.scss"

interface ILoadingProps {
    loading: boolean
    className?: string
}

function Loading(props: ILoadingProps) {
    const { loading, className = '' } = props
    if (!loading) {
        return null
    }
    return <div className={classNames("common-loading", { [className]: true })} style={{ backgroundImage: `url('./static/images/loading.png')` }}></div>
}

export default memo(Loading)