#!/usr/bin/env python3
"""
Smart Code Enhancement Engine
Suggests and applies code improvements without API keys
"""

import json
import re
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any
from collections import defaultdict


class CodeEnhancer:
    """Smart enhancement engine for code quality improvements"""
    
    def __init__(self, source_dir: str, model: str = "opencode", output_file: str = "enhancements.json"):
        self.source_dir = Path(source_dir)
        self.model = model
        self.output_file = output_file
        self.enhancements = []
        self.improvements_count = 0
        self.files_analyzed = 0
    
    def run(self) -> int:
        """Execute enhancement analysis"""
        print("[*] Starting Code Enhancement Engine...")
        
        # Analyze Python files
        self._enhance_python_files()
        
        # Analyze JavaScript/TypeScript files
        self._enhance_javascript_files()
        
        # Analyze configuration files
        self._enhance_configs()
        
        # Generate enhancements summary
        self._save_enhancements()
        
        print(f"[+] Total improvements suggested: {self.improvements_count}")
        print(f"[+] Files analyzed: {self.files_analyzed}")
        
        return 0
    
    def _enhance_python_files(self):
        """Enhance Python files"""
        print("[*] Analyzing Python files...")
        
        py_files = list(self.source_dir.rglob("*.py"))
        py_files = [f for f in py_files if ".venv" not in str(f) and "__pycache__" not in str(f)]
        
        for file_path in py_files[:150]:
            try:
                content = file_path.read_text(errors='ignore')
                self.files_analyzed += 1
                
                # Check for enhancement opportunities
                suggestions = self._get_python_enhancements(content, file_path)
                self.enhancements.extend(suggestions)
                self.improvements_count += len(suggestions)
                
            except Exception as e:
                print(f"  ✗ Error analyzing {file_path}: {e}")
    
    def _enhance_javascript_files(self):
        """Enhance JavaScript/TypeScript files"""
        print("[*] Analyzing JavaScript/TypeScript files...")
        
        js_files = list(self.source_dir.rglob("*.{js,jsx,ts,tsx}"))
        
        for file_path in js_files[:100]:
            try:
                content = file_path.read_text(errors='ignore')
                self.files_analyzed += 1
                
                suggestions = self._get_javascript_enhancements(content, file_path)
                self.enhancements.extend(suggestions)
                self.improvements_count += len(suggestions)
                
            except Exception as e:
                print(f"  ✗ Error analyzing {file_path}: {e}")
    
    def _enhance_configs(self):
        """Enhance configuration files"""
        print("[*] Analyzing configuration files...")
        
        # Check pyproject.toml
        pyproject_files = list(self.source_dir.rglob("pyproject.toml"))
        for file_path in pyproject_files:
            try:
                content = file_path.read_text()
                self.files_analyzed += 1
                
                suggestions = self._get_config_enhancements(content, file_path)
                self.enhancements.extend(suggestions)
                self.improvements_count += len(suggestions)
                
            except Exception as e:
                print(f"  ✗ Error analyzing {file_path}: {e}")
    
    @staticmethod
    def _get_python_enhancements(content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Get enhancement suggestions for Python files"""
        suggestions = []
        
        # Check for missing error handling
        if re.search(r'^\s*try:', content, re.MULTILINE):
            if not re.search(r'except\s+\w+\s+as\s+\w+:', content):
                suggestions.append({
                    "type": "error_handling",
                    "severity": "medium",
                    "file": str(file_path),
                    "suggestion": "Add specific exception handling with 'as' clause"
                })
        
        # Check for missing logging
        if 'print(' in content and 'import logging' not in content:
            suggestions.append({
                "type": "logging",
                "severity": "low",
                "file": str(file_path),
                "suggestion": "Replace print() with logging module"
            })
        
        # Check for hardcoded values
        if re.search(r"(password|api_key|secret)\s*=\s*['\"]", content, re.IGNORECASE):
            suggestions.append({
                "type": "security",
                "severity": "high",
                "file": str(file_path),
                "suggestion": "Remove hardcoded credentials, use environment variables"
            })
        
        # Check for type hints coverage
        lines = content.split('\n')
        func_count = len([l for l in lines if re.match(r'^def \w+', l)])
        hint_count = len([l for l in lines if '->' in l or ': ' in l])
        
        if func_count > 5 and hint_count < func_count * 0.5:
            suggestions.append({
                "type": "typing",
                "severity": "low",
                "file": str(file_path),
                "suggestion": f"Add type hints to {func_count - hint_count} functions"
            })
        
        # Check for docstring coverage
        docstring_count = len(re.findall(r'"""', content))
        if func_count > 0 and docstring_count < func_count:
            suggestions.append({
                "type": "documentation",
                "severity": "low",
                "file": str(file_path),
                "suggestion": "Add docstrings to public functions"
            })
        
        # Check for TODO comments
        todos = len(re.findall(r'#\s*TODO|#\s*FIXME', content, re.IGNORECASE))
        if todos > 0:
            suggestions.append({
                "type": "code_quality",
                "severity": "medium",
                "file": str(file_path),
                "suggestion": f"Address {todos} TODO/FIXME comments"
            })
        
        # Check for dead code patterns
        if re.search(r'^\s*# unused|^\s*pass\s*$', content, re.MULTILINE):
            suggestions.append({
                "type": "code_quality",
                "severity": "low",
                "file": str(file_path),
                "suggestion": "Remove dead code and unnecessary pass statements"
            })
        
        return suggestions
    
    @staticmethod
    def _get_javascript_enhancements(content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Get enhancement suggestions for JavaScript files"""
        suggestions = []
        
        # Check for missing error handling
        if 'try' in content and 'catch' not in content:
            suggestions.append({
                "type": "error_handling",
                "severity": "medium",
                "file": str(file_path),
                "suggestion": "Add catch blocks for all try statements"
            })
        
        # Check for missing null checks
        if '.prop' in content or '[0]' in content:
            if not re.search(r'if\s*\(.*\s*[!=]{1,2}=?\s*null', content):
                suggestions.append({
                    "type": "null_safety",
                    "severity": "high",
                    "file": str(file_path),
                    "suggestion": "Add null/undefined checks before accessing properties"
                })
        
        # Check for missing JSDoc
        func_count = len(re.findall(r'(function|const.*=.*\(|class\s+)', content))
        jsdoc_count = len(re.findall(r'/\*\*', content))
        
        if func_count > 3 and jsdoc_count == 0:
            suggestions.append({
                "type": "documentation",
                "severity": "low",
                "file": str(file_path),
                "suggestion": "Add JSDoc comments to exported functions"
            })
        
        # Check for hardcoded URLs/API endpoints
        if re.search(r"(http[s]?://|api\.)", content):
            suggestions.append({
                "type": "configuration",
                "severity": "medium",
                "file": str(file_path),
                "suggestion": "Move hardcoded URLs to configuration or environment variables"
            })
        
        # Check for console statements
        console_count = len(re.findall(r'console\.(log|error|warn)', content))
        if console_count > 5:
            suggestions.append({
                "type": "code_quality",
                "severity": "low",
                "file": str(file_path),
                "suggestion": f"Remove or replace {console_count} console statements with proper logging"
            })
        
        return suggestions
    
    @staticmethod
    def _get_config_enhancements(content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Get enhancement suggestions for configuration files"""
        suggestions = []
        
        if "pyproject.toml" in str(file_path):
            # Check for missing tool configurations
            if "[tool.black]" not in content:
                suggestions.append({
                    "type": "configuration",
                    "severity": "low",
                    "file": str(file_path),
                    "suggestion": "Add [tool.black] configuration for consistent formatting"
                })
            
            if "[tool.pytest.ini_options]" not in content:
                suggestions.append({
                    "type": "testing",
                    "severity": "low",
                    "file": str(file_path),
                    "suggestion": "Add pytest configuration for better test discovery"
                })
        
        return suggestions
    
    def _save_enhancements(self):
        """Save enhancement suggestions"""
        # Categorize enhancements
        by_type = defaultdict(list)
        by_severity = defaultdict(list)
        
        for enhancement in self.enhancements:
            by_type[enhancement.get("type", "unknown")].append(enhancement)
            by_severity[enhancement.get("severity", "low")].append(enhancement)
        
        summary = {
            "total_improvements": self.improvements_count,
            "files_analyzed": self.files_analyzed,
            "by_type": dict(by_type),
            "by_severity": {
                "high": len(by_severity.get("high", [])),
                "medium": len(by_severity.get("medium", [])),
                "low": len(by_severity.get("low", []))
            },
            "enhancements": self.enhancements[:100]  # Top 100 enhancements
        }
        
        output_path = Path(self.output_file)
        output_path.write_text(json.dumps(summary, indent=2))
        
        # Write counter for GitHub Actions
        counter_file = Path.cwd() / ".enhancement-counter.txt"
        counter_file.write_text(str(self.improvements_count))
        
        print(f"[+] Enhancements saved to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Smart Code Enhancement Engine")
    parser.add_argument("--source-dir", default=".", help="Source directory")
    parser.add_argument("--model", default="opencode", help="AI model to use")
    parser.add_argument("--use-opencode", type=bool, default=False, help="Use OpenCode")
    parser.add_argument("--output-enhancements", default="enhancements.json", help="Output file")
    
    args = parser.parse_args()
    
    enhancer = CodeEnhancer(args.source_dir, args.model, args.output_enhancements)
    return enhancer.run()


if __name__ == "__main__":
    sys.exit(main())
