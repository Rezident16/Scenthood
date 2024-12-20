import React, { useState } from "react";
import "./SignupForm.css";

function Third_page({
  description,
  profile_img,
  setProfileImg,
  setDescription,
  nextPage,
  prevPage,
}) {
  const [localImg, setLocalImg] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  let buttonClassname;
  if (!description || !profile_img) {
    buttonClassname = "disabled_next_button";
  } else {
    buttonClassname = "next_button";
  }

  const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImg(e.target.files[0]);
      const imageUrl = URL.createObjectURL(file);
      setLocalImg(imageUrl);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    setTimeout(() => {
      setImageLoading(false);
      nextPage();
    }, 1200);
  };

  return (
    <div className="sign_up_page_container">
      <div className="3">
        <label className="">
          <div>
            About You:
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <textarea
            className="login_signup_textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <span style={{ height: "10px" }}></span>
        </label>
        <label 
        className="file_input"
        >
          <div>
            Upload Profile Image{" "}
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            type="file"
            name="profile_img"
            accept=".jpg, .jpeg, .png"
            onChange={onFileChange}
              className="image_file_container"
          />
          <span style={{ height: "10px" }}></span>
          <div className="image_placeholder_signup">
            {localImg && (
              <div>
                <img id="profile_form_img" src={localImg} alt="" />
              </div>
            )}
          </div>
        </label>
      </div>
      <div className="next_previous">
        {
          <button className="next_button" onClick={prevPage}>
            Previous
          </button>
        }
        {
          <button onClick={onSubmit} className={buttonClassname}
          disabled={buttonClassname === "disabled_next_button" ? true : false}
          >
            Next
          </button>
        }
      </div>
      {imageLoading && <p>Image is Loading...</p>}
    </div>
  );
}

export default Third_page;
