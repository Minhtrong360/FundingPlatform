import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"




import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "../components/ui/Select"

function CustomerInput() {
  return (
    <div className="max-w-md mx-auto">
      <section aria-labelledby="assumptions-heading" className="mb-8">
        <h2 className="text-lg font-semibold mb-4" id="assumptions-heading">
          Assumptions
        </h2>
        <div className="bg-white rounded-md shadow p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Acquisition Type</span>
            <Input className="col-start-2" placeholder="Annual Projection" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Revenue Streams</span>
            <Input className="col-start-2" placeholder="5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-medium">Monthly Spend</span>
            <Input className="col-start-2" placeholder="$0.00" />
          </div>
        </div>
      </section>
      <section aria-labelledby="customers-heading" className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center" id="customers-heading">
          <PencilIcon className="mr-2" />
          Customers
        </h2>
        <div className="bg-white rounded-md shadow p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Begin Projection</span>
            <Input className="col-start-2 bg-[#E6F4EA] text-[#27AE60]" placeholder="Sep 2022 - 1" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">End Projection</span>
            <Input className="col-start-2 bg-[#E6F4EA] text-[#27AE60]" placeholder="Aug 2025 - 36" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Customers per Month</span>
            <Input className="col-start-2" placeholder="950" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-medium">% Change per Month</span>
            <Input className="col-start-2" placeholder="5.00 %" />
          </div>
        </div>
      </section>
    </div>
  )
}

function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}


function NewsComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-xl font-semibold mb-6">General Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="start-date">
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
          <label className="block text-sm font-medium mb-1" htmlFor="forecast-range">
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
          <label className="block text-sm font-medium mb-1" htmlFor="starting-cash">
            Starting Cash Balance
          </label>
          <div className="flex items-center">
            <Input id="starting-cash" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="income-tax">
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
          <label className="block text-sm font-medium mb-1" htmlFor="payroll-tax">
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Project</Button>
      </div>
    </div>
  )
}

export default function test() {
return (
<div>
     <NewsComponent />
     <CustomerInput />
     </div>
  )
 }
