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
import { message, Switch } from "antd";
import { Progress } from "../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

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

  const [step, setStep] = React.useState(1);
  const totalSteps = 3;
  const [logoInputType, setLogoInputType] = React.useState("url");
  const [profileImageInputType, setProfileImageInputType] =
    React.useState("url");
  const [raiseFunds, setRaiseFunds] = React.useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  console.log("formData.showAdditionalFields", formData.showAdditionalFields);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
            Company Information
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Please fill in the information below. You can save and continue
            later.
          </p>
          <Progress value={(step / totalSteps) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold" htmlFor="name">
                      Company name
                    </Label>
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
                    <Label className="font-semibold" htmlFor="country">
                      Country
                    </Label>
                    <Select
                      id="country"
                      name="country"
                      value={formData.country || countries[0]}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "country", value },
                        })
                      }
                    >
                      <SelectTrigger className=" rounded-lg ">
                        <SelectValue>
                          {formData.country ? (
                            <span>{formData.country}</span>
                          ) : (
                            <span className="">{countries[0]}</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                  <Label className="font-semibold" htmlFor="website">
                    Website
                  </Label>
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
                  <Label className="font-semibold" htmlFor="operationTime">
                    Founded year
                  </Label>
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
                    <SelectTrigger className=" rounded-lg ">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Company logo</Label>
                  <div className="flex items-center space-x-4">
                    <RadioGroup
                      defaultValue="url"
                      className="flex space-x-4"
                      onValueChange={setLogoInputType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="logo-url" />
                        <Label className="font-semibold" htmlFor="logo-url">
                          URL
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="logo-file" />
                        <Label className="font-semibold" htmlFor="logo-file">
                          File Upload
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {logoInputType === "url" ? (
                    <Input
                      placeholder="Enter logo URL"
                      value={formData.project_url}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "project_url",
                            value: e.target.value,
                          },
                        })
                      }
                      className=" "
                    />
                  ) : (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="file:mx-4 file:px-4 file:rounded-md file:border-[0.5px] file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-50 hover:file:cursor-pointer"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex items-center space-x-4">
                    <RadioGroup
                      defaultValue="url"
                      className="flex space-x-4"
                      onValueChange={setProfileImageInputType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="profile-url" />
                        <Label className="font-semibold" htmlFor="profile-url">
                          URL
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="profile-file" />
                        <Label className="font-semibold" htmlFor="profile-file">
                          File Upload
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {profileImageInputType === "url" ? (
                    <Input
                      placeholder="Enter profile image URL"
                      value={formData.card_url}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "card_url", value: e.target.value },
                        })
                      }
                      className=" "
                    />
                  ) : (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCardImageUpload}
                      className="file:mx-4 file:px-4 file:rounded-md file:border-[0.5px] file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-50 hover:file:cursor-pointer"
                    />
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Funding Information
                </h2>
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="revenueStatus">
                    Annual revenue last year
                  </Label>
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
                    <SelectTrigger className=" rounded-lg ">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {[
                        "$0 - $10k",
                        "$10k - $50k",
                        "$50k - $100k",
                        "$100k - $500k",
                        "$500k - $1M",
                        "$1M - $5M",
                        ">$5M",
                        "Non-Profit",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="raised-before">
                    Previously raised amount
                  </Label>
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showAdditionalFields"
                    name="showAdditionalFields"
                    checked={formData.showAdditionalFields === "Yes"}
                    onChange={(checked) =>
                      handleInputChange({
                        target: {
                          name: "showAdditionalFields",
                          value: checked ? "Yes" : "No",
                        },
                      })
                    }
                    className="custom-switch"
                    style={{
                      backgroundColor:
                        formData.showAdditionalFields === "Yes"
                          ? "#1890ff"
                          : "#d9d9d9",
                    }}
                  />
                  <Label className="font-semibold" htmlFor="raise-funds">
                    Do you want to raise funds?
                  </Label>
                </div>
                {formData.showAdditionalFields === "Yes" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className="font-semibold"
                          htmlFor="target-amount"
                        >
                          Target amount
                        </Label>
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
                        <Label
                          className="font-semibold"
                          htmlFor="type-offering"
                        >
                          Type of offering
                        </Label>
                        <Select
                          id="offer_type"
                          name="offer_type"
                          value={formData.offer_type}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "offer_type", value },
                            })
                          }
                        >
                          <SelectTrigger className=" rounded-lg ">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {typeOfferingOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className="font-semibold"
                          htmlFor="min-ticket-size"
                        >
                          Min ticket size
                        </Label>
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
                        <Label className="font-semibold" htmlFor="no-ticket">
                          Number of tickets
                        </Label>
                        <Input
                          id="no_ticket"
                          name="no_ticket"
                          value={formatNumber(formData.no_ticket)}
                          type="text"
                          readOnly
                        />{" "}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold" htmlFor="offer">
                        Offer
                      </Label>
                      <Textarea
                        id="offer"
                        name="offer"
                        value={formData.offer}
                        onChange={handleInputChange}
                        placeholder="Describe your offer"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Company Details
                </h2>
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="industry">
                    Industry
                  </Label>
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
                  <Label className="font-semibold" htmlFor="team-size">
                    Team size
                  </Label>
                  <Select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "teamSize", value } })
                    }
                  >
                    <SelectTrigger className=" rounded-lg ">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {["1-10", "11-50", "51-200", "201-500", ">500"].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="keywords">
                    Keywords
                  </Label>
                  <Input
                    id="keyWords"
                    name="keyWords"
                    value={formData.keyWords}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter keywords, separated by commas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="font-semibold"
                    htmlFor="company-description"
                  >
                    Company description
                  </Label>
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
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="calendly">
                    Calendly
                  </Label>
                  <Input
                    id="calendly"
                    name="calendly"
                    value={formData.calendly}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter Calendly link"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
              <Button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
              </Button>
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto !bg-black !text-white"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-full sm:w-auto !bg-black !text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Company;
