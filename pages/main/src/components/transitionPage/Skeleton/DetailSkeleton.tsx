import React from 'react'
import Skeleton from './common'
import { Footer } from './ListSkeleton'
import classNames from 'classnames'

function Header() {
  return (
    <div style={{ background: 'white', padding: '16px 16px 6px' }}>
      <Skeleton.Title animated style={{ width: '43%', marginTop: '0px', height: '20px' }} />
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ width: '16%', height: '31px', borderRadius: '4px', marginRight: '12px' }} />
        <Skeleton.Paragraph lineCount={1} animated style={{ width: '25%', height: '12px', borderRadius: '4px' }} />
      </div>
    </div>
  )
}

function Form() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0 16px' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ width: '16%', height: '12px', borderRadius: '4px', margin: '0 12px 0 0' }} />
        <Skeleton.Paragraph lineCount={1} animated style={{ width: '72%', height: '20px', borderRadius: '4px', margin: '12px 0' }} />
      </div>
    </div>
  )
}

function Children() {
  return (
    <div style={{ background: 'white', padding: '20px 16px 0', borderRadius: '8px' }}>
      <Skeleton.Paragraph lineCount={1} animated style={{ width: '18.6%', height: '16px', borderRadius: '4px', margin: '0' }} />
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ width: '16%', height: '60px', borderRadius: '4px', margin: '0 12px 0 0' }} />
        <div style={{ flex: '1' }}>
          <Skeleton.Paragraph lineCount={1} animatewidth='45%' style={{ height: '20px', width: '55%', marginTop: '0' }} />
          <Skeleton.Paragraph lineCount={1} animated style={{ height: '12px', width: '72%' }} />
          <Skeleton.Paragraph lineCount={1} animated style={{ height: '12px', width: '58%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '24px', width: '16%', borderRadius: '4px' }} />
        <Skeleton.Paragraph lineCount={1} animated style={{ height: '24px', width: '16%', borderRadius: '4px', marginLeft: '10px' }} />
      </div>
    </div>
  )
}

function Content() {
  return <>
      <>
        {
          [1, 2, 3].map(key => {
            return <Form key={key} />
          })
        }
      </>
      <div style={{ marginTop: '8px' }}>
        {[1, 2].map(key => {
          return <Children key={key} />
        })}
      </div>
  </>
}

interface IDetailSkeletonProps {
  className?: string
}
function DetailSkeleton(props: IDetailSkeletonProps) {
  const { className = '' } = props
  return (
    <div className={classNames('detail-skeleton', { [className]: true })}>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}

export default DetailSkeleton
