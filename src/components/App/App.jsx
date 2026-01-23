import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { fetchCityDetails } from "../../utils/costAPI.js";
import Footer from "../Footer/Footer.jsx";
import Main from "../Main/Main.jsx";
import Income from "../Income/Income.jsx";
import Expenses from "../Expenses/Expenses.jsx";
import Savings from "../Savings/Savings.jsx";
import Debt from "../Debt/Debt.jsx";
import Lifestyle from "../Lifestyle/Lifestyle.jsx";
import InfoHub from "../InfoHub/InfoHub.jsx";

function App() {
  const cityCacheRef = useRef(new Map());

    const getCityDetails = async (cityId) => {
    if (cityCacheRef.current.has(cityId)) {
      return cityCacheRef.current.get(cityId);
    }

    try {
      const data = await fetchCityDetails(cityId);
      cityCacheRef.current.set(cityId, data);

      console.log(
        "FALLBACK_CITY_DETAILS:",
        JSON.stringify(data, null, 2)
      );

      return data;
    } catch (err) {
      console.error("City details fetch failed:", err);
      throw err;
    }
  };


  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const pageMap = {
    "/": "Main",
    "/income": "Income",
    "/expenses": "Expenses",
    "/savings": "Savings",
    "/debt": "Debt",
    "/lifestyle": "Lifestyle",
    "/info": "InfoHub",
  };

  const currentPage = pageMap[pathname] || "main";

  return (
    <div className={`app app__page__${currentPage}`}>
      <div className="app__container">
        <main className="app__content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses getCityDetails={getCityDetails} />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/debt" element={<Debt />} />
            <Route path="/lifestyle" element={<Lifestyle getCityDetails={getCityDetails} />} />
            <Route path="/info" element={<InfoHub />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
