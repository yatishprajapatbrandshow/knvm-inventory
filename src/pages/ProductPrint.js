import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { API_NEW_URL, X_API_Key } from "../config";

import Logo from "../assets/img/medhouse.png";
import BG from "../assets/img/bg.png";

const ProductPrint = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { data } = location.state || {}; // Assuming data contains products
  const [products, setproducts] = useState([]);
  const [productCount, setProductCount] = useState(products.length);

  useEffect(() => {
    if (data) {
      console.log(data);
      setproducts(data.products);
      setProductCount(data.products.length);
    }
  }, [data]);

  useEffect(() => {
    if (productCount) {
      const newProducts = data.products.slice(0, productCount);
      setproducts(newProducts);
    } else {
      setproducts(data.products);
    }
  }, [productCount]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const formateDate = (value) => {
    const dateObject = new Date(value);
    let formattedDate =
      String(dateObject.getDate()).padStart(2, "0") +
      "-" +
      String(dateObject.getMonth() + 1).padStart(2, "0") +
      "-" +
      dateObject.getFullYear() +
      " : " +
      String(dateObject.getHours()).padStart(2, "0") +
      ":" +
      String(dateObject.getMinutes()).padStart(2, "0");

    return formattedDate;
  };

  return (
    <>
      {data ? (
        <div
          style={{ backgroundImage: `url(${BG})` }}
          ref={componentRef}
          className="mx-auto p-10 min-h-screen max-w-4xl bg-white bg-center bg-repeat bg-16"
        >
          <div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="notPrint mb-5 border-transparent inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect width="12" height="8" x="6" y="14"></rect>
                </svg>
                Print
              </button>
              <div className="flex w-max h-full justify-center items-center gap-2 notPrint ">
                <label className="text-sm font-medium text-gray-700 mb-1">Products To Print</label>
                <input
                  type="number"
                  className="w-20 px-3 h-10  border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                  min={1}
                  max={data.products.length}
                  value={productCount}
                  onChange={(e) => {

                    if (e.target.value > data.products.length) {
                      alert("Max Product Should Be : " + data.products.length);
                      setProductCount(data.products.length);
                      return;
                    } else {
                      setProductCount(e.target.value);
                    }
                  }}
                />
                <p className="text-sm font-medium text-gray-700 mb-1 notprint ">Max Should Be : {data.products.length}</p>
              </div>

            </div>
            <div className="grid grid-cols-2">
              <img src={Logo} width={250} alt="Logo" />
              <div className="flex flex-col items-end justify-end">
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  +233-504615240{" "}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone" >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </p>
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  www.medhousepharma.com{" "}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe" >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </p>
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  info@medhousepharma.com{" "}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </p>
              </div>
            </div>
            <div className="mt-7 mb-5 grid grid-cols-2 bg-blue-500 p-2.5  ">
              <p className="leading-2 text-2xl font-bold text-white">
                {data.ChallanName}
              </p>
              <p className="min-w-[80px] dark:text-neutral-500 text-white text-right"><b>Date: {formateDate(Date.now())}</b> </p>
            </div>
          </div>
          <div className=" text-sm flex  gap-2  justify-between  ">
            <div>
              <label className="min-w-[80px] dark:text-neutral-500 text-gray-800 font-bold">Company Details </label>
              <div>
                <address className="not-italic font-normal">
                  MED HOUSE PHARMACEUTICAL LTD<br />
                  FOKAL HOUSE NO 3(FIRST FLOOR) OFFICIAL STREET.<br />
                  ADABRAKA, ACCRA GHANA<br /> 
                  CONTACT NO: +233-504615240, +233-536504886<br />
                </address>
              </div>
            </div>
            <div className="flex items-start flex-col w-1/4">
              <label className="min-w-[80px] dark:text-neutral-500 text-gray-800 font-bold">Products Details </label>
              <div>
                Total Products : {products.length}
              </div>
            </div>
          </div>

          <div >
            {products.length ? (
              <div className="mt-5 h-full rounded-[20px]  p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none border-[1px] border-gray-100">
                <table className="w-full table-auto overflow-hidden">
                  <thead className="border-b-[1px]  border-gray-100 ">
                    <tr>
                      <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Name</th>
                      {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Description</th> */}
                      <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Brand</th>
                      {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Category</th> */}
                      {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Price</th> */}
                      <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">SKU</th>
                      <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Barcode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(products)
                    }
                    {products.map((product) => (
                      <tr key={product._id}>

                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                          {product.name}
                        </td>
                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.description}
                                        </td> */}
                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                          {product.brand}
                        </td>
                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.category}
                                        </td> */}
                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.defaultPrice}
                                        </td> */}
                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900  ">
                          {product.sku}
                        </td>
                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm font-normal text-gray-900 libre-barcode-39-text-regular  text-2xl">
                          {product.sku}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="  ">

              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductPrint;
