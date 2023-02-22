import React from "react";
import Input from "./input";
import Result from "./result";
import Payments from "./Payments";

class Calculator extends React.Component {

  constructor() {
    super()
    this.state = {
      totalDebt: 0,
      interestRate: '',
      payment: '',
      payments: [],
      interest: 0,
      minimumPayment: 0,
      principal: 0,
      totalPayments: 0
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: Number(e.target.value) });
  };

  getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // Add 1 to account for 0-indexed months
    const day = today.getDate();
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { totalDebt, interestRate } = this.state
    const interest = (totalDebt * (interestRate / 100)) / 12;
    const principal = totalDebt * 0.01
    const minPayment = interest + principal

    this.setState({ 
      interest: Number(interest.toFixed(2)),
      principal: Number(principal.toFixed(2)),
      minimumPayment: Number(minPayment.toFixed(2)),
      remainingDebt: Number(totalDebt),
      totalPayments: 0
    });
  };

  handlePayment = (e) => {
    e.preventDefault();
    const { totalDebt, payment, payments, interest, minimumPayment, interestRate, totalPayments } = this.state
    const date = this.getDate()

    let newRemainingDebt = totalDebt;
    let newInterest = (newRemainingDebt * (interestRate / 100)) / 12;
    let newPrinciple = newRemainingDebt * 0.01;
    let newMinPayment = newInterest + newPrinciple;
    let newPayments = payments;
    let newTotalPayment = totalPayments;
    let maxPayment = newRemainingDebt + newInterest

    // overpayment 
    if (payment > minimumPayment) { newPrinciple = payment - newInterest }

    newRemainingDebt -= newPrinciple.toFixed(2)

    // get initial interest and principle
    newInterest = (newRemainingDebt * (interestRate / 100)) / 12;
    newMinPayment = newInterest + (newRemainingDebt * 0.01)

    // update payments table
    newTotalPayment += payment
    newPayments = [...payments, {
      date, payment, interest, 
      principal : newPrinciple.toFixed(2), balance : newRemainingDebt.toFixed(2)
    }]

    // handles min payment
    if (newRemainingDebt <= 100) {
      newMinPayment = newRemainingDebt + newPrinciple
    }

    // prevents a payment without an debt
    if (totalDebt <= 0){ return }

    // handles min payment
    if (payment < minimumPayment) {
      alert("Payment must be at least the minimum payment of " + minimumPayment)
      return
    }

    // handles if user makes max payment
    if (payment === maxPayment ) {
      this.handlePaymentMax(e)
      return
    }

    // handles payments
    if (payment > totalDebt) {
      alert('Cannot process a payment greater than $' + totalDebt)
      return
    }

    this.setState({ 
      totalDebt: Number(newRemainingDebt.toFixed(2)),
      interest: Number(newInterest.toFixed(2)),
      principal: Number((newRemainingDebt * 0.01).toFixed(2)),
      minimumPayment: Number(newMinPayment.toFixed(2)),
      totalPayments: Number(parseFloat(newTotalPayment).toFixed(2)),
      payments: newPayments,
      payment: ''
    });
  }

  handlePaymentMax = (e) => {
    e.preventDefault()
    const { totalDebt, payments, interest, totalPayments } = this.state
    const date = this.getDate()

    let newPayments = payments;
    let newTotalPayment = totalPayments;
    let payment = totalDebt + interest
    let newPrinciple =  payment - interest

    // prevents clear debt without an debt
    if (totalDebt <= 0){ return }

    newPayments = [...payments, {date, payment: payment.toFixed(2), interest, principal : newPrinciple, balance : 0 }]
    newTotalPayment += payment
    
    this.setState({ 
      totalDebt: 0,
      interest: 0,
      principal: 0,
      minimumPayment: 0,
      totalPayments: Number(parseFloat(newTotalPayment).toFixed(2)),
      payments: newPayments,
      payment: ''
    });

    alert('Congratulations you are debt free');
  }

  render() {
    const {
      totalDebt, interest, interestRate, payment, payments, principal, 
      minimumPayment, totalPayments
    } = this.state

    const inputs = [
      {id: 'totalDebt', label: 'Debt Amount:', placeholder: '0', alt: 'money', symbol: '$'},
      {id: 'interestRate', label: 'Interest Rate:', step: '0.01', placeholder: '0', symbol: '%', value: interestRate},
      {id: 'payment', label: 'Make A Payment:', step: '0.01', alt: 'money', symbol: '$', value: payment,  min: minimumPayment, placeholder: minimumPayment === 0 ? "0" : "Minimum Amount $" + minimumPayment},
    ]

    const buttons = [
      {id: 1, label: 'Calculate', action: this.handleSubmit },
      {id: 2, label: 'Make A Payment', action: this.handlePayment},
      {id: 3, label: 'Clear Debt', action: this.handlePaymentMax}
    ]

    const resFields = [
      {id: 'Remaining Debt', value: totalDebt},
      {id: 'Interest', value: interest},
      {id: 'Principal', value: principal},
      {id: 'Min Payment', value: minimumPayment},
      {id: 'Total Payment', value: totalPayments},
    ]

    return (
      <div className="calculator-wrapper">
        <div className="heading">Debt Calculator</div>
        <div className="body">
          <div className="body-left">
            <form onSubmit={this.handleSubmit}>

              {inputs.map((item) => {
                const {id, label, placeholder, step, alt, symbol, value, min} = item
                return (
                  <Input 
                    key={id}
                    label={label}
                    name={id}
                    type="number"
                    step={step && step}
                    value={value}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    min={min && min}
                    alt={alt && alt}
                    symbol={symbol}
                  />
                )
              })}

              <div className="btn-container">
                {buttons.map((item) => (<button key={item.id} onClick={item.action}>{item.label}</button>))}
              </div>

            </form>
          </div>
          <div className="body-right">
            <div className="info">
              {resFields.map((item) => (<Result key={item.id} title={item.id} value={"$" + item.value || '$0'} />))}
            </div>
          </div>
        </div>
        {payments.length > 0 ? <div className="payment-list">
          <div className="payment-headings">
            {['Date', 'Amount', 'Interest', 'Principal', 'Balance'
              ].map((val, index) => <div className="heading-item" key={index}>{val}</div>)}
          </div>
          <div className="payments">
            {payments.map((item, index) => (
              <Payments 
                key={index} 
                date={item.date} 
                payment={item.payment} 
                interest={item.interest} 
                principal={item.principal}
                balance={item.balance}
              />
            ))}
          </div>
        </div> : ''}
      </div>
    )

  }
}

export default Calculator;