#!/usr/bin/env python3
"""
Advanced Code Enhancer V2 - Professional Grade
Enhanced with intelligent pattern detection and improvement suggestions
"""

import os
import json
import re
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional, Any
from datetime import datetime
from collections import defaultdict
import ast


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('.enhance-execution.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AdvancedCodeEnhancer:
    """Professional code enhancement engine with pattern-based improvements"""
    
    ENHANCEMENT_CATEGORIES = [
        'performance',
        'reliability',
        'maintainability',
        'security',
        'documentation',
        'testing',
        'error_handling',
        'logging'
    ]
    
    def __init__(self, source_dir: str, output_dir: str, verbose: bool = False):
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.verbose = verbose
        self.suggestions = defaultdict(list)
        self.stats = defaultdict(int)
        
        logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    def run(self) -> int:
        """Main execution function"""
        logger.info("=" * 60)
        logger.info("🚀 Advanced Code Enhancer V2 Starting")
        logger.info("=" * 60)
        
        try:
            self._enhance_python_files()
            self._enhance_javascript_files()
            self._enhance_configuration_files()
            self._generate_enhancement_report()
            
            logger.info("=" * 60)
            logger.info(f"✅ Code Enhancement Completed")
            logger.info(f"   Total Suggestions: {sum(len(v) for v in self.suggestions.values())}")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Enhancement failed: {e}", exc_info=True)
            return 1
    
    def _enhance_python_files(self):
        """Enhance Python files with intelligent suggestions"""
        logger.info("\n🐍 Analyzing Python Files for Enhancements...")
        
        py_files = list(self.source_dir.rglob("*.py"))
        py_files = [f for f in py_files if ".venv" not in str(f) and "__pycache__" not in str(f)]
        
        logger.info(f"   Found {len(py_files)} Python files")
        
        for file_path in py_files[:300]:
            try:
                content = file_path.read_text(errors='ignore')
                relative_path = str(file_path.relative_to(self.source_dir))
                
                # Analyze for various improvements
                self._suggest_python_performance_improvements(relative_path, content)
                self._suggest_python_error_handling(relative_path, content)
                self._suggest_python_logging(relative_path, content)
                self._suggest_python_type_hints(relative_path, content)
                self._suggest_python_testing(relative_path, content)
                self._suggest_python_documentation(relative_path, content)
                self._suggest_python_security(relative_path, content)
                
                self.stats['python_analyzed'] += 1
                
            except Exception as e:
                logger.debug(f"Error analyzing {file_path}: {e}")
    
    def _suggest_python_performance_improvements(self, file_path: str, content: str):
        """Suggest performance optimizations"""
        suggestions = []
        
        # Detect inefficient list operations
        if re.search(r'for .* in .*\n.*\.append\(', content):
            suggestions.append({
                'type': 'performance',
                'issue': 'Inefficient list building in loop',
                'suggestion': 'Consider using list comprehension for better performance',
                'priority': 'medium'
            })
        
        # Detect N+1 query patterns (database)
        if 'for item in items:' in content and '.query(' in content:
            suggestions.append({
                'type': 'performance',
                'issue': 'Potential N+1 query pattern',
                'suggestion': 'Consider bulk loading or eager loading of relationships',
                'priority': 'high'
            })
        
        # Detect string concatenation in loops
        if re.search(r'.*+=.*in .*\n.*\+=', content):
            suggestions.append({
                'type': 'performance',
                'issue': 'String concatenation in loop detected',
                'suggestion': 'Use list.join() for string concatenation instead of +=',
                'priority': 'medium'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['performance_suggestions'] += len(suggestions)
    
    def _suggest_python_error_handling(self, file_path: str, content: str):
        """Suggest improved error handling"""
        suggestions = []
        
        # Detect bare except clauses
        if re.search(r'except:\s*(?!#)', content):
            suggestions.append({
                'type': 'reliability',
                'issue': 'Bare except clause found',
                'suggestion': 'Specify exception types instead of bare except',
                'priority': 'high'
            })
        
        # Detect missing try-except for file operations
        if re.search(r'open\(.*\)\s*(?!with)', content) and 'with open' not in content:
            suggestions.append({
                'type': 'reliability',
                'issue': 'File operation without context manager',
                'suggestion': 'Use with statement for file operations',
                'priority': 'high'
            })
        
        # Detect missing validation
        if 'def ' in content and 'if not ' not in content and 'assert ' not in content:
            suggestions.append({
                'type': 'reliability',
                'issue': 'Missing input validation',
                'suggestion': 'Add validation for function inputs',
                'priority': 'medium'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['reliability_suggestions'] += len(suggestions)
    
    def _suggest_python_logging(self, file_path: str, content: str):
        """Suggest logging improvements"""
        suggestions = []
        
        # Detect print statements (should use logging)
        print_count = len(re.findall(r'print\(', content))
        if print_count > 0:
            suggestions.append({
                'type': 'logging',
                'issue': f'Found {print_count} print statements',
                'suggestion': 'Replace print() with logging module for better control',
                'priority': 'medium'
            })
        
        # Detect missing logging module
        if 'print(' in content and 'logging' not in content and 'logger' not in content:
            suggestions.append({
                'type': 'logging',
                'issue': 'No logging configured',
                'suggestion': 'Add logging configuration at module start',
                'priority': 'low'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['logging_suggestions'] += len(suggestions)
    
    def _suggest_python_type_hints(self, file_path: str, content: str):
        """Suggest type hint improvements"""
        suggestions = []
        
        # Detect functions without type hints
        func_count = len(re.findall(r'def \w+\([^)]*\)(?!.*->):', content))
        if func_count > 0:
            suggestions.append({
                'type': 'maintainability',
                'issue': f'Found {func_count} functions without return type hints',
                'suggestion': 'Add type hints to all function definitions',
                'priority': 'medium'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['maintainability_suggestions'] += len(suggestions)
    
    def _suggest_python_testing(self, file_path: str, content: str):
        """Suggest testing improvements"""
        suggestions = []
        
        # Check if file has tests
        if 'tests' not in file_path and 'test_' not in content:
            if 'def ' in content and len(re.findall(r'def ', content)) > 5:
                suggestions.append({
                    'type': 'testing',
                    'issue': 'Module lacks test coverage',
                    'suggestion': 'Create corresponding test file with unit tests',
                    'priority': 'medium'
                })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['testing_suggestions'] += len(suggestions)
    
    def _suggest_python_documentation(self, file_path: str, content: str):
        """Suggest documentation improvements"""
        suggestions = []
        
        # Check for docstrings
        docstring_count = len(re.findall(r'""".*?"""', content, re.DOTALL))
        func_count = len(re.findall(r'def \w+', content))
        
        if func_count > 0 and docstring_count == 0:
            suggestions.append({
                'type': 'documentation',
                'issue': f'Functions without docstrings ({func_count} functions found)',
                'suggestion': 'Add docstrings following Google or NumPy style',
                'priority': 'low'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['documentation_suggestions'] += len(suggestions)
    
    def _suggest_python_security(self, file_path: str, content: str):
        """Suggest security improvements"""
        suggestions = []
        
        # Detect hardcoded secrets
        if re.search(r"(password|api_key|secret|token)\s*=\s*['\"][\w\-]{8,}['\"]", content, re.IGNORECASE):
            suggestions.append({
                'type': 'security',
                'issue': 'Possible hardcoded credentials detected',
                'suggestion': 'Move sensitive data to environment variables or secrets manager',
                'priority': 'critical'
            })
        
        # Detect SQL injection risks
        if 'execute(' in content and '+' in content:
            suggestions.append({
                'type': 'security',
                'issue': 'Potential SQL injection risk',
                'suggestion': 'Use parameterized queries instead of string concatenation',
                'priority': 'critical'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
            self.stats['security_suggestions'] += len(suggestions)
    
    def _enhance_javascript_files(self):
        """Enhance JavaScript/TypeScript files"""
        logger.info("\n🟡 Analyzing JavaScript/TypeScript Files...")
        
        js_files = list(self.source_dir.rglob("*.{js,jsx,ts,tsx}"))
        
        logger.info(f"   Found {len(js_files)} JavaScript files")
        
        for file_path in js_files[:200]:
            try:
                content = file_path.read_text(errors='ignore')
                relative_path = str(file_path.relative_to(self.source_dir))
                
                self._suggest_js_performance(relative_path, content)
                self._suggest_js_error_handling(relative_path, content)
                self._suggest_js_async_patterns(relative_path, content)
                
                self.stats['javascript_analyzed'] += 1
                
            except Exception as e:
                logger.debug(f"Error analyzing {file_path}: {e}")
    
    def _suggest_js_performance(self, file_path: str, content: str):
        """Suggest JavaScript performance improvements"""
        suggestions = []
        
        # Detect DOM queries in loops
        if re.search(r'for.*{\s*document\.querySelector', content):
            suggestions.append({
                'type': 'performance',
                'issue': 'DOM query in loop detected',
                'suggestion': 'Cache DOM elements outside of loops',
                'priority': 'high'
            })
        
        # Detect sync code that should be async
        if 'localStorage' in content and 'await' not in content:
            suggestions.append({
                'type': 'performance',
                'issue': 'Synchronous storage operations',
                'suggestion': 'Consider async patterns for storage operations',
                'priority': 'medium'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
    
    def _suggest_js_error_handling(self, file_path: str, content: str):
        """Suggest JavaScript error handling improvements"""
        suggestions = []
        
        # Detect try-catch-ignore patterns
        if re.search(r'catch\s*\(\w+\)\s*{\s*}', content):
            suggestions.append({
                'type': 'reliability',
                'issue': 'Empty catch block found',
                'suggestion': 'Always handle or log errors in catch blocks',
                'priority': 'high'
            })
        
        # Detect unhandled promise rejections
        if 'Promise' in content and '.catch(' not in content:
            suggestions.append({
                'type': 'reliability',
                'issue': 'Unhandled promise rejection risk',
                'suggestion': 'Add .catch() handlers to all promises',
                'priority': 'high'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
    
    def _suggest_js_async_patterns(self, file_path: str, content: str):
        """Suggest async/await improvements"""
        suggestions = []
        
        if 'callback' in content.lower() and 'async' not in content:
            suggestions.append({
                'type': 'maintainability',
                'issue': 'Callback-based code detected',
                'suggestion': 'Consider refactoring to async/await for better readability',
                'priority': 'medium'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
    
    def _enhance_configuration_files(self):
        """Enhance configuration files"""
        logger.info("\n📋 Analyzing Configuration Files...")
        
        config_files = (
            list(self.source_dir.rglob("*.yaml")) +
            list(self.source_dir.rglob("*.yml")) +
            list(self.source_dir.rglob("package.json"))
        )
        
        logger.info(f"   Found {len(config_files)} configuration files")
        
        for file_path in config_files:
            try:
                content = file_path.read_text()
                relative_path = str(file_path.relative_to(self.source_dir))
                
                if file_path.suffix in ['.yaml', '.yml']:
                    self._suggest_yaml_improvements(relative_path, content)
                elif file_path.name == 'package.json':
                    self._suggest_package_json_improvements(relative_path, content)
                
            except Exception as e:
                logger.debug(f"Error analyzing {file_path}: {e}")
    
    def _suggest_yaml_improvements(self, file_path: str, content: str):
        """Suggest YAML improvements"""
        suggestions = []
        
        # Detect missing schema references
        if '$schema' not in content and 'schema' not in content.lower():
            suggestions.append({
                'type': 'maintainability',
                'issue': 'Missing schema reference',
                'suggestion': 'Add schema validation reference for IDE support',
                'priority': 'low'
            })
        
        if suggestions:
            self.suggestions[file_path].extend(suggestions)
    
    def _suggest_package_json_improvements(self, file_path: str, content: str):
        """Suggest package.json improvements"""
        suggestions = []
        
        try:
            data = json.loads(content)
            
            # Check for missing fields
            if 'version' not in data:
                suggestions.append({
                    'type': 'documentation',
                    'issue': 'Missing version field',
                    'suggestion': 'Add version field following semver',
                    'priority': 'low'
                })
            
            if 'license' not in data:
                suggestions.append({
                    'type': 'maintainability',
                    'issue': 'Missing license field',
                    'suggestion': 'Specify an appropriate license',
                    'priority': 'low'
                })
            
            if suggestions:
                self.suggestions[file_path].extend(suggestions)
                
        except json.JSONDecodeError:
            pass
    
    def _generate_enhancement_report(self):
        """Generate comprehensive enhancement report"""
        logger.info("\n📊 Generating Enhancement Report...")
        
        # Group by category
        by_category = defaultdict(list)
        by_priority = defaultdict(int)
        
        for file_path, suggs in self.suggestions.items():
            for sugg in suggs:
                by_category[sugg['type']].append({
                    'file': file_path,
                    'suggestion': sugg['suggestion'],
                    'priority': sugg['priority']
                })
                by_priority[sugg['priority']] += 1
        
        report = {
            "execution_time": datetime.now().isoformat(),
            "total_suggestions": sum(len(v) for v in self.suggestions.values()),
            "by_category": {k: len(v) for k, v in by_category.items()},
            "by_priority": dict(by_priority),
            "statistics": dict(self.stats),
            "sample_suggestions": {
                cat: suggs[:5] for cat, suggs in by_category.items()
            }
        }
        
        # Save report
        report_file = Path(self.output_dir) / "enhancements-v2.json"
        report_file.write_text(json.dumps(report, indent=2))
        logger.info(f"   Report saved: {report_file}")
        
        # Log summary
        logger.info(f"\n📈 Enhancement Summary:")
        logger.info(f"   Total Suggestions: {report['total_suggestions']}")
        for cat, count in report['by_category'].items():
            logger.info(f"   {cat.capitalize()}: {count}")


def main():
    parser = argparse.ArgumentParser(description="Advanced Code Enhancer V2")
    parser.add_argument("--source-dir", default=".", help="Source directory")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    
    args = parser.parse_args()
    
    enhancer = AdvancedCodeEnhancer(args.source_dir, args.output_dir, args.verbose)
    return enhancer.run()


if __name__ == "__main__":
    sys.exit(main())
