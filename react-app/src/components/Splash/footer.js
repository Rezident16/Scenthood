import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer_container">
      <ol className="my_links">
        <li className="name-li-footer">Andrei Vorobev</li>
        <li>
          <a
            className="footer_links"
            target="_blank"
            href="https://github.com/Rezident16"
          >
            {/* <div>GitHub</div> */}
            <i class="fa-brands fa-github"></i>
          </a>
        </li>
        <li>
          <a
            className="footer_links linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/andreivorobev/"
          >
            {/* <div>LinkedIn</div> */}
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </li>
      </ol>
    </div>
  );
}

export default Footer;
