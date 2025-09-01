// src/components/DailyExpenseOverview.jsx
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
  const [version, setVersion] = useState(0);
  const [selectedId, setSelectedId] = useState(null); // 👈 add

  const items = useMemo(
    () => getExpencesByDate(formatToYYYYMMDD(date)),
    [date, version]
  );
  const aggregation = useMemo(
    () => setAggregationByDate(formatToYYYYMMDD(date), items),
    [date, items]
  );
  const handleSaved = () => setVersion((v) => v + 1);

  return (
    <aside
      className={`daily-expense-overview-container ${open ? "" : "closed"}`}
    >
      <Markers
        items={items}
        onSelect={setSelectedId}
        selectedId={selectedId}
        date={formatToYYYYMMDD(date)}
      />
      <ExpenseOverviewHeader onClose={() => setOpen(false)} />
      <DateSlider date={date} onChange={setDate} />
      <ExpenseAggregationOverview aggregation={aggregation} />
      <ExpenseAggregationBadge
        totalSum={aggregation?.totalSum ?? 0}
        transactions={aggregation?.transactions ?? 0}
        date={date}
      />
      <ExpensesList
        date={date}
        items={items}
        onSaved={handleSaved}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </aside>
  );
};

export default DailyExpenseOverview;
