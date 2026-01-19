import "./App.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__content">
        <h2 className="app__page-title">Main Page</h2>
        <p className="app__placeholder-text">
          Stage 1.1 shell only. Content to be added in future stages.
        </p>
      </main>

      <Footer />
    </div>
  );
}
export default App;
