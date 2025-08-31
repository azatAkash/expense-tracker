import React, { useState } from "react";
import ExpenseOverviewHeader from "./ExpenseOverviewHeader";
import DateSlider from "./DateSlider";
import ExpensesList from "./ExpensesList";
import { formatToYYYYMMDD } from "../utils/format";
const DailyExpenseOverview = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`daily-expense-overview-container ${open ? "" : "closed"}`}
    >
      <ExpenseOverviewHeader onClose={() => setOpen(false)} />
      <DateSlider date={date} onChange={setDate} />
      <ExpensesList date={formatToYYYYMMDD(date)} />
    </aside>
  );
};

export default DailyExpenseOverview;
