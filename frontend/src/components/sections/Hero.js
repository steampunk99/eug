import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, MapPin, Building2, ArrowRight } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const searchParams = new URLSearchParams({
      query: query.trim()
    }).toString();
    
    navigate(`/search?${searchParams}`);
  };

  const quickLinks = [
    { 
      icon: Building2, 
      label: 'International Schools', 
      params: { category: 'International', sortBy: 'name' }
    },
    { 
      icon: MapPin, 
      label: 'Schools in Central', 
      params: { region: 'Central', sortBy: 'name' }
    },
    { 
      icon: GraduationCap, 
      label: 'Top Boarding Schools', 
      params: { type: 'Boarding', sortBy: 'name' }
    },
  ];

  const featuredStats = [
    { value: '500+', label: 'Schools Listed' },
    { value: '4,000+', label: 'Student Reviews' },
    { value: '50+', label: 'Districts' },
  ];

  return (
    <div className="relative min-h-[100vh] text-foreground flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-white/[0.02] bg-[size:40px_40px]" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />

      {/* Animated Accent Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full 
          bg-gradient-to-r from-primary/30 to-purple-500/30 dark:from-primary/20 dark:to-purple-500/20 
          rounded-full blur-3xl animate-drift-slow" 
        />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full 
          bg-gradient-to-l from-primary/30 to-blue-500/30 dark:from-primary/20 dark:to-blue-500/20 
          rounded-full blur-3xl animate-drift-slow" 
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-8 mt-8">
            <Badge variant="outline" className="px-4 py-1 border-indigo-400/30 backdrop-blur">
              <span className="text-primary text-lg font-mono">New!</span> Compare schools side by side
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find the Perfect School for Your 
              <span className="block text-primary mt-2">Educational Journey</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare schools, read reviews, and make informed decisions about your education
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by school name, location, or category..."
                className="h-14 px-6 rounded-full border-2 border-primary/20 
                bg-background/50 backdrop-blur-sm 
                placeholder:text-muted-foreground/60 text-lg
                focus-visible:ring-primary/20 focus-visible:border-primary/30"
              />
              <Button 
                type="submit"
                size="icon"
                className="absolute right-2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {quickLinks.map(({ icon: Icon, label, params }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="rounded-full bg-transparent border-purple-500/30 hover:bg-primary/10 group"
                  onClick={() => navigate({
                    pathname: '/search',
                    search: new URLSearchParams(params).toString()
                  })}
                >
                  <Icon className="mr-2 h-4 w-4 text-primary" />
                  {label}
                  <ArrowRight className="ml-2 h-4 text-primary w-4 opacity-0 hover:text-primary group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          </form>

       

          {/* Trust Indicators */}
          <div className="pt-12">
            <div className="flex items-center justify-center gap-6 font-mono text-yellow-600">
              <span className=''>Trusted by leading schools</span>
              <span>•</span>
              <span>Updated daily</span>
              <span>•</span>
              <span>Verified reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
