import React, { useState } from "react";
import ExpenseOverviewHeader from "./ExpenseOverviewHeader";
import DateSlider from "./DateSlider";

const DailyExpenseOverview = () => {
  const [date, setDate] = useState(new Date());

  return (
    <aside className="daily-expense-overview-container">
      <ExpenseOverviewHeader />
      <DateSlider date={date} onChange={setDate} />
      {/* later: you can show totals / expenses list here */}
    </aside>
  );
};

export default DailyExpenseOverview;
