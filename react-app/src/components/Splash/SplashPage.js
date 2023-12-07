import { useHistory } from "react-router-dom";
import "./splash.css";
import VideoBackground from "./VideoBackground";

function IntroPage() {
  const history = useHistory();

  const push = () => {
    history.push("/items");
  };
  return (
    <div className="splash_page">
      <div className="splash_page_text">
        <VideoBackground />
      </div>
    </div>
  );
}

export default IntroPage;
