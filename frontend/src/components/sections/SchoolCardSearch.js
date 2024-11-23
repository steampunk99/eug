import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Users, GraduationCap, ArrowRight, School, CheckCircle, Plus, Check, Bookmark, BookMarked } from "lucide-react";
import { Button } from "../ui/button";
import SVGBadge from '../../assets/badge.svg';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useCompareSchools } from "../../context/CompareContext";

export default function SchoolCard({ school }) {
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompareSchools();
  const inCompare = isInCompare(school._id);
  
  const {
    _id,
    name,
    type,
    category,
    location,
    fees,
    stats,
    media,
    metadata,
  } = school;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
      style: 'currency', 
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (inCompare) {
      removeFromCompare(_id);
    } else {
      addToCompare(school);
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative"
      onClick={() => navigate(`/schools/${_id}`)}
    >
      {/* Compare Button - Absolute positioned */}
      <Button
        variant={inCompare ? "secondary" : "outline"}
        size="icon"
        onClick={handleCompareClick}
        className="absolute bottom-2 left-2 bg-background"
      >
        {inCompare ? (
          <>
            {/* <Check className="h-4 w-4 text-primary" /> */}
            {/* <span className="text-primary">Added</span> */}
            <BookMarked className="h-4 w-4 text-primary" />
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4 mr-2" />
            
          </>
        )}
      </Button>

      <div className="flex p-4 gap-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          {media?.logo ? (
            <img 
              src={media.logo} 
              alt={name}
              className="w-20 h-20 object-contain rounded-lg bg-white p-1 border"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-primary/5 flex items-center justify-center">
              <School className="w-8 h-8 text-primary/50" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-grow space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-primary group-hover:text-primary/90">
                {name}
                {metadata?.isVerified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <img src={SVGBadge} alt='badge' width="17" height="auto" className="ml-2 inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified School</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {location.district}, {location.region}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={category === 'Religious' ? 'secondary' : 'default'}>
                {category}
              </Badge>
              <Badge variant="outline">{type}</Badge>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary/70" />
              {stats?.studentCount || 'N/A'} students
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4 mr-2 text-primary/70" />
              {stats?.performanceRating || 'N/A'} rating
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">From </span>
              <span className="font-semibold text-primary">
                {fees?.tuitionFee?.dayStudent 
                  ? formatCurrency(fees.tuitionFee.dayStudent)
                  : 'N/A'}
              </span>
              <span className="text-muted-foreground"> per term</span>
            </div>
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary/90 p-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/schools/${_id}`);
              }}
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}