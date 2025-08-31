// src/components/ExpenseAggregationOverview.jsx
import React from "react";
import { formatCurrencyCents } from "../../utils/format";

const ExpenseAggregationOverview = ({ aggregation }) => {
  const total = aggregation?.totalSum ?? 0;
  const tx = aggregation?.transactions ?? 0;

  return (
    <div className="expense-aggregation-container">
      <div className="expense-aggregation-card">
        <div className="left-container">
          <p className="daily-total-p">Daily Total</p>
          <p className="daily-total-sum">${formatCurrencyCents(total)}</p>
        </div>
        <div className="right-container">
          <p className="transaction-count-p">Transactions</p>
          <p className="transaction-count">{tx}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAggregationOverview;
