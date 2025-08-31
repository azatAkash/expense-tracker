import React from "react";
import { getFormattedDate } from "../../utils/format";
const DateSlider = ({ date, onChange }) => {
  const prevDay = () =>
    onChange(new Date(date.getTime() - 24 * 60 * 60 * 1000));
  const nextDay = () =>
    onChange(new Date(date.getTime() + 24 * 60 * 60 * 1000));
  const formattedDate = getFormattedDate(date);
  return (
    <div className="date-bar">
      <button className="nav-btn" onClick={prevDay}>
        ‹
      </button>

      <div className="date-center">
        <img src="../../imgs/calendar.png" alt="" className="cal-icon" />
        <span className="date-strong">{formattedDate.dateStr}</span>
        <span className="date-sub">{formattedDate.weekStr}</span>
      </div>

      <button className="nav-btn" onClick={nextDay}>
        ›
      </button>
    </div>
  );
};

export default DateSlider;
