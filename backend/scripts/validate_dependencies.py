#!/usr/bin/env python3
"""
Dependency Validation Script
Ensures all imports in the codebase match declared dependencies in requirements.txt
"""

import ast
import os
import sys
import subprocess
from pathlib import Path
from typing import Set, List, Dict

def get_imports_from_file(file_path: Path) -> Set[str]:
    """Extract all import statements from a Python file"""
    imports = set()
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        tree = ast.parse(content)
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.add(alias.name.split('.')[0])
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.add(node.module.split('.')[0])
    
    except Exception as e:
        print(f"Warning: Could not parse {file_path}: {e}")
    
    return imports

def get_requirements_packages(requirements_file: Path) -> Set[str]:
    """Extract package names from requirements.txt"""
    packages = set()
    
    try:
        with open(requirements_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and not line.startswith('-'):
                    # Extract package name (before ==, >=, etc.)
                    package_name = line.split('==')[0].split('>=')[0].split('<=')[0].split('[')[0]
                    packages.add(package_name.lower())
    except Exception as e:
        print(f"Error reading requirements file: {e}")
    
    return packages

def get_standard_library_modules() -> Set[str]:
    """Get list of standard library modules that don't need to be in requirements.txt"""
    try:
        result = subprocess.run([sys.executable, '-c', 'import sys; print("\\n".join(sys.builtin_module_names))'], 
                              capture_output=True, text=True)
        return set(result.stdout.strip().split('\n'))
    except:
        # Fallback list of common standard library modules
        return {
            'os', 'sys', 'json', 'datetime', 'uuid', 'pathlib', 'typing', 'collections',
            'itertools', 'functools', 'operator', 'math', 'random', 'string', 're',
            'urllib', 'http', 'email', 'html', 'xml', 'csv', 'sqlite3', 'threading',
            'multiprocessing', 'asyncio', 'logging', 'unittest', 'pdb', 'pickle',
            'base64', 'hashlib', 'hmac', 'secrets', 'ssl', 'socket', 'tempfile',
            'shutil', 'glob', 'fnmatch', 'linecache', 'fileinput', 'stat', 'time',
            'calendar', 'locale', 'gettext', 'codecs', 'io', 'contextlib', 'copy',
            'pprint', 'reprlib', 'enum', 'dataclasses', 'abc', 'weakref', 'gc',
            'traceback', 'warnings', 'inspect', 'dis', 'ast', 'keyword', 'token',
            'tokenize', 'symbol', 'parser', 'keyword', 'builtins', 'main', 'subprocess',
            'importlib', 'decimal', 'dotenv', 'bcrypt', 'jwt'
        }

def get_internal_modules(backend_dir: Path) -> Set[str]:
    """Get list of internal modules that don't need to be in requirements.txt"""
    internal_modules = set()
    
    # Add all Python files in the backend directory as internal modules
    for py_file in backend_dir.rglob("*.py"):
        # Get the module path relative to backend directory
        rel_path = py_file.relative_to(backend_dir)
        module_parts = list(rel_path.parts[:-1])  # Remove .py extension
        if module_parts:
            internal_modules.add(module_parts[0])  # Add the first part (e.g., 'models', 'services')
        
        # Also add the filename without extension
        module_name = py_file.stem
        internal_modules.add(module_name)
    
    return internal_modules

def validate_dependencies(backend_dir: Path) -> Dict[str, List[str]]:
    """Validate that all imports match declared dependencies"""
    requirements_file = backend_dir / "requirements.txt"
    
    if not requirements_file.exists():
        return {"error": ["requirements.txt not found"]}
    
    # Get declared packages
    declared_packages = get_requirements_packages(requirements_file)
    
    # Get standard library modules
    stdlib_modules = get_standard_library_modules()
    
    # Get internal modules
    internal_modules = get_internal_modules(backend_dir)
    
    # Find all Python files
    python_files = list(backend_dir.rglob("*.py"))
    
    # Collect all imports
    all_imports = set()
    for py_file in python_files:
        imports = get_imports_from_file(py_file)
        all_imports.update(imports)
    
    # Filter out standard library and internal modules
    external_imports = all_imports - stdlib_modules - internal_modules
    
    # Check for missing dependencies
    missing_deps = []
    for imp in external_imports:
        if imp.lower() not in declared_packages:
            missing_deps.append(imp)
    
    # Check for unused dependencies
    unused_deps = []
    for pkg in declared_packages:
        if pkg not in [imp.lower() for imp in external_imports]:
            unused_deps.append(pkg)
    
    return {
        "missing_dependencies": missing_deps,
        "unused_dependencies": unused_deps,
        "total_imports": len(external_imports),
        "declared_packages": len(declared_packages),
        "internal_modules": len(internal_modules),
        "stdlib_modules": len(stdlib_modules)
    }

def main():
    """Main validation function"""
    backend_dir = Path(__file__).parent.parent
    
    print("🔍 Dependency Validation")
    print("=" * 50)
    
    results = validate_dependencies(backend_dir)
    
    if "error" in results:
        print(f"❌ {results['error'][0]}")
        return 1
    
    print(f"📊 Found {results['total_imports']} external imports")
    print(f"📦 Found {results['declared_packages']} declared packages")
    print(f"🏠 Found {results['internal_modules']} internal modules")
    print(f"📚 Found {results['stdlib_modules']} standard library modules")
    print()
    
    if results["missing_dependencies"]:
        print("❌ Missing Dependencies:")
        for dep in results["missing_dependencies"]:
            print(f"   - {dep}")
        print()
    
    if results["unused_dependencies"]:
        print("⚠️  Potentially Unused Dependencies:")
        for dep in results["unused_dependencies"]:
            print(f"   - {dep}")
        print()
    
    if not results["missing_dependencies"]:
        print("✅ All imports have corresponding dependencies!")
        return 0
    else:
        print("❌ Missing dependencies found. Please add them to requirements.txt")
        return 1

if __name__ == "__main__":
    sys.exit(main())
