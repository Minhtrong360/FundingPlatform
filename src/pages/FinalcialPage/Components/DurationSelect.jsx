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
} from "../../../features/DurationSlice";
import { Tooltip } from "antd";
import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import currencyLists from "../../../components/Currency";

const DurationSelect = ({ handleSubmit, isInputFormOpen }) => {
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

  return (
    <section aria-labelledby="duration-heading" className="mb-8 sticky top-8">
      <h2
        className="text-lg font-semibold mb-7 flex items-center"
        id="duration-heading"
      >
        General Setup
      </h2>
      <div className="bg-white rounded-md p-6 border">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the name of your business">
            <span className=" flex items-center text-sm">Business name :</span>
          </Tooltip>

          <Input
            className="border-gray-300"
            value={financialProjectName}
            onChange={(e) => dispatch(setFinancialProjectName(e.target.value))}
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Enter the starting month of the business">
            <span className="flex items-center text-sm">Start Month :</span>
          </Tooltip>
          <Select
            onValueChange={(value) => {
              const selectedMonthIndex = months.indexOf(value);
              dispatch(setStartMonth(selectedMonthIndex + 1));
            }}
            value={months[startMonth - 1]}
          >
            <SelectTrigger
              id="start-month"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
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
            <span className="flex items-center text-sm">Start Year :</span>
          </Tooltip>
          <Select
            onValueChange={(value) => dispatch(setStartYear(value))}
            value={startYear}
          >
            <SelectTrigger
              id="start-year"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
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
            <span className="flex items-center text-sm">Duration :</span>
          </Tooltip>
          <Select
            onValueChange={(value) => dispatch(setSelectedDuration(value))}
          >
            <SelectTrigger
              id="start-date-year"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue placeholder={selectedDuration} />
            </SelectTrigger>
            <SelectContent position="popper">
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
              Starting Cash Balance :
            </span>
          </Tooltip>
          <Input
            className="border-gray-300"
            value={formatNumber(startingCashBalance)}
            onChange={(e) =>
              dispatch(setStartingCashBalance(parseNumber(e.target.value)))
            }
            type="text"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the status of the business">
            <span className="flex items-center text-sm">Status :</span>
          </Tooltip>
          <Select
            onValueChange={(value) => dispatch(setStatus(value))}
            value={status}
          >
            <SelectTrigger className="border-solid border-[1px] border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
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
            onValueChange={(value) => dispatch(setIndustry(value))}
            value={industry}
          >
            <SelectTrigger
              id="industry"
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
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
            <span className="flex items-center text-sm">Income Tax(%) :</span>
          </Tooltip>
          <Input
            className="border-gray-300"
            type="text"
            value={formatNumber(incomeTax)}
            onChange={(e) =>
              dispatch(setIncomeTax(parseNumber(e.target.value)))
            }
          />
        </div>
        {/* <Tooltip title="Input the payroll tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Payroll Tax (%):</span>
            <Input
              className="border-gray-300"
              type="text"
              placeholder="0"
              // value={formatNumber(payrollTax)}
              // onChange={(e) =>
              //   dispatch(setPayrollTax(parseNumber(e.target.value)))
              // }
              disabled
            />
          </div>
        </Tooltip> */}

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Tooltip title="Select the currency, e.g. USD">
            <span className="flex items-center text-sm">Currency :</span>
          </Tooltip>
          <Select
            onValueChange={(value) => dispatch(setCurrency(value))}
            value={currency}
          >
            <SelectTrigger className="border-solid border-[1px] border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
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
      </div>
      {isInputFormOpen !== "Ok" && (
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-8 text-sm flex items-center"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      )}
    </section>
  );
};

export default DurationSelect;
