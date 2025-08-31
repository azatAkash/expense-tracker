import React, { useState, useMemo } from "react";
import ExpenseOverviewHeader from "./overview/ExpenseOverviewHeader";
import DateSlider from "./overview/DateSlider";
import ExpensesList from "./overview/ExpensesList";
import ExpenseAggregationOverview from "./overview/ExpenseAggregationOverview";
import { formatToYYYYMMDD } from "../utils/format";
import { getExpencesByDate } from "../models/expenses";
import { setAggregationByDate } from "../models/aggregation";
import ExpenseAggregationBadge from "./overview/ExpenseAggregationBadge";

const DailyExpenseOverview = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true);

  // compute items when `date` changes
  const items = useMemo(
    () => getExpencesByDate(formatToYYYYMMDD(date)),
    [date]
  );
  const aggregation = useMemo(
    () => setAggregationByDate(formatToYYYYMMDD(date), items),
    [date]
  );

  return (
    <aside
      className={`daily-expense-overview-container ${open ? "" : "closed"}`}
    >
      <ExpenseOverviewHeader onClose={() => setOpen(false)} />

      {/* Date slider should call setDate(dateObj) */}
      <DateSlider date={date} onChange={setDate} />

      {/* If this component aggregates, pass items down */}
      <ExpenseAggregationOverview aggregation={aggregation} />

      <ExpenseAggregationBadge
        totalSum={aggregation?.totalSum ?? 0}
        transactions={aggregation?.transactions ?? 0}
        date={date}
      />

      {/* List just needs items for the selected day */}
      <ExpensesList items={items} />
    </aside>
  );
};

export default DailyExpenseOverview;
