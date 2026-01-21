import "./InfoHub.css";
import InfoHubHeader from "./InfoHubHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function InfoHub() {
  return (
    <section className="infohub">
      <div className="infohub__container">
        <InfoHubHeader />
        <SecondaryNav active="info" />

        <div className="infohub__content">
          InfoHub page content placeholder
        </div>
      </div>
    </section>
  );
}

export default InfoHub;
