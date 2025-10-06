"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2 } from "lucide-react";

import { WeatherTab } from "@/components/weather-tab";
import { SoilTab } from "@/components/soil-tab";
import { YieldPredictionTab } from "@/components/yield-prediction-tab";
import { CropsTab } from "@/components/crops-tab";

import { useDataViewModel } from "./view-model";

export default function DataPage() {
  const { 
    activeTab,
    setActiveTab,
    searchQuery,
    sortBy,
    sortOrder,
    viewType,
    sampleCropData,
    sampleSoilData
  } = useDataViewModel();

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Agricultural Data</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="weather" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
            <TabsTrigger value="yield">Yield Predictions</TabsTrigger>
            <TabsTrigger value="crops">Crop Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weather">
            <WeatherTab />
          </TabsContent>
          
          <TabsContent value="soil">
            <SoilTab 
              soilData={sampleSoilData}
              searchQuery={searchQuery}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </TabsContent>
          
          <TabsContent value="yield">
            <YieldPredictionTab 
              cropData={sampleCropData}
              soilData={sampleSoilData}
            />
          </TabsContent>
          
          <TabsContent value="crops">
            <CropsTab 
              cropData={sampleCropData}
              searchQuery={searchQuery}
              sortBy={sortBy}
              sortOrder={sortOrder}
              viewType={viewType}
            />
          </TabsContent>
        </Tabs>
        
        {/* Footer with metadata */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Last updated: October 7, 2025
          </div>
          <div>
            <Badge variant="outline">v1.2.0</Badge>
          </div>
        </div>
      </div>
    </Container>
  );
}