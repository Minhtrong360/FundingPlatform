import { Input } from "../../../components/ui/Input";

const CustomerSection = ({
  customerInputs,
  addNewCustomerInput,
  removeCustomerInput,
  handleInputChange,
}) => {
  const handleAddNewCustomer = () => {
    const newCustomerInput = {
      customersPerMonth: 0,
      growthPerMonth: 0,
      channelName: "",
    };
    addNewCustomerInput(newCustomerInput);
  };

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
