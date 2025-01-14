import Navbar from "pages/Navbar";
import { useEffect, useState } from "react";
import { API_NEW_URL, X_API_Key } from "../config";
import { isSessionActive } from "utils/sessionUtils";
import { useNavigate, useLocation } from "react-router-dom";
import PopUp from '../components/PopUp/PopUp'
import ProductInvoicePopUp from '../components/PopUp/ProductInvoicePopUp'; // Ensure this import is correct
import "react-datepicker/dist/react-datepicker.css";

const AnyOther = () => {
  const Session = isSessionActive();
  const navigate = useNavigate();
  const location = useLocation();
  const { reference } = location.state || {};
  const [ProductList, setProductList] = useState([]);
  const [StockRegister, setStockRegister] = useState([]);
  const [sortedStockRegister, setSortedStockRegister] = useState([]);
  const [showPop, setShowPopUp] = useState(false);
  const [showInvoicePopUp, setShowInvoicePopUp] = useState(false); // State for ProductInvoicePopUp
  const [selectedData, setSelectedData] = useState({});
  const [selectedSku, setSelectedSku] = useState(null); // State to store selected SKU

  useEffect(() => {
    if (!Session) navigate("/login");
  }, [Session, navigate]);

  const getStockRegister = async () => {
    const apiUrl = `${API_NEW_URL}stock`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
      });

      const data = await response.json();
      if (data.status === true) {
        setStockRegister(data.stockRegisters);
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProducttoAdd = async () => {
    const apiUrl = `${API_NEW_URL}product/list?page=1&limit=100`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
      });

      const data = await response.json();
      if (data.status === true) {
        setProductList(data.products);
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducttoAdd();
    getStockRegister();
  }, []);

  const getUniqueDataBySku = (data) => {
    const uniqueData = new Map();
    data.forEach((item) => {
      if (!uniqueData.has(item.sku)) {
        uniqueData.set(item.sku, item);
      }
    });
    return Array.from(uniqueData.values());
  };

  useEffect(() => {
    if (StockRegister.length > 0) {
      const sortedData = getUniqueDataBySku([...StockRegister]).sort((a, b) => {
        const productNameA = FindSku(a.productId).name.toLowerCase();
        const productNameB = FindSku(b.productId).name.toLowerCase();
        return productNameA.localeCompare(productNameB);
      });

      setSortedStockRegister(sortedData);
    }
  }, [StockRegister]);

  const FindSku = (id) => {
    const foundItem = ProductList.find((item) => item._id === id);
    return foundItem ? foundItem : { name: "SKU not found" };
  };

  const [searchType, setSearchType] = useState('SKU');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterStockRegisters = () => {
    if (!searchQuery) {
      return sortedStockRegister;
    }

    const query = searchQuery.toLowerCase();
    return sortedStockRegister.filter((item) => {
      switch (searchType) {
        case 'SKU':
          return item.sku.toLowerCase() === query.trim();
        case 'Product Name':
          return (item.productId && ProductList
            ? FindSku(item.productId).name.toLowerCase().includes(query)
            : false
          );
        default:
          return true;
      }
    });
  };

  const filteredStockRegisters = filterStockRegisters();

  // Modify the handleOnclick function to differentiate between SKU and Product Name clicks
  const handleOnclick = (item, type) => {
    if (type === "SKU") {
      setSelectedSku(item.sku);  // Set the SKU when clicked
      setShowInvoicePopUp(true);  // Show the ProductInvoicePopUp modal
      setShowPopUp(false);  // Close any other modals
    } else if (type === "Product Name") {
      // Show the standard PopUp
      setSelectedData(item);
      setShowPopUp(true);
      setShowInvoicePopUp(false); // Hide ProductInvoicePopUp
    }
  };
  
  
  
  

  return (
    <>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          brandText={"Stock Register"}
        />
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="bg-[#3B82F6] h-full w-full mb-2 rounded-md flex items-center p-2">
                <div className="">
                  <select
                    value={searchType}
                    onChange={handleSearchTypeChange}
                    className="bg-white border border-gray-300 rounded-l-md px-2 py-1 text-sm text-gray-900"
                  >
                    <option value="SKU">SKU</option>
                    <option value="Product Name">Product Name</option>
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder={`Search by ${searchType}`}
                    className="flex-1 bg-white border border-gray-300 rounded-r-md px-2 py-1 text-sm text-gray-900"
                  />
                </div>
              </div>
              {filteredStockRegisters.length === 0 ? (
                <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    No Data Found
                  </span>
                </div>
              ) : (
                <div className="ring-black overflow-hidden shadow ring-1 ring-opacity-5 sm:rounded-lg">
                  <div className="h-[75vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Product Name
                          </th>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            SKU
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Total Quantity In
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Total Quantity Out
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Running Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStockRegisters.map((item) => {
                          // Calculate total running balance for the current item (based on SKU)
                          const runningBalance = StockRegister.filter((stock) => stock.sku === item.sku)
                            .reduce((acc, stockItem) => acc + (stockItem.runningBalance || 0), 0);

                          const runningBalanceStyle = runningBalance < 100 ? { color: 'red' } : {};

                          return (
                            <tr key={item._id}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                <span className="hover:underline cursor-pointer hover:text-[#3B82F6]" onClick={() => {
                                  handleOnclick(item, "Product Name");
                                }}>
                                  {item.productId && ProductList
                                    ? FindSku(item.productId).name
                                    : "SKU not found"}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 cursor-pointer">
                                <span className="hover:underline hover:text-[#3B82F6]" onClick={() => {
                                  handleOnclick(item, "SKU");
                                }}>
                                  {item.sku}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {StockRegister.filter((stock) => stock.sku === item.sku).reduce((acc, item) => acc + item.totalQuantityIn, 0)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {StockRegister.filter((stock) => stock.sku === item.sku).reduce((acc, item) => acc + item.totalQuantityOut, 0)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                <span style={runningBalanceStyle}>{runningBalance}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional rendering of PopUp and ProductInvoicePopUp */}
      {showPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <PopUp item={selectedData} setShowPop={setShowPopUp} />
        </div>
      )}

{showInvoicePopUp && selectedSku && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <ProductInvoicePopUp sku={selectedSku} setShowPop={setShowInvoicePopUp} />
  </div>
)}
    </>
  );
};

export default AnyOther;
