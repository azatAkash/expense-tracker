const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;
import GMAP from "./components/GMap";
import CategoriesBadge from "./components/CategoriesBadge";
import DailyExpenseOverview from "./components/DailyExpenseOverview";
const App = () => {
  return (
    <div className="expenses-map-container">
      <DailyExpenseOverview />
      <CategoriesBadge />

      <GMAP mapId={MAP_ID} />
    </div>
  );
};

export default App;
