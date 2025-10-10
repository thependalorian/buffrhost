"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Settings, 
  X, 
  Eye, 
  EyeOff, 
  Contrast, 
  Type, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  MousePointer,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    voiceCommands: false,
    keyboardNavigation: true,
    reducedMotion: false
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-display font-bold text-nude-900">
              Accessibility Settings
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Settings */}
          <div>
            <h3 className="text-lg font-semibold text-nude-900 mb-4">Visual Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Contrast className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">High Contrast Mode</div>
                    <div className="text-sm text-nude-600">Increase contrast for better visibility</div>
                  </div>
                </div>
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                >
                  {settings.highContrast ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Type className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">Large Text</div>
                    <div className="text-sm text-nude-600">Increase text size for better readability</div>
                  </div>
                </div>
                <Button
                  variant={settings.largeText ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('largeText', !settings.largeText)}
                >
                  {settings.largeText ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <h3 className="text-lg font-semibold text-nude-900 mb-4">Audio Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">Screen Reader</div>
                    <div className="text-sm text-nude-600">Enable screen reader announcements</div>
                  </div>
                </div>
                <Button
                  variant={settings.screenReader ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                >
                  {settings.screenReader ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <VolumeX className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">Voice Commands</div>
                    <div className="text-sm text-nude-600">Enable voice control for navigation</div>
                  </div>
                </div>
                <Button
                  variant={settings.voiceCommands ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('voiceCommands', !settings.voiceCommands)}
                >
                  {settings.voiceCommands ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Settings */}
          <div>
            <h3 className="text-lg font-semibold text-nude-900 mb-4">Navigation Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Keyboard className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">Keyboard Navigation</div>
                    <div className="text-sm text-nude-600">Navigate using keyboard only</div>
                  </div>
                </div>
                <Button
                  variant={settings.keyboardNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                >
                  {settings.keyboardNavigation ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MousePointer className="w-5 h-5 text-nude-600" />
                  <div>
                    <div className="font-medium text-nude-900">Reduced Motion</div>
                    <div className="text-sm text-nude-600">Minimize animations and transitions</div>
                  </div>
                </div>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                >
                  {settings.reducedMotion ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end pt-4 border-t border-nude-200">
            <Button variant="outline" onClick={() => {
              setSettings({
                highContrast: false,
                largeText: false,
                screenReader: false,
                voiceCommands: false,
                keyboardNavigation: true,
                reducedMotion: false
              });
            }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ScreenReaderAnnouncementsProps {
  announcements: string[];
}

export function ScreenReaderAnnouncements({ announcements }: ScreenReaderAnnouncementsProps) {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>("");

  useEffect(() => {
    if (announcements.length > 0) {
      announcements.forEach((announcement, index) => {
        setTimeout(() => {
          setCurrentAnnouncement(announcement);
          // Clear after 3 seconds
          setTimeout(() => setCurrentAnnouncement(""), 3000);
        }, index * 1000);
      });
    }
  }, [announcements]);

  return (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {currentAnnouncement}
    </div>
  );
}

interface KeyboardNavigationHelperProps {
  children: React.ReactNode;
}

export function KeyboardNavigationHelper({ children }: KeyboardNavigationHelperProps) {
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardMode(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardMode(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className={isKeyboardMode ? 'keyboard-navigation' : ''}>
      {children}
    </div>
  );
}

interface VoiceCommandsInterfaceProps {
  isEnabled: boolean;
  onToggle: () => void;
  commands?: Array<{
    command: string;
    action: () => void;
    description: string;
  }>;
}

export function VoiceCommandsInterface({ 
  isEnabled, 
  onToggle, 
  commands = [] 
}: VoiceCommandsInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");

  useEffect(() => {
    if (!isEnabled) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      setLastCommand(command);
      
      const matchedCommand = commands.find(cmd => 
        command.includes(cmd.command.toLowerCase())
      );
      
      if (matchedCommand) {
        matchedCommand.action();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isEnabled && isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isEnabled, isListening, commands]);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-nude-900">Voice Commands</h3>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${
              isListening ? 'bg-semantic-success/20' : 'bg-nude-100'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-semantic-success animate-pulse' : 'bg-nude-400'
              }`}></div>
              <span className="text-sm text-nude-700">
                {isListening ? 'Listening...' : 'Voice commands ready'}
              </span>
            </div>
            
            {lastCommand && (
              <div className="p-2 bg-nude-50 rounded-lg">
                <div className="text-xs text-nude-600 mb-1">Last command:</div>
                <div className="text-sm text-nude-900">"{lastCommand}"</div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="text-xs text-nude-600 mb-2">Available commands:</div>
              {commands.map((cmd, index) => (
                <div key={index} className="text-xs text-nude-700">
                  • "{cmd.command}" - {cmd.description}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AccessibilityShortcutsProps {
  shortcuts?: Array<{
    key: string;
    description: string;
    action: () => void;
  }>;
}

export function AccessibilityShortcuts({ 
  shortcuts = [
    { key: 'Alt + A', description: 'Open accessibility panel', action: () => {} },
    { key: 'Alt + H', description: 'Go to home', action: () => {} },
    { key: 'Alt + B', description: 'Open booking', action: () => {} },
    { key: 'Alt + G', description: 'Go to guests', action: () => {} },
    { key: 'Alt + S', description: 'Go to settings', action: () => {} },
  ]
}: AccessibilityShortcutsProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '?') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts]);

  if (!showShortcuts) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-nude-900">
              Keyboard Shortcuts
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-nude-50 rounded-lg">
                <span className="text-sm text-nude-700">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-nude-200 text-xs font-mono rounded">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
            <div className="text-xs text-nude-500 mt-4 text-center">
              Press Alt + ? to toggle this panel
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}