import React from "react";

class Payments extends React.Component {

  render() {
    const { date, payment, interest, principal} = this.props

    return (

      <div className="payment-details">
        <div className="date">{date}</div>
        <div className="amount">{"$" + payment}</div>
        <div className="interest">{"$" + interest}</div>
        <div className="principal">{"$" + principal}</div>
      </div>
    )
  }

}

export default Payments