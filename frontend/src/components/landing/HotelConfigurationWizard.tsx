"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface HotelType {
  id: number;
  name: string;
  description: string;
  icon: string;
  common_services: string[];
  is_active: boolean;
}

interface HotelService {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  is_active: boolean;
}

interface HotelConfigurationWizardProps {
  onComplete: (configuration: {
    hotel_type: string;
    selected_services: string[];
    configuration_data: any;
  }) => void;
  onCancel: () => void;
}

const HotelConfigurationWizard: React.FC<HotelConfigurationWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [hotelServices, setHotelServices] = useState<HotelService[]>([]);
  const [selectedHotelType, setSelectedHotelType] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHotelTypes();
    loadHotelServices();
  }, []);

  const loadHotelTypes = async () => {
    try {
      const response = await fetch("/api/v1/hotel-configuration/hotel-types");
      const data = await response.json();
      setHotelTypes(data);
    } catch (error) {
      console.error("Error loading hotel types:", error);
    }
  };

  const loadHotelServices = async () => {
    try {
      const response = await fetch("/api/v1/hotel-configuration/hotel-services");
      const data = await response.json();
      setHotelServices(data);
    } catch (error) {
      console.error("Error loading hotel services:", error);
    }
  };

  const handleHotelTypeSelect = (hotelType: string) => {
    setSelectedHotelType(hotelType);
    setCurrentStep(2);
  };

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const configuration = {
        hotel_type: selectedHotelType,
        selected_services: selectedServices,
        configuration_data: {
          setup_completed: true,
          setup_date: new Date().toISOString(),
        },
      };
      
      onComplete(configuration);
    } catch (error) {
      console.error("Error completing configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedServices = () => {
    const selectedType = hotelTypes.find(ht => ht.name === selectedHotelType);
    if (!selectedType) return [];
    
    return hotelServices.filter(service => 
      selectedType.common_services.includes(service.name)
    );
  };

  const getServicesByCategory = () => {
    const categories = [...new Set(hotelServices.map(s => s.category))];
    return categories.map(category => ({
      category,
      services: hotelServices.filter(s => s.category === category)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-nude-900 mb-2">
          Configure Your Hospitality Business
        </h2>
        <p className="text-nude-600">
          Tell us about your business type and the services you offer
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-nude-600 text-white"
                    : "bg-nude-200 text-nude-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? "bg-nude-600" : "bg-nude-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="text-sm text-nude-600">
            {currentStep === 1 && "Select Business Type"}
            {currentStep === 2 && "Choose Services"}
            {currentStep === 3 && "Review & Complete"}
          </div>
        </div>
      </div>

      {/* Step 1: Hotel Type Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-nude-900">
            What type of hospitality business do you run?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotelTypes.map((hotelType) => (
              <Card
                key={hotelType.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedHotelType === hotelType.name
                    ? "ring-2 ring-nude-600 bg-nude-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleHotelTypeSelect(hotelType.name)}
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-nude-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xl">🏨</span>
                  </div>
                  <CardTitle className="text-lg">{hotelType.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-nude-600 text-center">
                    {hotelType.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1 justify-center">
                    {hotelType.common_services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="text-xs bg-nude-100 text-nude-700 px-2 py-1 rounded-full"
                      >
                        {service.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Service Selection */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-nude-900">
            Which services do you offer?
          </h3>
          
          {/* Recommended Services */}
          <div>
            <h4 className="text-lg font-medium text-nude-800 mb-3">
              Recommended for your business type:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getRecommendedServices().map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedServices.includes(service.name)
                      ? "border-nude-600 bg-nude-50"
                      : "border-nude-200 hover:border-nude-300"
                  }`}
                  onClick={() => handleServiceToggle(service.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-nude-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🔧</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-nude-900">
                        {service.description}
                      </h5>
                      <p className="text-sm text-nude-600">{service.category}</p>
                    </div>
                    {selectedServices.includes(service.name) && (
                      <CheckCircle className="w-5 h-5 text-nude-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Services by Category */}
          <div>
            <h4 className="text-lg font-medium text-nude-800 mb-3">
              All available services:
            </h4>
            {getServicesByCategory().map((categoryGroup) => (
              <div key={categoryGroup.category} className="mb-6">
                <h5 className="text-md font-medium text-nude-700 mb-2">
                  {categoryGroup.category}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryGroup.services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedServices.includes(service.name)
                          ? "border-nude-600 bg-nude-50"
                          : "border-nude-200 hover:border-nude-300"
                      }`}
                      onClick={() => handleServiceToggle(service.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-nude-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">🔧</span>
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium text-nude-900 text-sm">
                            {service.description}
                          </h6>
                        </div>
                        {selectedServices.includes(service.name) && (
                          <CheckCircle className="w-4 h-4 text-nude-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Review & Complete */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-nude-900">
            Review Your Configuration
          </h3>
          
          <div className="bg-nude-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-nude-800 mb-4">
              Business Type
            </h4>
            <p className="text-nude-600">
              {hotelTypes.find(ht => ht.name === selectedHotelType)?.description}
            </p>
          </div>

          <div className="bg-nude-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-nude-800 mb-4">
              Selected Services ({selectedServices.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedServices.map((serviceName) => {
                const service = hotelServices.find(s => s.name === serviceName);
                return (
                  <div key={serviceName} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{service?.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedHotelType}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center space-x-2 bg-nude-600 hover:bg-nude-700"
            >
              <span>{loading ? "Setting up..." : "Complete Setup"}</span>
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelConfigurationWizard;
