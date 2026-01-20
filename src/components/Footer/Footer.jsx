import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__text">© {currentYear} SAVR by Alex Xavier Ruiz</p>
    </footer>
  );
}

export default Footer;
