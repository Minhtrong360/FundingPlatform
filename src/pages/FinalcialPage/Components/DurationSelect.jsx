import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDuration,
  setStartingCashBalance,
  setStatus,
  setIndustry,
  setIncomeTax,
  setPayrollTax,
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

const DurationSelect = ({ handleSubmit }) => {
  const dispatch = useDispatch();
  const {
    selectedDuration,
    startingCashBalance,
    status,
    industry,
    incomeTax,
    payrollTax,
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

  const formatNumber = (value) => {
    // Chuyển đổi giá trị thành chuỗi và loại bỏ tất cả các dấu phẩy
    const stringValue = value.toString().replace(/,/g, "");
    // Sử dụng regex để thêm dấu phẩy mỗi 3 chữ số
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (value) => {
    // Xóa dấu phẩy trong chuỗi giá trị
    const numberString = value.replace(/,/g, "");
    // Chuyển đổi chuỗi thành số
    const parsedNumber = parseFloat(numberString);
    // Kiểm tra nếu giá trị không phải là một số hợp lệ, trả về 0
    if (isNaN(parsedNumber)) {
      return 0;
    }
    return parsedNumber;
  };

  return (
    <section aria-labelledby="duration-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="duration-heading"
      >
        General Setup
      </h2>
      <div className="bg-white rounded-md shadow p-6 border">
        <Tooltip title="Enter the name of your business">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Business name :</span>

            <Input
              className="border-gray-200"
              value={financialProjectName}
              onChange={(e) =>
                dispatch(setFinancialProjectName(e.target.value))
              }
              type="text"
            />
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting month of the business">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Start Month :</span>
            <Select
              onValueChange={(value) => dispatch(setStartMonth(value))}
              value={startMonth}
            >
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
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Start Year :</span>
            <Select
              onValueChange={(value) => dispatch(setStartYear(value))}
              value={startYear}
            >
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
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Duration :</span>
            <Select
              onValueChange={(value) => dispatch(setSelectedDuration(value))}
            >
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
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">
              Starting Cash Balance :
            </span>

            <Input
              className="border-gray-200"
              value={formatNumber(startingCashBalance)}
              onChange={(e) =>
                dispatch(setStartingCashBalance(parseNumber(e.target.value)))
              }
              type="text"
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the status of the business, e.g. $10,000">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Status :</span>
            <Select
              onValueChange={(value) => dispatch(setStatus(value))}
              value={status}
            >
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
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">
              Business industry:
            </span>
            <Select
              onValueChange={(value) => dispatch(setIndustry(value))}
              value={industry}
            >
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
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Income Tax(%) :</span>
            <Input
              className="border-gray-200"
              type="text"
              value={formatNumber(incomeTax)}
              onChange={(e) =>
                dispatch(setIncomeTax(parseNumber(e.target.value)))
              }
            />
          </div>
        </Tooltip>

        <Tooltip title="Input the payroll tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Payroll Tax (%):</span>
            <Input
              className="border-gray-200"
              type="text"
              value={formatNumber(payrollTax)}
              onChange={(e) =>
                dispatch(setPayrollTax(parseNumber(e.target.value)))
              }
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the currency, e.g. USD">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className=" flex items-center text-sm">Currency :</span>
            <Select
              onValueChange={(value) => dispatch(setCurrency(value))}
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

      <button
        className="bg-blue-600 text-white py-1 px-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Save
      </button>
    </section>
  );
};

export default DurationSelect;
