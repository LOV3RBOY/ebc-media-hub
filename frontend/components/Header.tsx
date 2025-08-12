import React from 'react';
import { Search, Filter, Image, Video, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'image' | 'video';
  onFilterChange: (type: 'all' | 'image' | 'video') => void;
}

export function Header({ searchQuery, onSearchChange, filterType, onFilterChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                EBC Media Hub
              </h1>
              <p className="text-sm text-slate-500">Communal media storage for staff</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/50 border-slate-200/50 focus:bg-white transition-colors"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-white/50 border-slate-200/50 hover:bg-white">
                  <Filter className="w-4 h-4" />
                  {filterType === 'all' ? 'All' : filterType === 'image' ? 'Images' : 'Videos'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onFilterChange('all')} className="gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  All Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('image')} className="gap-2">
                  <Image className="w-4 h-4" />
                  Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('video')} className="gap-2">
                  <Video className="w-4 h-4" />
                  Videos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
