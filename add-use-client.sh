#!/bin/bash

# Script to add "use client" directive to pages that need it
# Pages need "use client" if they use:
# - useState, useEffect, useCallback, useMemo
# - Event handlers (onClick, onChange, onSubmit)
# - Browser APIs (localStorage, sessionStorage, etc.)
# - Third-party client-side libraries

echo "🔧 Adding 'use client' directive to pages that need it..."

# Function to add "use client" to a file if it doesn't already have it
add_use_client() {
    local file="$1"
    if ! grep -q '"use client"' "$file"; then
        # Check if file uses client-side features
        if grep -q "useState\|useEffect\|useCallback\|useMemo\|onClick\|onChange\|onSubmit\|addEventListener\|removeEventListener\|localStorage\|sessionStorage\|window\|document" "$file"; then
            echo "Adding 'use client' to: $file"
            # Add "use client" at the top of the file
            sed -i '' '1i\
"use client";
' "$file"
        fi
    fi
}

# Process all TSX files that don't have "use client"
find /Users/georgenekwaya/ai-agent-mastery/buffr-host/frontend/app -name "*.tsx" -type f -exec grep -L '"use client"' {} \; | while read -r file; do
    add_use_client "$file"
done

echo "✅ 'use client' directive addition completed!"
