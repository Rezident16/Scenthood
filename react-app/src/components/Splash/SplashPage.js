import { useHistory } from "react-router-dom";
import "./splash.css";

function IntroPage() {
  const history = useHistory();

  const push = () => {
    history.push("/items");
  };
  return (
    <div className="splash_page">
      <div className="splash_page_text">
        <h1>Welcome to Scenthood - Your Fragrance Haven!</h1>
        <p>
          At Scenthood, we invite you to immerse yourself in the world of
          captivating aromas and unique scents. As a dedicated community for
          fragrance enthusiasts, we've created a space where your passion for
          perfumes can flourish.
        </p>
      </div>
      <div className="about_us">
        <h2>What Sets Us Apart:</h2>
        <ul>
          <li>
            <div>Opinion Oasis: </div>
            <div>
              Scenthood is not just a marketplace; it's a community-driven hub
              where fragrance lovers gather to share their thoughts, reviews,
              and insights on a vast array of perfumes. Whether you're a
              seasoned connoisseur or a budding enthusiast, your opinions matter
              here.
            </div>
          </li>
          <li>
            <div>Scentalicious Marketplace: </div>
            <div>
              Explore and discover an extensive collection of fragrances
              available for purchase, carefully curated to cater to diverse
              tastes. Our marketplace operates with the ease of an auction,
              giving you the chance to snag that elusive bottle or bid farewell
              to a beloved scent.
            </div>
          </li>
          <li>
            <div>Fragrance Stories: </div>
            <div>
              Every bottle has a story to tell. Dive into the captivating
              narratives behind your favorite perfumes or share your own
              olfactory adventures. Connect with like-minded individuals who
              appreciate the artistry and emotion that each fragrance
              encapsulates.
            </div>
          </li>
        </ul>
      </div>
      <div className="about_us">
        <h2>Why Scenthood:</h2>
        <ul>
          <li>
            <div>Community-Driven:</div>
            <div>
              Scenthood thrives on the diverse perspectives of its community.
              From reviews and recommendations to discussions on the latest
              trends, you'll find a wealth of knowledge and camaraderie here.
            </div>
          </li>
          <li>
            <div>Passion-Infused Interface:</div>
            <div>
              Navigate through our user-friendly platform designed with the
              fragrance enthusiast in mind. Engage with stunning visuals,
              detailed fragrance profiles, and a vibrant community that shares
              your love for all things aromatic.
            </div>
          </li>
        </ul>
      </div>
      <button className="intro_button" onClick={push}>
        Lets Begin
      </button>
    </div>
  );
}

export default IntroPage;
