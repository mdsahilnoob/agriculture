"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActivityLog, ActivityEntry, recordActivity } from "@/lib/activity";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, DownloadIcon, Clock, Search, Filter, X, ArrowUpDown, BarChart, 
         CalendarRange, Share2, AlertCircle, Printer, TrendingUp, Award, MapPin, ChevronDown,
         Activity, BarChart2, PieChart, LineChart, Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Container } from "@/components/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const activityIcons: Record<string, JSX.Element> = {
  mission: <Badge variant="default" className="bg-green-500">Mission</Badge>,
  quiz: <Badge variant="default" className="bg-blue-500">Quiz</Badge>,
  reward: <Badge variant="default" className="bg-amber-500">Reward</Badge>,
  login: <Badge variant="default" className="bg-purple-500">Login</Badge>,
  community: <Badge variant="default" className="bg-pink-500">Community</Badge>,
  marketplace: <Badge variant="default" className="bg-orange-500">Market</Badge>,
  weather: <Badge variant="default" className="bg-cyan-500">Weather</Badge>,
  sensor: <Badge variant="default" className="bg-indigo-500">Sensor</Badge>,
  learning: <Badge variant="default" className="bg-emerald-500">Learning</Badge>,
  chat: <Badge variant="default" className="bg-yellow-500">Chat</Badge>,
  default: <Badge variant="default" className="bg-gray-500">Action</Badge>
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return format(date, 'PPP p'); // Format: Apr 29, 2025, 3:00 PM
};

const sampleActivities: ActivityEntry[] = [
  { id: "1", type: "mission", message: "Completed Water Conservation Mission", payload: { points: 50, badges: ["water_saver"] }, ts: Date.now() - 5000 },
  { id: "2", type: "quiz", message: "Scored 8/10 on Sustainable Farming Quiz", payload: { score: 8, total: 10 }, ts: Date.now() - 3600000 },
  { id: "3", type: "login", message: "Logged in from new device", ts: Date.now() - 86400000 },
  { id: "4", type: "reward", message: "Earned Soil Expert Badge", payload: { badge: "soil_expert", level: 2 }, ts: Date.now() - 172800000 },
  { id: "5", type: "community", message: "Posted in Organic Farming forum", payload: { post: "How to make organic fertilizers at home?" }, ts: Date.now() - 259200000 },
  { id: "6", type: "marketplace", message: "Purchased Organic Seeds", payload: { item: "Tomato Seeds (Organic)", quantity: 2, points: 120 }, ts: Date.now() - 345600000 },
  { id: "7", type: "weather", message: "Set up weather alerts for your farm", payload: { location: "Delhi, India" }, ts: Date.now() - 432000000 },
  { id: "8", type: "sensor", message: "Connected soil moisture sensor", payload: { device: "SM100", location: "Field 1" }, ts: Date.now() - 518400000 },
  { id: "9", type: "learning", message: "Completed article on Crop Rotation", ts: Date.now() - 604800000 },
  { id: "10", type: "mission", message: "Started Organic Fertilizer Mission", ts: Date.now() - 691200000 },
]

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [timeframe, setTimeframe] = useState<"all" | "today" | "week" | "month">("all");
  const [viewType, setViewType] = useState<"list" | "compact" | "detailed">("list");

  useEffect(() => {
    const realActivities = getActivityLog();
    
    if (realActivities.length === 0) {
      sampleActivities.forEach(activity => {
        recordActivity({
          type: activity.type,
          message: activity.message,
          payload: activity.payload
        });
      });
      setActivities(sampleActivities);
    } else {
      setActivities(realActivities);
    }
    
    recordActivity({
      type: "navigation",
      message: "Viewed Activity Log"
    });
  }, []);

  const getTimeframeFilteredActivities = (list: ActivityEntry[]) => {
    if (timeframe === "all") return list;
    
    const today = new Date();
    const timeframeDate = timeframe === "today" ? today : 
                          timeframe === "week" ? subDays(today, 7) : 
                          subDays(today, 30);
                          
    return list.filter(activity => new Date(activity.ts) >= timeframeDate);
  };

  const filteredActivities = getTimeframeFilteredActivities(activities)
    .filter(activity => 
      activity.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(activity => 
      selectedTypes.length === 0 || selectedTypes.includes(activity.type)
    )
    .filter(activity => {
      if (!dateRange.from) return true;
      const activityDate = new Date(activity.ts);
      if (dateRange.to) {
        return activityDate >= dateRange.from && activityDate <= dateRange.to;
      }
      return activityDate >= dateRange.from;
    });

  const sortedActivities = [...filteredActivities].sort((a, b) => 
    sortBy === "newest" ? b.ts - a.ts : a.ts - b.ts
  );

  const activityTypes = activities.reduce<Record<string, number>>((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {});

  const availableTypes = Object.keys(activityTypes);
  
  const activityTrends = useMemo(() => {
    const today = new Date();
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      const activitiesOnDate = activities.filter(activity => {
        const activityDate = new Date(activity.ts);
        return isWithinInterval(activityDate, {
          start: startOfDay(date),
          end: endOfDay(date)
        });
      }).length;
      
      return {
        date: format(date, 'MMM dd'),
        count: activitiesOnDate
      };
    }).reverse();
    
    return last7Days;
  }, [activities]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setDateRange({ from: undefined, to: undefined });
  };

  const exportActivities = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedActivities, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `activity-log-${format(new Date(), 'yyyy-MM-dd')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Export successful",
      description: `${sortedActivities.length} activities exported to JSON`
    });
  };
  
  const shareActivities = () => {
    toast({
      title: "Sharing",
      description: "Sharing functionality will be implemented soon"
    });
  };

  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={shareActivities}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Export Activity Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose the format to export your activity data. This will download a file to your device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-24 border-dashed"
                    onClick={() => {
                      exportActivities();
                      document.querySelector('[data-dismissable]')?.click();
                    }}
                  >
                    <DownloadIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span>JSON Format</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 border-dashed"
                    onClick={() => {
                      toast({
                        title: "CSV Export",
                        description: "CSV export will be available soon"
                      });
                      document.querySelector('[data-dismissable]')?.click();
                    }}
                  >
                    <DownloadIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span>CSV Format</span>
                  </Button>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel data-dismissable>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="stats">Activity Stats</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {/* Time range selector */}
            <div className="mb-6">
              <div className="inline-flex p-1 bg-muted rounded-lg">
                <Button 
                  variant={timeframe === "all" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTimeframe("all")}
                  className="text-xs"
                >
                  All Time
                </Button>
                <Button 
                  variant={timeframe === "today" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTimeframe("today")}
                  className="text-xs"
                >
                  Today
                </Button>
                <Button 
                  variant={timeframe === "week" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTimeframe("week")}
                  className="text-xs"
                >
                  Last 7 Days
                </Button>
                <Button 
                  variant={timeframe === "month" ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTimeframe("month")}
                  className="text-xs"
                >
                  Last 30 Days
                </Button>
              </div>
            </div>
            
            {/* Search and filter row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search activities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter Types
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <div className="font-medium">Filter by activity type</div>
                      {availableTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-${type}`} 
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleTypeToggle(type)}
                          />
                          <label htmlFor={`filter-${type}`} className="text-sm flex items-center gap-2">
                            {activityIcons[type] || activityIcons.default}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d")
                        )
                      ) : (
                        "Date Range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange({
                        from: range?.from,
                        to: range?.to || range?.from
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-[140px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={viewType} onValueChange={(value) => setViewType(value as any)}>
                  <SelectTrigger className="w-[140px]">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">Standard View</SelectItem>
                    <SelectItem value="compact">Compact View</SelectItem>
                    <SelectItem value="detailed">Detailed View</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchQuery || selectedTypes.length > 0 || dateRange.from) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Quick stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Activity className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Activities</div>
                  <div className="text-2xl font-bold">{sortedActivities.length}</div>
                </div>
              </Card>
              
              <Card className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Users className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Activity Types</div>
                  <div className="text-2xl font-bold">{availableTypes.length}</div>
                </div>
              </Card>
              
              <Card className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                  <Award className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Latest Activity</div>
                  <div className="text-xl font-bold">
                    {activities.length > 0 
                      ? format(Math.max(...activities.map(a => a.ts)), 'MMM d')
                      : "None"}
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Most Active</div>
                  <div className="text-xl font-bold">
                    {Object.entries(activityTypes).length > 0
                      ? Object.entries(activityTypes).sort((a, b) => b[1] - a[1])[0][0]
                      : "None"}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Activity list */}
            <ScrollArea className="h-[600px] rounded-md border">
              {sortedActivities.length === 0 ? (
                <Card className="p-6 m-4 text-center text-muted-foreground">No activities match your filters</Card>
              ) : (
                viewType === "compact" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedActivities.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {activityIcons[entry.type] || activityIcons.default}
                          </TableCell>
                          <TableCell>{entry.message}</TableCell>
                          <TableCell>{format(new Date(entry.ts), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{format(new Date(entry.ts), 'h:mm a')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : viewType === "detailed" ? (
                  <div className="p-4 space-y-6">
                    {sortedActivities.map((entry) => (
                      <Accordion key={entry.id} type="single" collapsible className="border rounded-lg">
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-start gap-3 text-left">
                              <div className="mt-1">
                                {activityIcons[entry.type] || activityIcons.default}
                              </div>
                              <div>
                                <div className="font-medium">{entry.message}</div>
                                <div className="text-xs text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(entry.ts)}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm font-medium mb-1">Activity Type</div>
                                <div className="bg-muted p-2 rounded-md text-sm">
                                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                                </div>
                              </div>
                              
                              {entry.payload && (
                                <div>
                                  <div className="text-sm font-medium mb-1">Payload Details</div>
                                  <div className="bg-muted rounded-md p-3">
                                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                      {JSON.stringify(entry.payload, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <div className="text-sm font-medium mb-1">Timestamp</div>
                                <div className="bg-muted p-2 rounded-md text-sm">
                                  {new Date(entry.ts).toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="pt-2 flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
                                    toast({
                                      title: "Copied to clipboard",
                                      description: "Activity details copied successfully"
                                    });
                                  }}
                                >
                                  <Share2 className="h-4 w-4 mr-1" /> Share
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    window.print();
                                  }}
                                >
                                  <Printer className="h-4 w-4 mr-1" /> Print
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {sortedActivities.map((entry) => (
                      <Card key={entry.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {activityIcons[entry.type] || activityIcons.default}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-lg">{entry.message}</div>
                            {entry.payload && (
                              <div className="mt-2 bg-muted rounded-md p-3">
                                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(entry.payload, null, 2)}
                                </pre>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(entry.ts)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Activity Distribution</h3>
                  <Select defaultValue="chart">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="View as" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chart">Chart</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(activityTypes).map(([type, count]) => (
                    <div key={type}>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center">
                          {activityIcons[type] || activityIcons.default}
                          <span className="ml-2 text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count} activities</span>
                      </div>
                      <div className="relative">
                        <Progress value={(count / activities.length) * 100} className="h-2" />
                        <span className="absolute right-0 text-xs text-muted-foreground -top-1">
                          {Math.round((count / activities.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Data based on {activities.length} total activities
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Activity Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Activities</span>
                    <span className="font-medium">{activities.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>First Activity</span>
                    <span className="font-medium">{activities.length > 0 ? formatDate(Math.min(...activities.map(a => a.ts))) : "None"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Latest Activity</span>
                    <span className="font-medium">{activities.length > 0 ? formatDate(Math.max(...activities.map(a => a.ts))) : "None"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Most Common Type</span>
                    <span className="font-medium">
                      {Object.entries(activityTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Average Daily Activities</span>
                    <span className="font-medium">
                      {activities.length > 0 
                        ? (activities.length / 7).toFixed(1) 
                        : "0"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Most Active Day</span>
                    <span className="font-medium">
                      {activityTrends.length > 0 
                        ? activityTrends.sort((a, b) => b.count - a.count)[0].date 
                        : "None"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Weekly Activity Trend</h4>
                  <div className="flex items-end h-40 gap-1">
                    {activityTrends.map((day) => {
                      const maxCount = Math.max(...activityTrends.map(d => d.count));
                      const heightPercentage = maxCount === 0 ? 5 : Math.max(15, (day.count / maxCount) * 100);
                      
                      return (
                        <div key={day.date} className="flex flex-col items-center flex-1">
                          <div 
                            className={`bg-primary rounded-t-sm w-full ${
                              day.count === 0 ? 'h-[5%]' : 
                              day.count === maxCount ? 'h-[100%]' : 
                              heightPercentage <= 20 ? 'h-[20%]' : 
                              heightPercentage <= 40 ? 'h-[40%]' : 
                              heightPercentage <= 60 ? 'h-[60%]' : 
                              heightPercentage <= 80 ? 'h-[80%]' : 
                              'h-[90%]'
                            }`}
                          ></div>
                          <div className="text-xs text-muted-foreground mt-2">{day.date.split(' ')[1]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Activity Insights</h3>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Activity Pattern Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {activities.length > 0 
                        ? `Your most common activity is "${Object.entries(activityTypes).sort((a, b) => b[1] - a[1])[0][0]}" which makes up ${Math.round((Object.entries(activityTypes).sort((a, b) => b[1] - a[1])[0][1] / activities.length) * 100)}% of your total activity. You were most active on ${activityTrends.sort((a, b) => b.count - a.count)[0].date}.`
                        : "Not enough data to analyze activity patterns. Start using the app more to see insights here!"}
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-amber-500" />
                      Engagement Recommendations
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {activities.length > 5 
                        ? `Based on your activity history, try exploring more "${Object.entries(activityTypes).sort((a, b) => a[1] - b[1])[0][0]}" activities to increase your engagement across all areas.`
                        : "Complete more activities to receive personalized recommendations here!"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="mb-6 flex justify-between">
              <div className="inline-flex p-1 bg-muted rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                >
                  Day
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs"
                >
                  Week
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                >
                  Month
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                >
                  Year
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <MapPin className="h-4 w-4 mr-1" /> 
                Jump to latest
              </Button>
            </div>
            
            {sortedActivities.length === 0 ? (
              <Card className="p-6 m-4 text-center text-muted-foreground">No activities match your filters</Card>
            ) : (
              <div className="relative border-l-2 border-muted ml-4">
                {/* Group activities by date for better timeline visualization */}
                {Object.entries(
                  sortedActivities.reduce<Record<string, ActivityEntry[]>>((acc, activity) => {
                    const dateKey = format(new Date(activity.ts), 'yyyy-MM-dd');
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(activity);
                    return acc;
                  }, {})
                ).map(([dateKey, activitiesOnDate], groupIndex) => (
                  <div key={dateKey} className="mb-8">
                    <div className="absolute w-5 h-5 rounded-full bg-muted-foreground -left-[11px] border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-background">{activitiesOnDate.length}</span>
                    </div>
                    <div className="ml-6 mb-4">
                      <div className="text-sm font-medium">
                        {format(new Date(dateKey), 'PPPP')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activitiesOnDate.length} {activitiesOnDate.length === 1 ? 'activity' : 'activities'}
                      </div>
                    </div>
                    
                    {activitiesOnDate.map((activity, index) => (
                      <div key={activity.id} className="mb-6 ml-6">
                        <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] mt-1.5 border border-background"></div>
                        <time className="text-xs font-normal leading-none text-muted-foreground mb-1 block">
                          {format(new Date(activity.ts), 'p')}
                        </time>
                        <Card className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {activityIcons[activity.type] || activityIcons.default}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{activity.message}</h3>
                              {activity.payload && (
                                <div className="mt-2 bg-muted rounded-md p-2">
                                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(activity.payload, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(activity, null, 2));
                              toast({
                                title: "Copied to clipboard",
                                description: "Activity details copied successfully"
                              });
                            }}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Timeline end indicator */}
                <div className="flex items-center justify-center my-6 ml-6">
                  <div className="absolute w-3 h-3 rounded-full bg-muted-foreground -left-[7px] border border-background"></div>
                  <Card className="px-4 py-2 text-center text-sm text-muted-foreground">
                    End of timeline â€¢ {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'} total
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
