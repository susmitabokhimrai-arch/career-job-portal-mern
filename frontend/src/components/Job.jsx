import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const Job = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      {/* Top Section */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">2 days ago</p>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100"
        >
          <Bookmark className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-5">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src="https://img.freepik.com/premium-vector/creative-elegant-abstract-minimalistic-logo-design-vector-any-brand-company_1253202-137644.jpg" />
        </Avatar>

        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            Company Name
          </h2>
          <p className="text-sm text-gray-500">Nepal</p>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Frontend Developer
        </h1>
        <p className="text-sm text-gray-600 line-clamp-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-5">
        <Badge className="bg-blue-50 text-blue-600">
          12 Positions
        </Badge>
        <Badge className="bg-red-50 text-red-600">
          Part Time
        </Badge>
        <Badge className="bg-purple-50 text-purple-600">
          Remote
        </Badge>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1">
          Details
        </Button>
        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;