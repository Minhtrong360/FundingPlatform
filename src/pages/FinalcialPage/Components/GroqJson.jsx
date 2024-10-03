import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
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
import { useSelector, useDispatch } from "react-redux";
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

import Papa from "papaparse";
import { saveAs } from "file-saver";

import { Parser } from "@json2csv/plainjs";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../../../components/ui/button";

const SUPABASE_URL = process.env.REACT_APP_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FileUploadComponent = ({ BS, CF, PNL, Source, paramsID }) => {
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
            // Delete the key if its value is undefined or matches specific strings
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

  const jsonData = {
    CashFlowStatement: CF,
    BalanceSheetStatement: BS,
    IncomeStatement: PNLChanged,
  };

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
    Object.keys(obj).forEach((key) => {
      let newKey = key.toLowerCase().replace(/ /g, "_");
      if (newKey === "metric") {
        newKey = "month";
      }
      let value = obj[key];
      if (typeof value === "string" && value.includes(",")) {
        value = value.replace(/,/g, "");
      }
      transformedObj[newKey] = value;
    });
    return transformedObj;
  };

  const DownloadCSVButton = () => {
    const handleDownload = (type) => {
      downloadCSV(jsonData[type], type);
    };

    const cleanData = (data) => {
      return data.map((item) => {
        const cleanedItem = { ...item };

        Object.keys(cleanedItem).forEach((key) => {
          if (key === "month") {
            // Convert month format from "9-2024" to "2024-09-01"
            const [month, year] = cleanedItem[key].split("-");
            const formattedMonth = `${year}-${month.padStart(2, "0")}-01`; // Converts "9-2024" to "2024-09-01"
            cleanedItem[key] = new Date(formattedMonth).toISOString(); // Converts to ISO timestamp format
          } else if (key !== "project_id") {
            // Replace empty strings with null and convert numeric fields
            if (cleanedItem[key] === "") {
              cleanedItem[key] = null;
            } else {
              const parsedValue = parseFloat(cleanedItem[key]);
              if (!isNaN(parsedValue)) {
                cleanedItem[key] = parsedValue;
              }
            }
          }
        });

        return cleanedItem;
      });
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

          // Parse the CSVs
          const cashFlowJson = (await parseCSVToJson(cashFlowData)).map(
            transformKeysAndCleanValues
          );
          const balanceSheetJson = (await parseCSVToJson(balanceSheetData)).map(
            transformKeysAndCleanValues
          );
          const incomeStatementJson = (
            await parseCSVToJson(incomeStatementData)
          ).map(transformKeysAndCleanValues);

          // Check if there is a project_id
          const projectId = balanceSheetJson[0]?.project_id; // assuming project_id exists and is the same across the data

          if (projectId) {
            // Remove existing data related to project_id
            await supabase
              .from("balancesheet")
              .delete()
              .eq("project_id", projectId);
            await supabase
              .from("profitandloss")
              .delete()
              .eq("project_id", projectId);
            await supabase
              .from("cashflow")
              .delete()
              .eq("project_id", projectId);
          }

          // Clean and insert new data
          if (balanceSheetJson) {
            await supabase
              .from("balancesheet")
              .insert(cleanData(balanceSheetJson));
          }
          if (incomeStatementJson) {
            await supabase
              .from("profitandloss")
              .insert(cleanData(incomeStatementJson));
          }
          if (cashFlowJson) {
            await supabase.from("cashflow").insert(cleanData(cashFlowJson));
          }

          message.success("Submit successfully!");
        } catch (err) {
          console.log(err);
          message.error("Error submitting data.");
        }
      };

      return (
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100%", // Ensure the parent takes full width
          }}
        >
          <div style={{ flex: 1 }}>
            <ClearButton paramsID={paramsID} />
          </div>
          <div style={{ flex: 1 }}>
            <Button
              variant="destructive"
              style={{
                backgroundColor: "#18181B",
                color: "white",
                width: "100%", // Make the button fill its container
              }}
              onClick={saveToSupabase}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col">
        {/* Commented out individual download buttons for clarity */}
        <CsvUploader />
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

  return (
    <div className="md:ml-2">
      <DownloadCSVButton />
    </div>
  );
};

// ClearButton Component
const ClearButton = ({ paramsID }) => {
  const [loading, setLoading] = useState(false); // Manage loading state
  const [messageText, setMessageText] = useState(""); // Display success or error messages

  const deleteProjectData = async () => {
    setLoading(true);
    setMessageText(""); // Reset message
    // Access the actual ID from the paramsID object
    const projectIDString = paramsID;
    try {
      // Delete from cashflow where project_id matches paramsID
      const { error: cashflowError } = await supabase
        .from("cashflow")
        .delete()
        .eq("project_id", projectIDString);

      if (cashflowError) throw cashflowError;

      // Delete from profitandloss where project_id matches projectIDString
      const { error: profitAndLossError } = await supabase
        .from("profitandloss")
        .delete()
        .eq("project_id", projectIDString);

      if (profitAndLossError) throw profitAndLossError;

      // Delete from balancesheet where project_id matches projectIDString
      const { error: balanceSheetError } = await supabase
        .from("balancesheet")
        .delete()
        .eq("project_id", projectIDString);

      if (balanceSheetError) throw balanceSheetError;

      setMessageText(`Successfully deleted all records for project`);
      message.success("Successfully deleted all records for project");
    } catch (error) {
      setMessageText(`Error deleting project data: ${error.message}`);
      message.error(`Error deleting project data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      style={{
        backgroundColor: "#18181B",
        color: "white",
        width: "100%", // Make the button fill its container
      }}
      onClick={deleteProjectData}
      disabled={loading}
    >
      {loading ? "Clearing..." : "Clear"}
    </Button>
  );
};

// Main Component
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
  }, [customerGrowthData, channelInputs, numberOfMonths, dispatch]);

  const { costData, costInputs } = useSelector((state) => state.cost);
  useEffect(() => {
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths, revenueData, dispatch]);

  const { personnelCostData, personnelInputs } = useSelector(
    (state) => state.personnel
  );

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );
    dispatch(setPersonnelCostData(calculatedData));
  }, [personnelInputs, numberOfMonths, dispatch]);

  const { investmentData, investmentTableData, investmentInputs } = useSelector(
    (state) => state.investment
  );
  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
  }, [investmentInputs, numberOfMonths, dispatch]);

  const { loanInputs, loanData, loanTableData } = useSelector(
    (state) => state.loan
  );

  useEffect(() => {
    const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
    dispatch(setLoanData(calculatedData));
  }, [loanInputs, numberOfMonths, dispatch]);

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
  }, [fundraisingInputs, numberOfMonths, dispatch]);

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
    // If investmentTableData.length = 0, create an array with 0s
    for (let i = 0; i < numberOfMonths; i++) {
      cfInvestmentsArray.push(0);
    }
  }

  const cfLoanArray = [];

  if (loanTableData.length > 0) {
    const cfLoans = loanTableData.find((item) => item.key === "CF Loans");

    Object.keys(cfLoans).forEach((key) => {
      if (key.startsWith("month")) {
        cfLoanArray.push(parseNumber(cfLoans[key]));
      }
    });
  } else {
    // If loanTableData.length = 0, create an array with 0s
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
    {
      key: "CF Investments",
      values: cfInvestmentsArray,
    },
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

  // Check if investmentData has assetValue
  if (!investmentData || !investmentData[0]?.assetValue) {
    // Create an array with 0s
    for (let i = 0; i < numberOfMonths; i++) {
      totalAssetValue.push(0);
    }
  } else {
    // Sum assetValue across all investmentData entries
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
    // Create arrays with 0s
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalDepreciation.push(0);
      bsTotalNetFixedAssets.push(0);
    }
  } else {
    // Extract data from investmentTableData
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
    // Create an array with 0s
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalRemainingBalance.push(0);
    }
  } else {
    // Extract data from loanTableData
    loanTableData.forEach((data) => {
      if (data.key === "Total Remaining Balance") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("month")) {
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

  // Calculate total liabilities and shareholders equity
  const totalLiabilitiesAndShareholdersEquity = totalLiabilities.map(
    (totalLiability, index) => totalLiability + totalShareholdersEquity[index]
  );

  const positionDataWithNetIncome2 = [
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
    // Insert BS Total investment here
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

    {
      key: "Accounts Payable", // Added Accounts Payable row
      values: new Array(numberOfMonths).fill(0), // Set values to zero
    },

    {
      key: "Long term liabilities",
      values: bsTotalRemainingBalance, // New row for long term liabilities
    },

    {
      key: "Total Liabilities", // Added Total Liabilities row
      values: totalLiabilities,
    },

    {
      key: "Paid in Capital",
      values: Array.from({ length: numberOfMonths }, (_, i) => {
        const currentValue = i === 0 ? startingPaidInCapital.toFixed(2) : "0";
        const currentValueFloat = parseFloat(currentValue);
        const capitalArrValue = capitalArr[i] || 0; // Default to 0 if undefined
        return (currentValueFloat + capitalArrValue).toFixed(2);
      }).map((value) => parseFloat(value)),
    },
    {
      key: "Common Stock", // Added Common Stock row
      values: commonStockArr,
    },
    {
      key: "Preferred Stock", // Added Preferred Stock row
      values: preferredStockArr,
    },
    {
      key: "Retain Earnings", // Added Retain Earnings row
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
  }, [customerGrowthData, channelInputs, numberOfMonths, dispatch]);

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
  }, [costInputs, numberOfMonths, revenueData, dispatch]);

  const transposedData = [
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
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
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
            [`${realDate[i]}`]: formatNumber(value?.toFixed(2)),
          }),
          {}
        ),
      })),
    },
    { key: "EBITDA", values: ebitda },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
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

  return (
    currentUser[0]?.admin && (
      <div className="flex flex-col rounded-md">
        {/* 
        // Uncomment the following block if you need input and button for sending questions
        <input
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
zIndex={42424244}
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
        </Modal>
        */}
        <FileUploadComponent
          BS={BS}
          CF={CF}
          PNL={PNL}
          Source={financialProjectName}
          paramsID={paramsID}
        />
      </div>
    )
  );
};

export default GroqJS;
