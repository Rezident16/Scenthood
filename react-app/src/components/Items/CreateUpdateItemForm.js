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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};

    if (!name) errorsObj.name = "Name is required";
    if (!brand) errorsObj.brand = "Brand is required";
    if (price <= 0) errorsObj.price = `Price must be above $0.00`;
    if (!preview_img) errorsObj.preview_img = "Image is required";
    if (!description) errorsObj.description = "Description is required";

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
      <form enctype="multipart/form-data" onSubmit={handleSubmit}>
        <label>
          Product setName
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Brand
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Available Quantity
          <input
            type="number"
            step="1"
            min="0"
            value={available_qty}
            onChange={(e) => setAvailableQty(e.target.value)}
          />
        </label>
        <label className="item-form-labels">
          Upload Image
          <input
            id="item-img-input"
            type="file"
            name="Item Image"
            accept=".jpg, .jpeg, .png"
            onChange={onFileChange}
          />
          {localImg && (
            <div>
              <img id="item_form_img" src={localImg} alt="" />
            </div>
          )}
        </label>
        {errors.preview_img && (
          <p className="item-errors">{errors.preview_img}</p>
        )}
        <button className="item-submit-button">Submit</button>
        {imageLoading && <p>Image is Loading...</p>}
      </form>
    </div>
  );
}

export default ItemForm;
