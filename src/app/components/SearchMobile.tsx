"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/app/components/ui/select";
import { Search as Search_icon, MapPinCheckInside } from "lucide-react";

const SearchMobile = ({
  setSearch,
  location,
  setLocation,
  handleClickSearch,
}: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const placeholders = [
    "Find the events you're interested in",
    "Search for concerts, sports, and more",
    "Discover new events near you",
    "Explore upcoming events",
  ];

  // Mock location API
  const locationAPI = new Promise((res) => {
    setTimeout(() => {
      res([
        { city: "Delhi", country: "India" },
        { city: "Mumbai", country: "India" },
        { city: "New York", country: "USA" },
        { city: "London", country: "UK" },
        { city: "Paris", country: "France" },
        { city: "Tokyo", country: "Japan" },
        { city: "Sydney", country: "Australia" },
        { city: "Berlin", country: "Germany" },
        { city: "Toronto", country: "Canada" },
        { city: "Dubai", country: "UAE" },
        { city: "San Francisco", country: "USA" },
        { city: "Barcelona", country: "Spain" },
        { city: "Rome", country: "Italy" },
        { city: "Moscow", country: "Russia" },
        { city: "Beijing", country: "China" },
        { city: "Rio de Janeiro", country: "Brazil" },
        { city: "Cape Town", country: "South Africa" },
        { city: "Bangkok", country: "Thailand" },
      ]);
    }, 1000);
  });

  const [locationList, setLocationList] = useState([] as any[]);
  const [myLocation, setMyLocation] = useState(location);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  const [animationClass, setAnimationClass] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const interval = setInterval(() => {
        setAnimationClass("fade-out");
        setTimeout(() => {
          setCurrentPlaceholder((prev) => {
            const currentIndex = placeholders.indexOf(prev);
            const nextIndex = (currentIndex + 1) % placeholders.length;
            return placeholders[nextIndex];
          });
          setAnimationClass("fade-in");
        }, 500);
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
      country: loc.country,
    });
    setMyLocation({
      city: loc.city,
      country: loc.country,
    });
  };

  const handleSearch = () => {
    setSearch(searchTerm);
    handleClickSearch();
    setShowPopup(false);
  };

  return (
    <>
      {/* Search Button for Mobile */}
      <button
        aria-label="Open search"
        onClick={() => setShowPopup(true)}
        style={{
          background: "none",
          border: "none",
          fontSize: "2rem",
          cursor: "pointer",
        }}
      >
        <Search_icon />
      </button>

      {/* Fullscreen Mobile Search Overlay */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.95)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              width: "100vw",
              display: "flex",
              alignItems: "center",
              padding: "8px",
              gap: "8px",
              background: "#fff",
              borderBottom: "1px solid #eee",
            }}
          >
            <button
              aria-label="Close search"
              onClick={() => setShowPopup(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.8rem",
                color: "#333",
                marginRight: "8px",
              }}
            >
              ✖️
            </button>
            <input
              type="text"
              placeholder={currentPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              autoFocus
            />
            <Select>
              <SelectTrigger>
                <MapPinCheckInside />
                <span style={{ fontSize: "0.9rem", marginLeft: 4 }}>
                  {myLocation?.city}, {myLocation?.country}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    <span>Locations</span>
                    {locationList?.map((loc: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleLocationClick(loc)}
                        style={{ cursor: "pointer" }}
                      >
                        <SelectItem value={loc}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <MapPinCheckInside />
                            {loc?.city}, {loc?.country}
                          </div>
                        </SelectItem>
                      </div>
                    ))}
                  </SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
            <button
              onClick={handleSearch}
              style={{
                marginLeft: "8px",
                padding: "10px 16px",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "none",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchMobile;
