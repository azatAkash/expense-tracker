const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;
import GMAP from "./components/GMap";
import CategoriesBadge from "./components/CategoriesBadge";
import DailyExpenseOverview from "./components/DailyExpenseOverview";

const App = () => {
  return (
    <div className="expenses-map-container">
      <GMAP mapId={MAP_ID} searchResult={{ lat: 51.1, lng: 71.45 }} />
      <DailyExpenseOverview />

      <CategoriesBadge />
    </div>
  );
};

export default App;
