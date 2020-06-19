import { Component } from "react";
import ReactDOM from "react-dom";
// Use a ternary operator to make sure that the document object is defined
const portalRoot = typeof document !== `undefined` ? document.getElementById("portal") : null;
export default class Portal extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            portalRoot ? portalRoot.appendChild(this.el) : null;
        };
        this.componentWillUnmount = () => {
            portalRoot ? portalRoot.removeChild(this.el) : null;
        };
        // Use a ternary operator to make sure that the document object is defined
        this.el =
            typeof document !== `undefined` ? document.createElement("div") : null;
    }
    render() {
        const { children } = this.props;
        // Check that this.el is not null before using ReactDOM.createPortal
        if (this.el) {
            return ReactDOM.createPortal(children, this.el);
        }
        else {
            return null;
        }
    }
}
