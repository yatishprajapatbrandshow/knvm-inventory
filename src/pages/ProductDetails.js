import BaconBurger from "assets/img//product/Bacon Burger.jpg";
import Navbar from "pages/Navbar";
import { useEffect, useState } from "react";
import { API_NEW_URL, X_API_Key, DOC_URL } from "../config";
import { isSessionActive } from 'utils/sessionUtils';
import { useNavigate, useLocation } from 'react-router-dom';

import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';


const AnyOther = () => {

  const Session = isSessionActive()
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  useEffect(() => {
    if (!Session) navigate('/login');
  }, []);



  const [productID, setProductID] = useState('');
  const [ProductName, setProductName] = useState("");
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [productContainer, setProductContainer] = useState('');
  const [quantityInContainer, setQuantityInContainer] = useState('');
  const [quantityContainerMeasurement, setQuantityContainerMeasurement] = useState('');
  const [openingStock, setOpeningStock] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSKU] = useState('');
  const [productWidth, setProductWidth] = useState('');
  const [productHeight, setProductHeight] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('');
  const [brand, setBrand] = useState('');

  const [ProductCanEdit, setProductCanEdit] = useState(false);

  const [productImages, setProductImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const [productImagesPrev, setproductImagesPrev] = useState("");

  useEffect(() => {
    if (data) {
      console.log(data)
      setProductName(data.name)
      setDescription(data.description)
      setType(data.type)
      setProductContainer(data.productContainer)
      setQuantityInContainer(data.quantityInOneProductContainer)
      setQuantityContainerMeasurement(data.measuringUnit)
      setOpeningStock(data.openingStock)
      setDefaultPrice(data.defaultPrice)
      setCategory(data.category)
      setSKU(data.sku)
      setProductWeight(data.productWeight)
      setWeightUnit(data.weightUnit)
      setBrand(data.brand)
      setProductCanEdit(true)
      setProductID(data._id)
      setProductWidth(data.productDimension?.width)
      setProductHeight(data.productDimension?.height)
      setproductImagesPrev(data.productImages)
    }
  }, [data]);


  const handleImageChange = (e) => {
    setProductImages([...productImages, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    setInputKey(Date.now()); // reset input key to allow re-uploading the same image
  };

  const [ErrorMessage, setErrorMessage] = useState("");

  const AddProduct = async () => {
    setErrorMessage("");

    if (ProductName === undefined || ProductName === null || ProductName === "" ||
      type === undefined || type === null || type === "" ||
      productContainer === undefined || productContainer === null || productContainer === "" ||
      quantityInContainer === undefined || quantityInContainer === null || quantityInContainer === "" ||
      quantityContainerMeasurement === undefined || quantityContainerMeasurement === null || quantityContainerMeasurement === "" ||
      openingStock === undefined || openingStock === null || openingStock === "" ||
      defaultPrice === undefined || defaultPrice === null || defaultPrice === "" ||
      category === undefined || category === null || category === "" ||
      sku === undefined || sku === null || sku === "" ||
      productWeight === undefined || productWeight === null || productWeight === "" ||
      weightUnit === undefined || weightUnit === null || weightUnit === "" ||
      brand === undefined || brand === null || brand === "") {
      setErrorMessage("Please Fill Required Fields");
      alert("Please Fill Required Fields");
      return;
    }

    const formData = new FormData();
    formData.append('name', ProductName);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('productContainer', productContainer);
    formData.append('quantityInOneProductContainer', quantityInContainer);
    formData.append('measuringUnit', quantityContainerMeasurement);
    formData.append('openingStock', openingStock);
    formData.append('defaultPrice', defaultPrice);
    formData.append('category', category);
    formData.append('sku', sku);
    formData.append('width', productWidth);
    formData.append('height', productHeight);
    formData.append('productWeight', productWeight);
    formData.append('weightUnit', weightUnit);
    formData.append('brand', brand);

    // Append images to formData
    productImages.forEach((image, index) => {
      formData.append('productImages', image);
    });

    const apiUrl = `${API_NEW_URL}product/add`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'X-API-Key': X_API_Key
        },
        body: formData
      });

      const data = await response.json();
      console.log(data);
      if (data.success === true) {
        alert("Product added successfully");
        navigate('/admin');
      } else if (data.message === "SKU already exists") {
        alert(`Product with SKU: ${sku} already exists. Please try using a different SKU number.`);
      } else {
        alert("Something went wrong please try again.");
      }
    } catch (error) {

    }
  };

  const EditProduct = async () => {
    setErrorMessage("");

    if (
      ProductName === undefined || ProductName === null || ProductName === "" ||
      type === undefined || type === null || type === "" ||
      productContainer === undefined || productContainer === null || productContainer === "" ||
      quantityInContainer === undefined || quantityInContainer === null || quantityInContainer === "" ||
      quantityContainerMeasurement === undefined || quantityContainerMeasurement === null || quantityContainerMeasurement === "" ||
      openingStock === undefined || openingStock === null || openingStock === "" ||
      defaultPrice === undefined || defaultPrice === null || defaultPrice === "" ||
      category === undefined || category === null || category === "" ||
      sku === undefined || sku === null || sku === "" ||
      productWeight === undefined || productWeight === null || productWeight === "" ||
      weightUnit === undefined || weightUnit === null || weightUnit === "" ||
      brand === undefined || brand === null || brand === ""
    ) {

      setErrorMessage("Please Fill Required Fields");
      alert("Please Fill Required Fields");
      return;
    }

    const formData = new FormData();
    formData.append('name', ProductName);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('productContainer', productContainer);
    formData.append('quantityInOneProductContainer', quantityInContainer);
    formData.append('measuringUnit', quantityContainerMeasurement);
    formData.append('openingStock', openingStock);
    formData.append('defaultPrice', defaultPrice);
    formData.append('category', category);
    formData.append('sku', sku);
    formData.append('width', productWidth);
    formData.append('height', productHeight);
    formData.append('productWeight', productWeight);
    formData.append('weightUnit', weightUnit);
    formData.append('brand', brand);


    // Append images to formData
    productImages.forEach((image, index) => {
      formData.append('productImages', image);
    });


    const apiUrl = `${API_NEW_URL}product/edit/${productID}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          'X-API-Key': X_API_Key
        },
        body: formData
      });

      const data = await response.json();
      if (data.success === true) {
        alert("Product Edit successfully");
        navigate('/admin');
      } else if (data.message === "SKU already exists") {
        alert(`Product with SKU: ${sku} already exists. Please try using a different SKU number.`);
      } else {
        alert("Something went wrong please try again.");
      }

    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage("An error occurred while adding the product. Please try again later.");
      alert("An error occurred while adding the product. Please try again later.");
    }
  };





  return (
    <>
      <div className="mx-auto max-w-7xl p-5">
        <Navbar
          logoText={"Product Detail"}
          brandText={"product detail"}
        />
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-3 2xl:col-span-3 bg-white p-5">
            <div >
              {ErrorMessage ? <>
                <p className="text-left mt-5 font-dm text-sm font-medium text-red-500">{ErrorMessage}</p>
              </> : null}
            </div>
            <div className="mt-4 border-t border-t-gray-200 pt-4">
              <div>
                <label
                  htmlFor="ProductName"
                  className="text-left text-sm font-medium text-gray-900"
                >
                  Product Name*
                </label>
                <input
                  id="ProductName"
                  name="ProductName"
                  type="text"
                  value={ProductName}
                  placeholder="e.g. MEDICON Tablets"
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mt-5">
                <label
                  htmlFor="Description"
                  className="text-left text-sm font-medium text-gray-900 "
                >
                  Description
                </label>
                <input
                  id="Description"
                  name="ProductName"
                  type="text"
                  value={description}
                  placeholder="..."
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                {/* product category  */}
                <div className="grid grid-cols-2 mt-4">
                  <p className="border-b pb-2 mb-4 font-bold text-gray-900 border-gray-300">General Information</p>
                </div>
                {/* product category  */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Type*:</label>
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={type}
                        required
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Injection">Injection</option>
                        <option value="Powder">Powder</option>
                        <option value="Liquid">Liquid</option>
                        <option value="Gel">Gel</option>
                        <option value="Cream">Cream</option>
                        <option value="Ointment">Ointment</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Suspension">Suspension</option>
                        <option value="Lozenge">Lozenge</option>
                        <option value="Spray">Spray</option>
                        <option value="Patch">Patch</option>
                        <option value="Inhaler">Inhaler</option>
                        <option value="Suppository">Suppository</option>
                        <option value="Drops">Drops</option>
                        <option value="Foam">Foam</option>
                        <option value="Solution">Solution</option>
                        <option value="Granules">Granules</option>
                      </select>
                    </div>

                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Product Container*:</label>
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={productContainer}
                        required
                        onChange={(e) => setProductContainer(e.target.value)}
                      >
                        <option value="">Select Product Container</option>
                        <option value="Strip">Strip</option>
                        <option value="Pouch">Pouch</option>
                        <option value="Bottle">Bottle</option>
                        <option value="Blister Pack">Blister Pack</option>
                        <option value="Jar">Jar</option>
                        <option value="Tube">Tube</option>
                        <option value="Sachet">Sachet</option>
                        <option value="Vial">Vial</option>
                        <option value="Ampoule">Ampoule</option>
                        <option value="Canister">Canister</option>
                        <option value="Carton">Carton</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>


                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Quantity in One Product Container*:</label>
                      <div className="col-span-2 flex space-x-2">
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          value={quantityInContainer}
                          pattern="[0-9]*"
                          required
                          onChange={(e) => setQuantityInContainer(e.target.value)}
                        />
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={quantityContainerMeasurement}
                          required
                          onChange={(e) => setQuantityContainerMeasurement(e.target.value)}
                        >
                          <option value="">Select Unit</option>
                          <option value="Caps">Caps</option>
                          <option value="Tab">Tab</option>
                          <option value="Gram">Gram</option>
                          <option value="Piece">Piece</option>
                          <option value="mL">ml</option>
                          <option value="mg">mg</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Opening Stock*:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        value={openingStock}
                        pattern="[0-9]*"
                        required
                        onChange={(e) => setOpeningStock(e.target.value)}
                      />
                    </div>
                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Default Price*:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        value={defaultPrice}
                        pattern="[0-9]*"
                        required
                        onChange={(e) => setDefaultPrice(e.target.value)}
                      />
                    </div>

                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Category*:</label>
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={category}
                        required
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>


                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">SKU*:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        value={sku}
                        required
                        disabled={ProductCanEdit}
                        onChange={(e) => setSKU(e.target.value)}
                      />
                    </div>

                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Product Dimension :</label>
                      <div className="col-span-2 flex space-x-2">
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          placeholder="Width"
                          pattern="[0-9]*"
                          value={productWidth}
                          onChange={(e) => setProductWidth(e.target.value)}
                        />
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          placeholder="Height"
                          pattern="[0-9]*"
                          value={productHeight}
                          onChange={(e) => setProductHeight(e.target.value)}
                        />
                      </div>
                    </div>


                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Product Weight*:</label>
                      <div className="col-span-2 flex space-x-2">
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          placeholder="Weight"
                          pattern="[0-9]*"
                          value={productWeight}
                          required
                          onChange={(e) => setProductWeight(e.target.value)}
                        />
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={weightUnit}
                          required
                          onChange={(e) => setWeightUnit(e.target.value)}
                        >
                          <option value="">Select Unit</option>
                          <option value="KG">KG</option>
                          <option value="Gram">Gram</option>
                          <option value="MG">MG</option>
                          <option value="LB">LB</option>
                          <option value="OZ">OZ</option>
                          <option value="ML">ML</option>
                        </select>
                      </div>
                    </div>


                    <div className="mb-1">
                      <label className="col-span-1 text-left font-dm font-medium text-base text-gray-900">Brand*:</label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        value={brand}
                        required
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-end">
                      <div className="mb-1 flex flex-col items-end gap-5">
                        <label
                          htmlFor="ProductImage"
                          className="h-24 w-24 bg-gray-100 p-5 flex justify-center items-center rounded-lg relative cursor-pointer border border-dashed border-gray-200 hover:bg-gray-200"
                        >
                          <img
                            src="images.png"
                            alt="Default"
                            className="mix-blend-multiply"
                            style={{ maxWidth: '80%', maxHeight: '80%', opacity: '0.7' }}
                          />
                          <div className="bg-gray-400 absolute -bottom-2 right-0 w-8 h-8 flex justify-center items-center rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-camera"
                            >
                              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                          </div>
                          <input
                            key={inputKey}
                            className="hidden"
                            type="file"
                            multiple
                            id="ProductImage"
                            name="productImages"
                            onChange={handleImageChange}
                          />
                        </label>

                        <div className="flex flex-wrap mt-4 space-x-4">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative h-24 w-24 mb-4">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-cover rounded-lg shadow"
                              />
                              <button
                                className="absolute top-0 right-0 bg-red-700 text-white rounded-full p-1 m-1"
                                onClick={() => removeImage(index)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          {productImagesPrev ?
                            <LightGallery
                              speed={500}
                              className="grid grid-cols-4"
                            > {productImagesPrev.map((item, index) => {
                              const modifiedItem = item.replace(/^\//, '');
                              return (
                                <a key={index} className="w-[350px] rounded-lg overflow-hidden block" href={`${DOC_URL}${modifiedItem}`}>
                                  <img alt="img1" src={`${DOC_URL}${modifiedItem}`} />
                                </a>
                              )
                            })}
                            </LightGallery>
                            : <></>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-start mt-5">
              <div>
                {ProductCanEdit ?
                  <button onClick={EditProduct} className="rounded-lg bg-blue-500 px-5 py-2 text-left font-dm text-sm font-medium text-white">
                    Edit Product
                  </button> :
                  <button onClick={AddProduct} className="rounded-lg bg-blue-500 px-5 py-2 text-left font-dm text-sm font-medium text-white">
                    Add New Product
                  </button>
                }
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </>
  );
};

export default AnyOther;