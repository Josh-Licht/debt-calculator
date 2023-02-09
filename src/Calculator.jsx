import React from "react";
import Input from "./input";
import Result from "./result";

class Calculator extends React.Component {

  constructor() {
    super()
    this.state = {
      totalDebt: 0,
      interestRate: 0,
      payment: '',
      payments: [],
      interest: 0,
      minimumPayment: 0,
      principal: 0,
      totalPayments: 0
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { totalDebt, interestRate } = this.state
    const interest = (totalDebt * (interestRate / 100)) / 12;
    const principal = totalDebt * 0.01
    const minPayment = interest + principal

    this.setState({ 
      interest: interest.toFixed(2),
      principal: principal.toFixed(2),
      minimumPayment: minPayment.toFixed(2),
      remainingDebt: totalDebt,
      totalPayments: 0
    });
  };

  handlePayment = (e) => {
    e.preventDefault();
    const { totalDebt, payment, payments, interest, minimumPayment, interestRate, totalPayments } = this.state

    let newRemainingDebt = totalDebt
    let newInterest = interest;
    let newPrinciple;
    let newMinPayment;
    let newPayments = payments
    let newTotalPayment = Number(totalPayments)

    newRemainingDebt -= Number(payment)
    newInterest = (newRemainingDebt * (interestRate / 100)) / 12;
    newPrinciple = newRemainingDebt * 0.01
    newMinPayment = Number(newRemainingDebt) <= 100 ? Number(newRemainingDebt) + newPrinciple : newInterest + newPrinciple
    newPayments = [...payments, Number(payment)]
    newTotalPayment += Number(payment)

    console.log(Number(newRemainingDebt));

    if (Number(payment) <= Number(minimumPayment)) {
      alert("Payment must be at least the minimum payment of " + minimumPayment)
      return
    }

    if (Number(payment) > Number(totalDebt)) {
      alert("Payment cannot be greater than the $" + totalDebt)
      return
    }

    this.setState({ 
      totalDebt: newRemainingDebt.toFixed(2),
      interest: newInterest.toFixed(2),
      principal: newPrinciple.toFixed(2),
      minimumPayment: newMinPayment.toFixed(2),
      totalPayments: parseFloat(newTotalPayment).toFixed(2),
      payments: newPayments,
      payment: ''
    });

  }

  render() {
    const {
      totalDebt, interest, interestRate, payment, principal, 
      minimumPayment, totalPayments
    } = this.state

    return(
      <div>
        <h2>Debt Calculator</h2>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <Input 
              label='Debt Amount:'
              name='totalDebt'
              type="number"
              pattern="^\$\d{1,3}(,\d{3})*(\.\d{2})?$"
              placeholder="0"
              onChange={this.handleChange}
              alt='money'
              symbol='$'
            />

            <Input 
              label='Interest Rate:'
              name='interestRate'
              type="decimal"
              value={interestRate}
              pattern="[0-9]+([,\.][0-9]+)?"
              onChange={this.handleChange}
              alt=''
              symbol='%'
            />

            <Input 
              label='Make A Payment'
              name='payment'
              type="decimal"
              value={payment}
              pattern="[0-9]+([,\.][0-9]+)?"
              placeholder={minimumPayment === 0 ? "0" : "Minimum Amount $" + minimumPayment}
              onChange={this.handleChange}
              min={minimumPayment}
              alt='money'
              symbol='$'
            />

            <div className="btn-container">
              <button onClick={this.handleSubmit}>Calculate</button>
              <button onClick={this.handlePayment}>Make A Payment</button>
            </div>         
          </form>

          <div className="info">
            <Result title="Remaining Debt" value={"$" + totalDebt || '$0'} />
            <Result title="Interest" value={"$" + interest || '$0'} />
            <Result title="Principal" value={"$" + principal || '$0'} />
            <Result title="Min Payment" value={"$" + minimumPayment || '$0'} />
            <Result title="Total Payment" value={"$" + totalPayments || '$0'} />
          </div>

        </div>
      </div>
    )
  }
}

export default Calculator;