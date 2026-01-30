import { Link } from "react-router-dom";
import "./SecondaryNav.css";

function SecondaryNav({ active }) {
  return (
    <nav className="secondary-nav">
      <ul className="secondary-nav__list">
        <li className={`secondary-nav__item ${active === "income" ? "secondary-nav__item_active" : ""}`} data-color="income">
          <Link to="/income">Income</Link>
        </li>
        <li className={`secondary-nav__item ${active === "expenses" ? "secondary-nav__item_active" : ""}`} data-color="expenses">
          <Link to="/expenses">Expenses</Link>
        </li>
        <li className={`secondary-nav__item ${active === "savings" ? "secondary-nav__item_active" : ""}`} data-color="savings">
          <Link to="/savings">Savings</Link>
        </li>
        <li className={`secondary-nav__item ${active === "debt" ? "secondary-nav__item_active" : ""}`} data-color="debt">
          <Link to="/debt">Debt</Link>
        </li>
        <li className={`secondary-nav__item ${active === "lifestyle" ? "secondary-nav__item_active" : ""}`} data-color="lifestyle">
          <Link to="/lifestyle">Lifestyle</Link>
        </li>
        <li className={`secondary-nav__item ${active === "info" ? "secondary-nav__item_active" : ""}`} data-color="info">
          <Link to="/info">Info Hub</Link>
        </li>
      </ul>
    </nav>
  );
}

export default SecondaryNav;
