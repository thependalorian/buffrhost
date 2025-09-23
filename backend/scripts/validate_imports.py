#!/usr/bin/env python3
"""
Import Validation Script
Validates that all imports in the codebase can be resolved
"""

import ast
import sys
import importlib
from pathlib import Path
from typing import List, Dict, Set

def get_imports_from_file(file_path: Path) -> List[Dict[str, str]]:
    """Extract all import statements from a Python file"""
    imports = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        tree = ast.parse(content)
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append({
                        "type": "import",
                        "module": alias.name,
                        "file": str(file_path),
                        "line": node.lineno
                    })
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append({
                        "type": "from_import",
                        "module": node.module,
                        "file": str(file_path),
                        "line": node.lineno
                    })
    
    except Exception as e:
        print(f"Warning: Could not parse {file_path}: {e}")
    
    return imports

def validate_import(module_name: str) -> bool:
    """Check if a module can be imported"""
    try:
        importlib.import_module(module_name)
        return True
    except ImportError:
        return False
    except Exception:
        # Other exceptions (like syntax errors) are not import issues
        return True

def validate_imports_in_directory(directory: Path) -> Dict[str, List[Dict]]:
    """Validate all imports in a directory"""
    python_files = list(directory.rglob("*.py"))
    
    all_imports = []
    for py_file in python_files:
        imports = get_imports_from_file(py_file)
        all_imports.extend(imports)
    
    # Group by module name
    imports_by_module = {}
    for imp in all_imports:
        module = imp["module"]
        if module not in imports_by_module:
            imports_by_module[module] = []
        imports_by_module[module].append(imp)
    
    # Validate each unique module
    results = {
        "valid": [],
        "invalid": [],
        "total_imports": len(all_imports),
        "unique_modules": len(imports_by_module)
    }
    
    for module_name, import_list in imports_by_module.items():
        if validate_import(module_name):
            results["valid"].extend(import_list)
        else:
            results["invalid"].extend(import_list)
    
    return results

def main():
    """Main validation function"""
    backend_dir = Path(__file__).parent.parent
    
    print("🔍 Import Validation")
    print("=" * 50)
    
    results = validate_imports_in_directory(backend_dir)
    
    print(f"📊 Total imports: {results['total_imports']}")
    print(f"📦 Unique modules: {results['unique_modules']}")
    print(f"✅ Valid imports: {len(results['valid'])}")
    print(f"❌ Invalid imports: {len(results['invalid'])}")
    print()
    
    if results["invalid"]:
        print("❌ Invalid Imports:")
        for imp in results["invalid"]:
            print(f"   - {imp['module']} (in {imp['file']}:{imp['line']})")
        print()
        return 1
    else:
        print("✅ All imports are valid!")
        return 0

if __name__ == "__main__":
    sys.exit(main())
