export default function MovieCardSkeleton() {
    return (
        <div className="rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-hidden">
            <div className="aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-1/4 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        </div>
    );
}
