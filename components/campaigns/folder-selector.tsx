'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, FolderOpen, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface DriveFolder {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  parents?: string[];
}

interface FolderSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  allowManualInput?: boolean;
}

export function FolderSelector({
  value,
  onValueChange,
  placeholder = 'Select a Google Drive folder',
  allowManualInput = true,
}: FolderSelectorProps) {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMode, setInputMode] = useState<'select' | 'manual'>(value && !folders.find(f => f.id === value) ? 'manual' : 'select');
  const { data: session } = useSession();

  // Cache folders in sessionStorage
  const CACHE_KEY = 'drive-folders-cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);
  const fetchFolders = async (force = false) => {
    if (!session?.user) return;

    // Check cache first
    if (!force) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setFolders(data);
            setHasFetched(true);
            return;
          }
        } catch {
          // Invalid cache, continue to fetch
        }
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/drive/folders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch folders');
      }

      const folderList = data.data || data.folders || [];
      setFolders(folderList);
      setHasFetched(true);

      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data: folderList,
        timestamp: Date.now()
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load folders';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch when dropdown is opened and we haven't fetched yet
  const handleOpenChange = (open: boolean) => {
    if (open && !hasFetched && session?.user) {
      fetchFolders();
    }
  };

  const handleRefresh = () => {
    fetchFolders(true);
  };

  const selectedFolder = folders.find((folder) => folder.id === value);

  // Auto-switch to manual mode if value exists but not in folders
  useEffect(() => {
    if (value && !selectedFolder && folders.length > 0 && inputMode === 'select') {
      setInputMode('manual');
    }
  }, [value, selectedFolder, folders, inputMode]);

  // If not authenticated, show manual input only
  if (!session?.user) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Google Drive Folder ID</span>
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Enter the Drive Folder ID"
        />
        <p className="text-xs text-muted-foreground">
          Right-click folder → Share → Link (ID is at the end)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">Google Drive Folder</span>
        {allowManualInput && (
          <div className="flex gap-1 ml-auto">
            <Button
              type="button"
              variant={inputMode === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('select')}
              className="h-6 px-2 text-xs"
            >
              Select
            </Button>
            <Button
              type="button"
              variant={inputMode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('manual')}
              className="h-6 px-2 text-xs"
            >
              Manual
            </Button>
          </div>
        )}
      </div>

      {inputMode === 'manual' ? (
        <div className="space-y-1">
          <Input
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Enter the Drive Folder ID"
          />
          <p className="text-xs text-muted-foreground">
            Right-click folder → Share → Link (ID is at the end)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Select value={value} onValueChange={onValueChange} onOpenChange={handleOpenChange}>
            <SelectTrigger>
              <div className="flex items-center gap-2 flex-1">
                <SelectValue placeholder={placeholder}>
                  {selectedFolder ? selectedFolder.name : placeholder}
                </SelectValue>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </SelectTrigger>
            <SelectContent>
              {error && (
                <div className="p-2 border-b">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed to load folders</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      className="h-6 px-2 ml-auto"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {!hasFetched && !isLoading && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Click to load your folders
                </div>
              )}

              {hasFetched && !isLoading && folders.length === 0 && !error && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No folders found in your Google Drive
                </div>
              )}

              {folders.length > 10 && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {filteredFolders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span>{folder.name}</span>
                  </div>
                </SelectItem>
              ))}

              {filteredFolders.length === 0 && searchQuery && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No folders match &quot;{searchQuery}&quot;
                </div>
              )}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Choose from your accessible folders</span>
            {hasFetched && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-6 px-2"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}