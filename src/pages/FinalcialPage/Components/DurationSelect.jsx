import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDuration,
  setStartingCashBalance,
  setStatus,
  setIndustry,
  setIncomeTax,
  setCurrency,
  setStartMonth,
  setStartYear,
  setFinancialProjectName,
  setDescription,
  setLocation,
} from "../../../features/DurationSlice";
import { Tooltip } from "antd";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import currencyLists from "../../../components/Currency";
import { CheckCircleOutlined } from "@ant-design/icons";
import SpinnerBtn from "../../../components/SpinnerBtn";
import TextArea from "antd/es/input/TextArea";
import { Button } from "../../../components/ui/button";
import { Check } from "lucide-react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const DurationSelect = ({ handleSubmit, isInputFormOpen, isLoading }) => {
  const dispatch = useDispatch();
  const {
    selectedDuration,
    startingCashBalance,
    status,
    industry,
    incomeTax,
    currency,
    startMonth,
    startYear,
    financialProjectName,
    description,
    location,
  } = useSelector((state) => state.durationSelect);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 11 },
    (_, index) => currentYear - 5 + index
  );

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Transportation",
    "Hospitality",
    "Real Estate",
    "Entertainment",
    "Automotive",
    "Construction",
    "Telecommunications",
    "Energy",
    "Food and Beverage",
    "Pharmaceuticals",
    "Agriculture",
    "Media",
    "Insurance",
    "Utilities",
    "Government",
    "Aerospace",
    "Biotechnology",
    "Consulting",
    "Logistics",
    "Internet",
    "Software",
    "Hardware",
    "E-commerce",
    "Health and Wellness",
    "Fashion",
    "Banking",
    "Investment",
    "Advertising",
    "Consumer Goods",
    "Engineering",
    "Defense",
    "Mining",
    "Chemicals",
    "Legal",
    "Nonprofit",
    "Gaming",
    "Renewable Energy",
    "Shipping",
    "Venture Capital",
    "Social Media",
    "Travel",
    "Human Resources",
  ];

  const [debouncedFinancialProjectName, setDebouncedFinancialProjectName] =
    useState(financialProjectName);
  const [debouncedStartMonth, setDebouncedStartMonth] = useState(startMonth);
  const [debouncedStartYear, setDebouncedStartYear] = useState(startYear);
  const [debouncedSelectedDuration, setDebouncedSelectedDuration] =
    useState(selectedDuration);
  const [debouncedStartingCashBalance, setDebouncedStartingCashBalance] =
    useState(startingCashBalance);
  const [debouncedStatus, setDebouncedStatus] = useState(status);
  const [debouncedIndustry, setDebouncedIndustry] = useState(industry);
  const [debouncedIncomeTax, setDebouncedIncomeTax] = useState(incomeTax);
  const [debouncedCurrency, setDebouncedCurrency] = useState(currency);
  const [debouncedDescription, setDebouncedDescription] = useState(description);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  const debouncedDispatch = useCallback(
    debounce((dispatchFunc, value) => {
      dispatch(dispatchFunc(value));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedDispatch(setFinancialProjectName, debouncedFinancialProjectName);
  }, [debouncedFinancialProjectName]);

  useEffect(() => {
    debouncedDispatch(setStartMonth, debouncedStartMonth);
  }, [debouncedStartMonth]);

  useEffect(() => {
    debouncedDispatch(setStartYear, debouncedStartYear);
  }, [debouncedStartYear]);

  useEffect(() => {
    debouncedDispatch(setSelectedDuration, debouncedSelectedDuration);
  }, [debouncedSelectedDuration]);

  useEffect(() => {
    debouncedDispatch(setStartingCashBalance, debouncedStartingCashBalance);
  }, [debouncedStartingCashBalance]);

  useEffect(() => {
    debouncedDispatch(setStatus, debouncedStatus);
  }, [debouncedStatus]);

  useEffect(() => {
    debouncedDispatch(setIndustry, debouncedIndustry);
  }, [debouncedIndustry]);

  useEffect(() => {
    debouncedDispatch(setIncomeTax, debouncedIncomeTax);
  }, [debouncedIncomeTax]);

  useEffect(() => {
    debouncedDispatch(setCurrency, debouncedCurrency);
  }, [debouncedCurrency]);

  useEffect(() => {
    debouncedDispatch(setDescription, debouncedDescription);
  }, [debouncedDescription]);

  useEffect(() => {
    debouncedDispatch(setLocation, debouncedLocation);
  }, [debouncedLocation]);

  return (
    <section
      aria-labelledby="duration-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="duration-heading"
      >
        General Setup
      </h2>
      <div className="bg-white rounded-md p-6 border my-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the name of your business">
            <span className=" flex items-center text-sm">Business name:</span>
          </Tooltip>

          <Input
            className="border-gray-300"
            value={debouncedFinancialProjectName}
            onChange={(e) => setDebouncedFinancialProjectName(e.target.value)}
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the starting month of the business">
            <span className="flex items-center text-sm">Start Month:</span>
          </Tooltip>
          <Select
            className="bg-white"
            onValueChange={(value) =>
              setDebouncedStartMonth(months.indexOf(value) + 1)
            }
            value={months[debouncedStartMonth - 1]}
          >
            <SelectTrigger
              id="start-month"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              {months.map((month, index) => (
                <SelectItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={month}
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the starting year of the business">
            <span className="flex items-center text-sm">Start Year:</span>
          </Tooltip>
          <Select
            onValueChange={(value) => setDebouncedStartYear(value)}
            value={debouncedStartYear}
          >
            <SelectTrigger
              id="start-year"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              {years.map((year, index) => (
                <SelectItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={year}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the duration 3 years or 5 years">
            <span className="flex items-center text-sm">Duration:</span>
          </Tooltip>
          <Select
            onValueChange={(value) => setDebouncedSelectedDuration(value)}
          >
            <SelectTrigger
              id="start-date-year"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue placeholder={debouncedSelectedDuration} />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              <SelectItem className="hover:cursor-pointer" value="3 years">
                3 years
              </SelectItem>
              <SelectItem className="hover:cursor-pointer" value="5 years">
                5 years
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the starting cash balance, e.g. $10,000">
            <span className="flex items-center text-sm">
              Starting Cash Balance:
            </span>
          </Tooltip>
          <Input
            className="border-gray-300"
            value={formatNumber(debouncedStartingCashBalance)}
            onChange={(e) =>
              setDebouncedStartingCashBalance(parseNumber(e.target.value))
            }
            type="text"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the status of the business">
            <span className="flex items-center text-sm">Status:</span>
          </Tooltip>
          <Select
            onValueChange={(value) => setDebouncedStatus(value)}
            value={debouncedStatus}
          >
            <SelectTrigger className="border-solid border-[1px] border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              <SelectItem className="hover:cursor-pointer" value="active">
                Active
              </SelectItem>
              <SelectItem className="hover:cursor-pointer" value="inactive">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the business industry, e.g. Fintech, Edtech">
            <span className="flex items-center text-sm">
              Business industry:
            </span>
          </Tooltip>
          <Select
            onValueChange={(value) => setDebouncedIndustry(value)}
            value={debouncedIndustry}
          >
            <SelectTrigger
              id="industry"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              {industries.map((industry, index) => (
                <SelectItem
                  className="hover:cursor-pointer"
                  key={index}
                  value={industry}
                >
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Input the income tax, e.g. 10">
            <span className="flex items-center text-sm">Income Tax(%):</span>
          </Tooltip>
          <Input
            className="border-gray-300"
            type="text"
            value={formatNumber(debouncedIncomeTax)}
            onChange={(e) => setDebouncedIncomeTax(parseNumber(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the currency, e.g. USD">
            <span className="flex items-center text-sm">Currency:</span>
          </Tooltip>
          <Select
            onValueChange={(value) => setDebouncedCurrency(value)}
            value={debouncedCurrency}
          >
            <SelectTrigger className="border-solid border-[1px] border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-white">
              {currencyLists?.map((option) => (
                <SelectItem
                  key={option.key}
                  className="hover:cursor-pointer"
                  value={option.key}
                >
                  {option.key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3 min-h-[7rem]">
          <Tooltip title="Input the income tax, e.g. 10">
            <span className="flex items-center text-sm">Description:</span>
          </Tooltip>
          <TextArea
            className="border-gray-300 rounded-2xl text-sm"
            type="text"
            value={debouncedDescription}
            onChange={(e) => setDebouncedDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Input the income tax, e.g. 10">
            <span className="flex items-center text-sm">Location:</span>
          </Tooltip>
          <Input
            className="border-gray-300"
            type="text"
            value={debouncedLocation}
            onChange={(e) => setDebouncedLocation(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="destructive"
          onClick={handleSubmit}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default DurationSelect;
