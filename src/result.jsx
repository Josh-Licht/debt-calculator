import React from "react";

class Result extends React.Component {

  render() {
    const {title, value} = this.props

    return (
      <div className="results">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    )
  }
}

export default Result