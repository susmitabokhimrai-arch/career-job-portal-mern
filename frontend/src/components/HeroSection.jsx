import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const HeroSection = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-12 pb-6 px-4">
            <div className="flex flex-col items-center gap-2 text-center">

                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wide">
                    No. 1 Job Hunt Website
                </span>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Search, Apply & <span className='block text-blue-600'>
                    Get Your Dream Jobs</span>
                </h1>

                <p className="text-gray-500 max-w-lg text-sm">
                    Discover jobs that fit your passion and skills. Connect with trusted recruiters and start your journey toward a brighter future today.
                </p>

                <div className="flex w-full max-w-lg shadow-md border border-gray-200 pl-3 pr-1 py-1 rounded-full items-center gap-2">
                    <input
                        type="text"
                        placeholder="Find Your Dream Jobs"
                        className="outline-none border-none w-full text-base"
                    />
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default HeroSection