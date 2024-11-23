import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import SchoolCard from '../sections/SchoolCardSearch';  
import { Loader, Search, Trash, TrashIcon } from 'lucide-react';  // Add a loading icon from lucide
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";

import { X } from 'lucide-react';
import Header from './Header';
import { BarLoader } from 'react-spinners';


const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    region: '',
    type: '',
    category: '',
    curriculum: '',
    
    sortBy: 'name',
  });
  
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);  // Loading state

  const [recentSearches, setRecentSearches] = useState([]);


  const regions = ['Central', 'Eastern', 'Northern', 'Western'];
  


  const clearFilters = () => {
    setSearchParams({
      query: '',
      region: '',
      type: '',
      category: '',
      curriculum: '',
      
      sortBy: 'name',
    });
    setSchools([]);

  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const activeParams = Object.entries(searchParams)
        .filter(([_, value]) => value)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      if (Object.keys(activeParams).length === 0) {
        setSchools([]);
        setLoading(false);
        return;
      }

      const queryString = new URLSearchParams(activeParams).toString();
      const API_URL = process.env.REACT_APP_DEV || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/schools/search?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSchools(data.data);
        calculateStats(data.data);
       
      } else {
        setSchools([]);
      
      }
    } catch (error) {
      console.error("Search failed", error);
      setSchools([]);
    
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const [activeFilters, setActiveFilters] = useState([]);

  const removeFilter = (filterKey) => {
    const newParams = { ...searchParams };
    delete newParams[filterKey];
    setSearchParams(newParams);
  };

  // Define categories to match backend enum
  const categories = ['Government', 'Private', 'Religious', 'International'];

 

  // Update the URL params effect to not trigger search automatically
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = Object.fromEntries(urlParams.entries());
    
    if (Object.keys(urlQuery).length > 0) {
      setSearchParams(prev => ({
        ...prev,
        ...urlQuery
      }));
      // Only search if there are URL parameters
      handleSearch();
    }
  }, []); // Run once on mount

  const handleSchoolSelect = async (school) => {
    // Call this when a school card is clicked
 
  };

  const [stats, setStats] = useState({
    totalResults: 0,
    
    schoolTypes: {},
    regionBreakdown: {},
  
  });

  const calculateStats = (schoolsData) => {
    if (!schoolsData || schoolsData.length === 0) {
      setStats({
        totalResults: 0,
        
        schoolTypes: {},
        regionBreakdown: {},
       
      });
      return;
    }

    const newStats = {
      totalResults: schoolsData.length,
      schoolTypes: {},
      regionBreakdown: {},
      
    
    };

    schoolsData.forEach(school => {
      // Count school types (with null check)
      if (school.type) {
        newStats.schoolTypes[school.type] = (newStats.schoolTypes[school.type] || 0) + 1;
      }
      
      // Count regions (with null check)
      if (school.region) {
        newStats.regionBreakdown[school.region] = (newStats.regionBreakdown[school.region] || 0) + 1;
      }
      
    
    });

  

    setStats(newStats);
  };

  return (
  <>
  <Header/>
 
    <div className=" mx-auto bg-background text-foreground border ">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6   rounded-md w-full p-6">
        {/* Left Sidebar - Filters */}
        <div className="md:col-span-3 order-2 md:order-1">
          <div className="sticky top-4 space-y-2">
            <Card className="p-6 border-2 border-primary/10 ">
              <div className="space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">Filters</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearFilters}
                    className=""
                  >
                    Clear All
                    <TrashIcon className='h-4 w-4 ml-2' />
                    
                  </Button>
                </div>

                <Separator className="bg-primary/10" />

                {/* Active Filters */}
                {Object.keys(searchParams).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Active Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(searchParams).map(([key, value]) => (
                        value && (
                          <Badge 
                            key={key}
                            variant="secondary"
                            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20"
                          >
                            {key}: {value}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeFilter(key)}
                            />
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* School Type */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">School Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Day', 'Boarding', 'Mixed'].map((type) => (
                      <Button
                        key={type}
                        variant={searchParams.type === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchParams({...searchParams, type})}
                        className="w-full justify-start"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Updated Category Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-primary">School Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={searchParams.category === category}
                          onCheckedChange={() => 
                            setSearchParams({...searchParams, category})
                          }
                          className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label 
                          htmlFor={`category-${category}`}
                          className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

         

                {/* Tuition Range */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Tuition Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0]}
                      max={2000000}
                      step={100000}
                      value={[searchParams.maxTuition || 0]}
                      onValueChange={([value]) => 
                        setSearchParams({...searchParams, maxTuition: value})
                      }
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0 UGX</span>
                      <span>{(searchParams.maxTuition || 0).toLocaleString()} UGX</span>
                    </div>
                  </div>
                </div>

              

                {/* Location */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Location</h4>
                  <Select
                    value={searchParams.region}
                    onValueChange={(value) => 
                      setSearchParams({...searchParams, region: value})
                    }
                  >
                    <SelectTrigger className="w-full border-primary/20">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Central', 'Eastern', 'Northern', 'Western'].map((region) => (
                        <SelectItem 
                          key={region} 
                          value={region}
                          className="hover:bg-primary/10"
                        >
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                
                </div>

                {/* Apply Filters Button */}
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSearch}
                >
                  Apply Filters
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content - Search Results */}
        <div className="md:col-span-6 order-1 md:order-2">
          <div className="sticky top-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-6">
            <div className="p-4 ">
             

              <div className="relative flex items-center">
              <Input
                placeholder="Search school name..." 
                value={searchParams.query}
                onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
                className="h-14 px-6 rounded-full border-2 border-primary/20 
                bg-background/50 backdrop-blur-sm 
                placeholder:text-muted-foreground/60 text-lg
                focus-visible:ring-primary/20 focus-visible:border-primary/30"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                type="submit"
                size="icon"
                className="absolute right-2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            </div>
          </div>

          <div className="mb-4">
            {loading ? (
             <><BarLoader color='white'/></>
            ) : schools.length > 0 ? (
              <p className="text-sm text-muted-foreground">Found {schools.length} schools</p>
            ) : searchParams.query || searchParams.region || searchParams.type || searchParams.category ? (
              <p className="text-center text-muted-foreground">No schools match your search criteria</p>
            ) : (
              <p className="text-center text-muted-foreground">Use the search bar or filters to find schools</p>
            )}
          </div>

          <div className="max-w-xl justify-center align-middle space-y-4 pt-2">
            {schools.map((school) => (
              <SchoolCard key={school._id} school={school} />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Similar Schools & Stats */}
        <div className="md:col-span-3 order-3">
          <div className="sticky top-4 space-y-6">
          

            <Card className="p-6 border-2 border-primary/10">
              <h3 className="font-semibold mb-4 text-primary">Quick Stats</h3>
              <div className="space-y-4">
                {/* Total Results */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Schools</span>
                  <span className="font-medium">{stats.totalResults}</span>
                </div>


                {/* School Types Breakdown */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">School Types</span>
                  <div className="space-y-1">
                    {Object.entries(stats.schoolTypes || {}).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center text-xs">
                        <span>{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary/10 rounded-full w-20">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ 
                                width: `${stats.totalResults ? (count / stats.totalResults) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <span>{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SearchResults;
