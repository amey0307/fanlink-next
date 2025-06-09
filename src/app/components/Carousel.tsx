'use client'
import React, { useEffect, useState } from 'react'

interface CarouselItem {
    type: 'image' | 'video';
    src: string;
}

function Carousel({ items }: { items: CarouselItem[] }, autoRotate = true, interval = 5000) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (autoRotate) {
            const timer = setInterval(() => {
                handleNext();
            }, interval);

            return () => clearInterval(timer);
        }
    }, [currentIndex, autoRotate, interval]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative w-[60vw] h-ful mx-auto mb-10">
            {/* Carousel Content */}
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
                {items?.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-500 ${index === currentIndex ? "translate-x-0" : "translate-x-full"
                            } ${index < currentIndex ? "-translate-x-full" : ""}`}
                    >
                        {item.type === "image" ? (
                            <img
                                src={item.src}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={item.src}
                                controls
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none"
            >
                ❮
            </button>
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none"
            >
                ❯
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-black scale-150 transition-all duration-200" : "bg-white"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Carousel
