'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrBadge,
  BuffrSelect,
} from '@/components/ui';

import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';
interface ContentItem {
  id: number;
  title: string;
  content_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  file_size?: number;
  mime_type?: string;
}

interface CMSStats {
  total_content: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  recent_uploads: number;
  storage_used: number;
}

/**
 * CMS Dashboard Page
 * Content Management System interface
 */
export default function CMSDashboardPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<CMSStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Documents' },
    { value: 'menu_item', label: 'Menu Items' },
    { value: 'room', label: 'Rooms' },
    { value: 'facility', label: 'Facilities' },
    { value: 'service', label: 'Services' },
    { value: 'event', label: 'Events' },
    { value: 'promotion', label: 'Promotions' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  useEffect(() => {
    fetchContent();
    fetchStats();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cms/content');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data['content'] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cms/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'all' || item.content_type === filterType;
    const matchesStatus =
      filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <BuffrIcon name="video" className="h-5 w-5" />;
      case 'audio':
        return <BuffrIcon name="music" className="h-5 w-5" />;
      case 'document':
        return <BuffrIcon name="file-text" className="h-5 w-5" />;
      default:
        return <BuffrIcon name="file-text" className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      draft: { color: 'bg-nude-100 text-nude-800', label: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-red-100 text-red-800', label: 'Archived' },
      scheduled: { color: 'bg-nude-100 text-nude-800', label: 'Scheduled' },
    };

    const config = statusConfig[status] || statusConfig['draft'];
    return <BuffrBadge className={config!.color}>{config!.label}</BuffrBadge>;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">
            Content Management
          </h1>
          <p className="text-nude-600 mt-2">
            Manage your property's content, media, and digital assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuffrButton>
            <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
            Add Content
          </BuffrButton>
          <BuffrButton variant="outline">
            <BuffrIcon name="upload" className="h-4 w-4 mr-2" />
            Upload
          </BuffrButton>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Total Content
              </BuffrCardTitle>
              <BuffrIcon
                name="file-text"
                className="h-4 w-4 text-muted-foreground"
              />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold">{stats.total_content}</div>
              <p className="text-xs text-muted-foreground">All content items</p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Images
              </BuffrCardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold">
                {stats.by_type['image'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Image files</p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Published
              </BuffrCardTitle>
              <BuffrIcon
                name="bar-chart-3"
                className="h-4 w-4 text-muted-foreground"
              />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold">
                {stats.by_status['published'] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Live content</p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Storage Used
              </BuffrCardTitle>
              <BuffrIcon
                name="folder"
                className="h-4 w-4 text-muted-foreground"
              />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.storage_used / 1024 / 1024)}MB
              </div>
              <p className="text-xs text-muted-foreground">Total storage</p>
            </BuffrCardContent>
          </BuffrCard>
        </div>
      )}

      {/* Permission Guard */}
      <PermissionGuard
        permission={Permission.CMS_READ}
        fallback={
          <BuffrCard>
            <BuffrCardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BuffrIcon
                  name="file-text"
                  className="h-12 w-12 text-nude-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-nude-900 mb-2">
                  Access Denied
                </h3>
                <p className="text-nude-600">
                  You don't have permission to access the CMS.
                </p>
              </div>
            </BuffrCardContent>
          </BuffrCard>
        }
      >
        <BuffrTabs defaultValue="content" className="space-y-6">
          <BuffrTabsList>
            <BuffrTabsTrigger value="content">Content Library</BuffrTabsTrigger>
            <BuffrTabsTrigger value="media">Media Library</BuffrTabsTrigger>
            <BuffrTabsTrigger value="pages">Pages</BuffrTabsTrigger>
            <BuffrTabsTrigger value="templates">Templates</BuffrTabsTrigger>
          </BuffrTabsList>

          {/* Content Library Tab */}
          <BuffrTabsContent value="content" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <div className="flex items-center justify-between">
                  <BuffrCardTitle>Content Library</BuffrCardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <BuffrIcon
                        name="search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nude-400"
                      />
                      <Input
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <BuffrSelect
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </BuffrSelect>
                    <BuffrSelect
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </BuffrSelect>
                    <BuffrButton variant="outline" size="sm">
                      <BuffrIcon name="filter" className="h-4 w-4 mr-2" />
                      Filter
                    </BuffrButton>
                  </div>
                </div>
              </BuffrCardHeader>
              <BuffrCardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContent.map((item) => (
                      <BuffrCard
                        key={item.id}
                        className="hover:shadow-luxury-strong transition-shadow duration-300"
                      >
                        <BuffrCardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getContentIcon(item.content_type)}
                              <span className="text-sm font-medium text-nude-600">
                                {item.content_type}
                              </span>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>

                          <h3 className="font-semibold text-nude-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>

                          <div className="text-sm text-nude-600 mb-3">
                            Created:{' '}
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <BuffrButton variant="outline" size="sm">
                              <BuffrIcon name="eye" className="h-4 w-4" />
                            </BuffrButton>
                            <BuffrButton variant="outline" size="sm">
                              <BuffrIcon name="edit" className="h-4 w-4" />
                            </BuffrButton>
                            <BuffrButton variant="outline" size="sm">
                              <BuffrIcon name="download" className="h-4 w-4" />
                            </BuffrButton>
                            <BuffrButton
                              variant="outline"
                              size="sm"
                              className="text-semantic-error"
                            >
                              <Trash2 className="h-4 w-4" />
                            </BuffrButton>
                          </div>
                        </BuffrCardContent>
                      </BuffrCard>
                    ))}
                  </div>
                )}
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Media Library Tab */}
          <BuffrTabsContent value="media" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Media Library</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-nude-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Media Library
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Upload and manage your media files
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="upload" className="h-4 w-4 mr-2" />
                    Upload Media
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Pages Tab */}
          <BuffrTabsContent value="pages" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Pages</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="file-text"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Page Builder
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Create and manage your property pages
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
                    Create Page
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Templates Tab */}
          <BuffrTabsContent value="templates" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Content Templates</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="settings"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Template Manager
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Create and manage content templates
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
                    Create Template
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>
        </BuffrTabs>
      </PermissionGuard>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
