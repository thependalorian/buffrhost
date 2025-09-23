#!/usr/bin/env python3
"""
Validation script to check model file structure and syntax.
"""

import os
import ast
import sys

def validate_python_file(filepath):
    """Validate a Python file for syntax errors."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Parse the AST to check for syntax errors
        ast.parse(content)
        return True, None
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Error: {e}"

def check_model_files():
    """Check all model files for syntax and structure."""
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    
    if not os.path.exists(models_dir):
        print(f"❌ Models directory not found: {models_dir}")
        return False
    
    print(f"📁 Checking models directory: {models_dir}")
    
    # Get all Python files in models directory
    model_files = [f for f in os.listdir(models_dir) if f.endswith('.py') and f != '__init__.py']
    
    print(f"📄 Found {len(model_files)} model files:")
    
    all_valid = True
    
    for model_file in sorted(model_files):
        filepath = os.path.join(models_dir, model_file)
        print(f"  🔍 Checking {model_file}...")
        
        is_valid, error = validate_python_file(filepath)
        
        if is_valid:
            print(f"    ✅ {model_file} - Syntax OK")
        else:
            print(f"    ❌ {model_file} - {error}")
            all_valid = False
    
    # Check __init__.py
    init_file = os.path.join(models_dir, '__init__.py')
    if os.path.exists(init_file):
        print(f"  🔍 Checking __init__.py...")
        is_valid, error = validate_python_file(init_file)
        if is_valid:
            print(f"    ✅ __init__.py - Syntax OK")
        else:
            print(f"    ❌ __init__.py - {error}")
            all_valid = False
    else:
        print(f"    ❌ __init__.py not found")
        all_valid = False
    
    return all_valid

def check_model_structure():
    """Check if model files have expected structure."""
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    
    expected_files = [
        'hospitality_property.py',
        'customer.py',
        'room.py',
        'menu.py',
        'order.py',
        'user.py',
        'user_type.py',
        'inventory.py',
        'modifiers.py',
        'cms.py',
        'services.py',
        'loyalty.py',
        'corporate.py',
        'compliance.py',
        'ai_knowledge.py',
        'documents.py'
    ]
    
    print(f"\n📋 Checking for expected model files:")
    
    missing_files = []
    for expected_file in expected_files:
        filepath = os.path.join(models_dir, expected_file)
        if os.path.exists(filepath):
            print(f"  ✅ {expected_file}")
        else:
            print(f"  ❌ {expected_file} - Missing")
            missing_files.append(expected_file)
    
    if missing_files:
        print(f"\n⚠️  Missing {len(missing_files)} expected model files:")
        for missing in missing_files:
            print(f"    - {missing}")
        return False
    else:
        print(f"\n✅ All expected model files present")
        return True

def main():
    """Main validation function."""
    print("🔍 The Shandi Model Validation")
    print("=" * 50)
    
    # Check file structure
    structure_ok = check_model_structure()
    
    # Check syntax
    syntax_ok = check_model_files()
    
    print("\n" + "=" * 50)
    print("📊 Validation Summary:")
    print(f"  Structure: {'✅ PASS' if structure_ok else '❌ FAIL'}")
    print(f"  Syntax:    {'✅ PASS' if syntax_ok else '❌ FAIL'}")
    
    if structure_ok and syntax_ok:
        print("\n🎉 All model files are valid!")
        return True
    else:
        print("\n💥 Some issues found in model files!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
