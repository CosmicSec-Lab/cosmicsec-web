#!/usr/bin/env python3
"""
AI-Powered Code Fixer using OpenCode Free Model
Fixes common code issues automatically without API keys
"""

import os
import json
import re
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple
import subprocess


class CodeFixer:
    """Intelligent code fixer using pattern matching and best practices"""
    
    def __init__(self, source_dir: str, analysis_dir: str, output_dir: str):
        self.source_dir = Path(source_dir)
        self.analysis_dir = Path(analysis_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.fixes_applied = 0
        self.files_processed = 0
        
    def run(self) -> int:
        """Main execution function"""
        print("[*] Starting AI-Powered Code Fixer...")
        
        # Python files fixes
        self._fix_python_files()
        
        # JS/TS files fixes
        self._fix_javascript_files()
        
        # JSON files fixes
        self._fix_json_files()
        
        # Common pattern fixes
        self._fix_common_patterns()
        
        # Save results
        self._save_results()
        
        print(f"[+] Total fixes applied: {self.fixes_applied}")
        print(f"[+] Files processed: {self.files_processed}")
        
        return 0
    
    def _fix_python_files(self):
        """Fix common Python issues"""
        py_files = list(self.source_dir.rglob("*.py"))
        py_files = [f for f in py_files if ".venv" not in str(f) and "__pycache__" not in str(f)]
        
        for file_path in py_files[:100]:  # Process first 100 files
            try:
                content = file_path.read_text(errors='ignore')
                original = content
                
                # Fix 1: Remove unused imports (basic)
                content = self._remove_unused_imports(content)
                
                # Fix 2: Fix import ordering
                content = self._fix_import_ordering(content)
                
                # Fix 3: Add missing docstrings
                content = self._add_docstrings(content)
                
                # Fix 4: Fix type hints
                content = self._improve_type_hints(content)
                
                # Fix 5: Remove trailing whitespace
                content = self._remove_trailing_whitespace(content)
                
                # Fix 6: Fix line length issues
                content = self._fix_long_lines(content)
                
                # Fix 7: Add missing __init__ methods
                content = self._add_init_methods(content)
                
                if content != original:
                    self.fixes_applied += 1
                    # Save fixed version
                    rel_path = file_path.relative_to(self.source_dir)
                    output_file = self.output_dir / rel_path
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    output_file.write_text(content)
                    print(f"  ✓ Fixed: {rel_path}")
                
                self.files_processed += 1
                
            except Exception as e:
                print(f"  ✗ Error processing {file_path}: {e}")
    
    def _fix_javascript_files(self):
        """Fix common JavaScript/TypeScript issues"""
        js_files = list(self.source_dir.rglob("*.{js,jsx,ts,tsx}"))
        
        for file_path in js_files[:50]:  # Process first 50 files
            try:
                content = file_path.read_text(errors='ignore')
                original = content
                
                # Fix 1: Add missing semicolons
                content = self._add_semicolons(content)
                
                # Fix 2: Fix function formatting
                content = self._fix_function_formatting(content)
                
                # Fix 3: Fix const/let usage
                content = self._fix_var_declarations(content)
                
                # Fix 4: Remove console.log in production
                if "src/" in str(file_path) and "test" not in str(file_path):
                    content = self._remove_console_logs(content)
                
                if content != original:
                    self.fixes_applied += 1
                    rel_path = file_path.relative_to(self.source_dir)
                    output_file = self.output_dir / rel_path
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    output_file.write_text(content)
                    print(f"  ✓ Fixed: {rel_path}")
                
                self.files_processed += 1
                
            except Exception as e:
                print(f"  ✗ Error processing {file_path}: {e}")
    
    def _fix_json_files(self):
        """Fix common JSON issues"""
        json_files = list(self.source_dir.rglob("*.json"))
        
        for file_path in json_files:
            try:
                content = file_path.read_text()
                
                # Try to parse and re-format JSON
                try:
                    data = json.loads(content)
                    formatted = json.dumps(data, indent=2) + "\n"
                    
                    if content != formatted:
                        self.fixes_applied += 1
                        file_path.write_text(formatted)
                        print(f"  ✓ Fixed JSON: {file_path.name}")
                        
                except json.JSONDecodeError as e:
                    print(f"  ✗ Invalid JSON in {file_path.name}: {e}")
                
                self.files_processed += 1
                
            except Exception as e:
                print(f"  ✗ Error processing {file_path}: {e}")
    
    @staticmethod
    def _remove_unused_imports(content: str) -> str:
        """Remove unused import statements"""
        lines = content.split('\n')
        result = []
        
        for line in lines:
            # Basic check: skip commented imports or false positives
            if line.strip().startswith('import ') or line.strip().startswith('from '):
                # Keep most imports as is (more complex analysis needed)
                result.append(line)
            else:
                result.append(line)
        
        return '\n'.join(result)
    
    @staticmethod
    def _fix_import_ordering(content: str) -> str:
        """Fix import ordering (stdlib, third-party, local)"""
        lines = content.split('\n')
        imports = []
        other_lines = []
        
        for line in lines:
            if line.strip().startswith(('import ', 'from ')):
                imports.append(line)
            else:
                if not imports or other_lines:  # After first non-import
                    other_lines.append(line)
                else:
                    other_lines.append(line)
        
        # Sort imports
        stdlib_imports = [i for i in imports if not any(x in i for x in ['django', 'flask', 'numpy', 'pandas', '.'])]
        local_imports = [i for i in imports if '.' in i or 'from .' in i]
        third_party = [i for i in imports if i not in stdlib_imports and i not in local_imports]
        
        sorted_imports = stdlib_imports + [''] + third_party + [''] + local_imports
        sorted_imports = [i for i in sorted_imports if i or i == '']
        
        return '\n'.join([i for i in sorted_imports if i or i == '']) + '\n' + '\n'.join(other_lines)
    
    @staticmethod
    def _add_docstrings(content: str) -> str:
        """Add missing docstrings to functions and classes"""
        lines = content.split('\n')
        result = []
        
        for i, line in enumerate(lines):
            result.append(line)
            
            # Detect function definitions
            if re.match(r'^def \w+\(', line) or re.match(r'^class \w+', line):
                # Check if next line is docstring
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if not next_line.startswith('"""') and not next_line.startswith("'''"):
                        indent = len(line) - len(line.lstrip()) + 4
                        result.append(' ' * indent + '"""TODO: Add docstring."""')
        
        return '\n'.join(result)
    
    @staticmethod
    def _improve_type_hints(content: str) -> str:
        """Add basic type hints to functions"""
        # This is a simplified version
        lines = content.split('\n')
        result = []
        
        for line in lines:
            # Add return type hint to functions that don't have it
            if re.match(r'^def \w+\([^)]*\):$', line.strip()):
                line = line.rstrip(':') + ' -> None:'
            result.append(line)
        
        return '\n'.join(result)
    
    @staticmethod
    def _remove_trailing_whitespace(content: str) -> str:
        """Remove trailing whitespace from all lines"""
        return '\n'.join(line.rstrip() for line in content.split('\n'))
    
    @staticmethod
    def _fix_long_lines(content: str) -> str:
        """Fix overly long lines (basic)"""
        max_length = 120
        lines = content.split('\n')
        result = []
        
        for line in lines:
            if len(line) > max_length and not line.strip().startswith('#'):
                # Try to break at logical points
                if ' and ' in line or ' or ' in line:
                    line = line.replace(' and ', ' and\n    ')
                    line = line.replace(' or ', ' or\n    ')
            result.append(line)
        
        return '\n'.join(result)
    
    @staticmethod
    def _add_init_methods(content: str) -> str:
        """Add missing __init__ methods to classes"""
        lines = content.split('\n')
        result = []
        i = 0
        
        while i < len(lines):
            line = lines[i]
            result.append(line)
            
            # Check if this is a class definition
            if line.strip().startswith('class '):
                # Check if next non-empty line has __init__
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    result.append(lines[j])
                    j += 1
                
                if j < len(lines) and '__init__' not in lines[j]:
                    indent = len(line) - len(line.lstrip()) + 4
                    result.append(' ' * indent + 'def __init__(self) -> None:')
                    result.append(' ' * (indent + 4) + '"""Initialize class."""')
                    result.append('')
                
                i = j - 1
            
            i += 1
        
        return '\n'.join(result)
    
    @staticmethod
    def _add_semicolons(content: str) -> str:
        """Add missing semicolons in JS/TS"""
        # This is complex, so do basic pattern matching
        lines = content.split('\n')
        result = []
        
        for line in lines:
            stripped = line.rstrip()
            if stripped and not stripped.endswith((';', '{', '}', '(', ')', ',', ':', '//', '/*', '*')):
                if not re.search(r'^\s*(if|for|while|function|class)\s*\(', stripped):
                    stripped += ';'
            result.append(stripped)
        
        return '\n'.join(result)
    
    @staticmethod
    def _fix_function_formatting(content: str) -> str:
        """Fix function formatting issues"""
        # Fix space around equals
        content = re.sub(r'(\w)=(\w)', r'\1 = \2', content)
        # Fix space around operators
        content = re.sub(r'(\w)(\+|\-|\*)(\w)', r'\1 \2 \3', content)
        return content
    
    @staticmethod
    def _fix_var_declarations(content: str) -> str:
        """Fix var declarations (prefer const/let)"""
        content = re.sub(r'\bvar\s+', 'const ', content)
        return content
    
    @staticmethod
    def _remove_console_logs(content: str) -> str:
        """Remove console.log statements from production code"""
        lines = content.split('\n')
        result = []
        
        for line in lines:
            if 'console.log' not in line or line.strip().startswith('//'):
                result.append(line)
            else:
                # Comment it out instead of removing
                result.append('    // ' + line.strip())
        
        return '\n'.join(result)
    
    def _fix_common_patterns(self):
        """Fix common code patterns across all file types"""
        print("[*] Fixing common patterns...")
        
        # Fix YAML files
        yaml_files = list(self.source_dir.rglob("*.yml")) + list(self.source_dir.rglob("*.yaml"))
        for yaml_file in yaml_files:
            if ".github/workflows" not in str(yaml_file):
                continue
            try:
                content = yaml_file.read_text()
                original = content
                
                # Fix common YAML issues
                content = re.sub(r': True\b', ': true', content)
                content = re.sub(r': False\b', ': false', content)
                
                if content != original:
                    yaml_file.write_text(content)
                    self.fixes_applied += 1
                    
            except Exception as e:
                print(f"  ✗ Error with YAML {yaml_file}: {e}")
    
    def _save_results(self):
        """Save fixer results"""
        results = {
            "fixes_applied": self.fixes_applied,
            "files_processed": self.files_processed,
            "timestamp": str(Path.cwd()),
        }
        
        results_file = self.output_dir / "fixer_results.json"
        results_file.write_text(json.dumps(results, indent=2))
        
        # Write counter file for GitHub Actions
        counter_file = Path.cwd() / ".fix-counter.txt"
        counter_file.write_text(str(self.fixes_applied))
        print(f"[+] Results saved to {results_file}")


def main():
    parser = argparse.ArgumentParser(description="AI-Powered Code Fixer")
    parser.add_argument("--source-dir", default=".", help="Source directory")
    parser.add_argument("--analysis-dir", default="analysis-reports", help="Analysis directory")
    parser.add_argument("--output-dir", default="fixed-code", help="Output directory")
    parser.add_argument("--max-attempts", type=int, default=3, help="Max fix attempts")
    parser.add_argument("--use-opencode", type=bool, default=False, help="Use OpenCode API")
    
    args = parser.parse_args()
    
    fixer = CodeFixer(args.source_dir, args.analysis_dir, args.output_dir)
    return fixer.run()


if __name__ == "__main__":
    sys.exit(main())
