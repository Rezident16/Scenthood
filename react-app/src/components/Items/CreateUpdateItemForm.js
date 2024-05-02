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
import './item_form.css';

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
  let tooltip;
  let tooltiptext;
  if (
    !name ||
    !brand ||
    !price ||
    !preview_img ||
    !parseInt(available_qty) < 0 ||
    !description
  ) {
    buttonClassname = "disabled_next_button";
    tooltip = "tooltip";
    tooltiptext = "tooltiptext";
  } else {
    buttonClassname = "next_button";
    tooltip = "";
    tooltiptext = "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};

    if (!name) errorsObj.name = "Name is required";
    if (!brand) errorsObj.brand = "Brand is required";
    if (price <= 0) errorsObj.price = `Price must be above $0.00`;
    if (!preview_img) errorsObj.preview_img = "Image is required";
    if (!description) errorsObj.description = "Description is required";
    if (description.length < 25)
      errorsObj.description = "Description needs to be at least 25 charachters";
    if (parseInt(available_qty).length == 0 || parseInt(available_qty) < 0)
      errorsObj.available_qty =
        "Available quantity can't be less than 0 or empty";

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
    <form 
      enctype="multipart/form-data" 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f3f3f3', 
        padding: '20px', 
        borderRadius: '4px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)', 
        width: '100%', 
        maxWidth: '400px', 
        fontFamily: 'Arial, sans-serif' 
      }}
    >
      {formType === "edit" ? <h2>Update Item</h2> : <h2>Add New Item</h2>}
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Product Name
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {errors.name && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.name}</span>}
      </label>
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Brand
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          style={{ width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {errors.brand && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.brand}</span>}
      </label>
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Price
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {errors.price && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.price}</span>}
      </label>
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Available Quantity
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <input
          type="number"
          step="1"
          min="0"
          value={available_qty}
          onChange={(e) => setAvailableQty(e.target.value)}
          required
          style={{ width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {errors.available_qty && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.available_qty}</span>}
      </label>
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Description
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <textarea
          rows="10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ height: '150px', width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {errors.description && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.description}</span>}
      </label>
      <label style={{ width: '90%', marginBottom: '10px' }}>
        Product Image
        <span aria-hidden="true" style={{ color: 'red' }}>*</span>
        <input
          type="file"
          name="Item Image"
          accept=".jpg, .jpeg, .png"
          onChange={onFileChange}
          style={{ width: '90%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </label>
      {localImg && <img id="item_form_img" src={localImg} alt="" style={{ maxWidth: '90%', height: 'auto' }} />}
      {errors.preview_img && <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.preview_img}</span>}
      <button style={{ width: '80%', padding: '10px', backgroundColor: '#f90', border: '1px solid', borderColor: '#a88734 #9c7e31 #846a29', cursor: 'pointer', borderRadius: '4px', color: '#111' }}>Submit</button>
      {imageLoading && <p>Image is Loading...</p>}
    </form>
  );
}

export default ItemForm;
