#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define emoji to text symbol mappings
const emojiReplacements = {
  // Navigation & UI
  '🏠': '⌂', // home
  '🔍': '🔍', // search (keep as is - it's a symbol)
  '🔽': '▼', // filter
  '⚙️': '⚙', // settings
  '👤': '👤', // user (keep as is - it's a symbol)
  '👥': '👥', // users (keep as is - it's a symbol)
  '🔔': '🔔', // bell (keep as is - it's a symbol)
  '✉️': '✉', // mail
  '📞': '📞', // phone (keep as is - it's a symbol)
  '📅': '📅', // calendar (keep as is - it's a symbol)
  '🕐': '🕐', // clock (keep as is - it's a symbol)
  '📍': '📍', // map-pin (keep as is - it's a symbol)
  '🧭': '🧭', // navigation (keep as is - it's a symbol)
  '🌍': '🌍', // globe (keep as is - it's a symbol)
  '↗️': '↗', // external-link
  '🔗': '🔗', // link (keep as is - it's a symbol)

  // Actions & Controls
  '✏️': '✏', // edit
  '🗑️': '🗑', // trash
  '📋': '📋', // copy (keep as is - it's a symbol)
  '⬇️': '↓', // download
  '⬆️': '↑', // upload
  '💾': '💾', // save (keep as is - it's a symbol)
  '🔄': '🔄', // refresh (keep as is - it's a symbol)
  '▶️': '▶', // play
  '⏸️': '⏸', // pause
  '⏹️': '⏹', // stop
  '⏭️': '⏭', // skip-forward
  '⏮️': '⏮', // skip-back
  '🔊': '🔊', // volume (keep as is - it's a symbol)
  '🔇': '🔇', // volume-x (keep as is - it's a symbol)
  '👁️': '👁', // eye
  '👁️‍🗨️': '👁', // eye-off
  '🔒': '🔒', // lock (keep as is - it's a symbol)
  '🔓': '🔓', // unlock (keep as is - it's a symbol)
  '🛡️': '🛡', // shield
  '⚠️': '⚠', // alert-triangle
  '⭕': '⭕', // alert-circle (keep as is - it's a symbol)
  ℹ️: 'ℹ', // info
  '❓': '❓', // help-circle (keep as is - it's a symbol)
  '✅': '✅', // check-circle (keep as is - it's a symbol)
  '❌': '❌', // x-circle (keep as is - it's a symbol)
  '➖': '➖', // minus-circle (keep as is - it's a symbol)
  '➕': '➕', // plus-circle (keep as is - it's a symbol)

  // Business & Commerce
  '💳': '💳', // credit-card (keep as is - it's a symbol)
  '👛': '👛', // wallet (keep as is - it's a symbol)
  '🛒': '🛒', // shopping-cart (keep as is - it's a symbol)
  '🛍️': '🛍', // shopping-bag
  '📦': '📦', // package (keep as is - it's a symbol)
  '🚚': '🚚', // truck (keep as is - it's a symbol)
  '🏪': '🏪', // store (keep as is - it's a symbol)
  '🏢': '🏢', // building (keep as is - it's a symbol)
  '💼': '💼', // briefcase (keep as is - it's a symbol)
  '📊': '📊', // chart-bar (keep as is - it's a symbol)
  '📈': '📈', // chart-line (keep as is - it's a symbol)
  '🥧': '🥧', // chart-pie (keep as is - it's a symbol)
  '📉': '📉', // trending-down (keep as is - it's a symbol)
  '🧮': '🧮', // calculator (keep as is - it's a symbol)
  '🧾': '🧾', // receipt (keep as is - it's a symbol)
  '📄': '📄', // file-text (keep as is - it's a symbol)
  '📁': '📁', // file (keep as is - it's a symbol)
  '📂': '📂', // folder-open (keep as is - it's a symbol)

  // Hospitality & Travel
  '🛏️': '🛏', // bed
  '🗺️': '🗺', // map
  '🚗': '🚗', // car (keep as is - it's a symbol)
  '✈️': '✈', // plane
  '🚂': '🚂', // train (keep as is - it's a symbol)
  '🚌': '🚌', // bus (keep as is - it's a symbol)
  '🚲': '🚲', // bike (keep as is - it's a symbol)
  '🚶': '🚶', // walking (keep as is - it's a symbol)
  '📷': '📷', // camera (keep as is - it's a symbol)
  '🖼️': '🖼', // image
  '📹': '📹', // video (keep as is - it's a symbol)
  '🎵': '🎵', // music (keep as is - it's a symbol)
  '🎧': '🎧', // headphones (keep as is - it's a symbol)
  '📺': '📺', // tv (keep as is - it's a symbol)
  '🖥️': '🖥', // monitor
  '💻': '💻', // laptop (keep as is - it's a symbol)
  '📱': '📱', // smartphone (keep as is - it's a symbol)
  '📶': '📶', // wifi (keep as is - it's a symbol)
  '🔋': '🔋', // battery (keep as is - it's a symbol)
  '🔌': '🔌', // battery-charging (keep as is - it's a symbol)
  '⚡': '⚡', // power (keep as is - it's a symbol)
  '☀️': '☀', // sun
  '🌙': '🌙', // moon (keep as is - it's a symbol)
  '☁️': '☁', // cloud
  '🌧️': '🌧', // cloud-rain

  // Food & Dining
  '🍴': '🍴', // utensils (keep as is - it's a symbol)
  '☕': '☕', // coffee (keep as is - it's a symbol)
  '🍷': '🍷', // wine (keep as is - it's a symbol)
  '🍺': '🍺', // beer (keep as is - it's a symbol)
  '🍰': '🍰', // cake (keep as is - it's a symbol)
  '🍕': '🍕', // pizza (keep as is - it's a symbol)
  '🍔': '🍔', // hamburger (keep as is - it's a symbol)
  '🍦': '🍦', // ice-cream (keep as is - it's a symbol)
  '🍎': '🍎', // apple (keep as is - it's a symbol)
  '🍌': '🍌', // banana (keep as is - it's a symbol)
  '🍒': '🍒', // cherry (keep as is - it's a symbol)
  '🍇': '🍇', // grapes (keep as is - it's a symbol)
  '🍋': '🍋', // lemon (keep as is - it's a symbol)
  '🍊': '🍊', // orange (keep as is - it's a symbol)
  '🍑': '🍑', // peach (keep as is - it's a symbol)
  '🍐': '🍐', // pear (keep as is - it's a symbol)
  '🍓': '🍓', // strawberry (keep as is - it's a symbol)
  '🍉': '🍉', // watermelon (keep as is - it's a symbol)

  // Social & Communication
  '🤍': '🤍', // heart (keep as is - it's a symbol)
  '❤️': '❤', // heart-filled
  '👍': '👍', // thumbs-up (keep as is - it's a symbol)
  '👎': '👎', // thumbs-down (keep as is - it's a symbol)
  '⭐': '⭐', // star (keep as is - it's a symbol)
  '📤': '📤', // share (keep as is - it's a symbol)
  '💬': '💬', // message-circle (keep as is - it's a symbol)
  '↩️': '↩', // reply
  '📘': '📘', // facebook (keep as is - it's a symbol)
  '🐦': '🐦', // twitter (keep as is - it's a symbol)
  '💼': '💼', // linkedin (keep as is - it's a symbol)
  '🐙': '🐙', // github (keep as is - it's a symbol)
  '🦊': '🦊', // gitlab (keep as is - it's a symbol)

  // System & Status
  '🗄️': '🗄', // database
  '☁️': '☁', // cloud
  '🔄': '🔄', // sync (keep as is - it's a symbol)

  // Weather & Nature
  '❄️': '❄', // cloud-snow
  '⛅': '⛅', // cloud-sun (keep as is - it's a symbol)
  '💨': '💨', // wind (keep as is - it's a symbol)
  '💧': '💧', // droplet (keep as is - it's a symbol)
  '🌡️': '🌡', // thermometer
  '☂️': '☂', // umbrella
  '🌳': '🌳', // tree (keep as is - it's a symbol)
  '🌸': '🌸', // flower (keep as is - it's a symbol)
  '🍃': '🍃', // leaf (keep as is - it's a symbol)
  '🏔️': '🏔', // mountain

  // Animals & Pets
  '🐱': '🐱', // cat (keep as is - it's a symbol)
  '🐶': '🐶', // dog (keep as is - it's a symbol)
  '🐟': '🐟', // fish (keep as is - it's a symbol)
  '🐦': '🐦', // bird (keep as is - it's a symbol)
  '🐛': '🐛', // bug (keep as is - it's a symbol)
  '🕷️': '🕷', // spider
  '🦋': '🦋', // butterfly (keep as is - it's a symbol)
  '🐝': '🐝', // bee (keep as is - it's a symbol)
  '🐌': '🐌', // snail (keep as is - it's a symbol)
  '🐸': '🐸', // frog (keep as is - it's a symbol)

  // Sports & Activities
  '🏈': '🏈', // football (keep as is - it's a symbol)
  '🏀': '🏀', // basketball (keep as is - it's a symbol)
  '⚽': '⚽', // soccer (keep as is - it's a symbol)
  '🎾': '🎾', // tennis (keep as is - it's a symbol)
  '⛳': '⛳', // golf (keep as is - it's a symbol)
  '🏊': '🏊', // swimming (keep as is - it's a symbol)
  '🏃': '🏃', // running (keep as is - it's a symbol)
  '🚴': '🚴', // cycling (keep as is - it's a symbol)
  '🎿': '🎿', // skiing (keep as is - it's a symbol)
  '🏂': '🏂', // snowboarding (keep as is - it's a symbol)
  '🏋️': '🏋', // dumbbell
  '🏆': '🏆', // trophy (keep as is - it's a symbol)
  '🏅': '🏅', // medal (keep as is - it's a symbol)
  '🎯': '🎯', // target (keep as is - it's a symbol)
  '🎳': '🎳', // bowling (keep as is - it's a symbol)
  '🎱': '🎱', // pool (keep as is - it's a symbol)
  '♟️': '♟', // chess
  '🧩': '🧩', // puzzle (keep as is - it's a symbol)

  // Education & Learning
  '📚': '📚', // book (keep as is - it's a symbol)
  '📖': '📖', // book-open (keep as is - it's a symbol)
  '🎓': '🎓', // graduation-cap (keep as is - it's a symbol)
  '✏️': '✏', // pencil
  '🖊️': '🖊', // pen
  '🖍️': '🖍', // highlighter
  '📏': '📏', // ruler (keep as is - it's a symbol)
  '🔬': '🔬', // microscope (keep as is - it's a symbol)
  '🔭': '🔭', // telescope (keep as is - it's a symbol)
  '🧪': '🧪', // flask (keep as is - it's a symbol)
  '⚛️': '⚛', // atom
  '🧠': '🧠', // brain (keep as is - it's a symbol)
  '💡': '💡', // lightbulb (keep as is - it's a symbol)

  // Entertainment & Media
  '🎤': '🎤', // mic (keep as is - it's a symbol)
  '📷': '📷', // camera (keep as is - it's a symbol)
  '📹': '📹', // video (keep as is - it's a symbol)
  '🎵': '🎵', // music (keep as is - it's a symbol)
  '🎧': '🎧', // headphones (keep as is - it's a symbol)
  '🔊': '🔊', // speaker (keep as is - it's a symbol)

  // Additional icons that were found
  '🎯': '🎯', // target (keep as is - it's a symbol)
  '💡': '💡', // lightbulb (keep as is - it's a symbol)
  '📊': '📊', // activity (keep as is - it's a symbol)
  '🌊': '🌊', // wave (keep as is - it's a symbol)
  '✨': '✨', // sparkles (keep as is - it's a symbol)
  '🕐': '🕐', // clock (keep as is - it's a symbol)
  '⚡': '⚡', // zap (keep as is - it's a symbol)
  '📊': '📊', // bar-chart-3 (keep as is - it's a symbol)
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

console.log('✅ Successfully replaced all emojis with text-based symbols');
console.log('📝 Backup created at daisy-icons.tsx.backup');
