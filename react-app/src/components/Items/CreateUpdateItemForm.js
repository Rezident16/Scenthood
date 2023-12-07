import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import React from "react";
import { fetchCreateNewItem } from "../../store/item";
import { fetchUpdateItem } from "../../store/item";
import { fetchOneItem } from "../../store/item";
import { useHistory } from "react-router-dom";
import { fetchLoadCart } from "../../store/cart";
import "./items.css";

function ItemForm({ item, formType, userId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState(formType == "edit" ? item.name : "");
  const [brand, setBrand] = useState(formType == "edit" ? item.brand : "");
  const [price, setPrice] = useState(formType == "edit" ? item.price : "");
  const [preview_img, setPreviewImg] = useState(
    formType == "edit" ? item.preview_img : null
  );
  const [available_qty, setAvailableQty] = useState(
    formType == "edit" ? item.available_qty : 0
  );
  const [description, setDescription] = useState(
    formType == "edit" ? item.description : ""
  );
  const [localImg, setLocalImg] = useState(
    formType === "edit" ? item.preview_img : null
  );
  const [errors, setErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreviewImg(e.target.files[0]);
      const imageUrl = URL.createObjectURL(file);
      setLocalImg(imageUrl);
    }
  };
  let buttonClassname;
  if (
    !name ||
    !brand ||
    !price ||
    !preview_img ||
    !available_qty < 0 ||
    !description
  ) {
    buttonClassname = "disabled_signup_login_button";
  } else {
    buttonClassname = "signup_login_button";
  }

  console.log(description.length)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};

    if (!name) errorsObj.name = "Name is required";
    if (!brand) errorsObj.brand = "Brand is required";
    if (price <= 0) errorsObj.price = `Price must be above $0.00`;
    if (!preview_img) errorsObj.preview_img = "Image is required";
    if (!description) errorsObj.description = "Description is required";
    if (description.length < 25) errorsObj.description = "Description needs to be at least 25 charachters"

    if (!Object.keys(errorsObj).length) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("available_qty", available_qty);
      formData.append("preview_img", preview_img);

      setImageLoading(true);
      if (formType == "edit") {
        await dispatch(fetchUpdateItem(item.id, formData));
        await dispatch(fetchLoadCart());
        history.push(`/items/${item.id}`);
        closeModal();
      } else {
        const data = await dispatch(fetchCreateNewItem(formData));
        history.push(`/items/${data.id}`);
        closeModal();
      }
    } else {
      setErrors(errorsObj);
    }
  };

  return (
    <div>
      <form
        className="form_container item_form"
        enctype="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {formType == "edit" ? <h2>Update Item</h2> : <h2>Add New Item</h2>}
        <div className="name_brand_price">
          <div className="brand_name">
            <label className="form_label">
              <div>
                Product Name
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <input
                className="login_input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
                              <span style={{ height: "12px" }}>
                  {errors.name && (
                    <span className="errors">{errors.name}</span>
                  )}
                </span>
            </label>
            <label className="form_label">
              <div>
                Brand
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <input
                className="login_input"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
                              <span style={{ height: "12px" }}>
                  {errors.brand && (
                    <span className="errors">{errors.brand}</span>
                  )}
                </span>
            </label>
          </div>
          <div className="price_qty">
            <label className="form_label">
              <div>
                Price
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <div>
                <input
                  className="login_input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <span style={{ height: "12px" }}>
                  {errors.price && (
                    <span className="errors">{errors.price}</span>
                  )}
                </span>
            </label>
            <label className="form_label">
              <div>
                Available Quantity
                <span aria-hidden="true" className="required">
                  *
                </span>
              </div>
              <input
                className="login_input available_qty_form"
                type="number"
                step="1"
                min="0"
                value={available_qty}
                onChange={(e) => setAvailableQty(e.target.value)}
              />
                              <span style={{ height: "12px" }}>
                  {errors.available_qty && (
                    <span className="errors">{errors.available_qty}</span>
                  )}
                </span>
            </label>
          </div>
        </div>
        <label className="form_label">
          <div>
            Description
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <textarea
            className="login_signup_textarea"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
                          <span style={{ height: "12px" }}>
                  {errors.description && (
                    <span className="errors">{errors.description}</span>
                  )}
                </span>
        </label>

        <label className="form_label item_form_input">
          <div>
            Upload Image
            <span aria-hidden="true" className="required">
              *
            </span>
          </div>
          <input
            className="input_create_item"
            id="item-img-input"
            type="file"
            name="Item Image"
            accept=".jpg, .jpeg, .png"
            onChange={onFileChange}
          />
        </label>
          <div className="image_placeholder_item">
            {localImg && (
              <div>
                <img id="item_form_img" src={localImg} alt="" />
              </div>
            )}
          </div>
          <span style={{ height: "12px" }}>
                  {errors.preview_img && (
                    <span className="errors">{errors.preview_img}</span>
                  )}
                </span>
        <button className={buttonClassname}>Submit</button>
        {imageLoading && <p>Image is Loading...</p>}
      </form>
    </div>
  );
}

export default ItemForm;
