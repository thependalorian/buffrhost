/**
 * Menu Item Component for Buffr Host Frontend
 *
 * Displays individual menu items with pricing, descriptions, and actions.
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface MenuItemProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  onViewDetails?: (item: MenuItem) => void;
  showAddButton?: boolean;
  showDetailsButton?: boolean;
  className?: string;
}

export function MenuItem({
  item,
  onAddToCart,
  onViewDetails,
  showAddButton = true,
  showDetailsButton = true,
  className,
}: MenuItemProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-NA", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getDietaryBadges = () => {
    const badges = [];
    if (item.is_vegetarian)
      badges.push({ label: "Vegetarian", variant: "success" as const });
    if (item.is_vegan)
      badges.push({ label: "Vegan", variant: "success" as const });
    if (item.is_gluten_free)
      badges.push({ label: "Gluten Free", variant: "outline" as const });
    return badges;
  };

  const dietaryBadges = getDietaryBadges();

  return (
    <Card className={cn("h-full flex flex-col w-full", className)}>
      {item.image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="flex-1">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <CardTitle className="text-base font-semibold sm:text-lg">
            {item.name}
          </CardTitle>
          <div className="text-left sm:text-right">
            <div className="text-lg font-bold text-primary sm:text-xl">
              {formatPrice(item.price, item.currency)}
            </div>
            {item.preparation_time && (
              <div className="text-xs text-muted-foreground sm:text-sm">
                {item.preparation_time} min
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm line-clamp-2">
          {item.description}
        </p>

        {dietaryBadges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dietaryBadges.map((badge) => (
              <Badge key={badge.label} variant={badge.variant} size="sm">
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Allergens:</span>{" "}
            {item.allergens.join(", ")}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          {showAddButton && (
            <Button
              onClick={() => onAddToCart?.(item)}
              disabled={!item.is_available}
              className="w-full sm:flex-1"
            >
              {item.is_available ? "Add to Cart" : "Unavailable"}
            </Button>
          )}

          {showDetailsButton && (
            <Button
              variant="outline"
              onClick={() => onViewDetails?.(item)}
              className="w-full sm:flex-1"
            >
              View Details
            </Button>
          )}
        </div>

        {item.calories && (
          <div className="mt-2 text-xs text-muted-foreground">
            {item.calories} calories
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MenuItem;
