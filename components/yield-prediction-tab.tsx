"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CropYieldChart, 
  MarketValueChart, 
  RegionDistributionChart, 
  SoilHealthChart 
} from "@/components/data-charts";

// Sample data structure
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

export function YieldPredictionTab({ 
  cropData, 
  soilData 
}: { 
  cropData: CropData[],
  soilData: SoilData[]
}) {
  return (
    <>
      {/* Data Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CropYieldChart data={cropData} />
        <MarketValueChart data={cropData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RegionDistributionChart data={cropData} />
        <SoilHealthChart data={soilData} />
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Yield Prediction Model</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Our AI-powered yield prediction model considers soil health, weather patterns, crop varieties, and historical data to forecast potential yield. This helps farmers make informed decisions about resource allocation and market planning.
          </p>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Expected Yield for Current Season</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Rice (Basmati)</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">4.5</span>
                  <span className="text-sm text-muted-foreground">tons/ha</span>
                  <span className="text-xs text-green-600 ml-2">(+7.1%)</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Wheat (HD-2967)</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">4.8</span>
                  <span className="text-sm text-muted-foreground">tons/ha</span>
                  <span className="text-xs text-red-600 ml-2">(-4.0%)</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Maize (DHM-121)</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">5.8</span>
                  <span className="text-sm text-muted-foreground">tons/ha</span>
                  <span className="text-xs text-green-600 ml-2">(+5.5%)</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Cotton (Bt Cotton)</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">2.9</span>
                  <span className="text-sm text-muted-foreground">tons/ha</span>
                  <span className="text-xs text-green-600 ml-2">(+3.6%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline">View Detailed Predictions</Button>
            <Button>Get Custom Forecast</Button>
          </div>
        </div>
      </Card>
    </>
  );
}