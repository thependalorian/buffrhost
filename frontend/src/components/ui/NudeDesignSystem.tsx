"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";

// Re-export all components from NudeComponents
export * from "./NudeComponents";

// Re-export Badge from the UI components
export { Badge } from "./badge";

export function NudeDesignSystem() {
  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
          Nude Design System
        </h1>
        <p className="text-lg text-nude-600">
          A comprehensive design system for luxury hospitality applications
        </p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Nude 50", class: "bg-nude-50", text: "text-nude-900" },
              { name: "Nude 100", class: "bg-nude-100", text: "text-nude-900" },
              { name: "Nude 200", class: "bg-nude-200", text: "text-nude-900" },
              { name: "Nude 300", class: "bg-nude-300", text: "text-nude-900" },
              { name: "Nude 400", class: "bg-nude-400", text: "text-white" },
              { name: "Nude 500", class: "bg-nude-500", text: "text-white" },
              { name: "Nude 600", class: "bg-nude-600", text: "text-white" },
              { name: "Nude 700", class: "bg-nude-700", text: "text-white" },
              { name: "Nude 800", class: "bg-nude-800", text: "text-white" },
              { name: "Nude 900", class: "bg-nude-900", text: "text-white" },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div className={`w-20 h-20 rounded-lg ${color.class} ${color.text} flex items-center justify-center mb-2`}>
                  {color.name}
                </div>
                <div className="text-sm text-nude-600">{color.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-nude-900">Display Heading</h1>
            <p className="text-sm text-nude-600">font-display text-4xl font-bold</p>
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-nude-800">Section Heading</h2>
            <p className="text-sm text-nude-600">font-display text-2xl font-semibold</p>
          </div>
          <div>
            <h3 className="text-xl font-primary font-semibold text-nude-800">Card Heading</h3>
            <p className="text-sm text-nude-600">font-primary text-xl font-semibold</p>
          </div>
          <div>
            <p className="text-base text-nude-700">Body text for regular content and descriptions.</p>
            <p className="text-sm text-nude-600">font-primary text-base text-nude-700</p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="example-input">Example Input</Label>
            <Input id="example-input" placeholder="Enter text here" />
          </div>
          <div>
            <Label htmlFor="example-textarea">Example Textarea</Label>
            <textarea 
              id="example-textarea" 
              className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
              placeholder="Enter longer text here"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}