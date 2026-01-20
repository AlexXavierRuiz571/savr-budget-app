import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Main from "../Main/Main.jsx";
import Income from "../Income/Income.jsx";
import Expenses from "../Expenses/Expenses.jsx";
import Savings from "../Savings/Savings.jsx";
import Debt from "../Debt/Debt.jsx";
import Lifestyle from "../Lifestyle/Lifestyle.jsx";
import InfoHub from "../InfoHub/InfoHub.jsx";

function App() {
  const { pathname } = useLocation();

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
        <Header />

        <main className="app__content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/debt" element={<Debt />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
            <Route path="/info" element={<InfoHub />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
