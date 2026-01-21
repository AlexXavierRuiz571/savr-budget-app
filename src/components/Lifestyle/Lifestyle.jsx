import "./lifestyle.css";
import LifestyleHeader from "./LifestyleHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function Lifestyle() {
  return (
    <section className="lifestyle">
      <div className="lifestyle__container">
        <LifestyleHeader />
        <SecondaryNav active="lifestyle" />

        <div className="lifestyle__content">
          Lifestyle page content placeholder
        </div>
      </div>
    </section>
  );
}

export default Lifestyle;
