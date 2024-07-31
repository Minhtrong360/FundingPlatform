import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import SpinnerBtn from "../../../components/SpinnerBtn";
import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
  setCostTableData,
  transformCostDataForTable,
} from "../../../features/CostSlice";
import { calculateProfitAndLoss } from "../../../features/ProfitAndLossSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  calculateChannelRevenue,
  setCogsData,
  setRevenueData,
  setRevenueDeductionData,
  setRevenueTableData,
  transformRevenueDataForTable,
} from "../../../features/SaleSlice";
import {
  calculatePersonnelCostData,
  setPersonnelCostData,
} from "../../../features/PersonnelSlice";
import {
  calculateInvestmentData,
  setInvestmentData,
} from "../../../features/InvestmentSlice";
import { calculateLoanData, setLoanData } from "../../../features/LoanSlice";
import {
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";
import { useAuth } from "../../../context/AuthContext";
import { message } from "antd";

import Papa from "papaparse";
import { saveAs } from "file-saver";

import { Parser } from "@json2csv/plainjs";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;
  
// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FileUploadComponent = ({ BS, CF, PNL, Source }) => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restructuredData, setRestructuredData] = useState([]);

  const restructureData = (data) => {
    let result = [];

    const processItem = (item) => {
      if (item.children) {
        item.children.forEach((child) => processItem(child));
        delete item.children;
      }
      // Remove keys with undefined values
      let cleanedItem = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== undefined) {
          cleanedItem[key] = item[key];
        }
      });
      result.push(cleanedItem);
    };

    data.forEach((item) => processItem(item));

    return result;
  };

  // const newData = restructureData(PNL);
  const RemoveChildren = (obj) => {
    // Helper function to recursively clean the object
    const cleanObject = (input) => {
      // Check if the input is an object
      if (typeof input === "object" && input !== null) {
        // Iterate over the keys of the object
        for (const key in input) {
          // Recursively clean the children array if it exists
          if (key === "children" && Array.isArray(input[key])) {
            input[key] = input[key].map(cleanObject);
          } else if (
            input[key] === undefined ||
            input[key] === "Revenue" ||
            input[key] === "Cost of Revenue" ||
            input[key] === "Operating Expenses" ||
            input[key] === "Additional Expenses"
          ) {
            // Delete the key if its value is undefined
            delete input[key];
          } else if (typeof input[key] === "object") {
            // Recursively clean the nested object
            input[key] = cleanObject(input[key]);
          }
        }
      }
      return input;
    };

    return cleanObject(obj);
  };

  const transformData = (data) => {
    const transformedData = data.map((item) => {
      if (
        (item.metric === "Total Revenue" ||
          item.metric === "Operating Costs" ||
          item.metric === "Personnel") &&
        item.children
      ) {
        const transformedChildren = {};

        item.children.forEach((child) => {
          Object.keys(child).forEach((key) => {
            if (key !== "metric") {
              if (!transformedChildren[key]) {
                transformedChildren[key] = {};
              }
              transformedChildren[key][child.metric] = child[key];
            }
          });
        });

        const transformedItem = {
          metric: item.metric,
        };

        Object.keys(item).forEach((key) => {
          if (key !== "metric" && key !== "children") {
            transformedItem[key] = transformedChildren[key] || {};
            transformedItem[key]["Total"] = item[key];
          }
        });

        return transformedItem;
      }
      return item;
    });

    return transformedData;
  };

  const transformedData = transformData(PNL);
  const PNLChanged = RemoveChildren(transformedData);
  console.log("transformedData", PNLChanged);

  const jsonData = {
    CashFlowStatement: CF,
    BalanceSheetStatement: BS,
    IncomeStatement: PNLChanged,
  };
  console.log("jsonData", jsonData);
  const convertToCSV = (json) => {
    const opts = { delimiter: "|" };
    const parser = new Parser(opts);
    return parser?.parse(json);
  };

  const transposeData = (csv) => {
    const rows = csv.split("\n").map((row) => row.split("|"));
    const transposed = rows[0].map((_, colIndex) =>
      rows.map((row) => row[colIndex])
    );
    return transposed.map((row) => row.join(",")).join("\n");
  };

  const createCSVBlob = (data) => {
    const csv = convertToCSV(data);
    const transposedData = transposeData(csv);
    // console.log("csv", csv);
    return new Blob([transposedData], { type: "text/csv;charset=utf-8;" });
  };

  const downloadCSV = (data, filename) => {
    const blob = createCSVBlob(data);
    saveAs(blob, `${filename}.csv`);
  };

  const csvBlobs = {
    "CashFlowStatement.csv": createCSVBlob(jsonData.CashFlowStatement),
    "BalanceSheetStatement.csv": createCSVBlob(jsonData.BalanceSheetStatement),
    "IncomeStatement.csv": createCSVBlob(jsonData.IncomeStatement),
  };

  const transformKeysAndCleanValues = (obj) => {
    const transformedObj = {};
    Object.keys(obj).forEach(key => {
      let newKey = key.toLowerCase().replace(/ /g, '_');
      if (newKey === 'metric') {
        newKey = 'month';
      }
      let value = obj[key];
      if (typeof value === 'string' && value.includes(',')) {
        value = value.replace(/,/g, '');
      }
      transformedObj[newKey] = value;
    });
    return transformedObj;
  };
  
  

  const DownloadCSVButton = () => {
    const handleDownload = (type) => {
      downloadCSV(jsonData[type], type);
    };

    const CsvUploader = () => {
      const saveToSupabase = async () => {
        try {
          const cashFlowData = csvBlobs["CashFlowStatement.csv"];
          const balanceSheetData = csvBlobs["BalanceSheetStatement.csv"];
          const incomeStatementData = csvBlobs["IncomeStatement.csv"];

          // Parse the CSV blobs back to JSON
          const parseCSVToJson = (blob) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const text = reader.result;
                Papa.parse(text, {
                  header: true,
                  complete: (results) => resolve(results.data),
                  error: (error) => reject(error),
                });
              };
              reader.readAsText(blob);
            });
          };

          const cashFlowJson = (await parseCSVToJson(cashFlowData)).map(transformKeysAndCleanValues);
          const balanceSheetJson = (await parseCSVToJson(balanceSheetData)).map(transformKeysAndCleanValues);
          const incomeStatementJson = (await parseCSVToJson(incomeStatementData)).map(transformKeysAndCleanValues);

          if (balanceSheetJson) {
            await supabase.from("balancesheet").insert(balanceSheetJson);
          }
          if (incomeStatementJson) {
            await supabase.from("profitandloss").insert(incomeStatementJson);
          }
          if (cashFlowJson) {
            await supabase.from("cashflow").insert(cashFlowJson);
          }

          alert("CSV files uploaded successfully!");
        } catch (err) {
          console.log(err);
        }
      };

      return (
        <div>
          
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={saveToSupabase}>Save Supabase</button>
        </div>
      );
    };

    return (
      <div className="flex flex-col mt-4 p-2">
        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleDownload("CashFlowStatement")}
        >
          {" "}
          Cash Flow CSV
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleDownload("BalanceSheetStatement")}
        >
          Balance Sheet CSV
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleDownload("IncomeStatement")}
        >
          Income Statement CSV
        </button> */}
        <CsvUploader/>
      </div>
    );
  };
  /////////////

  const content = `
      CashFlowStatement=
      ${JSON.stringify(CF, null, 2)}

      BalanceSheetStatement=
      ${JSON.stringify(BS, null, 2)}

      ProfitandLossStatement=
      ${JSON.stringify(PNL, null, 2)}
        `;

  // Convert content to a Blob
  const blob = new Blob([content], { type: "text/plain" });

  // Create a File object from Blob
  const txtFile = new File([blob], "financial_statements.txt", {
    type: "text/plain",
  });

  const downloadFile = () => {
    // Create a URL for the file
    const fileURL = URL.createObjectURL(txtFile);

    // Create an anchor element and click it programmatically
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = txtFile.name;
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
  };
  // Update state with the File object

  const handleSubmit = async () => {
    setFile(txtFile);

    let formData = new FormData();
    Object.keys(csvBlobs).forEach((filename) => {
      console.log(`Appending file: ${filename}`);
      console.log(csvBlobs[filename]);
      console.log(new File([csvBlobs[filename]], filename));
      formData.append("files", new File([csvBlobs[filename]], filename));
    });
    // formData.append("files", file);
    formData.append("chunkSize", 1000);
    formData.append("chunkOverlap", 200);
    formData.append("returnSourceDocuments", true);
    formData.append("metadata", '{ "source": "businessname" }');

    try {
      setLoading(true);
      const response = await fetch(
        "https://flowise-ngy8.onrender.com/api/v1/vector/upsert/5d297588-8b13-4452-8c68-a7288bfbbbe2",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      setResponse(result);
      if (result && result.numAdded > 0) {
        message.success("Embedding successful");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setResponse({ error: "Error uploading file" });
    } finally {
      setLoading(false);
    }
  };
  console.log("response", response);
  return (
    <div className="md:ml-2">
      {/* <input type="file" onChange={handleFileChange} /> */}
      {/* <button
        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Embed"}
      </button>
      <div>
        <button
          className="ml-4 mt-4 rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          onClick={downloadFile}
        >
          TXT
        </button>
      </div> */}
      <DownloadCSVButton />
      {/* {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

const GroqJS = ({ datasrc, inputUrl, numberOfMonths }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  // Add the following state for controlling the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const params = useParams();
  const paramsID = params.id;

  // Update the handleSubmit function to set modal visibility and response content
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const newMessage = {
        role: "user",
        content:
          `1. All answers are short and using bullet points.
        2. Analyze figures and numbers vertically and horizontally. 
        3. Show remarkable changes, red flags, insights based on quantitative reasonings. 
        4. Give a score out of 10 for the data below` +
          "\n" +
          JSON.stringify(datasrc),
      };
      setMessages([newMessage]);

      let url;
      if (inputUrl === "urlPNL") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlCF") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlBS") {
        url =
          "https://flowise-ngy8.onrender.com/api/v1/prediction/5d297588-8b13-4452-8c68-a7288bfbbbe2";
      } else if (inputUrl === "urlCus") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlSale") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlCost") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlPer") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlInv") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlFund") {
        url = "http://localhost:300/";
      } else if (inputUrl === "urlLoan") {
        url = "http://localhost:300/";
      } else {
        alert("Invalid URL input");
        return;
      }

      const response = await fetch(
        // "https://news-fetcher-8k6m.onrender.com/chat",
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ question: [JSON.stringify(datasrc)] }),
          body: JSON.stringify({ question: input }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const dataJS = JSON.stringify(data);

      const assistantResponse = data.text?.replace(/[#*`]/g, "");

      const formattedAssistantResponse = assistantResponse.replace(
        /\n/g,
        "<br>"
      );
      setMessages([
        ...messages,
        { role: "assistant", content: formattedAssistantResponse },
      ]);
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add positionDataWithNetIncome

  const { customerGrowthData, customerInputs } = useSelector(
    (state) => state.customer
  );

  const { channelInputs, revenueData, revenueDeductionData, cogsData } =
    useSelector((state) => state.sales);

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
    } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        channelInputs
      )
    );

    dispatch(setRevenueData(revenueByChannelAndProduct));
    dispatch(setRevenueDeductionData(DeductionByChannelAndProduct));
    dispatch(setCogsData(cogsByChannelAndProduct));
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  const { costData, costInputs } = useSelector((state) => state.cost);
  useEffect(() => {
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths]);

  const { personnelCostData, personnelInputs } = useSelector(
    (state) => state.personnel
  );

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );
    dispatch(setPersonnelCostData(calculatedData));
  }, [personnelInputs, numberOfMonths]);

  const { investmentData, investmentTableData, investmentInputs } = useSelector(
    (state) => state.investment
  );
  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
  }, [investmentInputs, numberOfMonths]);

  const { loanInputs, loanData, loanTableData } = useSelector(
    (state) => state.loan
  );

  useEffect(() => {
    const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
    dispatch(setLoanData(calculatedData));
  }, [loanInputs, numberOfMonths]);

  const { incomeTax: incomeTaxRate, startingCashBalance } = useSelector(
    (state) => state.durationSelect
  );

  const { fundraisingInputs, fundraisingTableData } = useSelector(
    (state) => state.fundraising
  );

  useEffect(() => {
    const tableData = transformFundraisingDataForTable(
      fundraisingInputs,
      numberOfMonths
    );

    dispatch(setFundraisingTableData(tableData));
  }, [fundraisingInputs, numberOfMonths]);

  const {
    totalPrincipal,
    totalRevenue,
    totalDeductions,
    netRevenue,
    totalCOGS,
    grossProfit,
    totalCosts,
    totalPersonnelCosts,
    detailedPersonnelCosts, // Added detailed personnel costs
    totalInvestmentDepreciation,
    totalInterestPayments,
    ebitda,
    earningsBeforeTax,
    incomeTax,
    netIncome,
  } = calculateProfitAndLoss(
    numberOfMonths,
    revenueData,
    revenueDeductionData,
    cogsData,
    costData,
    personnelCostData,
    investmentData,
    loanData,
    incomeTaxRate,
    startingCashBalance
  );

  const CFOperationsArray = netIncome.map(
    (value, index) =>
      value +
      totalInvestmentDepreciation[index] +
      0 /* Inventory */ +
      0 /* AR */ -
      0 /* AP */
  );

  const cfInvestmentsArray = [];
  if (investmentTableData.length > 0) {
    const cfInvestments = investmentTableData.find(
      (item) => item.key === "CF Investments"
    );

    Object.keys(cfInvestments).forEach((key) => {
      if (key.startsWith("month")) {
        cfInvestmentsArray.push(parseNumber(cfInvestments[key]));
      }
    });
  } else {
    // Trường hợp investmentTableData.length = 0, tạo mảng với giá trị 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      cfInvestmentsArray.push(0);
    }
  }

  const cfLoanArray = [];

  if (loanTableData.length > 0) {
    const cfLoans = loanTableData.find((item) => item.key === "CF Loans");

    Object.keys(cfLoans).forEach((key) => {
      if (key.startsWith("Month ")) {
        cfLoanArray.push(parseNumber(cfLoans[key]));
      }
    });
  } else {
    // Trường hợp investmentTableData.length = 0, tạo mảng với giá trị 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      cfLoanArray.push(0);
    }
  }

  const commonStockArr = [];
  const preferredStockArr = [];
  const capitalArr = [];
  const accumulatedCommonStockArr = [];
  const accumulatedPreferredStockArr = [];
  const accumulatedCapitalArr = [];

  fundraisingTableData.forEach((data) => {
    if (data.key === "Increased in Common Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          commonStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Increased in Preferred Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          preferredStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Increased in Paid in Capital") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          capitalArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Common Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedCommonStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Preferred Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedPreferredStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Paid in Capital") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedCapitalArr.push(parseNumber(data[key]));
        }
      });
    }
  });

  const netCashChanges = netIncome.map((_, index) => {
    const cfOperations =
      netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
    const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
    const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
    const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
    const cfLoan = cfLoanArray[index] || 0;
    const cfInvestment = cfInvestmentsArray[index] || 0;
    const cfFinancing =
      cfLoan -
      totalPrincipal[index] +
      increaseCommonStock +
      increasePreferredStock +
      increasePaidInCapital; // Calculate CF Financing directly
    const netCash = cfOperations - cfInvestment + cfFinancing;
    return netCash;
  });

  const calculateCashBalances = (startingCash, netCashChanges) => {
    const cashBalances = netCashChanges?.reduce((acc, netCashChange, index) => {
      if (index === 0) {
        acc.push(parseFloat(startingCash) + netCashChange);
      } else {
        acc.push(acc[index - 1] + netCashChange);
      }
      return acc;
    }, []);
    return cashBalances;
  };
  const cashBeginBalances = [
    parseFloat(startingCashBalance),
    ...calculateCashBalances(startingCashBalance, netCashChanges)?.slice(0, -1),
  ];

  const cashEndBalances = calculateCashBalances(
    startingCashBalance,
    netCashChanges
  );

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const realDate = Array.from({ length: numberOfMonths }, (_, i) => {
    const monthIndex = (startMonth - 1 + i) % 12; // Adjusted monthIndex calculation
    const year = startYear + Math.floor((startMonth - 1 + i) / 12);
    return `${monthIndex + 1}-${year}`;
  });

  const positionDataWithNetIncome = [
    // { key: "Operating Activities" },
    { key: "Project ID", values: Array(cashEndBalances.length).fill(paramsID) },
    { key: "Net Income", values: netIncome },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    {
      key: "Decrease (Increase) in Inventory",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AR",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AP",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "CF Operations",
      values: CFOperationsArray,
    },
    // { key: "1" },
    // { key: "Investing Activities" },
    {
      key: "CF Investments",
      values: cfInvestmentsArray,
    },
    // { key: "1" },
    // { key: "Financing Activities" },
    {
      key: "CF Loans",
      values: cfLoanArray,
    },
    {
      key: "Total Principal", // Updated key to Total Principal
      values: totalPrincipal, // Updated values with totalPrincipal
    },
    {
      key: "Increase in Common Stock",
      values: commonStockArr, // Placeholder values
    },
    {
      key: "Increase in Preferred Stock",
      values: preferredStockArr, // Placeholder values
    },
    {
      key: "Increase in Paid in Capital",
      values: capitalArr, // Placeholder values
    },
    {
      key: "CF Financing",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        return (
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital
        );
      }),
    },
    // { key: "1" },
    {
      key: "Net +/- in Cash",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        const cfOperations =
          netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
        const cfInvestment = cfInvestmentsArray[index] || 0;
        const cfFinancing =
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital;
        return cfOperations - cfInvestment + cfFinancing;
      }),
    },
    {
      key: "Cash Begin",
      values: cashBeginBalances,
    },
    {
      key: "Cash End",
      values: cashEndBalances,
    },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [realDate[i]]:
          typeof value === "number" ? formatNumber(value.toFixed(2)) : value,
      }),
      {}
    ),
  }));

  // Add positionDataWithNetIncome2

  const currentAssets = cashEndBalances.map((cashEnd, index) => {
    const accountsReceivable = 0; // Placeholder value
    const inventory = 0; // Placeholder value
    return cashEnd + accountsReceivable + inventory; // Calculate Current Assets
  });

  let totalAssetValue = [];

  // Kiểm tra nếu investmentData không có giá trị hoặc investmentData[0]?.assetValue không tồn tại
  if (!investmentData || !investmentData[0]?.assetValue) {
    // Tạo một mảng mới với các phần tử có giá trị là 0
    // Ví dụ: Tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      totalAssetValue.push(0);
    }
  } else {
    // Nếu investmentData có giá trị và investmentData[0]?.assetValue tồn tại
    // Thực hiện tính tổng của từng phần tử tại index trong mảng assetValue của mỗi phần tử trong investmentData
    totalAssetValue = investmentData[0]?.assetValue?.map((_, index) =>
      investmentData.reduce(
        (acc, data) => acc + (data?.assetValue ? data.assetValue[index] : 0),
        0
      )
    );
  }

  const bsTotalDepreciation = [];
  const bsTotalNetFixedAssets = [];

  if (investmentTableData.length === 0) {
    // Trường hợp không có dữ liệu trong investmentTableData, tạo mảng mới với các phần tử có giá trị là 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalDepreciation.push(0);
      bsTotalNetFixedAssets.push(0);
    }
  } else {
    // Nếu có dữ liệu trong investmentTableData, thực hiện vòng lặp để xử lý dữ liệu
    investmentTableData.forEach((data) => {
      if (data.key === "BS Total Accumulated Depreciation") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("month")) {
            bsTotalDepreciation.push(parseNumber(data[key]));
          }
        });
      } else if (data.key === "BS Total Net Fixed Assets") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("month")) {
            bsTotalNetFixedAssets.push(parseNumber(data[key]));
          }
        });
      }
    });
  }

  const totalAssets = currentAssets.map(
    (currentAsset, index) => currentAsset + bsTotalNetFixedAssets[index]
  );

  const bsTotalRemainingBalance = [];

  if (loanTableData.length === 0) {
    // Trường hợp không có dữ liệu trong loanTableData, tạo mảng mới với các phần tử có giá trị là 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalRemainingBalance.push(0);
    }
  } else {
    // Nếu có dữ liệu trong loanTableData, thực hiện vòng lặp để xử lý dữ liệu
    loanTableData.forEach((data) => {
      if (data.key === "Total Remaining Balance") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("Month ")) {
            bsTotalRemainingBalance.push(parseNumber(data[key]));
          }
        });
      }
    });
  }

  const totalLiabilities = bsTotalRemainingBalance.map(
    (remainingBalance, index) => remainingBalance + 0 // Placeholder value
  );

  const startingPaidInCapital = parseFloat(startingCashBalance);

  const accumulatedRetainEarnings = netIncome.reduce((acc, curr, index) => {
    if (index === 0) {
      return [curr];
    } else {
      return [...acc, curr + acc[index - 1]];
    }
  }, []);

  const totalShareholdersEquity = accumulatedRetainEarnings.map(
    (earnings, index) =>
      startingPaidInCapital +
      accumulatedCommonStockArr[index] +
      accumulatedPreferredStockArr[index] +
      accumulatedCapitalArr[index] +
      earnings // Placeholder values
  );

  //calculate the total liabilities and shareholders equity = total liabilities + total shareholders equity
  const totalLiabilitiesAndShareholdersEquity = totalLiabilities.map(
    (totalLiability, index) => totalLiability + totalShareholdersEquity[index]
  );

  const positionDataWithNetIncome2 = [
    // {key: "Assets",},
    // {key: "Current-Assets",},
    { key: "Project ID", values: Array(cashEndBalances.length).fill(paramsID) },
    {
      key: "Cash",
      values: cashEndBalances, // Set values to zero
    },
    {
      key: "Accounts Receivable", // Added Accounts Receivable row
      values: new Array(numberOfMonths).fill(0), // Set values to zero
    },
    {
      key: "Inventory", // Added Inventory row
      values: new Array(numberOfMonths).fill(0), // Set values to zero
    },
    {
      key: "Current Assets", // Added Current Assets row
      values: currentAssets,
    },
    // { key: "1" },
    // {key: "Long-Term Assets",},
    // insert BS Total investment here
    { key: "Total Investment", values: totalAssetValue }, // New row for total investment

    { key: "Total Accumulated Depreciation", values: bsTotalDepreciation },

    {
      key: "Net Fixed Assets",
      values: bsTotalNetFixedAssets,
    },

    {
      key: "Long term assets",
      values: bsTotalNetFixedAssets,
    },

    {
      key: "Total Assets",
      values: totalAssets,
    },
    // { key: "1" },
    // {key: "Liabilities & Equity",},
    // {key: "Current Liabilities",},
    {
      key: "Accounts Payable", // Added Inventory row
      values: new Array(numberOfMonths).fill(0), // Set values to zero
    },

    // {key: "Long-Term Liabilities",},
    {
      key: "Long term liabilities",
      values: bsTotalRemainingBalance, // New row for long term liabilities
    },

    {
      key: "Total Liabilities", // Added Inventory row
      values: totalLiabilities,
    },
    // {key: "1",},
    // {key: "Shareholders Equity",},
    {
      key: "Paid in Capital",
      values: Array.from({ length: numberOfMonths }, (_, i) => {
        const currentValue = i === 0 ? startingPaidInCapital.toFixed(2) : "0";
        const currentValueFloat = parseFloat(currentValue);
        const capitalArrValue = capitalArr[i] || 0; // If capitalArr doesn't have value at index i, default to 0
        return (currentValueFloat + capitalArrValue).toFixed(2);
      }).map((value) => parseFloat(value)),
    },
    {
      key: "Common Stock", // Added Inventory row
      values: commonStockArr,
    },
    {
      key: "Preferred Stock", // Added Inventory row
      values: preferredStockArr,
    },
    {
      key: "Retain Earnings", // Added Inventory row
      values: netIncome,
    },

    // Calculated the accumulated retained earnings here

    {
      key: "Accumulated Retain Earnings",
      values: accumulatedRetainEarnings,
    },

    {
      key: "Total Shareholders Equity",
      values: totalShareholdersEquity,
    },

    // Add the Total Liabilities and Shareholders Equity here

    {
      key: "Total Liabilities and Shareholders Equity",
      values: totalLiabilitiesAndShareholdersEquity,
    },

    {
      key: "Total Assets (Double Check)",
      values: totalAssets,
    },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [realDate[i]]:
          typeof value === "number" ? formatNumber(value.toFixed(2)) : value,
      }),
      {}
    ),
  }));

  // Add transposedData

  const { revenueTableData } = useSelector((state) => state.sales);

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
      cashInflowByChannelAndProduct,
      receivablesByChannelAndProduct,
    } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        channelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      {
        revenueByChannelAndProduct,
        DeductionByChannelAndProduct,
        cogsByChannelAndProduct,
        netRevenueByChannelAndProduct,
        grossProfitByChannelAndProduct,
        cashInflowByChannelAndProduct,
        receivablesByChannelAndProduct,
      },
      channelInputs,
      "all"
    );
    dispatch(setRevenueTableData(calculateRevenueTableData));

    dispatch(setRevenueData(revenueByChannelAndProduct));
    dispatch(setRevenueDeductionData(DeductionByChannelAndProduct));
    dispatch(setCogsData(cogsByChannelAndProduct));
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  const { costTableData } = useSelector((state) => state.cost);

  useEffect(() => {
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
    const costTableData = transformCostDataForTable(
      costInputs,
      numberOfMonths,
      revenueData
    );

    dispatch(setCostTableData(costTableData));
  }, [costInputs, numberOfMonths]);

  const transposedData = [
    // { key: "Revenue" },
    // { key: "Total Revenue", values: totalRevenue },
    { key: "Project ID", values: Array(cashEndBalances.length).fill(paramsID) },
    {
      key: "Total Revenue",
      values: totalRevenue,
      children: revenueTableData
        .filter(
          (item) =>
            item.key.includes("Revenue - ") &&
            !item.key.includes("Net Revenue -")
        )
        .map((item) => ({
          key: item.key,
          metric: item.key,
          ...Object.keys(item).reduce((acc, key) => {
            if (key.startsWith("month")) {
              const monthIndex = key.replace("month", "").trim();
              acc[realDate[monthIndex - 1]] = item[key];
            }
            return acc;
          }, {}),
        })),
    },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    // { key: "" },
    // { key: "Cost of Revenue" },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    // { key: "" },
    // { key: "Operating Expenses" },

    // { key: "Operating Costs", values: totalCosts },
    {
      key: "Operating Costs",
      values: totalCosts,
      children: costTableData.map((item) => ({
        key: item.key,
        metric: item.costName,
        ...Object.keys(item).reduce((acc, key) => {
          if (key.startsWith("month")) {
            const monthIndex = key.replace("month", "").trim();
            acc[realDate[monthIndex - 1]] = item[key];
          }
          return acc;
        }, {}),
      })),
    },
    {
      key: "Personnel",
      values: totalPersonnelCosts,
      children: Object.keys(detailedPersonnelCosts).map((jobTitle) => ({
        key: jobTitle,
        values: detailedPersonnelCosts[jobTitle],
        metric: jobTitle,
        ...detailedPersonnelCosts[jobTitle].reduce(
          (acc, value, i) => ({
            ...acc,
            [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
          }),
          {}
        ),
      })),
    },
    { key: "EBITDA", values: ebitda },
    // { key: "" },
    // { key: "Additional Expenses" },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
    // { key: "" },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [realDate[i]]:
          typeof value === "number" ? formatNumber(value.toFixed(2)) : value,
      }),
      {}
    ),
    children: item.children?.map((child) => ({
      metric: child.metric,
      ...child.values?.reduce(
        (acc, value, i) => ({
          ...acc,
          [realDate[i]]:
            typeof value === "number" ? formatNumber(value.toFixed(2)) : value,
        }),
        {}
      ),
      ...Object.keys(child).reduce((acc, key) => {
        if (key.match("-")) {
          acc[key] = child[key];
        }
        return acc;
      }, {}),
    })),
  }));
  const { financialProjectName } = useSelector((state) => state.durationSelect);
  const filterMetrics = (data) => {
    return data?.filter((item) => item.metric !== "1" && item.metric !== "");
  };

  const BS = filterMetrics(positionDataWithNetIncome2);

  const CF = filterMetrics(positionDataWithNetIncome);

  const PNL = filterMetrics(transposedData);

  console.log("params", paramsID);

  return (
    currentUser[0]?.admin && (
      <div className="flex flex-col rounded-md">
        {/* <input
          className="p-2 rounded m-4 border-gray-300 border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
          onClick={handleSubmit}
        >
          {isLoading ? <SpinnerBtn /> : "Send"}
        </button>
        <Modal
          open={isModalVisible}
          footer={null}
          centered
          onCancel={() => setIsModalVisible(false)}
          width="60%"
          style={{ top: 20 }}
        >
          {messages.length > 0 && (
            <div
              dangerouslySetInnerHTML={{
                __html: messages[messages.length - 1].content,
              }}
            />
          )}
        </Modal> */}
        <FileUploadComponent
          BS={BS}
          CF={CF}
          PNL={PNL}
          Source={financialProjectName}
        />
      </div>
    )
  );
};

export default GroqJS;
