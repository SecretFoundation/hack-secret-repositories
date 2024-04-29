import { Skeleton } from "@/components/ui/skeleton";

export default function Loader({ count }) {
  const renderComponentThreeTimes = () => {
    const timesToRender = count;

    return Array.from({ length: timesToRender }, (_, index) => (
      <div key={index}>
        <Skeleton className="h-[272px] w-full rounded-xl bg-[#161833a0]" />
        <div className="mt-3 space-y-3">
          <Skeleton className="h-4 w-full bg-[#161833a0]" />
          <Skeleton className="h-4 w-[250px] bg-[#161833a0]" />
          <Skeleton className="h-4 w-[200px] bg-[#161833a0]" />
        </div>
      </div>
    ));
  };
  return (
    <>
      <div className={`grid grid-cols-${count} gap-4`}>
        {renderComponentThreeTimes()}
      </div>
    </>
  );
}
