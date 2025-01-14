import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { API_NEW_URL, X_API_Key } from "../../config";

const ProductInvoicePopUp = ({ sku, productId, productName, setShowPop }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle API call
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(`${API_NEW_URL}product-invoice/invoices-by-product?productId=${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });

        console.log("API Response:", response);
        const data = await response.json();
        if (data.status === true || response.ok) {
          setInvoiceData(data.invoiceGoods); // Assuming the response has `invoiceGoods` key
        } else {
          setError(data.message || "Failed to fetch invoice data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchInvoiceData();
    }
  }, [productId]); // Re-run this effect if productId changes

  // Handle the modal close
  const handleClose = () => {
    setShowPop(false);
  };

  if (loading) {
    return (
      <div className="mx-10 h-[90vh] w-full rounded-lg bg-white p-10">
        <div className="flex w-full justify-end">
          <button
            onClick={handleClose}
            className="text-2xl text-red-500 hover:text-red-700"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="mx-auto h-full p-5">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-10 h-[90vh] w-full rounded-lg bg-white p-10">
        <div className="flex w-full justify-end">
          <button
            onClick={handleClose}
            className="text-2xl text-red-500 hover:text-red-700"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="mx-auto h-full p-5">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-10 h-[90vh] w-full rounded-lg bg-white p-10">
      <div className="flex w-full justify-end">
        <button
          onClick={handleClose}
          className="text-2xl text-red-500 hover:text-red-700"
        >
          <IoMdClose />
        </button>
      </div>
      <div className="mx-auto h-full p-5">
        <div className="col-span-2 h-full w-full xl:col-span-2 2xl:col-span-2">
          <div className="flex items-center justify-between rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white">
            <div className="flex items-center">
              <span>Invoice Details for Product : {productName}</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="text-lg mb-3">
              Total Product Unit Count:{" "}
              {invoiceData.reduce((acc, invoice) => acc + (invoice.totalUnitQuantity || 0), 0)}
            </div>
            {invoiceData.length > 0 ? (
              <div className="rounded-lg bg-white p-4 shadow-3xl shadow-shadow-500">
                <div className="relative h-[60vh] overflow-y-auto">
                  <table className="w-full table-auto">
                    <thead className="sticky top-0 rounded-lg bg-white text-white">
                      <tr>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Product Description
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Packing Style
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Unit Price
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Total Quantity
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Total Value
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Batch
                        </th>
                        <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.map((invoice, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.productDescription}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.packingStyle}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.unitPrice}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.totalUnitQuantity}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.value}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.batch}
                          </td>
                          <td className="p-3 text-left font-dm text-sm text-gray-900">
                            {invoice.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 mt-3">
                No Invoice Goods Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInvoicePopUp;
