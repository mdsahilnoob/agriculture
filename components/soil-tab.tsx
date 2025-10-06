"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample soil data
type SoilData = {
  id: string;
  location: string;
  type: string;
  pH: number;
  organicMatter: number; // percentage
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  texture: string;
  waterHoldingCapacity: 'low' | 'medium' | 'high';
  lastTestedDate: string; // ISO string
};

export function SoilTab({
  soilData,
  searchQuery,
  sortBy,
  sortOrder
}: {
  soilData: SoilData[];
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  // Filter and sort soil data
  const filteredSoilData = soilData
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
    
  return (
    <>
      {/* Soil Data Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="py-3 px-4 text-left font-medium">Location</th>
                <th className="py-3 px-4 text-left font-medium">Soil Type</th>
                <th className="py-3 px-4 text-left font-medium">pH</th>
                <th className="py-3 px-4 text-left font-medium">Organic Matter (%)</th>
                <th className="py-3 px-4 text-left font-medium">N (kg/ha)</th>
                <th className="py-3 px-4 text-left font-medium">P (kg/ha)</th>
                <th className="py-3 px-4 text-left font-medium">K (kg/ha)</th>
                <th className="py-3 px-4 text-left font-medium">Texture</th>
                <th className="py-3 px-4 text-left font-medium">Last Tested</th>
              </tr>
            </thead>
            <tbody>
              {filteredSoilData.map((soil) => (
                <tr key={soil.id} className="border-t hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{soil.location}</td>
                  <td className="py-3 px-4">{soil.type}</td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      soil.pH < 6.0 ? "destructive" :
                      soil.pH > 7.5 ? "secondary" : 
                      "default"
                    }>
                      {soil.pH.toFixed(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{soil.organicMatter.toFixed(1)}%</td>
                  <td className="py-3 px-4">{soil.nitrogen}</td>
                  <td className="py-3 px-4">{soil.phosphorus}</td>
                  <td className="py-3 px-4">{soil.potassium}</td>
                  <td className="py-3 px-4">{soil.texture}</td>
                  <td className="py-3 px-4">{new Date(soil.lastTestedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSoilData.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No soil data matching your search
          </div>
        )}
      </div>
      
      {/* Placeholder text for soil recommendations */}
      <Card className="mt-6 p-4 bg-muted/50">
        <h3 className="text-lg font-medium mb-2">Soil Health Recommendations</h3>
        <p className="text-muted-foreground">
          Based on your soil analysis, we recommend adding organic matter to improve soil structure and water retention.
          Consider crop rotation to maintain soil health. Soil testing should be done every 2-3 years.
        </p>
        <Button className="mt-4" variant="outline">
          View Detailed Recommendations
        </Button>
      </Card>
    </>
  );
}