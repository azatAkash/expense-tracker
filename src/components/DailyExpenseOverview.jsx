import React, { useState, useMemo } from "react";
import ExpenseOverviewHeader from "./overview/ExpenseOverviewHeader";
import DateSlider from "./overview/DateSlider";
import ExpensesList from "./overview/ExpensesList";
import ExpenseAggregationOverview from "./overview/ExpenseAggregationOverview";
import { formatToYYYYMMDD } from "../utils/format";
import { getExpencesByDate } from "../models/expenses";
import { setAggregationByDate } from "../models/aggregation";
import ExpenseAggregationBadge from "./overview/ExpenseAggregationBadge";
import Markers from "./Markers";

const DailyExpenseOverview = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true);
  const [version, setVersion] = useState(0); // 👈 add

  const items = useMemo(
    () => getExpencesByDate(formatToYYYYMMDD(date)),
    [date, version] // 👈 depend on version too
  );
  const aggregation = useMemo(
    () => setAggregationByDate(formatToYYYYMMDD(date), items),
    [date, items] // depend on items
  );
  const handleSaved = () => setVersion((v) => v + 1); // 👈 bump to refresh

  return (
    <aside
      className={`daily-expense-overview-container ${open ? "" : "closed"}`}
    >
      <Markers items={items} />
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
      <ExpensesList date={date} items={items} onSaved={handleSaved} />
    </aside>
  );
};

export default DailyExpenseOverview;
