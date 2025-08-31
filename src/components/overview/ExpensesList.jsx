// src/components/ExpensesList.jsx
import { formatCurrencyCents, formatTime } from "../../utils/format";
import { getCategoryByName } from "../../models/categories";
import AddressText from "./AddressText";
import { hexToRgba } from "../../utils/format";

const ExpensesList = ({ items }) => {
  // compute directly

  return (
    <div className="expenses-list-container">
      <span className="line"></span>

      <div className="expenses-list">
        {items.map((expense) => {
          const category = getCategoryByName(expense.category);
          return (
            <div className="expense" key={expense.id}>
              <div className="top">
                <div className="left-container">
                  <div className="top-left-container">
                    <span
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="expense-time-amount-container">
                      <h1 className="expense-amount">
                        ${formatCurrencyCents(expense.amountUSDCents)}
                      </h1>
                      <div className="expense-time-container">
                        <img
                          src="../../imgs/clock.png"
                          alt="time"
                          className="expense-time-img"
                        />
                        <p className="expense-time-p">
                          {formatTime(expense.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right-container">
                  <p
                    className="expense-category"
                    style={{
                      backgroundColor: hexToRgba(category.color, 0.2),
                      border: `1px solid ${hexToRgba(category.color, 0.6)}`,
                      color: category.color,
                    }}
                  >
                    {expense.category}
                  </p>
                </div>
              </div>

              <div className="bottom">
                <p className="expense-note">{expense.note}</p>

                <AddressText
                  lat={expense.coordinates.lat}
                  lng={expense.coordinates.lng}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesList;
