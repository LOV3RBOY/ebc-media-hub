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
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-zinc-800/50 shadow-2xl shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5" />
      <div className="relative container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur-sm opacity-50" />
              <Grid3X3 className="relative w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                EBC Media Hub
              </h1>
              <p className="text-sm text-zinc-500">Communal media storage for staff</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-zinc-950/80 border-zinc-800/50 text-white placeholder:text-zinc-500 focus:bg-zinc-950 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-zinc-950/80 border-zinc-800/50 text-zinc-200 hover:bg-zinc-900/90 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/20 transition-all">
                  <Filter className="w-4 h-4" />
                  {filterType === 'all' ? 'All' : filterType === 'image' ? 'Images' : 'Videos'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-zinc-950/95 border-zinc-800/50 backdrop-blur-xl shadow-2xl shadow-black/50">
                <DropdownMenuItem onClick={() => onFilterChange('all')} className="gap-2 text-zinc-200 hover:bg-zinc-900/80 focus:bg-zinc-900/80 transition-colors">
                  <Grid3X3 className="w-4 h-4" />
                  All Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('image')} className="gap-2 text-zinc-200 hover:bg-zinc-900/80 focus:bg-zinc-900/80 transition-colors">
                  <Image className="w-4 h-4" />
                  Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange('video')} className="gap-2 text-zinc-200 hover:bg-zinc-900/80 focus:bg-zinc-900/80 transition-colors">
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
