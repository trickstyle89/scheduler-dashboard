import React, { Component } from "react";

class Panel extends Component {
    
    state = {
        focused: null
      };

  render() {
    const { label, value } = this.props;

    return (
      <section
        className="dashboard__panel"
      >
        <h1 className="dashboard__panel-header">{label}</h1>
        <p className="dashboard__panel-value">{value}</p>
      </section>
    );
  }
}

export default Panel;