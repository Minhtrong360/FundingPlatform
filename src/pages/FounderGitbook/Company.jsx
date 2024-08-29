import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";

import { Label } from "../../components/ui/label";

import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import MultiSelectField from "../../components/MultiSelectField";
import countries from "../../components/Country";
import industries from "../../components/Industries";
import { formatNumber } from "../../features/CostSlice";
import { message } from "antd";

function Company({
  handleSubmit,
  formData,
  handleInputChange,
  handleIndustryChange,
  typeOfferingOptions,
}) {
  const [projectImageUrl, setProjectImageUrl] = useState(formData.project_url);
  const [cardImageUrl, setCardImageUrl] = useState(formData.card_url);

  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      message.warning("File size exceeds the maximum allowed size: 2MB.");
      event.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setProjectImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    handleInputChange({
      target: { name: "project_url", value: projectImageUrl },
    });
  }, [projectImageUrl]);

  useEffect(() => {
    setProjectImageUrl(formData.project_url);
  }, [formData.project_url]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleCardImageUpload = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      message.warning("File size exceeds the maximum allowed size: 2MB.");
      event.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCardImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    handleInputChange({
      target: { name: "card_url", value: cardImageUrl },
    });
  }, [cardImageUrl]);

  useEffect(() => {
    setCardImageUrl(formData.card_url);
  }, [formData.card_url]);

  const [years, setYears] = useState([]);

  useEffect(() => {
    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = 1900;
      const yearsArray = [];
      for (let year = startYear; year <= currentYear; year++) {
        yearsArray.push(year.toString());
      }
      return yearsArray;
    };
    const yearsList = generateYears();
    setYears(yearsList);
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Please fill in the basic information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                name="country"
                value={formData.country}
                onValueChange={(value) =>
                  handleInputChange({ target: { name: "country", value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="showAdditionalFields">
              Do you want to raise funds?
            </Label>
            <Switch
              id="showAdditionalFields"
              name="showAdditionalFields"
              checked={formData.showAdditionalFields === "Yes"}
              onCheckedChange={(checked) =>
                handleInputChange({
                  target: {
                    name: "showAdditionalFields",
                    value: checked ? "Yes" : "No",
                  },
                })
              }
            />
          </div>

          {formData.showAdditionalFields === "Yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-amount">Target amount</Label>
                <Input
                  id="target-amount"
                  name="target_amount"
                  value={formatNumber(formData.target_amount)}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer_type">Type offering</Label>
                <Select
                  id="offer_type"
                  name="offer_type"
                  value={formData.offer_type}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "offer_type", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOfferingOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket_size">Min ticket size</Label>
                <Input
                  id="ticket_size"
                  name="ticket_size"
                  value={formatNumber(formData.ticket_size)}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_ticket">No. ticket</Label>
                <Input
                  id="no_ticket"
                  name="no_ticket"
                  value={formData.no_ticket}
                  type="number"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueStatus">Annual revenue last year</Label>
                <Select
                  id="revenueStatus"
                  name="revenueStatus"
                  value={formData.revenueStatus}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "revenueStatus", value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$0 - $10k">$0 - $10k</SelectItem>
                    {/* Add more revenue ranges as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyWords">Keywords</Label>
                <Input
                  id="keyWords"
                  name="keyWords"
                  value={formData.keyWords}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter keywords"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer">Offer</Label>
                <Input
                  id="offer"
                  name="offer"
                  value={formData.offer}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Describe your offer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  type="url"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team size</Label>
                <Select
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "teamSize", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    {/* Add more team sizes as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountRaised">Raised before</Label>
                <Input
                  id="amountRaised"
                  name="amountRaised"
                  value={formatNumber(formData.amountRaised)}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationTime">Founded year</Label>
                <Select
                  id="operationTime"
                  name="operationTime"
                  value={formData.operationTime}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "operationTime", value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="round">Round</Label>
                <Select
                  id="round"
                  name="round"
                  value={formData.round}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "round", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select round" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                    {/* Add more rounds as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Company logo</Label>
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="link">
                <Input
                  placeholder="Enter logo URL"
                  value={formData.project_url}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "project_url", value: e.target.value },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="upload">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProjectImageUpload}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Profile Image</Label>
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="link">
                <Input
                  placeholder="Enter profile image URL"
                  value={formData.card_url}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "card_url", value: e.target.value },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="upload">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageUpload}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <MultiSelectField
              id="industry"
              name="industry"
              OPTIONS={industries}
              selectedItems={formData.industry}
              setSelectedItems={handleIndustryChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendly">Calendly</Label>
            <Input
              id="calendly"
              name="calendly"
              value={formData.calendly}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter Calendly link"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your company"
              className="h-32"
              required
              maxLength={700}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Company;
