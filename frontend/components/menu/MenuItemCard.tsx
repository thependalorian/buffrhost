/**
 * MenuItemCard Component
 *
 * Reusable component for displaying individual menu items
 * Follows OOP principles with proper encapsulation
 */

import { Menu } from "@/lib/types/hospitality";
import { BuffrPayButton } from "@/components/payment/BuffrPayButton";

interface MenuItemCardProps {
  item: Menu;
  onSelect?: (item: Menu) => void;
  showPaymentButton?: boolean;
}

export class MenuItemCard {
  private item: Menu;
  private onSelect?: (item: Menu) => void;
  private showPaymentButton: boolean;

  constructor(props: MenuItemCardProps) {
    this.item = props.item;
    this.onSelect = props.onSelect;
    this.showPaymentButton = props.showPaymentButton || false;
  }

  private formatPrice(price: number, currency: string): string {
    return `${currency} ${price.toFixed(2)}`;
  }

  private getItemImage(itemName: string): string {
    // Use food-related images from Unsplash
    const imageMap: Record<string, string> = {
      "Full Breakfast":
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=150&fit=crop&crop=center",
      "Chicken Salad":
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop&crop=center",
      "Greek Salad":
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop&crop=center",
      "Spare Ribs":
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=150&fit=crop&crop=center",
      "Pork Chops":
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=150&fit=crop&crop=center",
      "Lamb Curry":
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop&crop=center",
      "Half Chicken":
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=150&fit=crop&crop=center",
      "Rump Steak":
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop&crop=center",
      "T-Bone":
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop&crop=center",
      "King Klip":
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&h=150&fit=crop&crop=center",
      "Hake Fillet":
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&h=150&fit=crop&crop=center",
      Okapana:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop&crop=center",
      "Traditional Half Chicken":
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=150&fit=crop&crop=center",
      "Haden Hawaiian":
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop&crop=center",
      "Harry Regina":
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop&crop=center",
      "Onawa Supreme":
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop&crop=center",
      "Ice-Cream":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop&crop=center",
      "Fruit Salad":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop&crop=center",
      "Malva Pudding":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop&crop=center",
      "Dom Pedro":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop&crop=center",
      Tea: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=150&fit=crop&crop=center",
      Coffee:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=150&fit=crop&crop=center",
      Cappuccino:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=150&fit=crop&crop=center",
    };

    // Default food image if no specific match
    return (
      imageMap[itemName] ||
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop&crop=center"
    );
  }

  private getDietaryTags(): string[] {
    if (!this.item.dietary_tags) return [];
    return this.item.dietary_tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  render(): JSX.Element {
    const dietaryTags = this.getDietaryTags();

    return (
      <div className="nude-card shadow-md hover:shadow-nude transition-shadow duration-300">
        <div className="card-body p-4">
          <div className="flex gap-4">
            {/* Item Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img
                  src={this.getItemImage(this.item.name)}
                  alt={this.item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Item Details */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{this.item.name}</h4>
                <span className="text-primary font-bold text-lg">
                  {this.formatPrice(this.item.base_price, "NAD")}
                </span>
              </div>

              {this.item.description && (
                <p className="text-sm text-base-content/70 mb-2 line-clamp-2">
                  {this.item.description}
                </p>
              )}

              {/* Dietary Tags */}
              {dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {dietaryTags.map((tag, index) => (
                    <span key={index} className="badge badge-sm badge-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Item Meta Info */}
              <div className="flex items-center justify-between text-xs text-base-content/60">
                <div className="flex items-center gap-4">
                  {this.item.preparation_time && (
                    <span>⏱️ {this.item.preparation_time} min</span>
                  )}
                  {this.item.calories && (
                    <span>🔥 {this.item.calories} cal</span>
                  )}
                  {this.item.is_popular && (
                    <span className="badge badge-sm badge-primary">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm ${
                      this.item.is_available ? "badge-success" : "badge-error"
                    }`}
                  >
                    {this.item.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {this.onSelect && (
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => this.onSelect!(this.item)}
                  >
                    View Details
                  </button>
                )}

                {this.showPaymentButton && this.item.is_available && (
                  <BuffrPayButton
                    amount={this.item.base_price}
                    currency="NAD"
                    paymentType="restaurant"
                    propertyId={1}
                    orderId={`MENU_${this.item.menu_item_id}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Functional component wrapper for React
export function MenuItemCardComponent(props: MenuItemCardProps) {
  const card = new MenuItemCard(props);
  return card.render();
}
