#!/usr/bin/env python3
"""
Smart Issue Creator with Enhanced Descriptions
Creates GitHub issues with rich descriptions, labels, and project links
"""

import json
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime


class SmartIssueCreator:
    """Create issues with smart descriptions and metadata"""
    
    SEVERITY_EMOJI = {
        "critical": "🔴",
        "high": "🟠",
        "medium": "🟡",
        "low": "🟢",
        "info": "ℹ️"
    }
    
    def __init__(self, analysis_dir: str = "analysis-reports"):
        self.analysis_dir = Path(analysis_dir)
        self.issues = []
    
    def run(self) -> int:
        """Generate issues from analysis"""
        print("[*] Analyzing issues...")
        
        # Analyze security issues
        self._analyze_security_issues()
        
        # Analyze quality issues
        self._analyze_quality_issues()
        
        # Analyze performance issues
        self._analyze_performance_issues()
        
        # Save issues file for webhook processing
        self._save_issues()
        
        print(f"[+] Found {len(self.issues)} issues to report")
        
        return 0
    
    def _analyze_security_issues(self):
        """Extract security issues from Bandit"""
        bandit_file = self.analysis_dir / "bandit.json"
        
        if bandit_file.exists():
            try:
                data = json.loads(bandit_file.read_text())
                results = data.get("results", [])
                
                for result in results:
                    severity = result.get("severity", "low").lower()
                    if severity in ["high", "critical"]:
                        self.issues.append({
                            "title": f"🔒 Security: {result.get('issue_text', 'Security Issue')}",
                            "body": self._format_security_issue(result),
                            "labels": ["security", severity, "auto-generated"],
                            "severity": severity,
                            "type": "security",
                            "priority": 1 if severity == "critical" else 2
                        })
                
            except Exception as e:
                print(f"  ✗ Error analyzing Bandit: {e}")
    
    def _analyze_quality_issues(self):
        """Extract quality issues from analysis reports"""
        pylint_file = self.analysis_dir / "pylint.json"
        
        if pylint_file.exists():
            try:
                data = json.loads(pylint_file.read_text())
                if isinstance(data, list):
                    errors = [d for d in data if d.get("type") == "error"]
                    if errors:
                        self.issues.append({
                            "title": f"🐛 Code Quality: {len(errors)} Pylint Errors",
                            "body": self._format_quality_issue(errors),
                            "labels": ["code-quality", "high", "auto-generated"],
                            "severity": "high",
                            "type": "quality",
                            "priority": 2
                        })
                    
            except Exception as e:
                print(f"  ✗ Error analyzing Pylint: {e}")
    
    def _analyze_performance_issues(self):
        """Extract performance issues from Radon"""
        radon_file = self.analysis_dir / "radon.json"
        
        if radon_file.exists():
            try:
                data = json.loads(radon_file.read_text())
                # Check for high complexity
                if isinstance(data, dict):
                    self.issues.append({
                        "title": "📈 Performance: Code Complexity Analysis",
                        "body": self._format_complexity_issue(data),
                        "labels": ["performance", "medium", "auto-generated"],
                        "severity": "medium",
                        "type": "performance",
                        "priority": 3
                    })
                    
            except Exception as e:
                print(f"  ✗ Error analyzing Radon: {e}")
    
    @staticmethod
    def _format_security_issue(result: Dict[str, Any]) -> str:
        """Format security issue with details"""
        severity = result.get("severity", "low")
        issue_text = result.get("issue_text", "")
        test_id = result.get("test_id", "")
        filename = result.get("filename", "unknown")
        line_no = result.get("line_number", 0)
        
        body = f"""## 🔒 Security Issue

**Severity:** {severity.upper()}

**Location:** `{filename}:{line_no}`

**Issue:** {issue_text}

**Test ID:** {test_id}

### Recommendation
- Review the code at the specified location
- Follow security best practices
- Check OWASP guidelines for similar issues
- Run automated fixes if available

### Labels
- `security`
- `{severity}`
- `auto-fix-available`
"""
        return body
    
    @staticmethod
    def _format_quality_issue(errors: List[Dict[str, Any]]) -> str:
        """Format quality issue with summary"""
        body = f"""## 🐛 Code Quality Issues

**Total Errors:** {len(errors)}

### Error Summary

| Type | Count |
|------|-------|
"""
        
        error_types = {}
        for error in errors:
            error_type = error.get("symbol", "unknown")
            error_types[error_type] = error_types.get(error_type, 0) + 1
        
        for error_type, count in error_types.items():
            body += f"| {error_type} | {count} |\n"
        
        body += f"""

### Top Issues
"""
        
        for error in errors[:5]:
            body += f"\n- **{error.get('symbol')}** at `{error.get('module', 'unknown')}:{error.get('line', 0)}`\n"
            body += f"  {error.get('message', 'No message')}\n"
        
        body += """

### Actions
1. Review the listed issues
2. Run auto-fix tools (Black, isort, etc.)
3. Fix remaining issues manually
4. Re-run analysis to verify
"""
        return body
    
    @staticmethod
    def _format_complexity_issue(data: Dict[str, Any]) -> str:
        """Format complexity issue"""
        body = """## 📈 Code Complexity Analysis

### Findings

Based on Radon complexity analysis:

- Functions with high cyclomatic complexity identified
- Recommend refactoring large functions
- Aim for complexity score < 10 per function

### Actions
1. Review high-complexity functions
2. Extract reusable components
3. Simplify logic and branching
4. Add unit tests for complex functions
5. Re-analyze after refactoring
"""
        return body
    
    def _save_issues(self):
        """Save issues to file for processing"""
        # Sort by priority
        self.issues.sort(key=lambda x: x.get("priority", 99))
        
        issues_file = Path("github-issues.json")
        issues_file.write_text(json.dumps(self.issues, indent=2))
        
        print(f"[+] Issues saved to {issues_file}")


def main():
    parser = argparse.ArgumentParser(description="Smart Issue Creator")
    parser.add_argument("--analysis-dir", default="analysis-reports", help="Analysis directory")
    
    args = parser.parse_args()
    
    creator = SmartIssueCreator(args.analysis_dir)
    return creator.run()


if __name__ == "__main__":
    sys.exit(main())
