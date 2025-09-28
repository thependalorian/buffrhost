import { useState } from "react";
import {
  QrCode,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Share2,
  Download,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  allergens?: string[];
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  displayOrder: number;
}

interface MenuData {
  restaurantName: string;
  restaurantDescription?: string;
  logo?: string;
  categories: MenuCategory[];
  currency: string;
  showPrices: boolean;
  showAllergens: boolean;
  showCalories: boolean;
  theme: "light" | "dark" | "colorful";
}

interface MenuPreviewProps {
  menuData: MenuData;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (menuData: MenuData) => void;
  showQRCode?: boolean;
  qrCodeUrl?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

const MenuPreview: React.FC<MenuPreviewProps> = ({
  menuData,
  isOpen,
  onClose,
  onSave,
  showQRCode = true,
  qrCodeUrl,
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>("mobile");
  const [showQRModal, setShowQRModal] = useState(false);

  const deviceConfig = {
    desktop: { width: "100%", maxWidth: "1200px", icon: Monitor },
    tablet: { width: "768px", maxWidth: "768px", icon: Tablet },
    mobile: { width: "375px", maxWidth: "375px", icon: Smartphone },
  };

  const DeviceIcon = deviceConfig[deviceType].icon;

  const getThemeClasses = () => {
    switch (menuData.theme) {
      case "dark":
        return {
          background: "bg-gray-900",
          text: "text-white",
          card: "bg-gray-800",
          accent: "bg-blue-600",
          border: "border-gray-700",
        };
      case "colorful":
        return {
          background:
            "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
          text: "text-white",
          card: "bg-white bg-opacity-90",
          accent: "bg-pink-500",
          border: "border-white border-opacity-30",
        };
      default: // light
        return {
          background: "bg-white",
          text: "text-gray-900",
          card: "bg-gray-50",
          accent: "bg-blue-600",
          border: "border-gray-200",
        };
    }
  };

  const theme = getThemeClasses();

  const renderMenuItem = (item: MenuItem) => (
    <div
      className={`p-4 ${theme.card} rounded-lg hover:shadow-md transition-all duration-200`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold ${theme.text}`}>
              {item.name}
            </h3>
            <div className="flex gap-1">
              {item.isPopular && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              {item.isVegetarian && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Veg
                </span>
              )}
              {item.isVegan && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Vegan
                </span>
              )}
              {item.isGlutenFree && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  GF
                </span>
              )}
            </div>
          </div>

          <p className={`text-sm ${theme.text} opacity-80 mb-2`}>
            {item.description}
          </p>

          {menuData.showAllergens &&
            item.allergens &&
            item.allergens.length > 0 && (
              <p className="text-xs text-orange-600 mb-2">
                Warning: Contains: {item.allergens.join(", ")}
              </p>
            )}

          {menuData.showCalories && item.calories && (
            <p className="text-xs text-gray-500">{item.calories} calories</p>
          )}
        </div>

        {menuData.showPrices && (
          <div className="text-right ml-4">
            <span
              className={`text-xl font-bold ${theme.accent} text-white px-3 py-1 rounded-lg`}
            >
              {menuData.currency}
              {item.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {item.image && (
        <div className="mt-3">
          <Image
            src={item.image}
            alt={item.name}
            width={300}
            height={128}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );

  const renderMenuContent = () => (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Header */}
      <div className={`${theme.accent} text-white p-6 text-center`}>
        {menuData.logo && (
          <Image
            src={menuData.logo}
            alt={menuData.restaurantName}
            width={64}
            height={64}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-white p-2"
          />
        )}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {menuData.restaurantName}
        </h1>
        {menuData.restaurantDescription && (
          <p className="text-white opacity-90">
            {menuData.restaurantDescription}
          </p>
        )}
      </div>

      {/* QR Code Section */}
      {showQRCode && deviceType === "mobile" && (
        <div className="p-4 bg-white bg-opacity-10 text-center">
          <button
            onClick={() => setShowQRModal(true)}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            View Digital Menu
          </button>
        </div>
      )}

      {/* Menu Categories */}
      <div className="p-4 space-y-6">
        {menuData.categories
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((category) => (
            <div key={category.id}>
              <h2
                className={`text-xl font-bold ${theme.text} mb-4 pb-2 border-b-2 ${theme.border}`}
              >
                {category.name}
              </h2>
              {category.description && (
                <p className={`text-sm ${theme.text} opacity-70 mb-4`}>
                  {category.description}
                </p>
              )}
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id}>{renderMenuItem(item)}</div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className={`p-6 text-center ${theme.text} opacity-70`}>
        <p className="text-sm">Powered by Buffr Host</p>
        <p className="text-xs mt-1">Scan QR code for digital menu</p>
      </div>
    </div>
  );

  const renderQRModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Digital Menu QR Code
        </h3>
        <div className="text-center">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="Menu QR Code"
              width={192}
              height={192}
              className="w-48 h-48 mx-auto mb-4"
            />
          ) : (
            <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <p className="text-sm text-gray-600 mb-4">
            Customers can scan this code to view your digital menu
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQRModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                /* Download QR code */
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Menu Preview: {menuData.restaurantName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {Object.entries(deviceConfig).map(([device, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={device}
                      onClick={() => setDeviceType(device as DeviceType)}
                      className={`p-2 rounded-md transition-colors ${
                        deviceType === device
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      title={`${
                        device.charAt(0).toUpperCase() + device.slice(1)
                      } view`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              {/* QR Code Button */}
              {showQRCode && (
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
              )}

              {/* Save Button */}
              {onSave && (
                <button
                  onClick={() => onSave(menuData)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Share2 className="w-4 h-4" />
                  Save Menu
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl font-bold">×</span>
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div
              className="mx-auto"
              style={{
                width: deviceConfig[deviceType].width,
                maxWidth: deviceConfig[deviceType].maxWidth,
              }}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {renderMenuContent()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <DeviceIcon className="w-4 h-4" />
                <span>
                  {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}{" "}
                  View
                </span>
              </div>
              <p>This is how your menu will appear to customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && renderQRModal()}
    </>
  );
};

export default MenuPreview;
import Image from "next/image";
