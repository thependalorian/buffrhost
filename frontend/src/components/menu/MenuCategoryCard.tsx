/**
 * Menu Category Card Component for Buffr Host Frontend
 *
 * Displays menu categories with items and navigation.
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuItemCard } from "./MenuItemCard";

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image_url?: string;
  is_available: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  preparation_time?: number;
  calories?: number;
  ingredients?: string[];
  created_at: string;
  updated_at: string;
}

interface MenuCategoryCardProps {
  category: MenuCategory;
  onViewCategory?: (category: MenuCategory) => void;
  onAddItemToCart?: (item: MenuItem) => void;
  onViewItemDetails?: (item: MenuItem) => void;
  showItems?: boolean;
  maxItems?: number;
  className?: string;
}

export function MenuCategoryCard({
  category,
  onViewCategory,
  onAddItemToCart,
  onViewItemDetails,
  showItems = true,
  maxItems = 3,
  className,
}: MenuCategoryCardProps) {
  const availableItems = category.items.filter((item) => item.is_available);
  const displayedItems = showItems ? availableItems.slice(0, maxItems) : [];
  const hasMoreItems = availableItems.length > maxItems;

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      {category.image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={category.image_url}
            alt={category.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="flex-1">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold">
            {category.name}
          </CardTitle>
          <Badge variant={category.is_active ? "success" : "secondary"}>
            {category.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{category.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{availableItems.length} items available</span>
          {hasMoreItems && (
            <span>• {availableItems.length - maxItems} more</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {showItems && displayedItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Featured Items</h4>
            <div className="space-y-2">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-semibold text-sm">
                      {new Intl.NumberFormat("en-NA", {
                        style: "currency",
                        currency: item.currency,
                      }).format(item.price)}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddItemToCart?.(item)}
                      className="mt-1"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => onViewCategory?.(category)}
            className="flex-1"
            disabled={!category.is_active}
          >
            View Category
          </Button>

          {hasMoreItems && (
            <Button
              variant="outline"
              onClick={() => onViewCategory?.(category)}
              className="flex-1"
            >
              View All Items
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MenuCategoryCard;
