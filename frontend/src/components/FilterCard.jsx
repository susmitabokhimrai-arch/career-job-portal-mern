import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Banglore", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Data Science",
    ],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "40k-1lakh", "1lakh-5lakh"],
  },
];

const FilterCard = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h1 className="text-lg font-bold text-gray-800">Filter Jobs</h1>
      <hr className="my-4" />

      {filterData.map((data, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            {data.filterType}
          </h2>

          <RadioGroup className="space-y-3">
            {data.array.map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <RadioGroupItem
                  value={item}
                  id={`${item}-${i}`}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label
                  htmlFor={`${item}-${i}`}
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {item}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;