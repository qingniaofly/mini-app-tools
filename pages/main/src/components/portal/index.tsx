import React from "react"
import ReactDOM from "react-dom"

const Portal: React.FC<PortalProps> = (props) => {
  const { target = document.body } = props
  return ReactDOM.createPortal(props.children, target)
}

export interface PortalProps {
  target?: Element;
  children: React.ReactNode;
}

export default Portal