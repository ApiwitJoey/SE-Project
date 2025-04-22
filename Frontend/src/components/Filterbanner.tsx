"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterBanner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get current filter values from URL or set defaults
    const [nameFilter, setNameFilter] = useState(searchParams.get('name') || '');
    const [timeFilter, setTimeFilter] = useState(searchParams.get('time') || '');

    const timeOptions = [
        "00:00", "01:00", "02:00", "03:00", "04:00",
        "05:00", "06:00", "07:00", "08:00", "08:00",
        "09:00", "10:00", "11:00", "12:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00",
        "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"
    ];
    
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build query params
        const params = new URLSearchParams();
        
        if (nameFilter) params.append('name', nameFilter);
        if (timeFilter) params.append('time', timeFilter);
        
        // Redirect to the same page with filters
        router.push(`/shops?${params.toString()}`);
    };
    
    const clearFilters = () => {
        setNameFilter('');
        setTimeFilter('');
        router.push('/shops');
    };
    
    return (
        <div className="bg-emerald-200 rounded-xl p-5 mb-8 border border-emerald-100 shadow-sm">
            <form onSubmit={handleFilter}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/*Shop Name Filter*/}
                    <div>
                        <label htmlFor="name-filter" className="block text-sm font-medium text-emerald-700 mb-1">
                            Shop Name
                        </label>
                        <input
                            id="name-filter"
                            type="text"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Search by name"
                            className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-black"
                        />
                    </div>
                    
                    {/* Time Filter */}
                    <div>
                        <label htmlFor="time-filter" className="block text-sm font-medium text-emerald-700 mb-1">
                            Available At
                        </label>
                        <select
                            id="time-filter"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-black"
                        >
                            <option value="">Any time</option>
                             {timeOptions.map((time) => (
                                 <option key={time} value={time}>
                                     {time}
                                 </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex justify-end mt-4 space-x-3">
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 text-emerald-600 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50"
                    >
                        Clear Filters
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>
        </div>
    );
}