import { Card } from "@/components/ui/card";

type CropYieldChartProps = {
  data: Array<{
    name: string;
    yield: number;
    marketValue: number;
  }>;
};

export function CropYieldChart({ data }: CropYieldChartProps) {
  const maxYield = Math.max(...data.map(crop => crop.yield));
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Crop Yield Comparison</h3>
      <div className="space-y-4">
        {data.map((crop, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{crop.name}</span>
              <span>{crop.yield.toFixed(1)} t/ha</span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${(crop.yield / maxYield) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        * Based on data from the current agricultural season
      </p>
    </Card>
  );
}

type MarketValueChartProps = {
  data: Array<{
    name: string;
    marketValue: number;
  }>;
};

export function MarketValueChart({ data }: MarketValueChartProps) {
  const maxValue = Math.max(...data.map(crop => crop.marketValue));
  const sortedData = [...data].sort((a, b) => b.marketValue - a.marketValue);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Market Value Comparison</h3>
      <div className="space-y-4">
        {sortedData.map((crop, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{crop.name}</span>
              <span>₹{crop.marketValue}/kg</span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-green-600 rounded-full"
                style={{ width: `${(crop.marketValue / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        * Current market rates as of October 2025
      </p>
    </Card>
  );
}

type RegionDistributionChartProps = {
  data: Array<{
    name: string;
    region: string;
  }>;
};

export function RegionDistributionChart({ data }: RegionDistributionChartProps) {
  const regionCounts: Record<string, number> = {};
  
  data.forEach(crop => {
    if (!regionCounts[crop.region]) {
      regionCounts[crop.region] = 0;
    }
    regionCounts[crop.region]++;
  });
  
  const sortedRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({ region, count }));
  
  const total = data.length;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Regional Distribution</h3>
      <div className="space-y-4">
        {sortedRegions.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.region}</span>
              <span>{Math.round((item.count / total) * 100)}%</span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        * Distribution of crops across different regions
      </p>
    </Card>
  );
}

type SoilHealthChartProps = {
  data: Array<{
    location: string;
    pH: number;
    organicMatter: number;
  }>;
};

export function SoilHealthChart({ data }: SoilHealthChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Soil Health Indicators</h3>
      <div className="space-y-6">
        {data.map((soil, i) => (
          <div key={i} className="space-y-3">
            <h4 className="font-medium">{soil.location}</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">pH Level</span>
                <span className="text-sm">{soil.pH.toFixed(1)}</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 h-full rounded-full ${
                    soil.pH < 6.0 ? "bg-red-600" :
                    soil.pH > 7.5 ? "bg-yellow-500" :
                    "bg-green-600"
                  }`}
                  style={{ 
                    width: `${((soil.pH - 4) / 6) * 100}%`,
                    left: 0
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Acidic (4.0)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (10.0)</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Organic Matter</span>
                <span className="text-sm">{soil.organicMatter.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    soil.organicMatter < 1.5 ? "bg-red-600" :
                    soil.organicMatter > 3.0 ? "bg-green-600" :
                    "bg-yellow-500"
                  }`}
                  style={{ width: `${Math.min(100, (soil.organicMatter / 5) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (0%)</span>
                <span>Good (2.5%)</span>
                <span>Excellent (5%+)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}