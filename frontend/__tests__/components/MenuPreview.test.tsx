import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuPreview from '@/app/components/MenuPreview';

// Mock data matching the actual component interface
const mockMenuData = {
  restaurantName: 'Test Restaurant',
  restaurantDescription: 'A wonderful dining experience',
  logo: 'https://example.com/logo.png',
  categories: [
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal right',
      displayOrder: 1,
      items: [
        {
          id: '1',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan',
          price: 12.99,
          image: 'https://example.com/salad.jpg',
          allergens: ['dairy'],
          isPopular: true,
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          calories: 250
        }
      ]
    }
  ],
  currency: 'N$',
  showPrices: true,
  showAllergens: true,
  showCalories: true,
  theme: 'light' as const
};

describe('MenuPreview', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Menu Preview: Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('A wonderful dining experience')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Menu Preview: Test Restaurant')).not.toBeInTheDocument();
  });

  it('displays menu categories and items correctly', () => {
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Appetizers')).toBeInTheDocument();
    expect(screen.getByText('Start your meal right')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Fresh romaine lettuce with parmesan')).toBeInTheDocument();
    expect(screen.getByText('N$12.99')).toBeInTheDocument();
  });

  it('shows dietary tags and allergens when enabled', () => {
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Veg')).toBeInTheDocument();
    expect(screen.getByText('Warning: Contains: dairy')).toBeInTheDocument();
    expect(screen.getByText('250 calories')).toBeInTheDocument();
  });

  it('allows device type switching', async () => {
    const user = userEvent.setup();
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Find and click tablet view button
    const tabletButton = screen.getByTitle('Tablet view');
    await user.click(tabletButton);

    // Verify tablet view is active
    expect(screen.getByText('Tablet View')).toBeInTheDocument();
  });

  it('opens QR code modal when QR button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        showQRCode={true}
        qrCodeUrl="https://example.com/qr.png"
      />
    );

    const qrButton = screen.getByText('QR Code');
    await user.click(qrButton);

    expect(screen.getByText('Digital Menu QR Code')).toBeInTheDocument();
    expect(screen.getByText('Customers can scan this code to view your digital menu')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Save Menu');
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(mockMenuData);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MenuPreview
        menuData={mockMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByText('×');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies dark theme correctly', () => {
    const darkMenuData = { ...mockMenuData, theme: 'dark' as const };
    
    render(
      <MenuPreview
        menuData={darkMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check for dark theme classes
    const previewContent = screen.getByText('Test Restaurant').closest('div');
    expect(previewContent).toHaveClass('bg-gray-900');
  });

  it('applies colorful theme correctly', () => {
    const colorfulMenuData = { ...mockMenuData, theme: 'colorful' as const };
    
    render(
      <MenuPreview
        menuData={colorfulMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Check for colorful theme classes
    const previewContent = screen.getByText('Test Restaurant').closest('div');
    expect(previewContent).toHaveClass('bg-gradient-to-br');
  });

  it('hides prices when showPrices is false', () => {
    const noPricesMenuData = { ...mockMenuData, showPrices: false };
    
    render(
      <MenuPreview
        menuData={noPricesMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('N$12.99')).not.toBeInTheDocument();
  });

  it('hides allergens when showAllergens is false', () => {
    const noAllergensMenuData = { ...mockMenuData, showAllergens: false };
    
    render(
      <MenuPreview
        menuData={noAllergensMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Warning: Contains: dairy')).not.toBeInTheDocument();
  });

  it('hides calories when showCalories is false', () => {
    const noCaloriesMenuData = { ...mockMenuData, showCalories: false };
    
    render(
      <MenuPreview
        menuData={noCaloriesMenuData}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('250 calories')).not.toBeInTheDocument();
  });
});
