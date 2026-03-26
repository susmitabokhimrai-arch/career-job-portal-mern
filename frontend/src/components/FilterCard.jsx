import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Remote", "Kathmandu", "Pokhara", "Lalitpur"],
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Data Science",
    ]
  },
  {
    filterType: "Stipend",
    array: ["0-5k", "5k-10k", "10k-20k","Unpaid"],
  },
  {
    filterType: "Duration",
    array: ["< 1 month", "1-3 months", "3-6 months", "6+ months"],
  },
]

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  const changeHandler = (value) => {
    setSelectedValue(value);

  }
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="text-lg font-bold">Filter Internships</h1>
      <hr className="mt-3" />
      < RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {
          filterData.map((data, index) => (
            <div>
              <h1 className="font-bold text-lg">{data.filterType}</h1>
              {
                data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`
                  return (
                    <div className="flex items-center space-x-2 my-2">
                      <RadioGroupItem value={item} id={itemId} />
                      <Label htmlFor={itemId}>{item}</Label>
                    </div>
                  )
                })
              }
            </div>
          ))
        }

      </RadioGroup>
    </div>
  )
}

export default FilterCard