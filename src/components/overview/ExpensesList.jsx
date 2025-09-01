// src/components/ExpensesList.jsx

import { getCategoryByName } from "../../models/categories";
import AddressText from "./expenses-list/AddressText";
import TopLeft from "./expenses-list/TopLeft";
import Category from "./expenses-list/Category";
import AddExpenses from "./AddExpenses";

const ExpensesList = ({ date, items, onSaved }) => {
  const hasItems = items && items.length > 0;

  return (
    <div className="expenses-list-container">
      <div className="expenses-list">
        {hasItems ? (
          items.map((expense) => {
            const category = getCategoryByName(expense.category);

            return (
              <div className="expense" key={expense.id}>
                <div className="top">
                  <div className="left-container">
                    <TopLeft
                      color={category.color}
                      time={expense.time}
                      amountUSDCents={expense.amountUSDCents}
                    />
                  </div>
                  <div className="right-container">
                    <Category
                      color={category.color}
                      category={expense.category}
                    />
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
          })
        ) : (
          <p className="no-expenses">...No expenses for today...</p>
        )}
      </div>
      <AddExpenses date={date} onSaved={onSaved} />
    </div>
  );
};

export default ExpensesList;
