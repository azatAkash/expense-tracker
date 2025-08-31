import React from "react";
import { hexToRgba } from "../../../utils/format";
const Category = ({ color, category }) => {
  return (
    <p
      className="expense-category"
      style={{
        backgroundColor: hexToRgba(color, 0.2),
        border: `1px solid ${hexToRgba(color, 0.6)}`,
        color,
      }}
    >
      {category}
    </p>
  );
};

export default Category;
