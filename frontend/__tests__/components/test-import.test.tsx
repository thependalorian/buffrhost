/**
 * Test to verify component imports work correctly
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Test if we can import the Button component
import { Button } from "../../src/components/ui/button";

describe("Component Import Test", () => {
  it("can import and render Button component", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });
});