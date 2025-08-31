import React from "react";
import { formatCurrencyCents, formatTime } from "../../../utils/format";

const TopLeft = ({ amountUSDCents, color, time }) => {
  return (
    <div className="top-left-container">
      <span className="category-color" style={{ backgroundColor: color }} />
      <div className="expense-time-amount-container">
        <h1 className="expense-amount">
          ${formatCurrencyCents(amountUSDCents)}
        </h1>
        <div className="expense-time-container">
          <img
            src="../../imgs/clock.png"
            alt="time"
            className="expense-time-img"
          />
          <p className="expense-time-p">{formatTime(time)}</p>
        </div>
      </div>
    </div>
  );
};

export default TopLeft;
