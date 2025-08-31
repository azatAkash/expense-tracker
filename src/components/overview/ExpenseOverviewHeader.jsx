import React from "react";

const ExpenseOverviewHeader = () => {
  return (
    <header className="header">
      <div className="left-child">
        <div className="app-logo-container">
          <img src="../../public/imgs/dollar.png" alt="" className="app-logo" />
        </div>
        <div className="heading">
          <h1 className="app-name">Expense Tracker</h1>
          <p className="app-subheading">Daily expense overview</p>
        </div>
      </div>
      <div className="right-child">
        <div className="close-logo-container">
          <img src="../../imgs/close.png" alt="" className="close-logo" />
        </div>
      </div>
    </header>
  );
};

export default ExpenseOverviewHeader;
