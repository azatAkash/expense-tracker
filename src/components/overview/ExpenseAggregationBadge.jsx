// src/components/ExpenseAggregationOverview.jsx
import React from "react";
import { formatCurrencyCents } from "../../utils/format";

const ExpenseAggregationBadge = ({ totalSum, transactions }) => {
  return (
    <div className="expense-aggregation-badge-container">
      <div className="expense-aggregation-badge">
        <div className="top-container">
          <p className="aggregation-date"></p>
        </div>
        <div className="bottom-container">
          <div className="left-container">
            <img src="../../imgs/up.png" alt="" className="expense-graph" />
            <p className="daily-total-sum">${formatCurrencyCents(totalSum)}</p>
          </div>
          <div className="right-container">
            <img src="../../imgs/filter.png" alt="" className="filter-icon" />
            <p className="transaction-count">{transactions} expenses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAggregationBadge;
