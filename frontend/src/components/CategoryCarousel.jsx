import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "Data Analyst",
    "Quality Assurance"
]
const CategoryCarousel = () => {
    return (
        <div>
            <Carousel className="w-full max-w-4xl mx-auto mt-1">
  <CarouselContent className="-ml-4">
    {category.map((cat, index) => (
      <CarouselItem
        key={index}
        className="pl-4 md:basis-1/2 lg:basis-1/3"
      >
        <Button
          variant="outline"
          className="rounded-full w-full py-6 hover:bg-gray-100 transition"
        >
          {cat}
        </Button>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
        </div>
    )
}

export default CategoryCarousel