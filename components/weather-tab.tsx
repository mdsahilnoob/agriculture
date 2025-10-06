"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WeatherTab() {
  return (
    <>
      {/* Data Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Current Weather Data</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="text-4xl">🌧️</div>
            <div className="text-right">
              <div className="text-2xl font-bold">28°C</div>
              <div className="text-sm text-muted-foreground">October 7, 2025</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Humidity</span>
              <span>65%</span>
            </div>
            <div className="flex justify-between">
              <span>Wind</span>
              <span>12 km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Precipitation</span>
              <span>40%</span>
            </div>
          </div>
          <Button className="w-full mt-4">View Detailed Forecast</Button>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Seasonal Rainfall Prediction</h3>
          <div className="h-[150px] flex items-end gap-2 mt-6 mb-2">
            {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${
                    i === 4 ? 'bg-primary' : 'bg-primary/30'
                  } rounded-t`} 
                  style={{ 
                    height: `${[40, 80, 100, 60, 50, 30][i]}px`
                  }}
                ></div>
                <div className="text-xs mt-2">{month}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Current month: October
          </div>
          <Button variant="outline" className="w-full mt-4">View Historical Data</Button>
        </Card>
      </div>
      
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Weather Alerts and Advisories</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 dark:bg-yellow-950 dark:border-yellow-500">
            <div className="flex items-center">
              <span className="text-yellow-700 font-medium dark:text-yellow-300">Rain Alert</span>
              <Badge className="ml-2" variant="outline">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Heavy rainfall expected in the next 48 hours. Consider delaying irrigation and harvesting activities.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 dark:bg-blue-950 dark:border-blue-500">
            <div className="flex items-center">
              <span className="text-blue-700 font-medium dark:text-blue-300">Irrigation Advisory</span>
              <Badge className="ml-2" variant="outline">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on soil moisture readings and upcoming weather, adjust irrigation schedule for optimal water usage.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}