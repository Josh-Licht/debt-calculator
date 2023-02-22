import React from "react";

class Payments extends React.Component {

  render() {
    const { date, payment, interest, principal, balance} = this.props

    const data = {
      date: date,
      amount: "$" + payment,
      interest: "$" + interest,
      principal: "$" + principal,
      balance: "$" + balance
    }

    return (

      <div className="payment-details">
        {Object.entries(data).map(([key, value]) => (<div className={key}>{value}</div>))}
      </div>
    )
  }

}

export default Payments