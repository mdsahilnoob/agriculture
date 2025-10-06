import { Container } from "@/components/container";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLoading() {
  return (
    <Container>
      <div className="py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-[400px] mb-6" />
          
          {/* Search and filter skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[120px]" />
              <Skeleton className="h-9 w-[120px]" />
              <Skeleton className="h-9 w-[120px]" />
            </div>
          </div>
          
          {/* Activity list skeleton */}
          <div className="border rounded-md p-4 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-md">
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}