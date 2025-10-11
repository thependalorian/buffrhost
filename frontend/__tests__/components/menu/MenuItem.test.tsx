/**
 * MenuItem Component Tests
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenuItem } from "@/components/menu/MenuItem";

const mockMenuItem = {
  id: "1",
  name: "Test Item",
  description: "A delicious test item",
  price: 15.99,
  currency: "USD",
  category: "Main Course",
  image_url: "https://example.com/image.jpg",
  is_available: true,
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
  allergens: ["nuts"],
  preparation_time: 20,
  calories: 350,
  ingredients: ["ingredient1", "ingredient2"],
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("MenuItem Component", () => {
  it("renders menu item with all information", () => {
    render(<MenuItem item={mockMenuItem} />);

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("A delicious test item")).toBeInTheDocument();
    expect(screen.getByText("US$15.99")).toBeInTheDocument();
    expect(screen.getByText("20 min")).toBeInTheDocument();
    expect(screen.getByText("350 calories")).toBeInTheDocument();
  });

  it("renders image when provided", () => {
    render(<MenuItem item={mockMenuItem} />);

    const image = screen.getByAltText("Test Item");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("shows dietary badges when applicable", () => {
    const vegetarianItem = { ...mockMenuItem, is_vegetarian: true };
    render(<MenuItem item={vegetarianItem} />);

    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
  });

  it("shows allergens when provided", () => {
    render(<MenuItem item={mockMenuItem} />);

    expect(screen.getByText(/allergens/i)).toBeInTheDocument();
    expect(screen.getByText("nuts")).toBeInTheDocument();
  });

  it("handles add to cart click", () => {
    const onAddToCart = jest.fn();
    render(<MenuItem item={mockMenuItem} onAddToCart={onAddToCart} />);

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(mockMenuItem);
  });

  it("handles view details click", () => {
    const onViewDetails = jest.fn();
    render(<MenuItem item={mockMenuItem} onViewDetails={onViewDetails} />);

    const detailsButton = screen.getByText("View Details");
    fireEvent.click(detailsButton);

    expect(onViewDetails).toHaveBeenCalledWith(mockMenuItem);
  });

  it("disables add button when item is unavailable", () => {
    const unavailableItem = { ...mockMenuItem, is_available: false };
    render(<MenuItem item={unavailableItem} />);

    const addButton = screen.getByText("Unavailable");
    expect(addButton).toBeDisabled();
  });

  it("hides buttons when showAddButton is false", () => {
    render(<MenuItem item={mockMenuItem} showAddButton={false} />);

    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
  });

  it("hides buttons when showDetailsButton is false", () => {
    render(<MenuItem item={mockMenuItem} showDetailsButton={false} />);

    expect(screen.queryByText("View Details")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MenuItem item={mockMenuItem} className="custom-class" />);

    const card = screen.getByText("Test Item").closest(".h-full");
    expect(card).toHaveClass("custom-class");
  });

  it("formats price correctly for different currencies", () => {
    const nadItem = { ...mockMenuItem, currency: "NAD", price: 1200 };
    render(<MenuItem item={nadItem} />);

    expect(screen.getByText("$1,200.00")).toBeInTheDocument();
  });
});
