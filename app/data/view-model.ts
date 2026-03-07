"use client";

import { useState } from 'react';

export type CropData = {
  id: string;
  name: string;
  variety: string;
  region: string;
  season: string;
  yield: number;
  plantingDate: string;
  harvestDate: string;
  waterRequirements: 'low' | 'medium' | 'high';
  soilType: string;
  pestResistance: 'low' | 'medium' | 'high';
  fertilizer: string[];
  marketValue: number;
};

export type SoilData = {
  id: string;
  location: string;
  type: string;
  pH: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  texture: string;
  waterHoldingCapacity: 'low' | 'medium' | 'high';
  lastTestedDate: string;
};

export type WeatherData = {
  id: string;
  date: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  description: string;
};

export type ViewMode = "table" | "cards";
export type SortOrder = "asc" | "desc";

export const sampleCropData: CropData[] = [
  {
    id: "c1",
    name: "Rice",
    variety: "Basmati",
    region: "North India",
    season: "Kharif",
    yield: 4.2,
    plantingDate: "2025-06-10",
    harvestDate: "2025-11-15",
    waterRequirements: "high",
    soilType: "Clay",
    pestResistance: "medium",
    fertilizer: ["Nitrogen", "Phosphorus"],
    marketValue: 45
  },
  {
    id: "c2",
    name: "Wheat",
    variety: "HD-2967",
    region: "Punjab",
    season: "Rabi",
    yield: 5.0,
    plantingDate: "2024-11-20",
    harvestDate: "2025-04-15",
    waterRequirements: "medium",
    soilType: "Loam",
    pestResistance: "high",
    fertilizer: ["Nitrogen", "Potassium"],
    marketValue: 25
  },
  {
    id: "c3",
    name: "Cotton",
    variety: "Bt Cotton",
    region: "Gujarat",
    season: "Kharif",
    yield: 2.8,
    plantingDate: "2025-05-15",
    harvestDate: "2025-11-30",
    waterRequirements: "medium",
    soilType: "Black",
    pestResistance: "high",
    fertilizer: ["Phosphorus", "Potassium"],
    marketValue: 75
  }
];

export const sampleSoilData: SoilData[] = [
  {
    id: "s1",
    location: "North Field",
    type: "Alluvial",
    pH: 7.2,
    organicMatter: 2.5,
    nitrogen: 280,
    phosphorus: 25,
    potassium: 180,
    texture: "Loam",
    waterHoldingCapacity: "medium",
    lastTestedDate: "2025-09-15"
  },
  {
    id: "s2",
    location: "South Field",
    type: "Black",
    pH: 6.8,
    organicMatter: 3.2,
    nitrogen: 320,
    phosphorus: 18,
    potassium: 210,
    texture: "Clay",
    waterHoldingCapacity: "high",
    lastTestedDate: "2025-09-10"
  }
];

export function useDataViewModel() {
  const [activeTab, setActiveTab] = useState("weather");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewType, setViewType] = useState<ViewMode>("table");

  const filteredCropData = sampleCropData
    .filter(crop => 
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.region.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * factor;
      } else if (sortBy === "yield") {
        return (a.yield - b.yield) * factor;
      } else if (sortBy === "marketValue") {
        return (a.marketValue - b.marketValue) * factor;
      }
      
      return 0;
    });
  
  const filteredSoilData = sampleSoilData
    .filter(soil => 
      soil.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soil.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      
      if (sortBy === "location") {
        return a.location.localeCompare(b.location) * factor;
      } else if (sortBy === "pH") {
        return (a.pH - b.pH) * factor;
      }
      
      return 0;
    });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    viewType,
    setViewType,
    filteredCropData,
    filteredSoilData,
    sampleCropData,
    sampleSoilData,
    clearSearch
  };
}