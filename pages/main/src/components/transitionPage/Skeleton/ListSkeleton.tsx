import classNames from 'classnames'
import React from 'react'
import Skeleton from './common'

function Header() {
  return (
    <div style={{ background: 'white', padding: '0 16px' }}>
      <Skeleton.Title animated style={{ width: '100%', marginTop: '0px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '16px', width: '51%' }} />
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '16px', width: '22%' }} />
      </div>
    </div>
  )
}

function Content() {
  return (
    <div>
      {
        [1, 2, 3, 4, 5, 6].map(key => {
          return <ContentRow key={key}/>
        })
      }
    </div>
  )
}

function ContentRow() {
  return (
    <div  style={{ background: 'white', padding: '20px 16px 0', marginTop: '8px', borderRadius: '8px' }}>
      <Skeleton.Paragraph lineCount={1} animatewidth='45%' style={{ height: '20px', width: '42%' }} />
      <Skeleton.Paragraph lineCount={1} animated style={{ height: '12px', width: '55%' }} />
      <Skeleton.Paragraph lineCount={1} animated style={{ height: '12px', width: '45%' }} />
      <div  style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '24px', width: '16%', borderRadius: '4px' }} />
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '24px', width: '16%', borderRadius: '4px', marginLeft: '10px' }} />
      </div>
    </div>
  )
}

export function Footer () {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'fixed', bottom: '0', width: '100%', background: 'white', boxShadow: '0 0 0.24rem 0 rgb(0 0 0 / 6%)', padding: '0 16px', boxSizing: 'border-box' }}>
      <Skeleton.Paragraph lineCount={1} animated style={{ height: '40px', flex: '1', marginRight: '12px' }} />
      <Skeleton.Paragraph lineCount={1} animated style={{ height: '40px', flex: '1', marginRight: '12px' }} />
      <Skeleton.Paragraph lineCount={1} animated style={{ height: '40px', flex: '1' }} />
    </div>
  )
}

interface IListSkeletonProps {
  className?: string
}

function ListSkeleton (props: IListSkeletonProps) {
  const { className = '' } = props
  return (
    <div className={classNames('list-skeleton', { [className]: true })}>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}

export default ListSkeleton
