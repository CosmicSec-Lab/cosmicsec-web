#!/usr/bin/env python3
"""
Quality Report Generator
Generates comprehensive quality metrics report
"""

import json
import sys
import argparse
from pathlib import Path
from typing import Dict, Any
from datetime import datetime


class QualityReportGenerator:
    """Generate quality metrics reports"""
    
    def __init__(self, analysis_dir: str, output_file: str = "quality-report.md"):
        self.analysis_dir = Path(analysis_dir)
        self.output_file = output_file
        self.metrics = {}
    
    def run(self) -> int:
        """Generate quality report"""
        print("[*] Generating Quality Report...")
        
        # Collect metrics from analysis reports
        self._collect_metrics()
        
        # Generate markdown report
        self._generate_markdown_report()
        
        print(f"[+] Quality report generated: {self.output_file}")
        
        return 0
    
    def _collect_metrics(self):
        """Collect metrics from analysis files"""
        json_files = list(self.analysis_dir.glob("*.json"))
        
        for json_file in json_files:
            try:
                data = json.loads(json_file.read_text())
                metric_name = json_file.stem
                self.metrics[metric_name] = self._parse_metrics(data, metric_name)
                print(f"  ✓ Collected metrics from {json_file.name}")
            except Exception as e:
                print(f"  ✗ Error reading {json_file.name}: {e}")
    
    @staticmethod
    def _parse_metrics(data: Any, source: str) -> Dict[str, Any]:
        """Parse metrics from various formats"""
        metrics = {"source": source, "errors": 0, "warnings": 0, "info": 0}
        
        if isinstance(data, dict):
            # Pylint format
            if source == "pylint" and isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        if item.get("type") == "error":
                            metrics["errors"] += 1
                        elif item.get("type") == "warning":
                            metrics["warnings"] += 1
            
            # Flake8 format
            elif source == "flake8" and isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        metrics["warnings"] += 1
            
            # Bandit format
            elif source == "bandit":
                metrics["issues"] = len(data.get("results", []))
            
            # MyPy format
            elif source == "mypy" and isinstance(data, list):
                for item in data:
                    if isinstance(item, dict) and "error" in item.get("message", "").lower():
                        metrics["errors"] += 1
            
            # Radon format (complexity)
            elif source == "radon":
                metrics["files_analyzed"] = len(data.get("_internal", {}).keys())
        
        return metrics
    
    def _generate_markdown_report(self):
        """Generate markdown report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""# 📊 Code Quality Report

**Generated:** {timestamp}

## Overview

This report provides a comprehensive analysis of code quality metrics across the project.

## Quality Metrics Summary

| Metric | Status | Details |
|--------|--------|---------|
"""
        
        # Add pylint metrics
        if "pylint" in self.metrics:
            pylint_data = self.metrics["pylint"]
            errors = pylint_data.get("errors", 0)
            warnings = pylint_data.get("warnings", 0)
            report += f"| **Pylint** | {'✅' if errors == 0 else '⚠️'} | {errors} errors, {warnings} warnings |\n"
        
        # Add flake8 metrics
        if "flake8" in self.metrics:
            flake8_data = self.metrics["flake8"]
            warnings = flake8_data.get("warnings", 0)
            report += f"| **Flake8** | {'✅' if warnings == 0 else '⚠️'} | {warnings} issues |\n"
        
        # Add bandit metrics
        if "bandit" in self.metrics:
            bandit_data = self.metrics["bandit"]
            issues = bandit_data.get("issues", 0)
            report += f"| **Bandit (Security)** | {'✅' if issues == 0 else '🔴'} | {issues} security issues |\n"
        
        # Add mypy metrics
        if "mypy" in self.metrics:
            mypy_data = self.metrics["mypy"]
            errors = mypy_data.get("errors", 0)
            report += f"| **MyPy (Type Checking)** | {'✅' if errors == 0 else '⚠️'} | {errors} type errors |\n"
        
        # Add radon metrics
        if "radon" in self.metrics:
            radon_data = self.metrics["radon"]
            report += f"| **Radon (Complexity)** | ℹ️ | Files analyzed: {radon_data.get('files_analyzed', 0)} |\n"
        
        report += """
## Detailed Analysis

### Python Code Quality (Pylint)
- **Purpose:** Static analysis for Python code
- **Key Metrics:** Error count, warning count, code rating
- **Recommendations:** Fix all errors and critical warnings

### Style & Formatting (Flake8)
- **Purpose:** PEP 8 compliance and common bugs
- **Key Metrics:** Style violations
- **Recommendations:** Auto-fix with tools like Black and isort

### Security Analysis (Bandit)
- **Purpose:** Security-related issues in Python code
- **Key Metrics:** High, medium, low severity issues
- **Recommendations:** Address all high and medium severity issues

### Type Checking (MyPy)
- **Purpose:** Static type checking for Python
- **Key Metrics:** Type annotation coverage
- **Recommendations:** Improve type hints across codebase

### Code Complexity (Radon)
- **Purpose:** Measure cyclomatic complexity
- **Key Metrics:** Complexity scores per function
- **Recommendations:** Refactor functions with high complexity

## Actionable Improvements

### High Priority
1. **Security:** Fix all high-severity security issues identified by Bandit
2. **Errors:** Address all pylint errors that prevent proper code execution
3. **Type Safety:** Add type hints to reduce runtime errors

### Medium Priority
1. **Style:** Run formatters (Black, isort) for consistent style
2. **Warnings:** Address pylint and flake8 warnings
3. **Testing:** Improve test coverage (target: 80%+)

### Low Priority
1. **Documentation:** Add docstrings to public APIs
2. **Complexity:** Refactor high-complexity functions
3. **Dead Code:** Remove unused imports and dead code

## Continuous Improvement Strategy

1. **Automated Fixes:** Run auto-formatting and linting in CI/CD
2. **Code Reviews:** Include quality metrics in PR reviews
3. **Monitoring:** Track metrics over time to identify trends
4. **Enforcement:** Set minimum quality standards in CI/CD

## Tools & Technologies

- **Pylint:** Python code analysis
- **Flake8:** Style and common errors
- **Bandit:** Security issues
- **MyPy:** Type checking
- **Radon:** Complexity metrics
- **Black:** Code formatter
- **isort:** Import sorting

## Next Steps

1. Review this report
2. Create issues for high-priority items
3. Schedule refactoring sessions
4. Implement automated quality checks
5. Track improvement over time

---

*Report generated by CosmicSec Quality Pipeline*
"""
        
        Path(self.output_file).write_text(report)


def main():
    parser = argparse.ArgumentParser(description="Quality Report Generator")
    parser.add_argument("--analysis-dir", default="analysis-reports", help="Analysis directory")
    parser.add_argument("--output-file", default="quality-report.md", help="Output file")
    
    args = parser.parse_args()
    
    generator = QualityReportGenerator(args.analysis_dir, args.output_file)
    return generator.run()


if __name__ == "__main__":
    sys.exit(main())
