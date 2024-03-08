import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Tooltip } from "antd";

const DurationSelect = ({
  selectedDuration,
  setSelectedDuration,
  startingCashBalance,
  setStartingCashBalance,
  status,
  setStatus,
  industry,
  setIndustry,
  incomeTax,
  setIncomeTax,
  payrollTax,
  setPayrollTax,
  currency,
  setCurrency,
  startMonth,
  setStartMonth,
  startYear,
  setStartYear,
  financialProjectName,
  setFinancialProjectName,
}) => {
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
    { length: currentYear - 2019 },
    (_, index) => 2020 + index
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
  ];

  return (
    <section aria-labelledby="duration-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="duration-heading"
      >
        Duration and Initial Setup
      </h2>
      <div className="bg-white rounded-md shadow p-6">
        <Tooltip title="Enter the name of your business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Business name :</span>

            <Input
              className="border-gray-200"
              value={financialProjectName}
              onChange={(e) => setFinancialProjectName(e.target.value)}
              type="text"
            />
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting month of the business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Start Month :</span>
            <Select onValueChange={setStartMonth} value={startMonth}>
              <SelectTrigger
                id="start-month"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {months.map((month, index) => (
                  <SelectItem key={index} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting year of the business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Start Year :</span>
            <Select onValueChange={setStartYear} value={startYear}>
              <SelectTrigger
                id="start-year"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {years.map((year, index) => (
                  <SelectItem key={index} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Select the duration 3 years or 5 years">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Duration :</span>
            <Select onValueChange={(value) => setSelectedDuration(value)}>
              <SelectTrigger
                id="start-date-year"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue placeholder={selectedDuration} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="3 years">3 years</SelectItem>
                <SelectItem value="5 years">5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting cash balance, e.g. $10,000">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">
              Starting Cash Balance :
            </span>

            <Input
              className="border-gray-200"
              value={startingCashBalance}
              onChange={(e) => setStartingCashBalance(e.target.value)}
              type="number"
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the status of the business, e.g. $10,000">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Status :</span>
            <Select onValueChange={(value) => setStatus(value)} value={status}>
              <SelectTrigger className="border-solid border-[1px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Select the business industry, e.g. Fintech, Edtech">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">
              Business industry:
            </span>
            <Select onValueChange={setIndustry} value={industry}>
              <SelectTrigger
                id="industry"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {industries.map((industry, index) => (
                  <SelectItem key={index} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Input the income tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Income Tax(%) :</span>
            <Input
              className="border-gray-200"
              type="number"
              value={incomeTax}
              onChange={(e) => setIncomeTax(e.target.value)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Input the payroll tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Payroll Tax (%):</span>
            <Input
              className="border-gray-200"
              type="number"
              value={payrollTax}
              onChange={(e) => setPayrollTax(e.target.value)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the currency, e.g. USD">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center text-sm">Currency :</span>
            <Select
              onValueChange={(value) => setCurrency(value)}
              value={currency}
            >
              <SelectTrigger className="border-solid border-[1px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
      </div>
    </section>
  );
};

export default DurationSelect;
