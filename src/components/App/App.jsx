import "./App.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";

function App() {
  return (
    <div className="app">
      <div className="app__container">
        <Header />

        <main className="app__content">
          <section className="main">
            <div className="main__summary-bar">
              <p className="main__summary-text">
                *How much is remaining in the month*
              </p>
              <div className="main__summary-icon" />
            </div>

            <div className="main__chart-panel">
              <div className="main__summary-bar main__summary-bar_type_open">
                <p className="main__summary-text">
                  *How much is remaining in the month*
                </p>
                <div className="main__summary-icon main__summary-icon_type_up" />
              </div>

              <div className="main__chart-placeholder" />
            </div>

            <div className="main__insight-panel">
              <p className="main__insight-text">Insight: *placeholder*</p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
export default App;
