import React, { useState, useEffect } from 'react';
import search_icon from '@/assets/icons/search.svg';
import location_icon from '@/assets/icons/location.svg';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/app/components/ui/select"

function Search({ search, setSearch, location, setLocation, handleClickSearch }: any) {

    const placeholders = [
        "Find the events you're interested in",
        "Search for concerts, sports, and more",
        "Discover new events near you",
        "Explore upcoming events"
    ];

    // Mock location API
    const locationAPI = new Promise((res, rej) => {
        setTimeout(() => {
            res([
                { city: 'Delhi', country: 'India' },
                { city: 'Mumbai', country: 'India' },
                { city: 'New York', country: 'USA' },
                { city: 'London', country: 'UK' },
                { city: 'Paris', country: 'France' },
                { city: 'Tokyo', country: 'Japan' },
                { city: 'Sydney', country: 'Australia' },
                { city: 'Berlin', country: 'Germany' },
                { city: 'Toronto', country: 'Canada' },
                { city: 'Dubai', country: 'UAE' },
                { city: 'San Francisco', country: 'USA' },
                { city: 'Barcelona', country: 'Spain' },
                { city: 'Rome', country: 'Italy' },
                { city: 'Moscow', country: 'Russia' },
                { city: 'Beijing', country: 'China' },
                { city: 'Rio de Janeiro', country: 'Brazil' },
                { city: 'Cape Town', country: 'South Africa' },
                { city: 'Bangkok', country: 'Thailand' }
            ]);
        }, 1000);
    });

    const [locationList, setLocationList] = useState([] as any[]);
    const [myLocation, setMyLocation] = useState(location);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
    const [animationClass, setAnimationClass] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            const interval = setInterval(() => {
                setAnimationClass('fade-out');
                setTimeout(() => {
                    setCurrentPlaceholder(prev => {
                        const currentIndex = placeholders.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % placeholders.length;
                        return placeholders[nextIndex];
                    });
                    setAnimationClass('fade-in');
                }, 500); // Match the duration of the fade-out animation
            }, 7000);

            return () => clearInterval(interval);
        }
    }, [placeholders, isFocused]);

    useEffect(() => {
        async function fetchLocations() {
            const res: any = await locationAPI;
            setLocationList(res);
        }
        fetchLocations();
    }, []);

    const handleLocationClick = (loc: any) => {
        setLocation({
            city: loc.city,
            country: loc.country
        });

        setMyLocation({
            city: loc.city,
            country: loc.country
        });
    }

    return (
        <div className='relative'>
            <div className='border-[1px] border-zinc-400 flex items-center gap-2 p-2 px-4 justify-between w-[40vw] z-10 dark: bg-white dark:bg-[#040f059a] dark:text-white rounded-md'>
                <div className='flex items-center gap-2 '>
                    <img src={search_icon} alt="Search Icon" className='w-8 h-8 dark:invert' />
                    <input
                        type="text"
                        className={`h-10 w-[20vw] pr-10 outline-none dark:bg-[#040f059a] ${animationClass}`}
                        placeholder={currentPlaceholder}
                        onChange={(e) => { setSearch(e.target.value) }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <div className='h-10 w-[1px] bg-zinc-400'></div>
                    <div className='flex items-center gap-2 relative'>
                        <Select>
                            <SelectTrigger>
                                <img src={location_icon} alt="Location Icon" className='w-8 h-8 hover:scale-110 cursor-pointer transition-all duration-200 dark:invert filter -hue-rotate-180' />
                                <p className='text-sm'>{myLocation?.city}, {myLocation?.country}</p>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        <span className='mx-auto'>Locations</span>
                                        {
                                            locationList?.map((loc: any, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        onMouseMove={() => handleLocationClick(loc)}>
                                                        <SelectItem
                                                            value={loc}
                                                        >
                                                            <div className='flex gap-1 items-center'>
                                                                <img src={location_icon}></img>{loc?.city}, {loc?.country}
                                                            </div>
                                                        </SelectItem>
                                                    </div>
                                                )
                                            })
                                        }
                                    </SelectLabel>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <button className='dark:bg-green-800 bg-zinc-700 p-2 rounded-md w-[5vw] text-white hover:w-[6vw] transition-all duration-200' onClick={handleClickSearch}>
                    Search
                </button>
            </div>
        </div>
    );
}

export default Search;