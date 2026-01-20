import "./App.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Main from "../Main/Main.jsx";

function App() {
  return (
    <div className="app">
      <div className="app__container">
        <Header />

        <main className="app__content">
          <Main />
        </main>

        <Footer />
      </div>
    </div>
  );
}
export default App;
