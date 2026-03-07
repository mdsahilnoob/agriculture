"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type CropData = {
  id: string;
  name: string;
  variety: string;
  region: string;
  season: string;
  yield: number;
  plantingDate: string; // ISO string
  harvestDate: string; // ISO string
  waterRequirements: 'low' | 'medium' | 'high';
  soilType: string;
  pestResistance: 'low' | 'medium' | 'high';
  fertilizer: string[];
  marketValue: number; // per kg/unit
};

export function CropsTab({
  cropData,
  searchQuery,
  sortBy,
  sortOrder,
  viewType
}: {
  cropData: CropData[];
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  viewType: "table" | "cards";
}) {
  const filteredCropData = cropData
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
  
  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Crops</div>
          <div className="text-3xl font-bold">{filteredCropData.length}</div>
          <div className="text-sm text-muted-foreground mt-2">
            Across {Array.from(new Set(filteredCropData.map(crop => crop.region))).length} regions
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Average Yield</div>
          <div className="text-3xl font-bold">
            {filteredCropData.length > 0 
              ? (filteredCropData.reduce((sum, crop) => sum + crop.yield, 0) / filteredCropData.length).toFixed(1)
              : "0"} t/ha
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Range: {filteredCropData.length > 0 ? Math.min(...filteredCropData.map(c => c.yield)) : "0"} - 
            {filteredCropData.length > 0 ? Math.max(...filteredCropData.map(c => c.yield)) : "0"} t/ha
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Average Market Value</div>
          <div className="text-3xl font-bold">
            â‚¹{filteredCropData.length > 0 
              ? (filteredCropData.reduce((sum, crop) => sum + crop.marketValue, 0) / filteredCropData.length).toFixed(0)
              : "0"}/kg
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Total potential: â‚¹{filteredCropData.reduce((sum, crop) => sum + crop.yield * 1000 * crop.marketValue, 0).toLocaleString()}
          </div>
        </Card>
      </div>
      
      {/* Data display - Table view */}
      {viewType === "table" && (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="py-3 px-4 text-left font-medium">Crop</th>
                  <th className="py-3 px-4 text-left font-medium">Variety</th>
                  <th className="py-3 px-4 text-left font-medium">Region</th>
                  <th className="py-3 px-4 text-left font-medium">Season</th>
                  <th className="py-3 px-4 text-left font-medium">Yield (t/ha)</th>
                  <th className="py-3 px-4 text-left font-medium">Market Value (â‚¹/kg)</th>
                  <th className="py-3 px-4 text-left font-medium">Water Req.</th>
                  <th className="py-3 px-4 text-left font-medium">Planting</th>
                  <th className="py-3 px-4 text-left font-medium">Harvest</th>
                </tr>
              </thead>
              <tbody>
                {filteredCropData.map((crop) => (
                  <tr key={crop.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{crop.name}</td>
                    <td className="py-3 px-4">{crop.variety}</td>
                    <td className="py-3 px-4">{crop.region}</td>
                    <td className="py-3 px-4">{crop.season}</td>
                    <td className="py-3 px-4">{crop.yield.toFixed(1)}</td>
                    <td className="py-3 px-4">â‚¹{crop.marketValue}</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        crop.waterRequirements === "high" ? "destructive" :
                        crop.waterRequirements === "medium" ? "default" : 
                        "outline"
                      }>
                        {crop.waterRequirements}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{new Date(crop.harvestDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCropData.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No crop data matching your search
            </div>
          )}
        </div>
      )}
      
      {/* Data display - Card view */}
      {viewType === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCropData.map((crop) => (
            <Card key={crop.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground">{crop.variety}</p>
                </div>
                <Badge variant={
                  crop.season === "Kharif" ? "default" :
                  crop.season === "Rabi" ? "secondary" : 
                  "outline"
                }>
                  {crop.season}
                </Badge>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Region:</span>
                  <p>{crop.region}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Soil Type:</span>
                  <p>{crop.soilType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Yield:</span>
                  <p className="font-medium">{crop.yield.toFixed(1)} t/ha</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Market Value:</span>
                  <p className="font-medium">â‚¹{crop.marketValue}/kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Water:</span>
                  <p>{crop.waterRequirements}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pest Resistance:</span>
                  <p>{crop.pestResistance}</p>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span>Plant: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span>Harvest: {new Date(crop.harvestDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-3 text-xs">
                View Details
              </Button>
            </Card>
          ))}
          
          {filteredCropData.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No crop data matching your search
            </div>
          )}
        </div>
      )}
    </>
  );
}