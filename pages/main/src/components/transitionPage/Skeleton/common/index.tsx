import React from 'react'
import classnames from 'classnames'
import './index.less'

const SkeletonBlock = (props) => {
  const cls = classnames('arc-skeleton', {
    'arc-skeleton-animated': props.animated
  }, props.className)
  return <div className={cls} style={props.style || {}} />
}

const Skeleton = {
  Title: (props) => {
    return <SkeletonBlock className='arc-skeleton-title' animated={props.animated} style={props.style} />
  },
  Paragraph: (props) => {
    const lineCount = props.lineCount || 3
    const linekeys = Array.from({ length: lineCount })
    // for (let i = 0; i < lineCount; i++) linekeys.push(i)
    return <>
      {linekeys.map((_, index) => <SkeletonBlock key={index} className='arc-skeleton-paragraph-line' animated={props.animated} style={props.style} />)}
    </>
  }
}

export default Skeleton
