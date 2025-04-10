import Navbar from "pages/Navbar";
import { useEffect, useState, useRef } from "react";
import { API_NEW_URL, X_API_Key } from "../config";
import { isSessionActive } from "utils/sessionUtils";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";

function generateRandomId() {
  return uuidv4().replace(/-/g, "").slice(0, 20);
}
const AddCategory = [
  { name: "Operations" },
  { name: "Additional Info" },
  { name: "Note" },
];

const AnyOther = () => {
  const Session = isSessionActive();
  const navigate = useNavigate();
  const location = useLocation();
  const { reference } = location.state || {};

  const componentRef = useRef();

  useEffect(() => {
    if (!Session) navigate("/login");
  }, []);

  const [Preview, setPreview] = useState(false);
  const [StockRegister, setStockRegister] = useState("InProcess");
  const [ErrorMessage, setErrorMessage] = useState(false);

  //   Form State
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [InvoiceDate, setInvoiceDate] = useState(new Date());
  const [TotalNoOfCarton, setTotalNoOfCarton] = useState(0);

  const [PaymentTerm, setPaymentTerm] = useState("");

  const [SearchCustomer, setSearchCustomer] = useState("");
  const [SearchedData, setSearchedData] = useState("");
  const [SelectedCustomer, setSelectedCustomer] = useState("");
  const [ProductCanAdd, setProductCanAdd] = useState(false);

  const [ProductName, setProductName] = useState("");
  const [ProductSKU, setProductSKU] = useState("");
  const [ProductList, setProductList] = useState("");
  const [SelectedProduct, setSelectedProduct] = useState([]);
  const [AddedProduct, setAddedProduct] = useState([]);
  const [Discount, setDiscount] = useState(0);
  const [TotalPrice, setTotalPrice] = useState("");
  const [Tax, setTax] = useState(0);
  const [CreatedInvoice, setCreatedInvoice] = useState(false);
  const [MapSingleProduct, setMapSingleProduct] = useState(0);
  const [InvoiceID, setInvoiceID] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [DeliveriesCreating, setDeliveriesCreating] = useState(false);
  const [TotalGroshValue, setTotalGroshValue] = useState("");
  const [CreatingInvoive, setCreatingInvoive] = useState(false);
  const [DeliveriesCreated, setDeliveriesCreated] = useState("");
  const [InvoiveCreated, setInvoiveCreated] = useState("");
  const [addedTransactions, setAddedTransactions] = useState("");
  const [totalAddedAmount, setTotalAddedAmount] = useState(0);
  const [isTrueForTwoSeconds, setIsTrueForTwoSeconds] = useState(false);
  const [isTrueForText, setIsTrueForText] = useState(false);
  const [lockInvoiceBtn, setLockInvoiceBtn] = useState(false);

  useEffect(() => {
    if (reference) {
      getCustomerAuto(reference.customer);
      setPaymentTerm(reference.paymentTerm);
      setTotalNoOfCarton(reference.totalNoOfCarton);
      setTotalPrice(reference.totalAmount);
      setTax(reference.tax);
      setDiscount(reference.discount);
      setInvoiceNumber(reference.invoiceNumber);
      setInvoiceDate(new Date(reference.invoiceDate));
      getMappedProduct(reference._id);
      setMapSingleProduct(true);
      setInvoiceID(reference._id);
      setCreatedInvoice(reference);
      setDeliveriesCreated(reference.delivery_id);
      setPreview(true);
      if (reference.status === "Approved") {
        setLockInvoiceBtn(true);
      }
    }
    getPaymentData();
  }, [reference]);

  useEffect(() => {
    if (addedTransactions) {
      let total = 0;
      addedTransactions.forEach((item) => {
        total += item.amount;
      });
      setTotalAddedAmount(total);
    }
  }, [addedTransactions]);

  const getPaymentData = async () => {

    const apiUrl = `${API_NEW_URL}payment/getByid`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify({
          invoiceId: reference?._id,
          customerId: reference?.customer,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === true) {

        if (data.paymentData.length > 0)
          console.log(data.paymentData);
        {
          setAddedTransactions(data.paymentData);
        }
        if (data.paymentData.length > 0) {
          setPreview(true);
        }
      } else {
        setAddedTransactions([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (SelectedProduct) {
      SelectedProduct.map((item) => {
        if (item.totalUnitQuantity && item.unitPrice) {
          const calculatedValue =
            parseFloat(item.totalUnitQuantity) * parseFloat(item.unitPrice) * (1 - (parseFloat(item.discount) || 0) / 100);
          item.valueOfGh = calculatedValue;
        } else {
          item.valueOfGh = 0;
        }
      });
    }
  }, [SelectedProduct]);

  useEffect(() => {
    const updateAddedProductValues = (products) => {
      products.forEach((item) => {
        if (item.totalUnitQuantity && item.unitPrice) {
          const calculatedValue =
            parseFloat(item.totalUnitQuantity) * parseFloat(item.unitPrice) * (1 - (parseFloat(item.discount) || 0) / 100);
          item.valueOfGh = calculatedValue;
        } else {
          item.valueOfGh = 0;
        }
      });
    };

    if (AddedProduct) {
      updateAddedProductValues(AddedProduct);
    }
  }, [AddedProduct]);


  const getCustomerAuto = async (value) => {
    const apiUrl = `${API_NEW_URL}customer/list`;
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
        if (data.customers) {
          data.customers.forEach((customer) => {
            if (customer._id === value) {
              setSelectedCustomer(customer);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMappedProduct = async (value) => {
    const apiUrl = `${API_NEW_URL}invoice-product-map/get?invoiceId=${value}&page=1&limit=15''`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
      });

      const data = await response.json();
      if (data.status == true) {
        setProductCanAdd(true);
        setAddedProduct(data.invoices);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStockRegister = async (sku, name) => {
    const apiUrl = `${API_NEW_URL}stock/all`;
    if (!sku && !name) {
      alert("Please provide either SKU or Name");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify({ sku, name }),
      });

      const data = await response.json();

      const filteredData = data.stockRegisters;

      if (data.status === true) {
        return filteredData;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CreateReceipt = async (status, deliveryId) => {
    setErrorMessage("");
    setCreatingInvoive(true);
    let errorBox = [];

    if (!SelectedCustomer) {
      errorBox.push("Billed to field is required.");
    }
    if (!InvoiceNumber) {
      errorBox.push("Invoice number field is required.");
    }
    if (!InvoiceDate) {
      errorBox.push("Date field is required.");
    }
    if (!TotalNoOfCarton || TotalNoOfCarton === "NaN") {
      errorBox.push("Total No Of Carton field is required.");
    }
    // if (!Discount || Discount === "NaN" || Discount === 0) {
    //   errorBox.push("Discount field is required.");
    // }
    // if (!Tax || Tax === "NaN" || Tax === 0) {
    //   errorBox.push("Tax field is required.");
    // }

    const allProducts = [...SelectedProduct, ...AddedProduct]; // Combine both arrays

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      errorBox.push("Please select at least one product.");
    } else {
      allProducts.forEach((product, index) => {
        let productNumber = index + 1; // Adjust product number based on index

        if (
          !product.packingStyle ||
          !product.noOfCarton ||
          !product.totalUnitQuantity ||
          !product.unitPrice
        ) {
          if (!product.packingStyle) {
            errorBox.push(
              `Please fill packingStyle field in Product number ${productNumber}.`
            );
          }
          if (!product.noOfCarton) {
            errorBox.push(
              `Please fill carton field in Product number ${productNumber}.`
            );
          }
          if (!product.totalUnitQuantity) {
            errorBox.push(
              `Please fill quantity field in Product number ${productNumber}.`
            );
          }
          if (!product.unitPrice) {
            errorBox.push(
              `Please fill UnitPrice field in Product number ${productNumber}.`
            );
          }
        }
      });
    }

    if (errorBox.length > 0) {
      setErrorMessage(errorBox);
      setCreatingInvoive(false);
      return;
    }

    const datas = {
      customer: SelectedCustomer._id,
      paymentTerm: PaymentTerm,
      totalNoOfCarton: TotalNoOfCarton,
      totalAmount: TotalPrice,
      discount: Discount,
      tax: Tax,
      invoiceDate: InvoiceDate.toString(),
      invoiceNumber: InvoiceNumber,
      status: status ? "Approved" : "Profarma",
      delivery_id: deliveryId ? deliveryId : "",
    };

    console.log(datas);

    const apiUrl = `${API_NEW_URL}invoice/add`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log("Add", data);
      if (data.status === true) {
        setCreatedInvoice(data.invoice);
        setInvoiceID(data.invoice._id);
        allProducts.map((item) => ProductInvoiceMap(item, data.invoice._id));
        alert(data.message);
      } else if (data.message === "Invoice already exists") {
        alert("This invoice number already exists");
        setCreatingInvoive(false);
      } else {
        alert("Something went wrong, please try again");
        setCreatingInvoive(false);
      }
    } catch (error) {
      console.log(error);
      setCreatingInvoive(false);
    }
  };

  const handleCreateDeliveries = async () => {
    setDeliveriesCreating(true);
    try {
      let errorBox = [];

      // Validate customer and invoice information
      if (!SelectedCustomer) {
        errorBox.push("Billed to field is required.");
      }
      if (!InvoiceNumber) {
        errorBox.push("Invoice number field is required.");
      }
      if (!InvoiceDate) {
        errorBox.push("Date field is required.");
      }
      if (!TotalNoOfCarton) {
        errorBox.push("Total No Of Carton field is required.");
      }
      // Normalize the keys in SelectedProduct and AddedProduct
      const normalizedSelectedProduct = SelectedProduct.map((product) => ({
        ...product,
        product_id: product._id, // Map `_id` to `product_id`
      }));

      const normalizedAddedProduct = AddedProduct.map((product) => ({
        ...product,
        product_id: product.product, // Map `product` to `product_id`
      }));

      // Merge the normalized arrays
      const allProducts = [...normalizedSelectedProduct, ...normalizedAddedProduct];

      // Validate products
      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        errorBox.push("Please select at least one product.");
      } else {
        // Validate each product in the combined array
        allProducts.forEach((product, index) => {
          if (
            !product.packingStyle ||
            !product.noOfCarton ||
            !product.totalUnitQuantity ||
            !product.unitPrice ||
            !product.batch
          ) {
            errorBox.push(
              `Please fill all fields in Product number ${index + 1}.`
            );
          }
        });
      }

      if (errorBox.length > 0) {
        setErrorMessage(errorBox);
        setDeliveriesCreating(false);
        setCreatingInvoive(false);
        return;
      }

      // Prepare data for delivery
      const deliveryData = {
        contact: "MED HOUSE PHARMACEUTICAL LTD",
        scheduledDate: InvoiceDate,
        sourceDocument: InvoiceNumber,
        companyDetails: {
          companyName: SelectedCustomer.companyName,
        },
      };
      const deliveryApiUrl = `${API_NEW_URL}delivery/add`;
      const deliveryResponse = await fetch(deliveryApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(deliveryData),
      });

      const deliveryResult = await deliveryResponse.json();
      if (deliveryResult.status === true) {
        setLockInvoiceBtn(true);
        setCreatedInvoice({ status: "Approved" });
        // Map products to delivery
        setDeliveriesCreated(deliveryResult.delivery);
        await Promise.all(
          allProducts.map(async (item) => {
            try {
              const productApiUrl = `${API_NEW_URL}delivery-product-map/add`;
              const productData = {
                product_id: item.product_id,
                delivery_id: deliveryResult.delivery._id,
                sku: item.sku,
                quantity: item.totalUnitQuantity,
                status: "true",
                batch: item.batch,
                price: item.unitPrice,
                totalPrice: item.totalUnitQuantity * item.unitPrice,
              };
              console.log(productData);
              const productResponse = await fetch(productApiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-API-Key": X_API_Key,
                },
                body: JSON.stringify(productData),
              });

              const productMapResult = await productResponse.json();

              if (productMapResult.success === true) {

                console.log("productMapResult");
                UpdateInvoive("Approved", deliveryResult.delivery._id);

                setCreatingInvoive(false);
              } else {
                alert("Something went wrong, please try again.");
                setDeliveriesCreating(false);
                setCreatingInvoive(false);
              }
            } catch (error) {
              console.error("Error in product mapping:", error);
              setDeliveriesCreating(false);
              setCreatingInvoive(false);
            }
          })
        );
      } else {
        alert(deliveryResult.message);
        setDeliveriesCreating(false);
        setCreatingInvoive(false);
      }
    } catch (error) {
      console.error("Error in delivery creation:", error);
      setDeliveriesCreating(false);
      setCreatingInvoive(false);
    }
  };

  const UpdateInvoive = async (status, deliveryId) => {
    console.log("hit")
    const datas = {
      invoiceId: CreatedInvoice._id,
      status: status,
      delivery_id: deliveryId,
    };

    const apiUrl = `${API_NEW_URL}invoice/update`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();

      if (data.status === true) {
        alert("Delivery Created Successfully.");
        setDeliveriesCreating(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ProductInvoiceMap = async (item, invoiceID) => {
    const datas = {
      product_id: item._id,
      invoice_id: invoiceID,
      productDescription: item.description,
      packingStyle: item.packingStyle,
      unitPrice: parseFloat(item.unitPrice),
      totalUnitQuantity: parseFloat(item.totalUnitQuantity),
      value: parseFloat(item.unitPrice) * parseFloat(item.totalUnitQuantity),
      sku: item.sku,
      type: item.type,
      noOfCarton: item.noOfCarton,
      batch: item.batch,
      discount: item.discount,
    };

    const apiUrl = `${API_NEW_URL}invoice-product-map/addedit`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === true) {
        alert(data.message);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SongleProductInvoiceMap = async (item, invoiceID) => {
    const datas = {
      product_id: AddedProduct[item].product,
      invoice_id: AddedProduct[item].invoice,
      productDescription: AddedProduct[item].productDescription,
      packingStyle: AddedProduct[item].packingStyle,
      unitPrice: parseFloat(AddedProduct[item].unitPrice),
      totalUnitQuantity: parseFloat(AddedProduct[item].totalUnitQuantity),
      value: parseFloat(AddedProduct[item].value),
      sku: AddedProduct[item].sku,
      status: "true",
      type: AddedProduct[item].type,
      noOfCarton: AddedProduct[item].noOfCarton,
      batch: AddedProduct[item].batch,
      discount: AddedProduct[item].discount,
    };

    console.log(datas);
    const apiUrl = `${API_NEW_URL}invoice-product-map/addedit`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      if (data.success === true) {
        UpdateProductMap(datas);
        alert(data.message);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SelectedProductInvoiceMap = async (item, invoiceID) => {
    const datas = {
      product_id: SelectedProduct[item]._id,
      invoice_id: InvoiceID,
      productDescription: SelectedProduct[item].description,
      packingStyle: SelectedProduct[item].packingStyle,
      unitPrice: parseFloat(SelectedProduct[item].unitPrice),
      totalUnitQuantity: parseFloat(SelectedProduct[item].totalUnitQuantity),
      value: parseFloat(SelectedProduct[item].valueOfGh),
      sku: SelectedProduct[item].sku,
      status: "true",
      type: SelectedProduct[item].type,
      noOfCarton: SelectedProduct[item].noOfCarton,
      batch: SelectedProduct[item].batch,
      discount: SelectedProduct[item].discount,
    };
    const apiUrl = `${API_NEW_URL}invoice-product-map/addedit`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log("Invoide Product maped : ", data);
      if (data.success === true) {
        UpdateProductMap(datas);
        alert(data.message);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const UpdateProductMap = async (ItemToMap) => {
    console.log("hit here");
    const productData = {
      product_id: ItemToMap.product_id,
      delivery_id: DeliveriesCreated,
      sku: ItemToMap.sku,
      quantity: ItemToMap.totalUnitQuantity,
      status: "true",
      batch: ItemToMap.batch,
      price: ItemToMap.unitPrice,
      totalPrice: ItemToMap.totalUnitQuantity * ItemToMap.unitPrice,
    };
    console.log(productData);
    try {
      const productApiUrl = `${API_NEW_URL}delivery-product-map/add`;
      const productResponse = await fetch(productApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(productData),
      });

      const PMData = await productResponse.json();
      console.log(PMData);
    } catch (error) {
      console.log(error);
    }
  };

  const SongleProductInvoiceMap_SecondType = async (item, invoiceID) => {
    const datas = {
      product_id: item._id,
      invoice_id: invoiceID,
      productDescription: item.description,
      packingStyle: item.packingStyle,
      unitPrice: parseFloat(item.price),
      totalUnitQuantity: parseFloat(item.quantity),
      value: parseFloat(item.price) * parseFloat(item.quantity),
      sku: item.sku,
      status: "true",
      type: item.type,
      noOfCarton: item.carton,
      discount: item.discount,
    };

    const apiUrl = `${API_NEW_URL}invoice-product-map/addedit`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      if (data.success === true) {
        setCreatedInvoice(data.invoice);
        alert(data.message);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateReceipt = async () => {

    const datas = {
      customer: SelectedCustomer._id,
      paymentTerm: PaymentTerm,
      totalNoOfCarton: parseFloat(TotalNoOfCarton),
      totalAmount: TotalPrice,
      discount: parseFloat(Discount),
      tax: Tax,
      invoiceDate: InvoiceDate.toString(),
      invoiceNumber: InvoiceNumber,
    };
    console.log(datas);
    const apiUrl = `${API_NEW_URL}invoice/edit/${InvoiceID}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log(data);
      if (data.status == true) {
        alert(data.message);
        navigate("/invoice/list");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomer = async (value) => {
    if (value.length < 3) return;
    setSelectedCustomer("");
    const apiUrl = `${API_NEW_URL}customer/list?name=${value}&page=1&limit=25'`;
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
        setSearchedData(data.customers);
      } else {
        alert("Something went wrong please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (name, sku) => {
    if (name) {
      if (name.length < 3) return;
    }
    if (sku) {
      if (sku.length < 3) return;
    }
    if (!sku && !name) {
      setProductList("");
      return;
    }
    const apiUrl = `${API_NEW_URL}product/list?name=${name}&sku=${sku}&page=1&limit=50'`;
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleProductSelect = async (value) => {
    const selectBatch = [];
    if (SelectedProduct) {
      SelectedProduct.map((item) => {
        selectBatch.push({ batch: item?.batch, sku: item?.sku }); // Include sku for better identification
      });
    }

    const addedBatch = [];
    if (AddedProduct) {
      AddedProduct.map((item) => {
        addedBatch.push({ batch: item?.batch, sku: item?.sku }); // Include sku for better identification
      });
    }

    // Combine both selectBatch and addedBatch, ensuring uniqueness based on both batch and sku
    const batchNotToShow = [
      ...selectBatch.map(item => `${item.batch}-${item.sku}`),
      ...addedBatch.map(item => `${item.batch}-${item.sku}`)
    ];

    const filteredData = await getStockRegister(value.sku);
    if (!filteredData) {
      setIsTrueForTwoSeconds(value.sku);
      setIsTrueForText(value.sku);

      setTimeout(() => {
        setIsTrueForTwoSeconds(false);
      }, 500);

      return;
    }

    setFilteredData(filteredData);

    const batch = [];
    filteredData.map((item) => {
      batch.push({ batch: item.batch, sku: item.sku }); // Include sku for batch
    });

    // Filter batches based on both batch and sku
    const batchToShow = batch.filter(
      (item) => !batchNotToShow.includes(`${item.batch}-${item.sku}`)
    );

    // Set batch to show after filtering
    value.batchBundle = batchToShow.map(item => item.batch); // Only return the batch ids

    value.index = generateRandomId();

    setStockRegister(filteredData);

    setSelectedProduct((prevSave) => [...prevSave, value]);

    setProductList((prevProductList) =>
      prevProductList.filter((product) => value._id !== product._id)
    );
  };


  const FetchdProductStateUpdate = (toFind, value) => {
    const index = AddedProduct.findIndex((product) => product._id === toFind);

    if (index === -1) {
      console.log("Product not found");
      return;
    }

    // Update the specific product with the new value(s)
    const updatedProduct = { ...AddedProduct[index], ...value };

    // Calculate the Total Value GH if either totalUnitQuantity or unitPrice is updated
    if ("totalUnitQuantity" in value || "unitPrice" in value || "discount" in value) {
      const totalUnitQuantity =
        value.totalUnitQuantity ?? updatedProduct.totalUnitQuantity;
      const unitPrice = value.unitPrice ?? updatedProduct.unitPrice;
      updatedProduct.totalValueGh = totalUnitQuantity * unitPrice * (1 - (value.discount || 0) / 100);
    }

    // Update the AddedProduct array with the updated product
    const updatedProducts = [...AddedProduct];
    updatedProducts[index] = updatedProduct;

    // Set the updated array back to the state
    setAddedProduct(updatedProducts);

    // Recalculate and set the total value of Total Value GH
    const totalGroshValue = updatedProducts.reduce(
      (acc, product) => acc + (product.totalValueGh || 0),
      0
    );
    setTotalGroshValue(totalGroshValue);

    // Trigger a re-render immediately
    setTimeout(() => {
      setDummyState((prev) => !prev);
    }, 0);

    // Recalculate the total price
    CalCulateTotal(totalGroshValue);
  };

  const CalCulateTotal = (value) => {
    if (value) {
      // Convert discount and tax to numbers and handle percentage
      const discountPercentage = parseFloat(Discount || 0);
      const taxPercentage = parseFloat(Tax || 0);

      // Calculate the discount amount
      const discountAmount = (value * discountPercentage) / 100;

      // Calculate the amount after discount
      const amountAfterDiscount = value - discountAmount;

      // Calculate the tax amount based on the amount after discount
      const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

      // Calculate the new total price
      const newTotalPrice = amountAfterDiscount + taxAmount;

      // Round the total price to two decimal places
      const roundedTotalPrice = parseFloat(newTotalPrice.toFixed(3));

      // Set the final total price
      setTotalPrice(roundedTotalPrice);
    }

  };

  useEffect(() => {
    if (AddedProduct) {
      const totalAddedProductGroshValue = AddedProduct.reduce(
        (acc, product) => acc + product.valueOfGh,
        0
      );
      const totalSelectedProductGroshValue = SelectedProduct.reduce(
        (acc, product) => acc + product.valueOfGh,
        0
      );
      const totalGroshValue =
        totalAddedProductGroshValue + totalSelectedProductGroshValue;
      setTotalGroshValue(totalGroshValue);
    }
  }, [AddedProduct, SelectedProduct]);

  useEffect(() => {
    CalCulateTotal(TotalGroshValue);
  }, [Discount, Tax, TotalGroshValue]);

  const handlePrintNextPage = () => {
    if (!CreatedInvoice) {
      alert("Please create invoice before print invoice");
      return;
    }
    const DataToSend = {
      ChallanName: reference?.status === "Profarma" || !AddedProduct ? "Proforma Invoice" : "Invoice",
      InvoiceDate: InvoiceDate,
      Billedto: SelectedCustomer,
      InvoiceNumber: InvoiceNumber,
      TotalNoOfCarton: TotalNoOfCarton,
      PaymentTerm: PaymentTerm,
      SelectedProduct: SelectedProduct,
      AddedProduct: AddedProduct,
      TotalPrice: TotalPrice,
      Discount: Discount,
      TotalGroshValue: TotalGroshValue,
      Tax: Tax,
      totalAddedAmount: totalAddedAmount,
    };
    // if (!DataToSend.ChallanName || !DataToSend.InvoiceDate || !DataToSend.Billedto || !DataToSend.InvoiceNumber || !DataToSend.TotalNoOfCarton || !DataToSend.PaymentTerm || !DataToSend.SelectedProduct) {
    //   alert("Please check all fields are filled");
    //   return;
    // }
    navigate("/invoiceprint", { state: { data: DataToSend } });
  };

  const checkQuantity = (index, value) => {
    const product = SelectedProduct[index];
    // Check if Batch is not selected
    if (!product?.batch) {
      alert("Please select a batch before choosing a quantity.");
      product.totalUnitQuantity = "";
      return false; // Prevent quantity selection
    }

    const filterProduct = filteredData.filter(
      (item) => item.batch == product.batch
    )[0];

    if (filterProduct.availableStock < value.totalUnitQuantity) {
      alert(
        `There are only ${filterProduct.availableStock} items in the selected batch.`
      );
      product.totalUnitQuantity = "";
      return false;
    }
    return true;
  };

  const [DummyState, setDummyState] = useState("");

  const ProductStateUpdate = (toFind, value) => {
    console.log(toFind, value);
    console.log(SelectedProduct);

    const index = SelectedProduct.findIndex(
      (product) => product.index === toFind
    );

    if (index === -1) {
      return "Product not found";
    }

    if (value.totalUnitQuantity && !checkQuantity(index, value)) {
      return "Invalid quantity";
    }

    const updatedProduct = { ...SelectedProduct[index], ...value };

    // Calculate Total Value GH if either Total Unit Quantity or Unit Price is updated
    if ("totalUnitQuantity" in value || "unitPrice" in value || "discount" in value) {
      const totalUnitQuantity =
        value.totalUnitQuantity ?? updatedProduct.totalUnitQuantity;
      const unitPrice = value.unitPrice ?? updatedProduct.unitPrice;
      updatedProduct.totalValueGh = totalUnitQuantity * unitPrice * (1 - (value.discount || 0) / 100);
    }

    const updatedProducts = [...SelectedProduct];
    updatedProducts[index] = updatedProduct;
    setSelectedProduct(updatedProducts);

    // Calculate the total sum of Total Value GH for all products
    const totalGroshValue = updatedProducts.reduce(
      (acc, product) => acc + (product.totalValueGh || 0),
      0
    );

    // Set the total value using setTotalGroshValue
    setTotalGroshValue(totalGroshValue);

    // Trigger a re-render if necessary
    setTimeout(() => {
      setDummyState((prev) => !prev);
    }, 0);

    if ("totalUnitQuantity" in value || "unitPrice" in value) {
      CalCulateTotal(totalGroshValue);
    }

    return "Product updated successfully";
  };

  // Changes
  useEffect(() => {
    let totalNumberOfCartons = 0;

    if (SelectedProduct && SelectedProduct.length > 0) {
      totalNumberOfCartons += SelectedProduct.reduce((total, item) => {
        const parsedNoOfCarton = parseFloat(item.noOfCarton, 10);
        return total + (isNaN(parsedNoOfCarton) ? 0 : parsedNoOfCarton);
      }, 0);
    }

    if (AddedProduct && AddedProduct.length > 0) {
      totalNumberOfCartons += AddedProduct.reduce((total, item) => {
        const parsedNoOfCarton = parseFloat(item.noOfCarton, 10);
        return total + (isNaN(parsedNoOfCarton) ? 0 : parsedNoOfCarton);
      }, 0);
    }

    setTotalNoOfCarton(totalNumberOfCartons);
  }, [SelectedProduct, AddedProduct]);

  const removeProduct = async (item, status) => {
    setTotalPrice(TotalPrice - item?.valueOfGh);
    if (status == "Draft") {
      const updatedProducts = SelectedProduct.filter((product) => product.index !== item.index);
      setSelectedProduct(updatedProducts);
      setProductList((prevProductList) => [...prevProductList, item]);
    } else {
      const updatedProducts = AddedProduct.filter((product) => product.index !== item.index);
      setAddedProduct(updatedProducts);
      const apiUrl = `${API_NEW_URL}invoice-product-map/delete`;
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
          body: JSON.stringify({
            _id: item._id,
            status: "false",
          }),
        });

        const data = await response.json();
        if (data.success === true) {
          if (status == "Profarma") {
            alert(data.message);
          } else if (status == "Approved") {
            // delivery-product-map/delete 
            const apiUrl = `${API_NEW_URL}delivery-product-map/delete`;
            try {
              const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-API-Key": X_API_Key,
                },
                body: JSON.stringify({
                  product_id: item.product,
                  delivery_id: reference.delivery_id,
                  batch: item.batch
                }),
              });

              const data = await response.json();
              if (data.status === true) {
                alert(data.message);
              } else {
                console.log(data.message);
              }
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleVoidInvoice = async () => {
    console.log(CreatedInvoice);

    if (!CreatedInvoice && !reference) {
      alert("Please create invoice before voiding invoice");
      return;
    }
    const datas = {}

    if (reference) {
      datas.invoiceId = reference._id;
      datas.status = reference.status;
      datas.delivery_id = reference.delivery_id;
    } else {
      datas.invoiceId = CreatedInvoice._id;
      datas.status = CreatedInvoice.status;
      datas.delivery_id = DeliveriesCreated._id;
    }

    console.log(datas);


    const apiUrl = `${API_NEW_URL}invoice/updatestatus`;
    // console.log(datas);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === true) {
        alert(data.message);
        navigate("/invoice/list");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLockInvoice = async () => {
    if (CreatedInvoice.lockInvoice === true && reference.lockInvoice === true) {
      alert("Invoice already locked");
      return;
    }
    if (!CreatedInvoice && !reference) {
      alert("Please create invoice before voiding invoice");
      return;
    }
    const datas = {}

    if (reference) {
      datas.invoiceId = reference._id;
    } else {
      datas.invoiceId = CreatedInvoice._id;
    }


    const apiUrl = `${API_NEW_URL}invoice/lock`;
    // console.log(datas);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      setCreatedInvoice(data.invoice);
      if (data.status === true) {
        alert(data.message);
        navigate("/invoice/list");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  


  return (
    <>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          // reference?.status === "Profarma" ? "Profarma Invoice" : "Invoice"
          brandText={
            !reference && !CreatedInvoice ? "Draft Invoice" : reference?.status === "Profarma" || CreatedInvoice.status === "Profarma" ? "Proforma Invoice" : "Invoice"
          }
        />
        <div>
          <div ref={componentRef}>
            <div className="notPrint mx-auto mt-5 flex max-w-[85rem] justify-end gap-2.5 rounded-lg bg-white p-4">
              {
                lockInvoiceBtn ? (<button
                  onClick={() => handleLockInvoice()}
                  className={`bg-red-400  text-white flex gap-2.5 px-5 py-2 border rounded-lg text-sm`}>
                  {CreatedInvoice.lockInvoice === true && reference.lockInvoice === true ? "Locked Invoice" : "Lock Invoice"}
                </button>) : null
              }
              {
                CreatedInvoice && CreatedInvoice.status != "Void" && CreatedInvoice.lockInvoice != true || reference && reference.status != "Void" && reference?.lockInvoice != true ? (<button
                  onClick={() => handleVoidInvoice()}
                  className={`bg-yellow-400  text-gray-800 flex gap-2.5 px-5 py-2 border rounded-lg text-sm`}>
                  Void
                </button>) : null
              }
              {
                CreatedInvoice && CreatedInvoice.status == "Void" || reference && reference.status == "Void" ? (<p className=" text-center font-bold text-xl p-2 text-white bg-green-400 rounded-md w-full">Invoice Voided</p>) : null
              }
              {CreatedInvoice.status !== "Void" || reference && reference.status !== "Void" && addedTransactions.length <= 0 ? (
                <button
                  onClick={() => setPreview(true)}
                  className={`${Preview
                    ? "bg-blue-600 text-white "
                    : "bg-white text-gray-800"
                    } flex items-center justify-center gap-2.5 rounded-lg border border-gray-300 px-2.5 py-2 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Preview Mode
                </button>
              ) : null}
              {CreatedInvoice.status !== "Void" && CreatedInvoice.lockInvoice != true || reference && reference.status !== "Void" && reference?.lockInvoice != true && addedTransactions.length <= 0 ? (
                <button
                  onClick={() => setPreview(false)}
                  className={`${!Preview
                    ? "bg-blue-600 text-white "
                    : "bg-white text-gray-800"
                    } flex items-center justify-center gap-2.5 rounded-lg border border-gray-300 px-2.5 py-2 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  Edit Mode
                </button>
              ) : null}
              {
                CreatedInvoice.status !== "Void" || reference && reference.status !== "Void" ? (<button
                  onClick={handlePrintNextPage}
                  className="border-transparent inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
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
                </button>) : null}

            </div>
            <div className="mx-auto mt-5 max-w-[85rem] rounded-lg bg-white sm:p-6 lg:p-8">
              <div className="dark:border-neutral-700 mb-5 flex items-center justify-between border-b border-gray-200 pb-5">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <div>
                    <p className="text-xl font-bold leading-5 text-gray-800">
                      Medhouse Pharma{" "}
                      <span className="block font-normal">
                        Inventory Management System
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  {ErrorMessage ? (
                    <>
                      <div className="gap mb-5 flex flex-col rounded-lg border border-red-200 bg-red-100 p-4">
                        {ErrorMessage.map((item, index) => (
                          <p
                            key={index}
                            className="text-left font-dm text-sm font-medium text-red-500"
                          >
                            ({index + 1}) {item}
                          </p>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <div className="grid space-y-1">
                    <dl className="grid gap-x-3 text-sm sm:flex ">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Billed to:
                      </label>
                      <div>
                        {!Preview ? (
                          <input
                            className={`mb-2 block w-full flex-1 rounded-lg border border-gray-300 bg-gray-50
                            p-2.5 text-sm text-gray-900`}
                            type="text"
                            value={SearchCustomer}
                            onChange={(e) => {
                              setSearchCustomer(e.target.value);
                              getCustomer(e.target.value);
                            }}
                          />
                        ) : null}
                        {SelectedCustomer ? (
                          <div>
                            <address className="font-normal not-italic">
                              {SelectedCustomer.companyName}
                              <br />
                              {SelectedCustomer.name}
                              <br />
                              {SelectedCustomer.email}
                              <br />
                              {SelectedCustomer.phone}
                              <br />
                              {SelectedCustomer.address.street},{" "}
                              {SelectedCustomer.address.city},{" "}
                              {SelectedCustomer.address.state}
                              <br />
                              {SelectedCustomer.address.zip}
                              <br />
                            </address>
                          </div>
                        ) : (
                          <div>
                            {SearchedData ? (
                              <>
                                {SearchedData.map((item, index) => (
                                  <button
                                    onClick={() => setSelectedCustomer(item)}
                                    className="border border-blue-200 bg-blue-50 p-2.5 text-left"
                                  >
                                    <p className="font-bold text-gray-800">
                                      {item.companyName}
                                    </p>
                                    <p className="text-gray-700">{item.name}</p>
                                    <p className="text-gray-700">
                                      {item.email}
                                    </p>
                                    <p className="mt-2 bg-blue-500 p-2.5 py-1 text-center text-white">
                                      Select
                                    </p>
                                  </button>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        )}
                      </div>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex ">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        From:
                      </label>
                      <div>
                        <address className="font-normal not-italic">
                          MED HOUSE PHARMACEUTICAL LTD
                          <br />
                          FOKAL HOUSE NO 3(FIRST FLOOR) OFFICIAL STREET.
                          <br />
                          ADABRAKA, ACCRA GHANA
                          <br />
                          CONTACT NO: +233-504615240, +233-536504886
                          <br />
                        </address>
                      </div>
                    </dl>
                  </div>
                </div>
                <div>
                  <div className="grid space-y-1">
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Invoice number:
                      </label>
                      <input
                        className={`${Preview
                          ? "outline-none focus:border-0"
                          : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                          }  block w-full flex-1
                        text-sm text-gray-900`}
                        type="text"
                        value={InvoiceNumber}
                        pattern="[0-9]*"
                        required
                        readOnly={Preview}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                      />
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Date:
                      </label>
                      <DatePicker
                        className={`${Preview
                          ? "outline-none focus:border-0"
                          : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                          }  block w-full flex-1
                        text-sm text-gray-900`}
                        selected={InvoiceDate}
                        disabled={Preview}
                        dateFormat="dd-MM-yyyy"
                        onChange={(date) => setInvoiceDate(date)}
                      />
                    </dl>

                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Payment Terms:
                      </label>

                      <div className="relative">
                        {/* Input Field with Datalist for Suggestions */}
                        <input
                          list="payment-terms" // Reference to the datalist id
                          className={`${Preview
                              ? "outline-none focus:border-0"
                              : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                            } block w-full flex-1 text-sm text-gray-900`}
                          type="text"
                          value={PaymentTerm}
                          required
                          readOnly={Preview}
                          onChange={(e) => setPaymentTerm(e.target.value)}
                          placeholder="Enter Payment Term"
                        />

                        {/* Datalist with default options */}
                        <datalist id="payment-terms">
                          <option value="CASH / MOMO / CHEQUE ON DELIVERY / PDC CHEQUE" />
                          <option value="CASH" />
                          <option value="MOMO" />
                          <option value="CHEQUE ON DELIVERY" />
                          <option value="PDC CHEQUE" />
                        </datalist>
                      </div>
                    </dl>

                    <dl className="grid gap-x-3 text-sm sm:flex pb-4 pt-2">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Total No Of Carton :
                      </label>
                      <input
                        className={`outline-none focus:border-0"
                            
                          }  block w-full flex-1
                        text-sm text-gray-900`}
                        type="number"
                        value={TotalNoOfCarton ? TotalNoOfCarton : 0}
                        pattern="[0-9]*"
                        required
                        readOnly
                        onChange={(e) =>
                          setTotalNoOfCarton(parseFloat(e.target.value))
                        }
                      />
                    </dl>
                    {/* <p className="font-lg font-bold text-gray-800">
                      {" "}
                      Bank Details 1:{" "}
                    </p>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Account Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        {" "}
                        MED HOUSE PHARMACEUTICAL LTD{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Bank Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        ZENITH BANK (GHANA) LIMITED{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Branch Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800"> HEAD OFFICE</p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Bank Address:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        {" "}
                        ENITH HEIGHTS, NO. 37 INDEPENDENCE AVENUE, ACCRE, GHANA{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        A/C No:{" "}
                      </p>
                      <p className="text-sm text-gray-800">6110106240</p>
                    </dl> */}
                    <p className="font-lg font-bold text-gray-800">
                      {" "}
                      Bank Details 1:{" "}
                    </p>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Account Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        {" "}
                        MED HOUSE PHARMACEUTICAL LTD{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Bank Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        ZENITH BANK (GHANA) LIMITED{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Branch Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800"> HEAD OFFICE</p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Bank Address:{" "}
                      </p>
                      <p className="text-sm text-gray-800">
                        {" "}
                        ZENITH HEIGHTS, NO. 37 INDEPENDENCE AVENUE, ACCRA, GHANA{" "}
                      </p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        A/C No:{" "}
                      </p>
                      <p className="text-sm text-gray-800">6110106240</p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Merchant Name:{" "}
                      </p>
                      <p className="text-sm text-gray-800">MED HOUSE PHARMACEUTICAL LTD</p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Mtn Momo Number:{" "}
                      </p>
                      <p className="text-sm text-gray-800">0530446851</p>
                    </dl>
                    <dl className="grid gap-x-3 text-sm sm:flex">
                      <p className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        {" "}
                        Mtn Momo Id:{" "}
                      </p>
                      <p className="text-sm text-gray-800">418267</p>
                    </dl>
                  </div>
                </div>
              </div>
              {!Preview ? (
                <>
                  <div className="mt-5 flex gap-10">
                    <div className="flex flex-col gap-3 text-sm">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
                        Search Product By SKU:
                      </label>
                      <input
                        className="block w-full flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                        type="text"
                        value={ProductSKU}
                        pattern="[0-9]*"
                        required
                        readOnly={Preview}
                        onChange={(e) => {
                          setProductSKU(e.target.value);
                          getProduct("", e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <label className="dark:text-neutral-500 min-w-[120px] text-gray-600 ">
                        Search Product By Name:
                      </label>
                      <input
                        className="block w-full flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                        type="text"
                        value={ProductName}
                        pattern="[0-9]*"
                        required
                        readOnly={Preview}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          getProduct(e.target.value, "");
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {ProductList ? (
                <>
                  <div className="mt-5 flex flex-wrap gap-1">
                    {ProductList.map((item, index) => (
                      <div>
                        <button
                          key={index}
                          onClick={() => HandleProductSelect(item)}
                          className={`border border-blue-200 bg-blue-100 p-2.5 ${isTrueForTwoSeconds === item.sku ? "animate-shake" : ""}`}
                        >
                          <p className="text-[12px] text-gray-900">{item.name}</p>
                          <p className="text-[12px] text-gray-700">{item.sku}</p>
                        </button>
                        {isTrueForText === item.sku ?
                          <p className="text-xs text-red-500 mt-1">Product are not available in stock</p>
                          : null}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

<div className="dark:border-neutral-700 mt-6 space-y-4 rounded-lg border border-gray-200 p-4">
  <table className="w-full border-separate border-spacing-2">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Name
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          SKU
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Type
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Batch
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Expiry
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Pack Style
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          No Of Carton
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Total Unit Quantity
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Unit Price
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Discount (in %):
        </th>
        <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
          Total Value Gh
        </th>
        {!Preview && reference?.lockInvoice != true && MapSingleProduct ? (
          <th className="dark:text-neutral-500 text-xs font-medium uppercase text-gray-600">
            Actions
          </th>
        ) : null}
      </tr>
    </thead>
    <tbody>
      {console.log("Added Product", AddedProduct)}
      {AddedProduct &&
        AddedProduct.map((item, index) => (
          <tr key={index} className="border-t border-gray-200">
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.productDescription}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.sku}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.type}
            </td>
            {AddedProduct && (
              <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
                <input
                  className={`${Preview
                    ? "outline-none focus:border-0"
                    : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                    } block w-full flex-1 cursor-not-allowed border-none text-sm text-gray-900 outline-none placeholder:text-gray-800`}
                  type="text"
                  required
                  value={item.batch}
                  readOnly={true}
                />
              </td>
            )}
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
  <input
    className={`${Preview ? "outline-none focus:border-0" : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"} block w-full flex-1 cursor-not-allowed border-none text-sm text-gray-900 outline-none placeholder:text-gray-800`}
    type="text"
    required
    value={item.expiry ? item.expiry.split('T')[0] : ''}
    readOnly={true}
  />
</td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {Preview ? (
                <span className="text-sm text-gray-900">{item.packingStyle || "N/A"}</span>
              ) : (
                <select
                  className={`${Preview
                    ? "outline-none focus:border-0"
                    : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                    } block w-full flex-1 text-sm text-gray-900 placeholder:text-gray-800`}
                  required
                  value={item.packingStyle}
                  disabled={Preview}
                  onChange={(e) =>
                    FetchdProductStateUpdate(item._id, {
                      packingStyle: e.target.value,
                    })
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select pack style
                  </option>
                  <option value="Box">Box</option>
                  <option value="Cartons">Cartons</option>
                  <option value="Other">Other</option>
                </select>
              )}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900 placeholder:text-gray-800`}
                type="number"
                placeholder={item.noOfCarton}
                value={item.noOfCarton}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) =>
                  FetchdProductStateUpdate(item._id, {
                    noOfCarton: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900 placeholder:text-gray-800`}
                type="number"
                placeholder={item.totalUnitQuantity}
                value={item.totalUnitQuantity}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) =>
                  FetchdProductStateUpdate(item._id, {
                    totalUnitQuantity: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900 placeholder:text-gray-800`}
                type="number"
                placeholder={item.unitPrice}
                value={item.unitPrice}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) =>
                  FetchdProductStateUpdate(item._id, {
                    unitPrice: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900 placeholder:text-gray-800`}
                type="number"
                placeholder={item?.discount}
                value={item?.discount}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) =>
                  FetchdProductStateUpdate(item._id, {
                    discount: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {parseFloat(item.valueOfGh).toFixed(3)}
            </td>
            {!Preview && reference?.lockInvoice != true && MapSingleProduct && (
              <td className="dark:text-neutral-500 text-xs font-medium text-gray-800 flex gap-2">
                <button
                  className="rounded-lg bg-blue-600 p-2 text-white"
                  onClick={() =>
                    SongleProductInvoiceMap(index, InvoiceID)
                  }
                >
                  Apply
                </button>
                <button
                  className="rounded-lg bg-red-600 p-2 text-white"
                  onClick={() => removeProduct(item, reference?.status)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 7H18M10 11V17M14 11V17M5 7H19L18 19H6L5 7Z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="2"
                      y1="4"
                      x2="22"
                      y2="4"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="2"
                      y1="20"
                      x2="22"
                      y2="20"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </td>
            )}
          </tr>
        ))}
      {SelectedProduct &&
        SelectedProduct.map((item, index) => (
          <tr key={index} className="border-t border-gray-200">
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.name}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.sku}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.type}
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <select
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                required
                disabled={Preview}
                onChange={(e) =>
                  ProductStateUpdate(item.index, {
                    batch: e.target.value,
                  })
                }
              >
                <option value="">Select Batch</option>
                {item.batchBundle.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                type="text"
                value={item.expiry ? new Date(item.expiry).toLocaleDateString() : ''}
                readOnly={true}
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <select
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                required
                disabled={Preview}
                onChange={(e) =>
                  ProductStateUpdate(item.index, {
                    packingStyle: e.target.value,
                  })
                }
                defaultValue=""
              >
                <option value="" disabled>
                  Select pack style
                </option>
                <option value="Box">Box</option>
                <option value="Cartons">Cartons</option>
                <option value="Other">Other</option>
              </select>
            </td>

            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                type="number"
                pattern="[0-9]*"
                value={item.noOfCarton}
                required
                readOnly={Preview}
                onChange={(e) =>
                  ProductStateUpdate(item.index, {
                    noOfCarton: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                type="number"
                min={0}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                value={item?.totalUnitQuantity}
                onChange={(e) =>
                  ProductStateUpdate(item.index, {
                    totalUnitQuantity: e.target.value,
                  })
                }
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                type="number"
                min={0}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) => {
                  item.unitPrice = parseFloat(e.target.value);
                  ProductStateUpdate(item.index, {
                    unitPrice: e.target.value,
                  });
                }}
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              <input
                className={`${Preview
                  ? "outline-none focus:border-0"
                  : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                  } block w-full flex-1 text-sm text-gray-900`}
                type="number"
                min={0}
                pattern="[0-9]*"
                required
                readOnly={Preview}
                onChange={(e) => {
                  item.discount = parseFloat(e.target.value);
                  ProductStateUpdate(item.index, {
                    discount: e.target.value,
                  });
                }}
              />
            </td>
            <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
              {item.valueOfGh}
            </td>
            {!Preview && reference?.lockInvoice != true && MapSingleProduct ? (
              <td className="dark:text-neutral-500 text-xs font-medium text-gray-800 flex gap-2" >
                <button
                  className="rounded-lg bg-blue-600 p-2 text-white"
                  onClick={() =>
                    SelectedProductInvoiceMap(index, InvoiceID)
                  }
                >
                  Apply
                </button>
                <button
                  className="rounded-lg bg-red-600 p-2 text-white"
                  onClick={() => removeProduct(item, "Draft")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 7H18M10 11V17M14 11V17M5 7H19L18 19H6L5 7Z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="2"
                      y1="4"
                      x2="22"
                      y2="4"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="2"
                      y1="20"
                      x2="22"
                      y2="20"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </td>

            ) : null}
            {
              !reference && !CreatedInvoice && SelectedProduct ?
                <td className="dark:text-neutral-500 text-xs font-medium text-gray-800">
                  <button
                    className="rounded-lg bg-red-600 p-2 text-white"
                    onClick={() => removeProduct(item, "Draft")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 7H18M10 11V17M14 11V17M5 7H19L18 19H6L5 7Z"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="2"
                        y1="4"
                        x2="22"
                        y2="4"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="2"
                        y1="20"
                        x2="22"
                        y2="20"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </td>
                : null
            }

          </tr>
        ))}
    </tbody>
  </table>
</div>

              <div className={`relative mt-8 flex sm:justify-end`}>
                <div className="w-full max-w-2xl space-y-2 sm:text-end">
                  <div
                    className={`grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2`}
                  >
                    <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                      <dt className="dark:text-neutral-500 col-span-3 text-gray-600">
                        VALUE GH:
                      </dt>
                      <dd className="dark:text-neutral-200 col-span-2 font-medium text-gray-800">
                        <input
                          className={`${Preview
                            ? "text-right outline-none focus:outline-none"
                            : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                            } block w-full flex-1 text-sm text-gray-900`}
                          style={
                            Preview
                              ? { width: "auto", background: "transparent" }
                              : {}
                          }
                          type="text"
                          value={parseFloat(TotalGroshValue).toFixed(3)}
                          pattern="[0-9]*"
                          required
                          readOnly
                        />
                      </dd>
                    </dl>

                    <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                      <dt className="dark:text-neutral-500 col-span-3 text-gray-600">
                        Discount (in %):
                      </dt>
                      <dd className="dark:text-neutral-200 col-span-2 font-medium text-gray-800">
                        <input
                          className={`${Preview
                            ? "text-right outline-none focus:outline-none"
                            : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                            } block w-full flex-1 text-sm text-gray-900`}
                          style={
                            Preview
                              ? { width: "auto", background: "transparent" }
                              : {}
                          }
                          type="text"
                          value={Discount}
                          pattern="[0-9]*"
                          required
                          readOnly={Preview}
                          onChange={(e) => setDiscount(e.target.value)}
                        />
                      </dd>
                    </dl>

                    <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                      <dt className="dark:text-neutral-500 col-span-3 text-gray-600">
                        Tax:
                      </dt>
                      <dd className="dark:text-neutral-200 col-span-2 font-medium text-gray-800">
                        <input
                          className={`${Preview
                            ? "text-right outline-none focus:outline-none"
                            : "rounded-lg border border-gray-300 bg-gray-50 p-2.5"
                            } block w-full flex-1 text-sm text-gray-900`}
                          style={
                            Preview
                              ? { width: "auto", background: "transparent" }
                              : {}
                          }
                          type="text"
                          value={Tax}
                          pattern="[0-9]*"
                          required
                          readOnly={Preview}
                          onChange={(e) => setTax(e.target.value)}
                        />
                      </dd>
                    </dl>

                    <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                      <dt className="dark:text-neutral-500 col-span-3 text-gray-600">
                        Total Amount:
                      </dt>
                      <dd className="dark:text-neutral-200 col-span-2 text-left font-medium text-gray-800">
                        {TotalPrice ? <>{TotalPrice}</> : 0}
                      </dd>
                    </dl>
                    {reference &&
                      addedTransactions.length !== 0 &&
                      reference?.status !== "Profarma" ? (
                      <>
                        <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                          <dt className="dark:text-neutral-500 col-span-3 text-green-600">
                            Paid:
                          </dt>
                          <dd className="dark:text-neutral-200 col-span-2 text-left font-medium text-gray-800">
                            {totalAddedAmount ? <>{totalAddedAmount}</> : 0}
                          </dd>
                        </dl>
                        {reference &&
                          totalAddedAmount !== TotalPrice &&
                          totalAddedAmount !== 0 ? (
                          <dl className="grid gap-x-3 text-sm sm:grid-cols-5">
                            <dt className="dark:text-neutral-500 col-span-3 text-red-600">
                              Remaining Amount:
                            </dt>
                            <dd className="dark:text-neutral-200 col-span-2 text-left font-medium text-gray-800">
                              {TotalPrice - totalAddedAmount <= 0 ? 0 : TotalPrice - totalAddedAmount}
                            </dd>
                          </dl>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>

                <div className="flex gap-2">
                  {CreatedInvoice && CreatedInvoice.status !== "Void" || reference && reference.status !== "Void" ? (
                    <>
                      {DeliveriesCreated ? (
                        <></>
                      ) : (
                        <>
                          <button
                            onClick={handleCreateDeliveries}
                            className="notPrint left-0 top-0 flex h-10 w-max gap-2 rounded-lg bg-blue-600 py-2 px-5 text-sm text-white"
                          >
                            Create Deliveries{" "}
                            {DeliveriesCreating ? (
                              <>
                                <div role="status">
                                  <svg
                                    aria-hidden="true"
                                    class="h-6 w-6 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span class="sr-only">Loading...</span>
                                </div>
                              </>
                            ) : null}
                          </button>
                        </>
                      )}
                      {!Preview && (
                        <button
                          onClick={UpdateReceipt}
                          className={`left-0 top-12 flex h-10 gap-2.5 rounded-lg border bg-green-500 px-2.5 py-2 text-sm text-white`}
                        >
                          Update Invoice
                        </button>
                      )}
                    </>
                  ) : reference?.status !== "Void" ? (
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => CreateReceipt(false)}
                        className={`left-0 top-12 flex h-10 gap-2.5 rounded-lg border bg-green-500 px-2.5 py-2 text-sm text-white`}
                      >
                        Create Invoice
                      </button>
                      {CreatingInvoive ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="h-8 w-8 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {/* MapSingleProduct */}
              </div>

              {/* Transaction History */}
              {reference &&
                addedTransactions.length !== 0 &&
                reference?.status !== "Profarma" ? (
                <div className="mt-5 max-w-max border-t-[1px] border-gray-700">
                  <div className="rounded bg-white py-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium text-gray-700">
                        Transaction History
                      </h3>
                    </div>

                    <table className="w-full table-fixed text-left">
                      <thead className="border-b text-gray-500">
                        <tr>
                          <th className="w-1/6 py-2">Date</th>
                          <th className="w-1/4 py-2">Invoice Number</th>
                          <th className="w-1/4 py-2">Transaction Amount</th>
                          <th className="w-1/6 py-2">Payment Mode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addedTransactions && addedTransactions.length > 0 ? (
                          addedTransactions.map((item) => (
                            <tr key={item._id} className="border-b">
                              <td className="py-2">
                                {item?.transactionDate.split("T")[0]}
                              </td>
                              <td className="py-2">
                                {SelectedProduct?.invoiceNumber ||
                                  reference.invoiceNumber}
                              </td>
                              <td className="py-2">{item.amount}</td>
                              <td className="py-2">{item.mode}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="py-4 text-center text-gray-500"
                            >
                              There are no transactions associated with this
                              invoice.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              {
                console.log(reference)
              }
              {/* Completed transaction */}
              {reference && reference.totalAmount - totalAddedAmount <= 0 ? (
                <div className=" bottom-0 left-0 w-full bg-green-500 p-4 text-center text-white">
                  Total Transaction Completed !
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnyOther;
