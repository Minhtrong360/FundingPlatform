import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";

const SalesSection = ({
  channelInputs,
  channelNames,
  addNewChannelInput,
  removeChannelInput,
  handleChannelInputChange,
}) => {
  const handleAddNewChannelInput = () => {
    const newChannelInput = {
      productName: "", // New field for product name
      price: 0,
      multiples: 0,
      txFeePercentage: 0,
      cogsPercentage: 0,
      selectedChannel: "",
    };
    addNewChannelInput(newChannelInput);
  };

  return (
    <section aria-labelledby="sales-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="sales-heading"
      >
        Sales Section
      </h2>

      {channelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Product Name:</span>
            <Input
              required
              className="col-start-2"
              value={input.productName}
              onChange={(e) =>
                handleChannelInputChange(index, "productName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Price:</span>
            <Input
              required
              className="col-start-2"
              value={input.price}
              onChange={(e) =>
                handleChannelInputChange(index, "price", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Multiples:</span>
            <Input
              required
              className="col-start-2"
              value={input.multiples}
              onChange={(e) =>
                handleChannelInputChange(index, "multiples", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Tx Fee (%):</span>
            <Input
              required
              className="col-start-2"
              value={input.txFeePercentage}
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "txFeePercentage",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">COGS (%):</span>
            <Input
              required
              className="col-start-2"
              value={input.cogsPercentage}
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "cogsPercentage",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Sales Channel:</span>
            <Select
              onValueChange={(value) =>
                handleChannelInputChange(index, "selectedChannel", value)
              }
              value={
                input.selectedChannel !== null ? input.selectedChannel : ""
              }
            >
              <SelectTrigger id={`select-channel-${index}`}>
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent position="popper">
                {channelNames.map((channelName, channelIndex) => (
                  <SelectItem key={channelIndex} value={channelName}>
                    {channelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Channel Allocation (%):</span>
            <Input
              required
              className="col-start-2"
              type="number"
              min="0"
              max="100"
              value={input.channelAllocation * 100} // Convert to percentage for display
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "channelAllocation",
                  e.target.value / 100
                )
              } // Convert back to fraction
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeChannelInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleAddNewChannelInput}
      >
        Add New
      </button>
    </section>
  );
};

export default SalesSection;
