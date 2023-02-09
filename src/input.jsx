import React from "react";

class Input extends React.Component {

  render() {
    const { label,name, type, value, pattern, placeholder, onChange, minValue, alt, symbol } = this.props

    return (
      <label>
        <span>{label}</span>
        <div className="input-container">
          <input 
            type={type} 
            name={name}
            value={value}
            autoComplete="off"
            pattern={pattern}
            inputMode="decimal"
            placeholder={placeholder}
            onChange={onChange}
            min={minValue}
          />
          <span className={alt ? 'symbol ' + alt : 'symbol '}>{symbol}</span>
        </div>
      </label>
    )
  }
}

export default Input;