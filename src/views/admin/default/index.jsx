
import { MdBarChart, MdArrowForward } from "react-icons/md";
import { API_NEW_URL, X_API_Key, IMG_URL } from "config";
import { useNavigate } from 'react-router-dom';
import DefaultImage from "../../../assets/img/image-icon-600nw-211642900.webp";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";





const Dashboard = () => {
  const [ProductList, setProductList] = useState("")
  const navigate = useNavigate();

  const [ProductSearchText, setProductSearchText] = useState("")
  const [ProductSearchSKU, setProductSearchSKU] = useState("")

  const getProduct = async (name, type) => {
    let apiUrl;

    if (name || type) {
      if (type === "name") {
        apiUrl = `${API_NEW_URL}product/list?name=${name}&page=1&limit=200'`
      } else {
        apiUrl = `${API_NEW_URL}product/list?sku=${name}&page=1&limit=200'`
      }
    } else {
      apiUrl = `${API_NEW_URL}product/list?name=&page=1&limit=200'`
    }

    console.log(apiUrl)
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': X_API_Key
        }
      });

      const data = await response.json();
      console.log(data);
      if (data.status === true) {
        setProductList(data.products)
      } else {
        if (!name) {
          alert("Something went wrong please try again")
        }
      }
    } catch (error) {
      console.log(error);


    }
  }
  useEffect(() => {
    getProduct();
  }, []);


  const NavigateFunc = async () => {
    navigate('/admin/products/add');
  }

  return (
    <div>
      <div className="mt-0 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        {/* <button
        onClick={NavigateFunc}
        className="bg-white flex gap-4 justify-center items-center p-5 rounded-xl shadow-sm cursor-pointer
        dark:!bg-navy-800 dark:text-white dark:shadow-none">
        Add Product
        <span className="aspect-square rounded-full cursor-pointer bg-lightPrimary p-3 dark:bg-navy-700">
          <MdArrowForward className="text-brand-500 dark:text-white" />
        </span>
      </button> */}
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white divide-x divide-y divide-gray-100 p-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex gap-10">
          <div className="w-96 mb-2.5 relative ">
            <label htmlFor="ProductName"
              className="text-left text-sm font-medium text-gray-900"
            > Search Product by SKU </label>
            <div className="relative">
              <input
                id="ProductName"
                name="ProductName"
                type="text"
                value={ProductSearchSKU}
                placeholder="e.g. 596895646"
                onChange={(e) => {
                  setProductSearchSKU(e.target.value);
                  getProduct(e.target.value, "sku");
                }}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {ProductSearchSKU ?
                <button onClick={() => {
                  setProductSearchSKU("");
                  getProduct("");
                }} className="bg-red-500 absolute top-0 right-0 h-full w-10 outline-none flex justify-center items-center  text-sm text-white"><IoMdClose /></button>
                : <></>}
            </div>
          </div>
          <div className="w-96 mb-2.5 relative">
            <label htmlFor="ProductName"
              className="text-left text-sm font-medium text-gray-900"
            > Search Product by Name</label>
            <div className="relative">
              <input
                id="ProductName"
                name="ProductName"
                type="text"
                value={ProductSearchText}
                placeholder="e.g. MEDICON Tablets"
                onChange={(e) => {
                  setProductSearchText(e.target.value);
                  getProduct(e.target.value, "name");
                }}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {ProductSearchText ?
                <button onClick={() => {
                  setProductSearchText("");
                  getProduct("");
                }} className="bg-red-500 absolute top-0 right-0 h-full w-10 outline-none flex justify-center items-center  text-sm text-white"><IoMdClose /></button>
                : <></>}
            </div>
          </div>
          <p className="font-bold text-gray-800">Total Product: {ProductList.length}</p>
        </div>
        {
          ProductList ?
            ProductList.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate("/admin/products/add", { state: { data: item } })}
                className="bg-white grid grid-cols-4 gap-2 p-2 cursor-pointer
          dark:!bg-navy-800 dark:text-white dark:shadow-none">
                {item.productImages && item.productImages.length > 0 ? (
                  <div className="col-span-1 aspect-square bg-gray-200 rounded-lg">
                    <img
                      src={IMG_URL + item.productImages[0]}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="col-span-1 aspect-square bg-gray-200 rounded-lg">
                    <img src={DefaultImage} alt="" />
                  </div>
                )}
                <div className="col-span-3">
                  <p className="font-dm text-xs text-left font-bold text-gray-900">{item.name}</p>
                  <p className="font-dm text-xs text-left font-normal text-gray-700">Price: {item.defaultPrice}</p>
                  <p className="font-dm text-xs text-left font-normal text-gray-700">Brand: {item.brand}</p>
                  <p className="font-dm text-xs text-left font-normal text-gray-700">SKU: {item.sku}</p>
                </div>
              </button>
            ))
            : <>
              <div role="status">
                <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </>
        }
      </div>

    </div>
  );
};

export default Dashboard;
