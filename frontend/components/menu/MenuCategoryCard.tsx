/**
 * MenuCategoryCard Component
 *
 * Reusable component for displaying menu categories
 * Follows OOP principles with proper encapsulation
 */

import { MenuCategory } from "@/lib/types/hospitality";
import { MenuItemCardComponent } from "@/components/menu/MenuItemCard";

interface MenuCategoryCardProps {
  category: MenuCategory;
  menuItems: any[];
  onItemSelect?: (item: any) => void;
  showPaymentButton?: boolean;
}

export class MenuCategoryCard {
  private category: MenuCategory;
  private menuItems: any[];
  private onItemSelect?: (item: any) => void;
  private showPaymentButton: boolean;

  constructor(props: MenuCategoryCardProps) {
    this.category = props.category;
    this.menuItems = props.menuItems;
    this.onItemSelect = props.onItemSelect;
    this.showPaymentButton = props.showPaymentButton || false;
  }

  private getCategoryImage(categoryName: string): string {
    const imageMap: Record<string, string> = {
      "Light Meals":
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&crop=center",
      "Main Course":
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center",
      "Traditional Cuisine":
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center",
      Pizza:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center",
      Desserts:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop&crop=center",
      "Hot Beverages":
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop&crop=center",
      Platters:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center",
      "Soft Drinks":
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100&h=100&fit=crop&crop=center",
      Beers:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop&crop=center",
      Wine: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=100&h=100&fit=crop&crop=center",
      Spirits:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&crop=center",
    };
    return (
      imageMap[categoryName] ||
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center"
    );
  }

  private getCategoryDescription(categoryName: string): string {
    const descriptionMap: Record<string, string> = {
      "Light Meals": "Quick bites and light options",
      "Main Course": "Hearty main dishes",
      "Traditional Cuisine": "Authentic Namibian dishes",
      Pizza: "Freshly made pizzas",
      Desserts: "Sweet treats to end your meal",
      "Hot Beverages": "Warm drinks to comfort you",
      Platters: "Perfect for sharing and events",
      "Soft Drinks": "Refreshing non-alcoholic beverages",
      Beers: "Local and international beers",
      Wine: "Local and imported wines",
      Spirits: "Premium spirits and liqueurs",
    };
    return descriptionMap[categoryName] || "Delicious options";
  }

  render(): JSX.Element {
    const filteredItems = this.menuItems.filter(
      (item) =>
        item.category_id === this.category.category_id && item.is_available,
    );

    return (
      <div className="nude-card shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <div className="avatar mr-4">
              <div className="w-16 h-16 rounded-lg">
                <img
                  src={this.getCategoryImage(this.category.name)}
                  alt={`${this.category.name} category`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div>
              <h3 className="card-title text-2xl">{this.category.name}</h3>
              <p className="text-base-content/70">
                {this.getCategoryDescription(this.category.name)}
              </p>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <MenuItemCardComponent
                  key={item.menu_item_id}
                  item={item}
                  onSelect={this.onItemSelect}
                  showPaymentButton={this.showPaymentButton}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/50">
              <p>No items available in this category</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Functional component wrapper for React
export function MenuCategoryCardComponent(props: MenuCategoryCardProps) {
  const card = new MenuCategoryCard(props);
  return card.render();
}
