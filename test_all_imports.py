#!/usr/bin/env python3
"""
Comprehensive Import Testing Script for Buffr Host Platform
Tests all Python imports across backend, microservices, and scripts
"""

import os
import sys
import subprocess
import importlib
import ast
import traceback
from pathlib import Path
from typing import List, Dict, Tuple, Set
import json


class ImportTester:
    """Comprehensive import testing for the entire project."""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.results = {
            'backend': {'success': [], 'failed': [], 'warnings': []},
            'microservices': {'success': [], 'failed': [], 'warnings': []},
            'scripts': {'success': [], 'failed': [], 'warnings': []},
            'frontend': {'success': [], 'failed': [], 'warnings': []}
        }
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def find_python_files(self, directory: Path) -> List[Path]:
        """Find all Python files in a directory."""
        python_files = []
        for root, dirs, files in os.walk(directory):
            # Skip __pycache__ and virtual environments
            dirs[:] = [d for d in dirs if d not in ['__pycache__', 'venv', '.venv', 'node_modules']]
            
            for file in files:
                if file.endswith('.py') and not file.startswith('.'):
                    python_files.append(Path(root) / file)
        return python_files
    
    def extract_imports_from_file(self, file_path: Path) -> Set[str]:
        """Extract all import statements from a Python file."""
        imports = set()
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.add(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        imports.add(node.module)
                        for alias in node.names:
                            imports.add(f"{node.module}.{alias.name}")
        except Exception as e:
            print(f"⚠️  Could not parse {file_path}: {e}")
        
        return imports
    
    def test_python_import(self, module_name: str, file_path: Path = None) -> Tuple[bool, str]:
        """Test importing a Python module."""
        try:
            # Add the file's directory to sys.path if file_path is provided
            if file_path:
                sys.path.insert(0, str(file_path.parent))
            
            # Try to import the module
            importlib.import_module(module_name)
            return True, "Import successful"
        except ImportError as e:
            return False, f"ImportError: {str(e)}"
        except Exception as e:
            return False, f"Unexpected error: {str(e)}"
        finally:
            # Clean up sys.path
            if file_path and str(file_path.parent) in sys.path:
                sys.path.remove(str(file_path.parent))
    
    def test_backend_imports(self):
        """Test all backend imports."""
        print("\n🔍 Testing Backend Imports...")
        print("=" * 50)
        
        backend_dir = self.project_root / "backend"
        if not backend_dir.exists():
            print("❌ Backend directory not found")
            return
        
        python_files = self.find_python_files(backend_dir)
        
        # Test main modules
        main_modules = [
            'main', 'config', 'database', 'models', 'routes', 'services',
            'auth', 'ai', 'rag', 'utils'
        ]
        
        for module in main_modules:
            self.total_tests += 1
            success, message = self.test_python_import(module, backend_dir / f"{module}.py")
            
            if success:
                self.results['backend']['success'].append(f"{module}: {message}")
                self.passed_tests += 1
                print(f"✅ {module}")
            else:
                self.results['backend']['failed'].append(f"{module}: {message}")
                self.failed_tests += 1
                print(f"❌ {module}: {message}")
        
        # Test individual model imports
        models_dir = backend_dir / "models"
        if models_dir.exists():
            model_files = [f for f in models_dir.glob("*.py") if f.name != "__init__.py"]
            
            for model_file in model_files:
                module_name = f"models.{model_file.stem}"
                self.total_tests += 1
                success, message = self.test_python_import(module_name, model_file)
                
                if success:
                    self.results['backend']['success'].append(f"{module_name}: {message}")
                    self.passed_tests += 1
                    print(f"✅ {module_name}")
                else:
                    self.results['backend']['failed'].append(f"{module_name}: {message}")
                    self.failed_tests += 1
                    print(f"❌ {module_name}: {message}")
        
        # Test route imports
        routes_dir = backend_dir / "routes"
        if routes_dir.exists():
            route_files = [f for f in routes_dir.glob("*.py") if f.name != "__init__.py"]
            
            for route_file in route_files:
                module_name = f"routes.{route_file.stem}"
                self.total_tests += 1
                success, message = self.test_python_import(module_name, route_file)
                
                if success:
                    self.results['backend']['success'].append(f"{module_name}: {message}")
                    self.passed_tests += 1
                    print(f"✅ {module_name}")
                else:
                    self.results['backend']['failed'].append(f"{module_name}: {message}")
                    self.failed_tests += 1
                    print(f"❌ {module_name}: {message}")
    
    def test_microservices_imports(self):
        """Test all microservices imports."""
        print("\n🔍 Testing Microservices Imports...")
        print("=" * 50)
        
        microservices_dir = self.project_root / "microservices"
        if not microservices_dir.exists():
            print("❌ Microservices directory not found")
            return
        
        # Get all service directories
        service_dirs = [d for d in microservices_dir.iterdir() if d.is_dir() and d.name.endswith('-service')]
        
        for service_dir in service_dirs:
            service_name = service_dir.name
            main_file = service_dir / "main.py"
            
            if main_file.exists():
                self.total_tests += 1
                success, message = self.test_python_import("main", main_file)
                
                if success:
                    self.results['microservices']['success'].append(f"{service_name}: {message}")
                    self.passed_tests += 1
                    print(f"✅ {service_name}")
                else:
                    self.results['microservices']['failed'].append(f"{service_name}: {message}")
                    self.failed_tests += 1
                    print(f"❌ {service_name}: {message}")
            
            # Test schemas if they exist
            schemas_dir = service_dir / "schemas"
            if schemas_dir.exists():
                schema_files = [f for f in schemas_dir.glob("*.py") if f.name != "__init__.py"]
                
                for schema_file in schema_files:
                    module_name = f"schemas.{schema_file.stem}"
                    self.total_tests += 1
                    success, message = self.test_python_import(module_name, schema_file)
                    
                    if success:
                        self.results['microservices']['success'].append(f"{service_name}.{module_name}: {message}")
                        self.passed_tests += 1
                        print(f"✅ {service_name}.{module_name}")
                    else:
                        self.results['microservices']['failed'].append(f"{service_name}.{module_name}: {message}")
                        self.failed_tests += 1
                        print(f"❌ {service_name}.{module_name}: {message}")
    
    def test_scripts_imports(self):
        """Test all script imports."""
        print("\n🔍 Testing Scripts Imports...")
        print("=" * 50)
        
        scripts_dir = self.project_root / "scripts"
        if not scripts_dir.exists():
            print("❌ Scripts directory not found")
            return
        
        python_files = self.find_python_files(scripts_dir)
        
        for script_file in python_files:
            script_name = script_file.stem
            self.total_tests += 1
            
            # For scripts, we'll try to import them as modules
            try:
                # Add scripts directory to path
                sys.path.insert(0, str(scripts_dir))
                
                # Try to import the script
                spec = importlib.util.spec_from_file_location(script_name, script_file)
                if spec and spec.loader:
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                    
                    self.results['scripts']['success'].append(f"{script_name}: Import successful")
                    self.passed_tests += 1
                    print(f"✅ {script_name}")
                else:
                    self.results['scripts']['failed'].append(f"{script_name}: Could not create module spec")
                    self.failed_tests += 1
                    print(f"❌ {script_name}: Could not create module spec")
                    
            except Exception as e:
                self.results['scripts']['failed'].append(f"{script_name}: {str(e)}")
                self.failed_tests += 1
                print(f"❌ {script_name}: {str(e)}")
            finally:
                # Clean up sys.path
                if str(scripts_dir) in sys.path:
                    sys.path.remove(str(scripts_dir))
    
    def test_frontend_imports(self):
        """Test frontend TypeScript/JavaScript imports using Node.js."""
        print("\n🔍 Testing Frontend Imports...")
        print("=" * 50)
        
        frontend_dir = self.project_root / "frontend"
        if not frontend_dir.exists():
            print("❌ Frontend directory not found")
            return
        
        # Check if package.json exists
        package_json = frontend_dir / "package.json"
        if not package_json.exists():
            print("❌ package.json not found in frontend directory")
            return
        
        # Test TypeScript compilation
        try:
            print("🔍 Testing TypeScript compilation...")
            result = subprocess.run(
                ["npm", "run", "type-check"],
                cwd=frontend_dir,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                self.results['frontend']['success'].append("TypeScript compilation: Successful")
                self.passed_tests += 1
                print("✅ TypeScript compilation successful")
            else:
                self.results['frontend']['failed'].append(f"TypeScript compilation: {result.stderr}")
                self.failed_tests += 1
                print(f"❌ TypeScript compilation failed: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            self.results['frontend']['failed'].append("TypeScript compilation: Timeout")
            self.failed_tests += 1
            print("❌ TypeScript compilation: Timeout")
        except Exception as e:
            self.results['frontend']['failed'].append(f"TypeScript compilation: {str(e)}")
            self.failed_tests += 1
            print(f"❌ TypeScript compilation: {str(e)}")
        
        # Test Next.js build (dry run)
        try:
            print("🔍 Testing Next.js build...")
            result = subprocess.run(
                ["npm", "run", "build"],
                cwd=frontend_dir,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                self.results['frontend']['success'].append("Next.js build: Successful")
                self.passed_tests += 1
                print("✅ Next.js build successful")
            else:
                self.results['frontend']['failed'].append(f"Next.js build: {result.stderr}")
                self.failed_tests += 1
                print(f"❌ Next.js build failed: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            self.results['frontend']['failed'].append("Next.js build: Timeout")
            self.failed_tests += 1
            print("❌ Next.js build: Timeout")
        except Exception as e:
            self.results['frontend']['failed'].append(f"Next.js build: {str(e)}")
            self.failed_tests += 1
            print(f"❌ Next.js build: {str(e)}")
    
    def run_existing_import_test(self):
        """Run the existing backend import test."""
        print("\n🔍 Running Existing Backend Import Test...")
        print("=" * 50)
        
        backend_dir = self.project_root / "backend"
        test_file = backend_dir / "test_imports.py"
        
        if test_file.exists():
            try:
                result = subprocess.run(
                    [sys.executable, str(test_file)],
                    cwd=backend_dir,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    self.results['backend']['success'].append("Existing import test: Successful")
                    self.passed_tests += 1
                    print("✅ Existing import test passed")
                    print(result.stdout)
                else:
                    self.results['backend']['failed'].append(f"Existing import test: {result.stderr}")
                    self.failed_tests += 1
                    print(f"❌ Existing import test failed: {result.stderr}")
                    
            except subprocess.TimeoutExpired:
                self.results['backend']['failed'].append("Existing import test: Timeout")
                self.failed_tests += 1
                print("❌ Existing import test: Timeout")
            except Exception as e:
                self.results['backend']['failed'].append(f"Existing import test: {str(e)}")
                self.failed_tests += 1
                print(f"❌ Existing import test: {str(e)}")
        else:
            print("⚠️  Existing import test file not found")
    
    def generate_report(self):
        """Generate a comprehensive test report."""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE IMPORT TEST REPORT")
        print("=" * 80)
        
        print(f"\n📈 SUMMARY:")
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%" if self.total_tests > 0 else "N/A")
        
        for category, results in self.results.items():
            print(f"\n🔍 {category.upper()}:")
            print(f"  ✅ Successful: {len(results['success'])}")
            print(f"  ❌ Failed: {len(results['failed'])}")
            print(f"  ⚠️  Warnings: {len(results['warnings'])}")
            
            if results['failed']:
                print(f"\n  ❌ FAILED IMPORTS:")
                for failure in results['failed']:
                    print(f"    - {failure}")
            
            if results['warnings']:
                print(f"\n  ⚠️  WARNINGS:")
                for warning in results['warnings']:
                    print(f"    - {warning}")
        
        # Save detailed report to file
        report_file = self.project_root / "import_test_report.json"
        with open(report_file, 'w') as f:
            json.dump({
                'summary': {
                    'total_tests': self.total_tests,
                    'passed_tests': self.passed_tests,
                    'failed_tests': self.failed_tests,
                    'success_rate': (self.passed_tests/self.total_tests*100) if self.total_tests > 0 else 0
                },
                'results': self.results
            }, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_file}")
        
        return self.failed_tests == 0
    
    def run_all_tests(self):
        """Run all import tests."""
        print("🧪 BUFFR HOST PLATFORM - COMPREHENSIVE IMPORT TESTING")
        print("=" * 80)
        
        # Run existing backend test first
        self.run_existing_import_test()
        
        # Test backend imports
        self.test_backend_imports()
        
        # Test microservices imports
        self.test_microservices_imports()
        
        # Test scripts imports
        self.test_scripts_imports()
        
        # Test frontend imports
        self.test_frontend_imports()
        
        # Generate final report
        success = self.generate_report()
        
        if success:
            print("\n🎉 ALL IMPORT TESTS PASSED!")
            return True
        else:
            print("\n💥 SOME IMPORT TESTS FAILED!")
            return False


def main():
    """Main function to run import tests."""
    project_root = os.path.dirname(os.path.abspath(__file__))
    tester = ImportTester(project_root)
    
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()