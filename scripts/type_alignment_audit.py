#!/usr/bin/env python3
"""
Comprehensive Type & Schema Alignment Audit
Analyzes type consistency across Pydantic, SQLAlchemy, Zod, and TypeScript interfaces
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Any, Optional
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class TypeDefinition:
    """Represents a type definition found in the codebase"""
    name: str
    file_path: str
    line_number: int
    type_system: str  # 'pydantic', 'sqlalchemy', 'typescript', 'zod'
    fields: Dict[str, str]  # field_name -> field_type
    raw_content: str

@dataclass
class AlignmentIssue:
    """Represents a type alignment issue"""
    severity: str  # 'critical', 'warning', 'info'
    category: str  # 'type_mismatch', 'missing_validation', 'schema_drift', 'rls_gap'
    description: str
    affected_files: List[str]
    suggested_fix: str

class TypeAlignmentAuditor:
    """Main auditor class for type alignment analysis"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.issues: List[AlignmentIssue] = []
        self.type_definitions: Dict[str, List[TypeDefinition]] = defaultdict(list)
        self.schema_files: Dict[str, str] = {}
        
    def discover_pydantic_models(self) -> None:
        """Discover all Pydantic models in the backend"""
        print("🔍 Discovering Pydantic models...")
        
        backend_path = self.project_root / "backend"
        if not backend_path.exists():
            print("❌ Backend directory not found")
            return
            
        for py_file in backend_path.rglob("*.py"):
            if "__pycache__" in str(py_file) or "venv" in str(py_file):
                continue
                
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find Pydantic model definitions
                model_pattern = r'class\s+(\w+)\(BaseModel\):'
                for match in re.finditer(model_pattern, content):
                    model_name = match.group(1)
                    line_number = content[:match.start()].count('\n') + 1
                    
                    # Extract fields from the model
                    fields = self._extract_pydantic_fields(content, match.start())
                    
                    type_def = TypeDefinition(
                        name=model_name,
                        file_path=str(py_file.relative_to(self.project_root)),
                        line_number=line_number,
                        type_system='pydantic',
                        fields=fields,
                        raw_content=content[match.start():match.start() + 500]
                    )
                    
                    self.type_definitions['pydantic'].append(type_def)
                    
            except Exception as e:
                print(f"⚠️ Error reading {py_file}: {e}")
                
    def discover_sqlalchemy_models(self) -> None:
        """Discover all SQLAlchemy models in the backend"""
        print("🔍 Discovering SQLAlchemy models...")
        
        backend_path = self.project_root / "backend"
        if not backend_path.exists():
            return
            
        for py_file in backend_path.rglob("*.py"):
            if "__pycache__" in str(py_file) or "venv" in str(py_file):
                continue
                
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find SQLAlchemy model definitions
                model_pattern = r'class\s+(\w+)\(Base\):'
                for match in re.finditer(model_pattern, content):
                    model_name = match.group(1)
                    line_number = content[:match.start()].count('\n') + 1
                    
                    # Extract fields from the model
                    fields = self._extract_sqlalchemy_fields(content, match.start())
                    
                    type_def = TypeDefinition(
                        name=model_name,
                        file_path=str(py_file.relative_to(self.project_root)),
                        line_number=line_number,
                        type_system='sqlalchemy',
                        fields=fields,
                        raw_content=content[match.start():match.start() + 500]
                    )
                    
                    self.type_definitions['sqlalchemy'].append(type_def)
                    
            except Exception as e:
                print(f"⚠️ Error reading {py_file}: {e}")
                
    def discover_typescript_interfaces(self) -> None:
        """Discover all TypeScript interfaces in the frontend"""
        print("🔍 Discovering TypeScript interfaces...")
        
        frontend_path = self.project_root / "frontend"
        if not frontend_path.exists():
            return
            
        for ts_file in frontend_path.rglob("*.ts"):
            if "node_modules" in str(ts_file) or ".next" in str(ts_file):
                continue
                
            try:
                with open(ts_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find TypeScript interface definitions
                interface_pattern = r'interface\s+(\w+)\s*\{'
                for match in re.finditer(interface_pattern, content):
                    interface_name = match.group(1)
                    line_number = content[:match.start()].count('\n') + 1
                    
                    # Extract fields from the interface
                    fields = self._extract_typescript_fields(content, match.start())
                    
                    type_def = TypeDefinition(
                        name=interface_name,
                        file_path=str(ts_file.relative_to(self.project_root)),
                        line_number=line_number,
                        type_system='typescript',
                        fields=fields,
                        raw_content=content[match.start():match.start() + 500]
                    )
                    
                    self.type_definitions['typescript'].append(type_def)
                    
            except Exception as e:
                print(f"⚠️ Error reading {ts_file}: {e}")
                
    def discover_zod_schemas(self) -> None:
        """Discover all Zod schemas in the frontend"""
        print("🔍 Discovering Zod schemas...")
        
        frontend_path = self.project_root / "frontend"
        if not frontend_path.exists():
            return
            
        for ts_file in frontend_path.rglob("*.ts"):
            if "node_modules" in str(ts_file) or ".next" in str(ts_file):
                continue
                
            try:
                with open(ts_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find Zod schema definitions
                zod_pattern = r'const\s+(\w+)\s*=\s*z\.object\('
                for match in re.finditer(zod_pattern, content):
                    schema_name = match.group(1)
                    line_number = content[:match.start()].count('\n') + 1
                    
                    # Extract fields from the schema
                    fields = self._extract_zod_fields(content, match.start())
                    
                    type_def = TypeDefinition(
                        name=schema_name,
                        file_path=str(ts_file.relative_to(self.project_root)),
                        line_number=line_number,
                        type_system='zod',
                        fields=fields,
                        raw_content=content[match.start():match.start() + 500]
                    )
                    
                    self.type_definitions['zod'].append(type_def)
                    
            except Exception as e:
                print(f"⚠️ Error reading {ts_file}: {e}")
                
    def _extract_pydantic_fields(self, content: str, start_pos: int) -> Dict[str, str]:
        """Extract field definitions from a Pydantic model"""
        fields = {}
        
        # Find the class definition block
        lines = content[start_pos:].split('\n')
        in_class = False
        indent_level = 0
        
        for line in lines:
            if 'class' in line and '(' in line:
                in_class = True
                continue
                
            if in_class:
                if line.strip() == '':
                    continue
                    
                # Check if we've left the class
                if line.strip() and not line.startswith(' ') and not line.startswith('\t'):
                    break
                    
                # Extract field definitions
                field_match = re.match(r'\s*(\w+):\s*([^=]+)', line)
                if field_match:
                    field_name = field_match.group(1)
                    field_type = field_match.group(2).strip()
                    fields[field_name] = field_type
                    
        return fields
        
    def _extract_sqlalchemy_fields(self, content: str, start_pos: int) -> Dict[str, str]:
        """Extract field definitions from a SQLAlchemy model"""
        fields = {}
        
        # Find the class definition block
        lines = content[start_pos:].split('\n')
        in_class = False
        
        for line in lines:
            if 'class' in line and '(' in line:
                in_class = True
                continue
                
            if in_class:
                if line.strip() == '':
                    continue
                    
                # Check if we've left the class
                if line.strip() and not line.startswith(' ') and not line.startswith('\t'):
                    break
                    
                # Extract Column definitions
                column_match = re.match(r'\s*(\w+)\s*=\s*Column\(([^)]+)\)', line)
                if column_match:
                    field_name = column_match.group(1)
                    field_type = column_match.group(2)
                    fields[field_name] = field_type
                    
        return fields
        
    def _extract_typescript_fields(self, content: str, start_pos: int) -> Dict[str, str]:
        """Extract field definitions from a TypeScript interface"""
        fields = {}
        
        # Find the interface definition block
        lines = content[start_pos:].split('\n')
        in_interface = False
        brace_count = 0
        
        for line in lines:
            if 'interface' in line and '{' in line:
                in_interface = True
                brace_count = line.count('{') - line.count('}')
                continue
                
            if in_interface:
                brace_count += line.count('{') - line.count('}')
                
                if brace_count <= 0:
                    break
                    
                # Extract field definitions
                field_match = re.match(r'\s*(\w+)\??:\s*([^;]+);?', line)
                if field_match:
                    field_name = field_match.group(1)
                    field_type = field_match.group(2).strip()
                    fields[field_name] = field_type
                    
        return fields
        
    def _extract_zod_fields(self, content: str, start_pos: int) -> Dict[str, str]:
        """Extract field definitions from a Zod schema"""
        fields = {}
        
        # Find the schema definition block
        lines = content[start_pos:].split('\n')
        in_schema = False
        paren_count = 0
        
        for line in lines:
            if 'z.object(' in line:
                in_schema = True
                paren_count = line.count('(') - line.count(')')
                continue
                
            if in_schema:
                paren_count += line.count('(') - line.count(')')
                
                if paren_count <= 0:
                    break
                    
                # Extract field definitions
                field_match = re.match(r'\s*(\w+):\s*z\.([^,)]+)', line)
                if field_match:
                    field_name = field_match.group(1)
                    field_type = field_match.group(2).strip()
                    fields[field_name] = field_type
                    
        return fields
        
    def analyze_type_alignment(self) -> None:
        """Analyze alignment between different type systems"""
        print("🔍 Analyzing type alignment...")
        
        # Check for missing TypeScript interfaces for Pydantic models
        pydantic_models = {td.name for td in self.type_definitions['pydantic']}
        typescript_interfaces = {td.name for td in self.type_definitions['typescript']}
        
        missing_interfaces = pydantic_models - typescript_interfaces
        for model_name in missing_interfaces:
            self.issues.append(AlignmentIssue(
                severity='warning',
                category='missing_validation',
                description=f"Missing TypeScript interface for Pydantic model: {model_name}",
                affected_files=[td.file_path for td in self.type_definitions['pydantic'] if td.name == model_name],
                suggested_fix=f"Create TypeScript interface {model_name} in frontend/lib/types/"
            ))
            
        # Check for missing Zod schemas for Pydantic models
        zod_schemas = {td.name for td in self.type_definitions['zod']}
        missing_zod = pydantic_models - zod_schemas
        
        for model_name in missing_zod:
            self.issues.append(AlignmentIssue(
                severity='info',
                category='missing_validation',
                description=f"Missing Zod schema for Pydantic model: {model_name}",
                affected_files=[td.file_path for td in self.type_definitions['pydantic'] if td.name == model_name],
                suggested_fix=f"Create Zod schema {model_name} in frontend/lib/schemas/"
            ))
            
        # Check for type mismatches between Pydantic and SQLAlchemy
        self._check_pydantic_sqlalchemy_alignment()
        
        # Check for validation inconsistencies
        self._check_validation_consistency()
        
    def _check_pydantic_sqlalchemy_alignment(self) -> None:
        """Check alignment between Pydantic and SQLAlchemy models"""
        pydantic_by_name = {td.name: td for td in self.type_definitions['pydantic']}
        sqlalchemy_by_name = {td.name: td for td in self.type_definitions['sqlalchemy']}
        
        for model_name in pydantic_by_name:
            if model_name in sqlalchemy_by_name:
                pydantic_model = pydantic_by_name[model_name]
                sqlalchemy_model = sqlalchemy_by_name[model_name]
                
                # Check for field mismatches
                pydantic_fields = set(pydantic_model.fields.keys())
                sqlalchemy_fields = set(sqlalchemy_model.fields.keys())
                
                missing_in_sqlalchemy = pydantic_fields - sqlalchemy_fields
                missing_in_pydantic = sqlalchemy_fields - pydantic_fields
                
                if missing_in_sqlalchemy:
                    self.issues.append(AlignmentIssue(
                        severity='critical',
                        category='type_mismatch',
                        description=f"Fields missing in SQLAlchemy model {model_name}: {missing_in_sqlalchemy}",
                        affected_files=[pydantic_model.file_path, sqlalchemy_model.file_path],
                        suggested_fix=f"Add missing fields to SQLAlchemy model {model_name}"
                    ))
                    
                if missing_in_pydantic:
                    self.issues.append(AlignmentIssue(
                        severity='warning',
                        category='type_mismatch',
                        description=f"Fields missing in Pydantic model {model_name}: {missing_in_pydantic}",
                        affected_files=[pydantic_model.file_path, sqlalchemy_model.file_path],
                        suggested_fix=f"Add missing fields to Pydantic model {model_name}"
                    ))
                    
    def _check_validation_consistency(self) -> None:
        """Check for validation consistency across type systems"""
        # This would check for validation rules consistency
        # between Pydantic validators and Zod schemas
        pass
        
    def generate_report(self) -> str:
        """Generate a comprehensive alignment report"""
        report = []
        report.append("# 🔍 COMPREHENSIVE TYPE & SCHEMA ALIGNMENT AUDIT REPORT")
        report.append(f"Generated: {os.popen('date').read().strip()}")
        report.append("")
        
        # Summary statistics
        report.append("## 📊 SUMMARY STATISTICS")
        report.append("")
        for type_system, definitions in self.type_definitions.items():
            report.append(f"- **{type_system.title()}**: {len(definitions)} definitions")
        report.append(f"- **Total Issues Found**: {len(self.issues)}")
        report.append("")
        
        # Critical issues
        critical_issues = [issue for issue in self.issues if issue.severity == 'critical']
        if critical_issues:
            report.append("## 🚨 CRITICAL ISSUES")
            report.append("")
            for issue in critical_issues:
                report.append(f"### {issue.description}")
                report.append(f"**Files**: {', '.join(issue.affected_files)}")
                report.append(f"**Fix**: {issue.suggested_fix}")
                report.append("")
                
        # Warning issues
        warning_issues = [issue for issue in self.issues if issue.severity == 'warning']
        if warning_issues:
            report.append("## ⚠️ WARNING ISSUES")
            report.append("")
            for issue in warning_issues:
                report.append(f"### {issue.description}")
                report.append(f"**Files**: {', '.join(issue.affected_files)}")
                report.append(f"**Fix**: {issue.suggested_fix}")
                report.append("")
                
        # Info issues
        info_issues = [issue for issue in self.issues if issue.severity == 'info']
        if info_issues:
            report.append("## ℹ️ INFO ISSUES")
            report.append("")
            for issue in info_issues:
                report.append(f"### {issue.description}")
                report.append(f"**Files**: {', '.join(issue.affected_files)}")
                report.append(f"**Fix**: {issue.suggested_fix}")
                report.append("")
                
        # Type definitions by system
        report.append("## 📋 TYPE DEFINITIONS BY SYSTEM")
        report.append("")
        for type_system, definitions in self.type_definitions.items():
            report.append(f"### {type_system.title()}")
            report.append("")
            for definition in definitions:
                report.append(f"- **{definition.name}** ({definition.file_path}:{definition.line_number})")
                if definition.fields:
                    report.append(f"  - Fields: {', '.join(definition.fields.keys())}")
            report.append("")
            
        return "\n".join(report)
        
    def run_audit(self) -> None:
        """Run the complete type alignment audit"""
        print("🚀 Starting Comprehensive Type & Schema Alignment Audit")
        print("=" * 60)
        
        # Discover all type definitions
        self.discover_pydantic_models()
        self.discover_sqlalchemy_models()
        self.discover_typescript_interfaces()
        self.discover_zod_schemas()
        
        # Analyze alignment
        self.analyze_type_alignment()
        
        # Generate report
        report = self.generate_report()
        
        # Save report
        report_path = self.project_root / "TYPE_ALIGNMENT_AUDIT_REPORT.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
            
        print(f"✅ Audit complete! Report saved to: {report_path}")
        print(f"📊 Found {len(self.issues)} issues across all type systems")
        
        # Print summary
        critical_count = len([i for i in self.issues if i.severity == 'critical'])
        warning_count = len([i for i in self.issues if i.severity == 'warning'])
        info_count = len([i for i in self.issues if i.severity == 'info'])
        
        print(f"🚨 Critical: {critical_count}")
        print(f"⚠️ Warning: {warning_count}")
        print(f"ℹ️ Info: {info_count}")

def main():
    """Main entry point"""
    project_root = "/Users/georgenekwaya/ai-agent-mastery/buffr-host"
    auditor = TypeAlignmentAuditor(project_root)
    auditor.run_audit()

if __name__ == "__main__":
    main()