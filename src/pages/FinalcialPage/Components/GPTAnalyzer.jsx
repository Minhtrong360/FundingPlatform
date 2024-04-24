import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Alert } from "antd";
import {
  calculateCustomerGrowth,
  generateCustomerTableData,
  setCustomerTableData,
  transformCustomerData,
} from "../../../features/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateChannelRevenue,
  setRevenueTableData,
  transformRevenueDataForTable,
} from "../../../features/SaleSlice";
import {
  setCostTableData,
  transformCostDataForTable,
} from "../../../features/CostSlice";
import {
  calculatePersonnelCostData,
  setPersonnelTableData,
  transformPersonnelCostDataForTable,
} from "../../../features/PersonnelSlice";
import {
  calculateInvestmentData,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import {
  setLoanTableData,
  transformLoanDataForTable,
} from "../../../features/LoanSlice";
import {
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";

const { Text } = Typography;

const GPTAnalyzer = ({ numberOfMonths }) => {
  const [inputValue, setInputValue] = useState("");
  const [responseResult, setResponseResult] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { customerInputs, customerTableData } = useSelector(
    (state) => state.customer
  );
  const { channelInputs, revenueTableData } = useSelector(
    (state) => state.sales
  );
  const { costInputs, costTableData } = useSelector((state) => state.cost);
  const { personnelInputs, personnelTableData } = useSelector(
    (state) => state.personnel
  );
  const { investmentInputs, investmentTableData } = useSelector(
    (state) => state.investment
  );
  const { loanInputs, loanTableData } = useSelector((state) => state.loan);
  const { fundraisingInputs, fundraisingTableData } = useSelector(
    (state) => state.fundraising
  );

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      numberOfMonths
    );

    const calculateTransformedCustomerTableData = transformCustomerData(
      calculatedData,
      customerInputs
    );

    const calculateCustomerTableData = generateCustomerTableData(
      calculateTransformedCustomerTableData,
      customerInputs,
      numberOfMonths,
      "all"
    );
    dispatch(setCustomerTableData(calculateCustomerTableData));

    const calculatedChannelRevenue = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        calculatedData,
        customerInputs,
        channelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      calculatedChannelRevenue,
      channelInputs,
      "all"
    );
    dispatch(setRevenueTableData(calculateRevenueTableData));

    const calculateCostTableData = transformCostDataForTable(
      costInputs,
      numberOfMonths
    );
    dispatch(setCostTableData(calculateCostTableData));

    const calculatedCostData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );

    const personnelCostTableData =
      transformPersonnelCostDataForTable(calculatedCostData);

    dispatch(setPersonnelTableData(personnelCostTableData));

    const calculatedInvestmentData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    const investmentTableData = transformInvestmentDataForTable(
      investmentInputs,
      "all",
      calculatedInvestmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(investmentTableData));

    const calculateLoanTableData = transformLoanDataForTable(
      loanInputs,
      "all",
      numberOfMonths
    );

    dispatch(setLoanTableData(calculateLoanTableData));

    const calculateFundTableData = transformFundraisingDataForTable(
      fundraisingInputs,
      numberOfMonths
    );
    dispatch(setFundraisingTableData(calculateFundTableData));
  }, [
    customerInputs,
    channelInputs,
    costInputs,
    personnelInputs,
    investmentInputs,
    loanInputs,
    numberOfMonths,
  ]);
  const formattedData = customerTableData.map(entry => {
    const channelData = Object.entries(entry)
        .filter(([key]) => key.startsWith('month'))
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    return `${entry.channelName}: ${channelData}`;
}).join('\n\n');

const userInput = `Analyzing, warning and recommendations for the following data of The TableData :\n${formattedData}`;
console.log(userInput)

  const handleAnalyze = async () => {
    try {
      console.log("customerTableData", customerTableData);
      console.log("revenueTableData", revenueTableData);
      console.log("costTableData", costTableData);
      console.log("personnelTableData", personnelTableData);
      console.log("investmentTableData", investmentTableData);
      console.log("loanTableData", loanTableData);
      console.log("fundraisingTableData", fundraisingTableData);

      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/analyze", // Replace with actual backend URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: `${customerTableData}. Array "customerTableData" này nói về cái chi, hãy giải thích cho tôi với.`,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      const cleanedResponseText = data?.response?.replace(/json|`/g, "");
      setResponseResult(cleanedResponseText);

      setError(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold ">Financial Analysis</h2>

      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              className=" m-2 px-4 block w-full h-full border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to analyze"
            />
          </div>
          <button
            className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
            type="primary"
            onClick={handleAnalyze}
          >
            Analyze
          </button>
          <div className="max-w-4xl mx-auto p-4 bg-white border rounded-md shadow-lg shadow-gray-100">
            {responseResult && (
              <div>
                <div>Analysis Result:</div>
                {responseResult.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
///////////////////

export default GPTAnalyzer;
