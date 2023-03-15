import React, { memo, useCallback } from 'react'
import ListSkeleton from './Skeleton/ListSkeleton'
import DetailSkeleton from './Skeleton/DetailSkeleton'
import "./index.less"

interface ITransitionPageProps {
    className?: string
    type?: E_TRANSITION_PAGE_TYPE
    visible?: boolean
    errorCode?: string
    btnRefreshVisible?: boolean
    onRefresh?: () => void
}
export enum E_TRANSITION_PAGE_TYPE {
    LIST = '1',
    DETAIL = '2'
}
const errorInfo = {
    404: {
      img: './static/images/404.png',
      msg: '网络开小差了，请稍后再试'
    },
    500: {
      img: './static/images/500.png',
      msg: '服务出错了，请稍后再试'
    }
  }
function TransitionPage(props: ITransitionPageProps) {

    const renderError = useCallback((props: ITransitionPageProps) => {
        const { errorCode, btnRefreshVisible } = props
        return (<div className={`transition-page-content ${!errorCode ? 'hide' : ''}`}>
        <img src={errorInfo[errorCode]?.img} className='transition-page-img' />
        <div className='transition-page-msg'>{errorInfo[errorCode]?.msg}</div>
      {btnRefreshVisible ? null : <button onClick={props.onRefresh} >刷新</button>}
    </div>)
    }, [])

    const renderSkeleton = useCallback((props: ITransitionPageProps) => {
        const { type, visible = true, ...extraProps } = props
        if(!visible) {
            return null
        }
        let Content = DetailSkeleton
        switch(type) {
            case E_TRANSITION_PAGE_TYPE.LIST:
                Content = ListSkeleton
                break
            case E_TRANSITION_PAGE_TYPE.DETAIL:
                Content = DetailSkeleton
                break
            default:
                Content = DetailSkeleton
                break
        }
        return <Content {...extraProps} />
    }, [])

    return <div className='transition-page'>
        {renderError(props)}
        {renderSkeleton(props)}
    </div>
}

export default memo(TransitionPage)