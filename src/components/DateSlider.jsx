import React from "react";

const DateSlider = ({ date, onChange }) => {
  const optionsDate = { month: "short", day: "numeric" };
  const optionsWeek = { weekday: "short" };
  const dateStr = date.toLocaleDateString("en-US", optionsDate);
  const weekStr = date.toLocaleDateString("en-US", optionsWeek);

  const prevDay = () =>
    onChange(new Date(date.getTime() - 24 * 60 * 60 * 1000));
  const nextDay = () =>
    onChange(new Date(date.getTime() + 24 * 60 * 60 * 1000));

  return (
    <div className="date-bar">
      <button className="nav-btn" onClick={prevDay}>
        ‹
      </button>

      <div className="date-center">
        <img src="../../imgs/calendar.png" alt="" className="cal-icon" />
        <span className="date-strong">{dateStr}</span>
        <span className="date-sub">{weekStr}</span>
      </div>

      <button className="nav-btn" onClick={nextDay}>
        ›
      </button>
    </div>
  );
};

export default DateSlider;
