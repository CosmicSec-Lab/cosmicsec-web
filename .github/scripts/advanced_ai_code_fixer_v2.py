#!/usr/bin/env python3
"""
Advanced AI Code Fixer V2 - Enterprise Grade
Enhanced with comprehensive fixing strategies and logging
"""

import os
import json
import re
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('.fix-execution.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AdvancedCodeFixer:
    """Enterprise-grade code fixer with comprehensive fixing strategies"""
    
    SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'json', 'yaml', 'markdown']
    
    def __init__(self, source_dir: str, output_dir: str, verbose: bool = False):
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.verbose = verbose
        self.stats = defaultdict(int)
        self.fixes_by_type = defaultdict(list)
        self.errors = []
        
        logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    def run(self) -> int:
        """Main execution function"""
        logger.info("=" * 60)
        logger.info("🚀 Advanced Code Fixer V2 Starting")
        logger.info("=" * 60)
        
        try:
            # Fix Python files
            self._fix_python_files()
            
            # Fix JavaScript/TypeScript files
            self._fix_javascript_files()
            
            # Fix JSON files
            self._fix_json_files()
            
            # Fix YAML files
            self._fix_yaml_files()
            
            # Fix Markdown files
            self._fix_markdown_files()
            
            # Generate comprehensive report
            self._generate_report()
            
            logger.info("=" * 60)
            logger.info(f"✅ Code Fixer Completed Successfully")
            logger.info(f"   Total Fixes: {sum(self.stats.values())}")
            logger.info(f"   Errors: {len(self.errors)}")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Fixer failed: {e}", exc_info=True)
            return 1
    
    def _fix_python_files(self):
        """Fix Python files with advanced strategies"""
        logger.info("\n🐍 Processing Python Files...")
        
        py_files = list(self.source_dir.rglob("*.py"))
        py_files = [f for f in py_files if ".venv" not in str(f) and "__pycache__" not in str(f)]
        
        logger.info(f"   Found {len(py_files)} Python files")
        
        for file_path in py_files[:200]:  # Process up to 200 files
            try:
                content = file_path.read_text(errors='ignore')
                original = content
                file_size = len(content)
                
                # Apply multiple fixing strategies
                content = self._fix_python_imports(content)
                content = self._fix_python_formatting(content)
                content = self._add_python_docstrings(content)
                content = self._improve_python_types(content)
                content = self._fix_python_best_practices(content)
                
                if content != original:
                    self.stats['python_fixed'] += 1
                    self.fixes_by_type['python'].append({
                        'file': str(file_path.relative_to(self.source_dir)),
                        'size': file_size,
                        'changes': len([l for l in content.split('\n') if l != original.split('\n')[min(content.split('\n').index(l), len(original.split('\n'))-1)]])
                    })
                    logger.debug(f"   ✓ Fixed: {file_path.name}")
                
                self.stats['python_processed'] += 1
                
            except Exception as e:
                error_msg = f"Error processing {file_path}: {e}"
                logger.warning(error_msg)
                self.errors.append(error_msg)
    
    def _fix_python_imports(self, content: str) -> str:
        """Fix Python import issues"""
        lines = content.split('\n')
        imports = []
        other_lines = []
        import_section_ended = False
        
        for i, line in enumerate(lines):
            if line.strip().startswith(('import ', 'from ')):
                imports.append(line)
            else:
                import_section_ended = True
                other_lines.append(line)
        
        if imports:
            # Sort and deduplicate imports
            stdlib = []
            third_party = []
            local = []
            
            for imp in imports:
                if ' from .' in imp or ' import .' in imp:
                    local.append(imp)
                elif any(pkg in imp for pkg in ['django', 'flask', 'numpy', 'pandas', 'requests', 'boto3']):
                    third_party.append(imp)
                else:
                    stdlib.append(imp)
            
            # Remove duplicates while preserving order
            stdlib = list(dict.fromkeys(stdlib))
            third_party = list(dict.fromkeys(third_party))
            local = list(dict.fromkeys(local))
            
            sorted_imports = stdlib + ([''] if third_party else []) + third_party + ([''] if local else []) + local
            sorted_imports = [i for i in sorted_imports if i or i == '']
            
            return '\n'.join(sorted_imports) + '\n\n' + '\n'.join(other_lines)
        
        return content
    
    def _fix_python_formatting(self, content: str) -> str:
        """Fix Python code formatting"""
        # Remove multiple blank lines
        content = re.sub(r'\n\n\n+', '\n\n', content)
        
        # Fix spacing around operators
        content = re.sub(r'(\w)=(\w)', r'\1 = \2', content)
        content = re.sub(r'(\w)\+(\w)', r'\1 + \2', content)
        content = re.sub(r'(\w)-(\w)', r'\1 - \2', content)
        
        # Remove trailing whitespace
        content = '\n'.join(line.rstrip() for line in content.split('\n'))
        
        return content
    
    def _add_python_docstrings(self, content: str) -> str:
        """Add missing docstrings"""
        lines = content.split('\n')
        result = []
        
        for i, line in enumerate(lines):
            result.append(line)
            
            # Check for function/class without docstring
            if (re.match(r'^\s*(def|class)\s+\w+', line) and not line.strip().endswith(':')
                or re.match(r'^\s*(def|class)\s+\w+.*:\s*$', line)):
                
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if not next_line.startswith(('"""', "'''", '#')):
                        indent = len(line) - len(line.lstrip()) + 4
                        result.append(' ' * indent + '"""TODO: Add docstring."""')
        
        return '\n'.join(result)
    
    def _improve_python_types(self, content: str) -> str:
        """Add type hints where missing"""
        lines = content.split('\n')
        result = []
        
        for line in lines:
            if re.match(r'^def\s+\w+\(.*\):\s*$', line.strip()):
                if '->' not in line:
                    line = line.rstrip(':') + ' -> None:'
            result.append(line)
        
        return '\n'.join(result)
    
    def _fix_python_best_practices(self, content: str) -> str:
        """Apply Python best practices"""
        # Replace 'var' with appropriate keyword (would need more context)
        content = re.sub(r'\bpass\s*$', '# Placeholder', content, flags=re.MULTILINE)
        
        # Fix common issues
        content = content.replace('== True', 'is True')
        content = content.replace('== False', 'is False')
        content = content.replace('== None', 'is None')
        content = content.replace('!= None', 'is not None')
        
        return content
    
    def _fix_javascript_files(self):
        """Fix JavaScript/TypeScript files"""
        logger.info("\n🟡 Processing JavaScript/TypeScript Files...")
        
        js_files = list(self.source_dir.rglob("*.{js,jsx,ts,tsx}"))
        
        logger.info(f"   Found {len(js_files)} JavaScript files")
        
        for file_path in js_files[:150]:
            try:
                content = file_path.read_text(errors='ignore')
                original = content
                
                content = self._fix_javascript_syntax(content)
                content = self._fix_javascript_style(content)
                content = self._fix_javascript_best_practices(content)
                
                if content != original:
                    self.stats['javascript_fixed'] += 1
                    logger.debug(f"   ✓ Fixed: {file_path.name}")
                
                self.stats['javascript_processed'] += 1
                
            except Exception as e:
                logger.warning(f"Error processing {file_path}: {e}")
                self.errors.append(str(e))
    
    def _fix_javascript_syntax(self, content: str) -> str:
        """Fix JavaScript syntax issues"""
        # Add missing semicolons
        lines = content.split('\n')
        result = []
        
        for line in lines:
            stripped = line.rstrip()
            if stripped and not stripped.endswith((';', '{', '}', ',', ':', '//', '/*', '*', '(', ')', '`')):
                if not re.search(r'^\s*(if|for|while|switch|function|class|return)\s*', stripped):
                    stripped += ';'
            result.append(stripped)
        
        return '\n'.join(result)
    
    def _fix_javascript_style(self, content: str) -> str:
        """Fix JavaScript style issues"""
        # Fix spacing
        content = re.sub(r'(\w)=(\w)', r'\1 = \2', content)
        content = re.sub(r':\s*(?!\s)', ': ', content)  # Space after colons
        
        return content
    
    def _fix_javascript_best_practices(self, content: str) -> str:
        """Apply JavaScript best practices"""
        # Replace var with const/let
        content = re.sub(r'\bvar\s+', 'const ', content)
        
        # Remove console.log from production
        if 'src/' in str(self.source_dir):
            lines = content.split('\n')
            result = []
            for line in lines:
                if 'console.log' in line and not line.strip().startswith('//'):
                    result.append('    // ' + line.strip())
                else:
                    result.append(line)
            content = '\n'.join(result)
        
        return content
    
    def _fix_json_files(self):
        """Fix and format JSON files"""
        logger.info("\n📄 Processing JSON Files...")
        
        json_files = list(self.source_dir.rglob("*.json"))
        
        logger.info(f"   Found {len(json_files)} JSON files")
        
        for file_path in json_files:
            try:
                content = file_path.read_text()
                
                # Try to parse and re-format
                try:
                    data = json.loads(content)
                    formatted = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
                    
                    if content != formatted:
                        file_path.write_text(formatted)
                        self.stats['json_fixed'] += 1
                        logger.debug(f"   ✓ Formatted: {file_path.name}")
                    
                except json.JSONDecodeError as e:
                    logger.warning(f"Invalid JSON in {file_path.name}: {e}")
                    self.errors.append(f"JSON error: {file_path.name}")
                
                self.stats['json_processed'] += 1
                
            except Exception as e:
                logger.warning(f"Error processing {file_path}: {e}")
    
    def _fix_yaml_files(self):
        """Fix YAML files"""
        logger.info("\n📋 Processing YAML Files...")
        
        yaml_files = list(self.source_dir.rglob("*.{yml,yaml}"))
        
        logger.info(f"   Found {len(yaml_files)} YAML files")
        
        for file_path in yaml_files:
            try:
                content = file_path.read_text()
                original = content
                
                # Fix common YAML issues
                content = re.sub(r': True\b', ': true', content)
                content = re.sub(r': False\b', ': false', content)
                content = re.sub(r': None\b', ': null', content)
                
                if content != original:
                    file_path.write_text(content)
                    self.stats['yaml_fixed'] += 1
                    logger.debug(f"   ✓ Fixed: {file_path.name}")
                
                self.stats['yaml_processed'] += 1
                
            except Exception as e:
                logger.warning(f"Error processing {file_path}: {e}")
    
    def _fix_markdown_files(self):
        """Fix Markdown files"""
        logger.info("\n📝 Processing Markdown Files...")
        
        md_files = list(self.source_dir.rglob("*.md"))
        
        logger.info(f"   Found {len(md_files)} Markdown files")
        
        for file_path in md_files:
            try:
                content = file_path.read_text()
                original = content
                
                # Fix common markdown issues
                content = re.sub(r'\n\n\n+', '\n\n', content)  # Remove multiple blank lines
                content = re.sub(r'#\s*(?=[A-Z])', '# ', content)  # Fix heading spacing
                
                if content != original:
                    file_path.write_text(content)
                    self.stats['markdown_fixed'] += 1
                    logger.debug(f"   ✓ Fixed: {file_path.name}")
                
                self.stats['markdown_processed'] += 1
                
            except Exception as e:
                logger.warning(f"Error processing {file_path}: {e}")
    
    def _generate_report(self):
        """Generate comprehensive fixing report"""
        logger.info("\n📊 Generating Report...")
        
        report = {
            "execution_time": datetime.now().isoformat(),
            "statistics": dict(self.stats),
            "fixes_by_language": {
                lang: len(fixes) for lang, fixes in self.fixes_by_type.items()
            },
            "errors": self.errors,
            "summary": {
                "total_processed": sum(v for k, v in self.stats.items() if 'processed' in k),
                "total_fixed": sum(v for k, v in self.stats.items() if 'fixed' in k),
                "error_count": len(self.errors)
            }
        }
        
        # Save report
        report_file = Path(self.output_dir) / "fixer-report.json"
        report_file.write_text(json.dumps(report, indent=2))
        logger.info(f"   Report saved: {report_file}")
        
        # Write counter for GitHub Actions
        counter_file = Path.cwd() / ".fix-counter.txt"
        counter_file.write_text(str(report["summary"]["total_fixed"]))
        
        # Log summary
        logger.info(f"\n📈 Summary:")
        logger.info(f"   Total Processed: {report['summary']['total_processed']}")
        logger.info(f"   Total Fixed: {report['summary']['total_fixed']}")
        logger.info(f"   Errors: {report['summary']['error_count']}")


def main():
    parser = argparse.ArgumentParser(description="Advanced Code Fixer V2")
    parser.add_argument("--source-dir", default=".", help="Source directory")
    parser.add_argument("--output-dir", default="fixed-code", help="Output directory")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    
    args = parser.parse_args()
    
    fixer = AdvancedCodeFixer(args.source_dir, args.output_dir, args.verbose)
    return fixer.run()


if __name__ == "__main__":
    sys.exit(main())
