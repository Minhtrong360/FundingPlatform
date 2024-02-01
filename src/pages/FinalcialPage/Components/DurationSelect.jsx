import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";

const DurationSelect = ({
  financeName,
  setFinanceName,
  selectedDuration,
  setSelectedDuration,
}) => {
  return (
    <section aria-labelledby="duration-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        id="duration-heading"
      >
        Duration
      </h2>
      <div className="bg-white rounded-md shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium">Finance name:</span>
          <Input
            required
            className="col-start-2"
            value={financeName}
            onChange={(e) => setFinanceName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium">Duration</span>
          <Select onValueChange={(value) => setSelectedDuration(value)}>
            <SelectTrigger id="start-date-year">
              <SelectValue placeholder={selectedDuration} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="3 years">3 years</SelectItem>
              <SelectItem value="5 years">5 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default DurationSelect;
