import { useEffect } from "react";
import { Input } from "../../../components/ui/Input";

const CustomerSection = ({
  selectedDuration,
  customerInputs,
  setCustomerInputs,
  customerGrowthData,
  setCustomerGrowthData,
  numberOfMonths,
  setCustomerGrowthChart,
  customerTableData,
  setCustomerTableData,
}) => {
  const handleAddNewCustomer = () => {
    setCustomerInputs([
      ...customerInputs,
      {
        customersPerMonth: 100,
        growthPerMonth: 10,
        channelName: "",
        beginMonth: 1,
        endMonth: numberOfMonths,
      },
    ]);
  };

  const removeCustomerInput = (index) => {
    const newInputs = [...customerInputs];
    newInputs.splice(index, 1);
    setCustomerInputs(newInputs);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...customerInputs];
    newInputs[index][field] = value;

    if (field === "beginMonth" || field === "endMonth") {
      const beginMonth = parseFloat(newInputs[index].beginMonth);
      const endMonth = parseFloat(newInputs[index].endMonth);

      if (field === "beginMonth" && beginMonth > endMonth) {
        newInputs[index].endMonth = value;
      } else if (field === "endMonth" && endMonth < beginMonth) {
        newInputs[index].beginMonth = value;
      }
    }

    setCustomerInputs(newInputs);
  };

  const calculateCustomerGrowth = (customerInputs) => {
    return customerInputs.map((channel) => {
      let customers = [];
      let currentCustomers = parseFloat(channel.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= channel.beginMonth && i <= channel.endMonth) {
          customers.push({
            month: i,
            customers: currentCustomers,
            channelName: channel.channelName,
          });
          currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
        } else {
          customers.push({
            month: i,
            customers: 0,
            channelName: channel.channelName,
          });
        }
      }
      return customers;
    });
  };

  const transformedCustomerData = {};
  customerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = customerInputs.find(
        (input) => input.channelName === data.channelName
      );

      if (customerInput) {
        if (!transformedCustomerData[data.channelName]) {
          transformedCustomerData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        // Check if the month is within the range
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedCustomerData[data.channelName][`month${data.month}`] =
            parseFloat(data.customers).toFixed(2);
        } else {
          // Set value to 0 if outside the range
          transformedCustomerData[data.channelName][`month${data.month}`] =
            "0.00";
        }
      }
    });
  });

  const tableData = Object.values(transformedCustomerData).map((row) => {
    for (let month = 1; month <= numberOfMonths; month++) {
      if (!row.hasOwnProperty(`month${month}`)) {
        row[`month${month}`] = "0.00";
      }
    }
    return row;
  });

  useEffect(() => {
    setCustomerTableData(tableData);
  }, [numberOfMonths, customerGrowthData]);

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      selectedDuration
    );
    setCustomerGrowthData(calculatedData);
  }, [customerInputs, selectedDuration]);

  useEffect(() => {
    const seriesData = customerTableData.map((channelData) => {
      const channelName = channelData.channelName || "Unknown Channel";
      const data = [];

      // Lặp qua từng tháng (month1 đến month36) và lấy dữ liệu customers tương ứng
      for (let i = 1; i <= numberOfMonths; i++) {
        const monthKey = `month${i}`;
        data.push(parseFloat(channelData[monthKey]) || 0); // Chuyển đổi thành số và mặc định là 0 nếu không có giá trị hợp lệ
      }

      return {
        name: channelName,
        data: data,
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));
  }, [customerTableData]);

  return (
    <section aria-labelledby="customers-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="customers-heading"
      >
        Customer
      </h2>

      {customerInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Channel Name:</span>
            <Input
              required
              className="col-start-2"
              value={input.channelName}
              onChange={(e) =>
                handleInputChange(index, "channelName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Customers Per Month:</span>
            <Input
              required
              className="col-start-2"
              value={input.customersPerMonth}
              onChange={(e) =>
                handleInputChange(index, "customersPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Growth Per Month:</span>
            <Input
              required
              className="col-start-2"
              value={input.growthPerMonth}
              onChange={(e) =>
                handleInputChange(index, "growthPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Begin Month:</span>
            <Input
              required
              className="col-start-2"
              type="number"
              min="1"
              value={input.beginMonth}
              onChange={(e) =>
                handleInputChange(index, "beginMonth", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">End Month:</span>
            <Input
              required
              className="col-start-2"
              type="number"
              min="1"
              value={input.endMonth}
              onChange={(e) =>
                handleInputChange(index, "endMonth", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeCustomerInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleAddNewCustomer}
      >
        Add New
      </button>
    </section>
  );
};

export default CustomerSection;
