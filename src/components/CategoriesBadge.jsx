import { categories } from "../models/categories";

const CategoriesBadge = () => {
  return (
    <div className="categories-badge">
      <h1 className="categories-heading">Categories</h1>
      <div className="categories-container">
        {categories.map(({ id, name, color }) => (
          <div className="category" key={id}>
            <span
              className="category-color"
              style={{ backgroundColor: color }}
            ></span>
            <p className="category-name">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesBadge;
