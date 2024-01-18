import React from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "../components/ui/Select";

function NewsComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-xl font-semibold mb-6">General Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="start-date"
          >
            Start Date
          </label>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger id="start-date-month">
                <SelectValue placeholder="September" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="august">August</SelectItem>
                <SelectItem value="september">September</SelectItem>
                <SelectItem value="october">October</SelectItem>
                <SelectItem value="november">November</SelectItem>
                <SelectItem value="december">December</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger id="start-date-year">
                <SelectValue placeholder="2022" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="forecast-range"
          >
            Forecast Range (# of Years)
          </label>
          <Select>
            <SelectTrigger id="forecast-range">
              <SelectValue placeholder="3 Years" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="2">2 Years</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="starting-cash"
          >
            Starting Cash Balance
          </label>
          <div className="flex items-center">
            <Input id="starting-cash" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="income-tax"
          >
            Income Tax
          </label>
          <div className="flex items-center">
            <Input id="income-tax" placeholder="25.00" />
            <span className="text-sm font-medium ml-2">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="payroll-tax"
          >
            Payroll Tax
          </label>
          <div className="flex items-center">
            <Input id="payroll-tax" placeholder="15.30" />
            <span className="text-sm font-medium ml-2">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="industry">
            Industry
          </label>
          <Select>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Please Select an Option" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="currency">
            Currency
          </label>
          <Select>
            <SelectTrigger id="currency">
              <SelectValue placeholder="United States Dollar (USD)" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="usd">United States Dollar (USD)</SelectItem>
              <SelectItem value="eur">Euro (EUR)</SelectItem>
              <SelectItem value="gbp">British Pound (GBP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Update Project
        </Button>
      </div>
    </div>
  );
}

export default NewsComponent;
