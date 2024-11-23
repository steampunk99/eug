import React from 'react';
import { useCompareSchools } from "../../context/CompareContext";
import { Button } from "../ui/button";
import { X, School, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';

export default function ComparePage() {
  const { compareSchools, removeFromCompare, clearCompare } = useCompareSchools();
  const navigate = useNavigate();

  const compareFields = [
    { label: 'School Type', key: 'type' },
    { label: 'Category', key: 'category' },
    { label: 'District', key: school => school.location?.district || 'N/A' },
    { label: 'Region', key: school => school.location?.region || 'N/A' },
    { label: 'Tuition Fee', key: school => {
      const boardingFee = school.fees?.tuitionFee?.boardingStudent;
      return boardingFee ? new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX' 
      }).format(boardingFee) : 'N/A';
    }},
    { label: 'Student Population', key: school => school.stats?.studentCount || 'N/A' },
    { label: 'Curriculum', key: school => school.curriculum?.join(', ') || 'N/A' },
  ];

  if (compareSchools.length === 0) {
    return (
      <div className="min-h-screen dark:bg-background">
        <Header />
        <div className="container mx-auto py-20 text-center">
          <School className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-bold mb-4 dark:text-foreground">No Schools to Compare</h1>
          <p className="text-muted-foreground mb-8">
            Add schools to compare from the search page
          </p>
          <Button variant="outline" className='text-primary' onClick={() => navigate('/search')}>
            Go to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row border-primary/20 rounded-md  border justify-between items-center mb-8 p-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0 text-foreground">Compare Schools</h1>
          <Button variant="outline" size="sm" className="text-foreground" onClick={clearCompare}>
            Clear All

            <Trash  className='h-4 w-4 ml-1'/>
          </Button>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          {compareSchools.map(school => (
            <div key={school._id} className="mb-8 border border-primary/20 rounded-lg overflow-hidden text-foreground">
              {/* School Header */}
              <div className="relative h-[200px]">
                <img 
                  src={school.media?.logo || '/school-placeholder.jpg'}
                  alt={school.name}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{school.name}</h3>
                  <p className="text-sm opacity-80">
                    {school.location?.district || 'N/A'}, {school.location?.region || 'N/A'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:bg-black/20"
                  onClick={() => removeFromCompare(school._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* School Details */}
              {compareFields.map(field => (
                <div key={field.label} className="p-4 ">
                  <div className="font-medium mb-1 dark:text-foreground">{field.label}</div>
                  <div className="text-muted-foreground">
                    {typeof field.key === 'function' 
                      ? field.key(school)
                      : school[field.key] || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden rounded-md border border-primary/20 lg:grid  grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {/* Headers */}
          <div className="sticky p-3  left-0 bg-secondary rounded-l-md rounded-bl-md">
            <div className="h-[200px]" />
            {compareFields.map(field => (
              <div key={field.label} className="py-4 px-4 font-medium border-t border-primary/20 dark:text-foreground">
                {field.label}
              </div>
            ))}
          </div>

          {/* School Columns */}
          <div className=' rounded-md  w-full h-auto flex gap-4 p-2'>
          {compareSchools.map(school => (
            <div key={school._id} className="relative">
              {/* School Header */}
              <div className="h-[200px] relative group">
                <img 
                  src={school.media?.logo || '/school-placeholder.jpg'}
                  alt={school.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{school.name}</h3>
                  <p className="text-sm opacity-80">
                    {school.location?.district || 'N/A'}, {school.location?.region || 'N/A'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:bg-black/20"
                  onClick={() => removeFromCompare(school._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* School Details */}
              {compareFields.map(field => (
                <div key={field.label} className="py-4 px-4 border-t border-primary/20 dark:text-foreground">
                  {typeof field.key === 'function' 
                    ? field.key(school)
                    : school[field.key] || 'N/A'}
                </div>
                
              ))}
            </div>
            
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}