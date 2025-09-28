"use client";

import {
  FileText,
  Image,
  Video,
  Music,
  File,
  Upload,
  Download,
  Eye,
  Edit,
  Share,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Tag,
  BarChart,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  ModalForm,
  FormField,
  FormSelect,
  FormTextarea,
  ActionButton,
  DataTable,
  Alert,
} from "@/src/components/ui";

export default function EtunaCMSPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // Mock CMS content data
  const contentItems = [
    {
      id: "CONTENT001",
      title: "Hotel Lobby Gallery",
      type: "image",
      category: "gallery",
      status: "published",
      author: "Maria Garcia",
      createdDate: "2024-01-15",
      lastModified: "2024-01-16",
      size: "2.4 MB",
      dimensions: "1920x1080",
      tags: ["lobby", "interior", "gallery"],
      views: 156,
      downloads: 23,
      featured: true,
    },
    {
      id: "CONTENT002",
      title: "Restaurant Menu - Winter 2024",
      type: "document",
      category: "menu",
      status: "draft",
      author: "Ahmed Hassan",
      createdDate: "2024-01-14",
      lastModified: "2024-01-16",
      size: "1.2 MB",
      dimensions: "A4",
      tags: ["menu", "restaurant", "winter"],
      views: 89,
      downloads: 12,
      featured: false,
    },
    {
      id: "CONTENT003",
      title: "Conference Room Setup Video",
      type: "video",
      category: "facilities",
      status: "published",
      author: "Sarah Johnson",
      createdDate: "2024-01-13",
      lastModified: "2024-01-15",
      size: "45.6 MB",
      dimensions: "1920x1080",
      tags: ["conference", "video", "setup"],
      views: 234,
      downloads: 8,
      featured: true,
    },
    {
      id: "CONTENT004",
      title: "Spa Services Brochure",
      type: "document",
      category: "services",
      status: "published",
      author: "Fatima Al-Zahra",
      createdDate: "2024-01-12",
      lastModified: "2024-01-14",
      size: "3.1 MB",
      dimensions: "A4",
      tags: ["spa", "services", "brochure"],
      views: 178,
      downloads: 34,
      featured: false,
    },
    {
      id: "CONTENT005",
      title: "Room Amenities Photos",
      type: "image",
      category: "rooms",
      status: "published",
      author: "John Smith",
      createdDate: "2024-01-11",
      lastModified: "2024-01-13",
      size: "4.2 MB",
      dimensions: "1920x1080",
      tags: ["rooms", "amenities", "photos"],
      views: 312,
      downloads: 45,
      featured: true,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-primary" />;
      case "video":
        return <Video className="w-5 h-5 text-secondary" />;
      case "document":
        return <FileText className="w-5 h-5 text-accent" />;
      case "audio":
        return <Music className="w-5 h-5 text-info" />;
      default:
        return <File className="w-5 h-5 text-base-content" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="badge badge-success">Published</span>;
      case "draft":
        return <span className="badge badge-warning">Draft</span>;
      case "archived":
        return <span className="badge badge-neutral">Archived</span>;
      case "pending":
        return <span className="badge badge-info">Pending</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "draft":
        return <Edit className="w-4 h-4 text-warning" />;
      case "archived":
        return <Archive className="w-4 h-4 text-neutral" />;
      case "pending":
        return <Clock className="w-4 h-4 text-info" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Content Management</h1>
                  <p className="text-primary-content/80">
                    Comprehensive CMS for all content types
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <ActionButton
                onClick={() => setShowUploadModal(true)}
                icon={<Upload className="w-4 h-4" />}
                iconPosition="left"
              >
                Upload Content
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Content Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Content</div>
              <div className="stat-value text-primary">
                {contentItems.length}
              </div>
              <div className="stat-desc">Items managed</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Published</div>
              <div className="stat-value text-success">
                {contentItems.filter((c) => c.status === "published").length}
              </div>
              <div className="stat-desc">Live content</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <Edit className="w-8 h-8" />
              </div>
              <div className="stat-title">Drafts</div>
              <div className="stat-value text-warning">
                {contentItems.filter((c) => c.status === "draft").length}
              </div>
              <div className="stat-desc">In progress</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Eye className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Views</div>
              <div className="stat-value text-info">
                {contentItems.reduce((sum, item) => sum + item.views, 0)}
              </div>
              <div className="stat-desc">This month</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Types</option>
                  <option>Images</option>
                  <option>Videos</option>
                  <option>Documents</option>
                  <option>Audio</option>
                </select>
                <select className="select select-bordered">
                  <option>All Categories</option>
                  <option>Gallery</option>
                  <option>Menu</option>
                  <option>Facilities</option>
                  <option>Services</option>
                  <option>Rooms</option>
                </select>
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                  <option>Pending</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {contentItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-base-content/70 capitalize">
                        {item.type}
                      </p>
                      <p className="text-xs text-base-content/50">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Author:</span>
                    <span className="text-sm">{item.author}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm">{item.size}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dimensions:</span>
                    <span className="text-sm">{item.dimensions}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Views:</span>
                    <span className="text-sm">{item.views}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Downloads:</span>
                    <span className="text-sm">{item.downloads}</span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-2">
                  <div className="font-semibold text-sm text-base-content/70">
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-outline badge-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContent(item);
                      setShowEditModal(true);
                    }}
                    className="btn btn-ghost btn-sm"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Share">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CMS Features */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <FileText className="w-6 h-6 text-primary" />
              Buffr Host CMS Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Upload className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Multi-Format Support</div>
                  <div className="text-sm text-base-content/70">
                    Upload and manage images, videos, documents, and audio files
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Smart Organization</div>
                  <div className="text-sm text-base-content/70">
                    Categorize content with tags, collections, and custom
                    metadata
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Edit className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Version Control</div>
                  <div className="text-sm text-base-content/70">
                    Track changes, compare versions, and rollback when needed
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Workflow Management</div>
                  <div className="text-sm text-base-content/70">
                    Multi-step approval processes with role-based permissions
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Advanced Search</div>
                  <div className="text-sm text-base-content/70">
                    Full-text search with filters, tags, and metadata
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Analytics & Insights</div>
                  <div className="text-sm text-base-content/70">
                    Track content performance, usage statistics, and engagement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Content Modal */}
      <ModalForm
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        title="Upload Content"
        description="Upload and organize your content files"
        size="lg"
        onSubmit={async (data) => {
          alert("Content uploaded successfully!");
          setShowUploadModal(false);
        }}
        submitText="Upload Content"
        cancelText="Cancel"
      >
        <FormField
          label="Content Title"
          name="title"
          placeholder="Enter content title"
          required
        />

        <FormSelect
          label="Content Type"
          name="type"
          placeholder="Select content type"
          required
          options={[
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
            { value: "document", label: "Document" },
            { value: "audio", label: "Audio" },
          ]}
        />

        <FormSelect
          label="Category"
          name="category"
          placeholder="Select category"
          required
          options={[
            { value: "gallery", label: "Gallery" },
            { value: "menu", label: "Menu" },
            { value: "facilities", label: "Facilities" },
            { value: "services", label: "Services" },
            { value: "marketing", label: "Marketing" },
          ]}
        />

        <FormField
          label="File Upload"
          name="file"
          type="file"
          required
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <FormTextarea
          label="Description"
          name="description"
          placeholder="Describe your content"
          rows={3}
        />

        <FormField
          label="Tags (comma-separated)"
          name="tags"
          placeholder="tag1, tag2, tag3"
        />

        <FormField
          label="Alt Text (for accessibility)"
          name="altText"
          placeholder="Describe the image for screen readers"
        />
      </ModalForm>

      {/* Edit Content Modal */}
      <ModalForm
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setSelectedContent(null);
        }}
        title="Edit Content"
        description="Update content details and settings"
        size="lg"
        onSubmit={async (data) => {
          alert("Content updated successfully!");
          setShowEditModal(false);
          setSelectedContent(null);
        }}
        submitText="Save Changes"
        cancelText="Cancel"
      >
        {selectedContent && (
          <>
            <FormField
              label="Content Title"
              name="title"
              defaultValue={selectedContent.title}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              defaultValue={selectedContent.status}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" },
              ]}
            />

            <FormSelect
              label="Category"
              name="category"
              defaultValue={selectedContent.category}
              options={[
                { value: "gallery", label: "Gallery" },
                { value: "menu", label: "Menu" },
                { value: "facilities", label: "Facilities" },
                { value: "services", label: "Services" },
                { value: "marketing", label: "Marketing" },
              ]}
            />

            <FormTextarea
              label="Description"
              name="description"
              placeholder="Describe your content"
              rows={3}
            />

            <FormField
              label="Tags (comma-separated)"
              name="tags"
              defaultValue={selectedContent.tags?.join(", ")}
              placeholder="tag1, tag2, tag3"
            />

            <FormField
              label="Alt Text (for accessibility)"
              name="altText"
              placeholder="Describe the image for screen readers"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={selectedContent.featured}
                className="checkbox mr-2"
              />
              <label className="text-sm">Featured content</label>
            </div>
          </>
        )}
      </ModalForm>
    </div>
  );
}

/**
 * Etuna CMS Content Management - Professional Demo
 *
 * Comprehensive content management showcasing Buffr Host's CMS capabilities
 * Features document management, media library, templates, and workflow automation
 */
import Link from "next/link";

// Metadata moved to layout or removed for client component
