import React from 'react';

function outsideElement(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        outside: false
      }
    }
    componentWillMount() {
      document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
      if (this.node.contains(e.target)) {
        return;
      }

      this.setState({ outside: true });
    }

    render() {
      return (
        <div ref={node => this.node = node}>
          <WrappedComponent outside={this.state.outside} {...this.props} />
        </div>
      )
    }
  }
}

export default outsideElement;
