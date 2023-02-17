import React from "react";

class Result extends React.Component {

  render() {
    const {title, value} = this.props

    return (
      <div className="info-item">
        <h2>{title}</h2>
        <p>{value}</p>
      </div>
    )
  }
}

export default Result