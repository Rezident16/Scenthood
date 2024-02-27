import React, { useEffect } from "react";
import "./VideoBackground.css"; // Import your CSS file
import { useHistory } from "react-router-dom";
import { useSearchBar } from "../../context/SearchBarClass";

const VideoBackground = () => {
  const { setSearchClass } = useSearchBar();

  useEffect(() => {
    setSearchClass("search_bar_component_logged_out");
  }, []);
  const history = useHistory();
  const push = () => {
    setSearchClass("search_bar_component")
    history.push("/items");
  };
  return (
    <div className="video-container">
      <video autoPlay muted loop className="video-bg">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <div className="content_text">
          <h1 className="video_h1">Welcome to Scenthood</h1>
          <p className="video_p">Discover the world of fragrances...</p>
        </div>
        <div className="intro_button" onClick={push}>
          Start Exploring
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
