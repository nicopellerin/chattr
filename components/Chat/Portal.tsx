import { Component } from "react"
import ReactDOM from "react-dom"

const portalRoot =
  typeof document !== `undefined` ? document.getElementById("portal") : null

export default class Portal extends Component {
  el: any

  constructor(props: any) {
    super(props)

    this.el =
      typeof document !== `undefined` ? document.createElement("div") : null
  }

  componentDidMount = () => {
    portalRoot ? portalRoot.appendChild(this.el) : null
  }

  componentWillUnmount = () => {
    portalRoot ? portalRoot.removeChild(this.el) : null
  }

  render() {
    const { children } = this.props

    if (this.el) {
      return ReactDOM.createPortal(children, this.el)
    } else {
      return null
    }
  }
}
