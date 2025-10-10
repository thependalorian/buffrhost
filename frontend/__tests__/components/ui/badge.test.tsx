/**
 * Badge Component Tests - shadcn/ui Badge
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/src/components/ui/badge";

describe("Badge Component", () => {
  it("renders badge with default props", () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
  });

  it("renders badge with different variants", () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass("bg-secondary");

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive");

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("text-foreground");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Badge onClick={handleClick}>Clickable</Badge>);

    const badge = screen.getByText("Clickable");
    badge.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with base classes", () => {
    render(<Badge>Base Classes</Badge>);

    const badge = screen.getByText("Base Classes");
    expect(badge).toHaveClass("inline-flex", "items-center", "rounded-full");
  });
});
