#!/usr/bin/env python3
"""
Script to update all BUFFR_HOST_*.md files to remove emojis and add corrected terminology
"""

import os
import re
import glob

def remove_emojis_from_headers(text):
    """Remove emojis from markdown headers"""
    # Pattern to match emojis in headers
    emoji_pattern = r'## [🎯📈🏗️📋🔍💡🚀📊🎨✅❌⚠️🔧📝🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿🧠🍽️🛠️💰📱🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]'
    
    # Replace emoji headers with clean headers
    text = re.sub(r'^# [🎯📈🏗️📋🔍💡🚀📊🎨✅❌⚠️🔧📝🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿🧠🍽️🛠️💰📱🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]', '#', text, flags=re.MULTILINE)
    text = re.sub(r'^## [🎯📈🏗️📋🔍💡🚀📊🎨✅❌⚠️🔧📝🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿🧠🍽️🛠️💰📱🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]', '##', text, flags=re.MULTILINE)
    text = re.sub(r'^### [🎯📈🏗️📋🔍💡🚀📊🎨✅❌⚠️🔧📝🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿🧠🍽️🛠️💰📱🎪🎭🎬🎮🎯🎲🎳🎴🎵🎶🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]', '###', text, flags=re.MULTILINE)
    
    return text

def remove_emoji_bullets(text):
    """Remove emoji bullets and replace with standard bullets"""
    # Replace emoji checkmarks and other bullets
    text = re.sub(r'^✅ ', '- ', text, flags=re.MULTILINE)
    text = re.sub(r'^❌ ', '- ', text, flags=re.MULTILINE)
    text = re.sub(r'^⚠️ ', '- ', text, flags=re.MULTILINE)
    text = re.sub(r'^🔧 ', '- ', text, flags=re.MULTILINE)
    text = re.sub(r'^📝 ', '- ', text, flags=re.MULTILINE)
    
    return text

def add_corrected_terminology(text):
    """Add corrected terminology section after executive summary"""
    corrected_terminology = """

## **CORRECTED TERMINOLOGY & FRAMEWORK**

### **System Architecture Clarification**
```
Buffr Host Platform
├── **PMS** - Property Management System (Correct)
├── **Payment Processing** - Adumo + RealPay (Separate from PMS)
├── **CRM** - Customer Relationship Management  
├── **CMS** - Content Management System
├── **Sofia AI Concierge**
├── **Analytics & Reporting**
└── **Security & Authentication**
```

### **Data Source Clarification**
- **Primary Database**: Neon PostgreSQL (No mocks, all data from production database)
- **Real-time Data**: All metrics, analytics, and reporting from live database
- **Payment Processing**: Adumo Gateway + RealPay integration with live transactions
- **AI Integration**: Sofia AI with real conversation data and memory storage

---
"""
    
    # Find the end of executive summary section
    exec_summary_end = text.find('---', text.find('## **EXECUTIVE SUMMARY**'))
    if exec_summary_end != -1:
        # Insert corrected terminology after executive summary
        text = text[:exec_summary_end] + corrected_terminology + text[exec_summary_end:]
    
    return text

def update_md_file(file_path):
    """Update a single markdown file"""
    print(f"Updating {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove emojis from headers
        content = remove_emojis_from_headers(content)
        
        # Remove emoji bullets
        content = remove_emoji_bullets(content)
        
        # Add corrected terminology if not already present
        if 'CORRECTED TERMINOLOGY & FRAMEWORK' not in content:
            content = add_corrected_terminology(content)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def main():
    """Main function to update all BUFFR_HOST_*.md files"""
    # Find all BUFFR_HOST_*.md files
    pattern = "BUFFR_HOST_*.md"
    files = glob.glob(pattern)
    
    print(f"Found {len(files)} BUFFR_HOST_*.md files to update")
    
    updated_count = 0
    for file_path in files:
        if update_md_file(file_path):
            updated_count += 1
    
    print(f"\n🎉 Successfully updated {updated_count}/{len(files)} files")

if __name__ == "__main__":
    main()