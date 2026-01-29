import "./InfoHub.css";
import { useState } from "react";
import InfoHubHeader from "./InfoHubHeader.jsx";
import SecondaryNav from "../SecondaryNav/SecondaryNav.jsx";

function InfoHub() {
  const faqItems = [
    {
      id: "works",
      title: "How SAVR Works",
      paragraphs: [
        "SAVR is a budget simulation tool that shows how income, expenses, savings, debt, and lifestyle choices interact within a single monthly view.",
        "Values you enter are combined to calculate totals, category allocations, and overall budget balance.",
        "Rather than focusing only on past spending, SAVR is designed to help you understand how changes in one area affect the rest of your budget.",
        "All calculations are based on the data currently saved to your profile.",
      ],
    },
    {
      id: "estimates",
      title: "How Estimates Are Used",
      paragraphs: [
        "Estimates are provided to give context when exact values are unknown or optional.",
        "They are shown as ranges and are meant to represent typical costs, not guaranteed amounts.",
        "User-entered values always take priority. Estimates never overwrite or modify your saved data, and you remain in full control of all final numbers used in calculations.",
      ],
    },
    {
      id: "data",
      title: "Where Data Comes From",
      paragraphs: [
        "Some estimated values in SAVR are based on third-party data sources and publicly available averages.",
        "These sources are used to provide general cost ranges for planning and comparison purposes, not exact pricing.",
        "For travel-related and lifestyle estimates, SAVR references external data providers to help establish typical cost ranges by location and category.",
        "Data Source:",
        "Cost of living estimates are based on publicly available data from TravelTables.com and similar cost-of-living reference sources.",
        "Data sources may vary by category and location, and estimates may not reflect real-time pricing.",
      ],
    },
    {
      id: "not",
      title: "What SAVR Does Not Do",
      paragraphs: [
        "SAVR does not provide financial advice, investment recommendations, or personalized financial guidance.",
        "It does not connect to bank accounts, credit cards, or external financial institutions.",
        "All data entered into SAVR is user-provided or estimated for reference only.",
        "Final financial decisions should always be made based on your own judgment and circumstances.",
      ],
    },
  ];

  const [openMap, setOpenMap] = useState(() => {
    const initial = {};
    faqItems.forEach((item) => {
      initial[item.id] = false;
    });
    return initial;
  });

  const toggleItem = (id) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="infohub">
      <div className="infohub__container">
        <InfoHubHeader />
        <SecondaryNav active="info" />

        <div className="infohub__content">
          <div className="infohub__about">
            <h2 className="infohub__about-title">About SAVR</h2>

            <p className="infohub__about-text">
              SAVR is a budget simulation tool designed to help you understand
              how income, expenses, savings, debt, and lifestyle choices
              interact over time.
            </p>

            <p className="infohub__about-text">
              It focuses on showing how everyday financial decisions affect the
              bigger picture of a budget, rather than just tracking past
              spending.
            </p>

            <p className="infohub__about-text">
              Each category in SAVR uses a consistent color to make patterns,
              trade-offs, and imbalances easier to recognize at a glance.
            </p>

            <p className="infohub__about-text">
              SAVR combines user-entered data with estimated ranges to provide
              context, while always allowing users to override estimates with
              their own values.
            </p>

            <p className="infohub__about-text infohub__about-text_strong">
              SAVR is a planning and simulation tool, not financial advice.
            </p>
          </div>

          <div className="infohub__profile-plan">
            <h2 className="infohub__profile-plan-title">Profile</h2>

            <p className="infohub__profile-plan-text">
              Profile features are planned for a future stage. For now, SAVR
              stores local saved data to support category totals and budget
              calculations.
            </p>

            <p className="infohub__profile-plan-text">
              The current structure is designed so it can later be replaced with
              a full authenticated profile system without rewriting page logic.
            </p>
          </div>

          <div className="infohub__faq">
            {faqItems.map((item) => (
              <div className="infohub__faq-item" key={item.id}>
                <button
                  className={`infohub__faq-title ${
                    openMap[item.id] ? "infohub__faq-title_active" : ""
                  }`}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                >
                  {item.title}
                </button>

                <div
                  className={`infohub__faq-body ${
                    openMap[item.id] ? "infohub__faq-body_open" : ""
                  }`}
                >
                  <div className="infohub__faq-body-inner">
                    {item.paragraphs.map((text, index) => (
                      <p
                        className="infohub__faq-text"
                        key={`${item.id}-${index}`}
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoHub;
