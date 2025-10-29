#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define comprehensive emoji to text symbol mappings
const emojiReplacements = {
  // Keep some symbols that are actually text-based
  '🔍': '🔍', // search - this is actually a magnifying glass symbol
  '👤': '👤', // user - this is actually a person symbol
  '👥': '👥', // users - this is actually a people symbol
  '🔔': '🔔', // bell - this is actually a bell symbol
  '📞': '📞', // phone - this is actually a phone symbol
  '📅': '📅', // calendar - this is actually a calendar symbol
  '🕐': '🕐', // clock - this is actually a clock symbol
  '📍': '📍', // map-pin - this is actually a pin symbol
  '🧭': '🧭', // navigation - this is actually a compass symbol
  '🌍': '🌍', // globe - this is actually a globe symbol
  '🔗': '🔗', // link - this is actually a chain link symbol
  '📊': '📊', // chart-bar - this is actually a bar chart symbol
  '⚡': '⚡', // power/zap - this is actually a lightning symbol
  '🎯': '🎯', // target - this is actually a target symbol
  '💡': '💡', // lightbulb - this is actually a lightbulb symbol
  '🌊': '🌊', // wave - this is actually a wave symbol
  '✨': '✨', // sparkles - this is actually a sparkle symbol

  // Replace actual emojis with text symbols
  '⚙️': '⚙', // settings
  '✉️': '✉', // mail
  '↗️': '↗', // external-link
  '👁️': '👁', // eye
  '👁️‍🗨️': '👁', // eye-off
  '🕹️': '🕹', // joystick
  '⌨️': '⌨', // keyboard
  '🖱️': '🖱', // mouse
  '✂️': '✂', // scissors
  '🛣️': '🛣', // route/road/highway
  '🅿️': '🅿', // parking
  '⏱️': '⏱', // timer/stopwatch
  '☑️': '☑', // check-square
};

// Read the file
const filePath = path.join(__dirname, '../components/ui/daisy-icons.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all emojis with their text equivalents
for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
  const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, replacement);
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log(
  '✅ Successfully replaced remaining emojis with text-based symbols'
);
