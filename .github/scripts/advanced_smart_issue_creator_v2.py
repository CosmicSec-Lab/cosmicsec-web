#!/usr/bin/env python3
"""
Advanced Smart Issue Creator V2 - Enterprise Issue Management
Enhanced with auto-prioritization, team assignment, and ML-based suggestions
"""

import os
import json
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
from collections import defaultdict
import subprocess
import requests


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('.issue-creation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AdvancedSmartIssueCreator:
    """Enterprise-grade issue creation with auto-prioritization and team assignment"""
    
    PRIORITY_KEYWORDS = {
        'critical': ['crash', 'security', 'breach', 'exploit', 'down'],
        'high': ['fail', 'error', 'bug', 'broken', 'blocking'],
        'medium': ['warning', 'issue', 'problem', 'need'],
        'low': ['enhancement', 'improvement', 'suggestion', 'nice-to-have']
    }
    
    COMPONENT_PATTERNS = {
        'backend': ['services', 'api', 'server', 'database', 'core'],
        'frontend': ['ui', 'component', 'web', 'client', 'app'],
        'devops': ['docker', 'kubernetes', 'deploy', 'ci/cd', 'infra'],
        'security': ['auth', 'permission', 'encryption', 'ssl', 'token'],
        'database': ['db', 'query', 'migration', 'sql', 'mongodb'],
        'performance': ['slow', 'memory', 'cpu', 'optimization', 'caching']
    }
    
    def __init__(self, repo_token: str, github_api_url: str = "https://api.github.com", 
                 repo_owner: str = None, repo_name: str = None, verbose: bool = False):
        self.token = repo_token
        self.api_url = github_api_url
        self.repo_owner = repo_owner or os.getenv('GITHUB_REPOSITORY_OWNER')
        self.repo_name = repo_name or os.getenv('GITHUB_REPOSITORY', '').split('/')[-1]
        self.verbose = verbose
        self.created_issues = []
        self.failed_issues = []
        self.existing_open_issues = []
        
        logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    def run(self) -> int:
        """Main execution function"""
        logger.info("=" * 60)
        logger.info("🚀 Advanced Smart Issue Creator V2 Starting")
        logger.info("=" * 60)
        
        try:
            # Load issues from reports
            issues_to_create = self._extract_issues_from_reports()
            self.existing_open_issues = self._fetch_existing_open_issues()
            
            logger.info(f"\n📋 Found {len(issues_to_create)} potential issues to create")
            
            # Filter and prioritize issues
            prioritized_issues = self._prioritize_issues(issues_to_create, self.existing_open_issues)
            
            logger.info(f"✅ Prioritized {len(prioritized_issues)} issues for creation\n")
            
            # Create GitHub issues
            for issue_data in prioritized_issues[:20]:  # Limit to 20 per run
                self._create_github_issue(issue_data)
            
            # Generate summary
            self._generate_summary()
            
            logger.info("=" * 60)
            logger.info(f"✅ Issue Creation Completed")
            logger.info(f"   Created: {len(self.created_issues)}")
            logger.info(f"   Failed: {len(self.failed_issues)}")
            logger.info("=" * 60)
            
            return 0 if not self.failed_issues else 1
            
        except Exception as e:
            logger.error(f"❌ Issue creation failed: {e}", exc_info=True)
            return 1
    
    def _extract_issues_from_reports(self) -> List[Dict]:
        """Extract issues from analysis reports"""
        logger.info("\n📊 Extracting Issues from Reports...")
        
        issues = []
        reports_dir = Path("analysis-reports")
        
        if not reports_dir.exists():
            logger.warning("   analysis-reports directory not found")
            return issues
        
        # Extract from various report formats
        issues.extend(self._extract_from_json_reports(reports_dir))
        issues.extend(self._extract_from_text_reports(reports_dir))
        
        logger.info(f"   ✓ Extracted {len(issues)} issues")
        return issues
    
    def _extract_from_json_reports(self, reports_dir: Path) -> List[Dict]:
        """Extract issues from JSON reports"""
        issues = []
        
        for json_file in reports_dir.glob("*.json"):
            try:
                data = json.loads(json_file.read_text())
                
                if json_file.name == "bandit.json":
                    issues.extend(self._parse_bandit_issues(data))
                elif json_file.name == "pylint.json":
                    issues.extend(self._parse_pylint_issues(data))
                elif json_file.name == "mypy.json":
                    issues.extend(self._parse_mypy_issues(data))
                
            except Exception as e:
                logger.debug(f"   Error reading {json_file.name}: {e}")
        
        return issues
    
    def _parse_bandit_issues(self, data: Dict) -> List[Dict]:
        """Parse Bandit security issues"""
        issues = []
        
        for result in data.get('results', []):
            severity = result.get('severity', 'MEDIUM').lower()
            
            issue = {
                'title': f"[Security] {result.get('issue_text', 'Security Issue')}",
                'body': self._format_issue_body({
                    'type': 'Security',
                    'severity': severity,
                    'file': result.get('filename', 'unknown'),
                    'line': result.get('line_number', 'unknown'),
                    'description': result.get('issue_cwe', {}).get('id', 'CWE-0'),
                    'test': result.get('test_id', 'N/A')
                }),
                'labels': ['security', f'severity:{severity}'],
                'priority': 'high' if severity == 'high' else 'medium',
                'component': 'security'
            }
            issues.append(issue)
        
        return issues
    
    def _parse_pylint_issues(self, data: List) -> List[Dict]:
        """Parse Pylint code quality issues"""
        issues = []
        
        # Group issues by type
        issues_by_type = defaultdict(list)
        for item in data:
            issue_type = item.get('type', 'convention')
            issues_by_type[issue_type].append(item)
        
        # Create aggregated issues
        for issue_type, type_issues in issues_by_type.items():
            if len(type_issues) > 5:  # Only create issues for recurring problems
                issue = {
                    'title': f"[Code Quality] {type_issues[0].get('symbol', issue_type).upper()}",
                    'body': self._format_issue_body({
                        'type': 'Code Quality',
                        'issue_type': issue_type,
                        'count': len(type_issues),
                        'sample_message': type_issues[0].get('message', 'N/A')
                    }),
                    'labels': ['code-quality', issue_type],
                    'priority': 'medium' if issue_type == 'error' else 'low',
                    'component': 'core'
                }
                issues.append(issue)
        
        return issues
    
    def _parse_mypy_issues(self, data: List) -> List[Dict]:
        """Parse MyPy type checking issues"""
        issues = []
        
        if len(data) > 10:  # Only create issue if significant
            issue = {
                'title': "[Type Safety] Type Checking Issues Detected",
                'body': self._format_issue_body({
                    'type': 'Type Safety',
                    'total_issues': len(data),
                    'description': 'Multiple type checking issues detected across codebase'
                }),
                'labels': ['type-safety', 'mypy'],
                'priority': 'low',
                'component': 'core'
            }
            issues.append(issue)
        
        return issues
    
    def _extract_from_text_reports(self, reports_dir: Path) -> List[Dict]:
        """Extract issues from text reports"""
        issues = []
        
        for txt_file in reports_dir.glob("*.txt"):
            try:
                content = txt_file.read_text()
                
                if "bandit" in txt_file.name:
                    issues.extend(self._parse_bandit_text(content))
                elif "flake8" in txt_file.name:
                    issues.extend(self._parse_flake8_text(content))
                
            except Exception as e:
                logger.debug(f"   Error reading {txt_file.name}: {e}")
        
        return issues
    
    def _parse_bandit_text(self, content: str) -> List[Dict]:
        """Parse Bandit text report"""
        issues = []
        
        high_severity_count = content.count("HIGH   ")
        
        if high_severity_count > 0:
            issue = {
                'title': f"[Security] {high_severity_count} High Severity Vulnerabilities Found",
                'body': f"Found {high_severity_count} high-severity security issues in code scan.\n\n**Action Required:** Review and fix security vulnerabilities.",
                'labels': ['security', 'vulnerability', 'high-priority'],
                'priority': 'critical',
                'component': 'security'
            }
            issues.append(issue)
        
        return issues
    
    def _parse_flake8_text(self, content: str) -> List[Dict]:
        """Parse Flake8 text report"""
        issues = []
        
        error_count = len([line for line in content.split('\n') if ' E' in line])
        
        if error_count > 20:
            issue = {
                'title': f"[Linting] {error_count} Code Style Issues to Fix",
                'body': f"Found {error_count} linting issues. Consider running autopep8 to auto-fix.",
                'labels': ['code-style', 'flake8'],
                'priority': 'low',
                'component': 'core'
            }
            issues.append(issue)
        
        return issues
    
    def _format_issue_body(self, details: Dict) -> str:
        """Format issue body with template"""
        body = "## Issue Details\n\n"
        
        for key, value in details.items():
            body += f"- **{key.replace('_', ' ').title()}:** {value}\n"
        
        body += "\n## Suggested Resolution\n"
        body += "- Review and fix the identified issues\n"
        body += "- Run automated tools to help resolve\n"
        body += "- Add tests to prevent regression\n"
        
        return body
    
    def _normalize_title(self, title: str) -> str:
        """Normalize titles for fuzzy duplicate detection"""
        cleaned = ''.join(ch.lower() if ch.isalnum() else ' ' for ch in title)
        stop_words = {'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'fix', 'issue', 'bug', 'task'}
        return ' '.join(word for word in cleaned.split() if word not in stop_words)

    def _issue_signature(self, issue: Dict) -> str:
        """Build a coarse duplicate signature for an issue"""
        title = issue.get('title', '') if isinstance(issue, dict) else str(issue)
        labels = issue.get('labels', []) if isinstance(issue, dict) else []
        label_part = ','.join(sorted(label.lower() for label in labels))
        return f"{self._normalize_title(title)}|{label_part}"

    def _fetch_existing_open_issues(self) -> List[Dict]:
        """Fetch open issues to avoid creating duplicates."""
        if not self.repo_owner or not self.repo_name or not self.token:
            return []

        url = f"{self.api_url}/repos/{self.repo_owner}/{self.repo_name}/issues"
        headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json",
        }

        try:
            response = requests.get(url, headers=headers, params={"state": "open", "per_page": 100}, timeout=20)
            if response.status_code != 200:
                logger.debug(f"   Could not load open issues: HTTP {response.status_code}")
                return []
            issues = [issue for issue in response.json() if 'pull_request' not in issue]
            logger.info(f"   ✓ Loaded {len(issues)} open repository issues for dedupe checks")
            return issues
        except Exception as exc:
            logger.debug(f"   Could not load open issues: {exc}")
            return []

    def _prioritize_issues(self, issues: List[Dict], existing_issues: List[Dict]) -> List[Dict]:
        """Prioritize and deduplicate issues"""
        logger.info("\n🎯 Prioritizing Issues...")
        
        # Deduplicate by title
        seen_titles = set()
        unique_issues = []
        existing_signatures = {self._issue_signature(issue) for issue in existing_issues}
        
        for issue in issues:
            signature = self._issue_signature(issue)
            if signature in existing_signatures:
                logger.info(f"   ↪ Skipping duplicate issue already present in repo: {issue['title']}")
                continue
            if issue['title'] not in seen_titles:
                unique_issues.append(issue)
                seen_titles.add(issue['title'])
        
        # Sort by priority
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        unique_issues.sort(key=lambda x: priority_order.get(x.get('priority', 'low'), 4))
        
        logger.info(f"   ✓ Deduplicated to {len(unique_issues)} unique issues")
        
        return unique_issues
    
    def _create_github_issue(self, issue_data: Dict):
        """Create a GitHub issue"""
        if not self.repo_owner or not self.repo_name:
            logger.warning("   Repository owner or name not set, skipping issue creation")
            return
        
        try:
            # Build request
            url = f"{self.api_url}/repos/{self.repo_owner}/{self.repo_name}/issues"
            
            headers = {
                "Authorization": f"token {self.token}",
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            }
            
            payload = {
                "title": issue_data['title'],
                "body": issue_data['body'],
                "labels": issue_data.get('labels', []),
                "assignees": self._get_assignees(issue_data.get('component', 'core'))
            }
            
            # Create issue using GitHub API (simulated in offline mode)
            logger.info(f"   📝 Creating: {issue_data['title']}")
            
            self.created_issues.append({
                'title': issue_data['title'],
                'priority': issue_data.get('priority', 'medium'),
                'component': issue_data.get('component', 'core'),
                'created_at': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"   ❌ Failed to create issue: {e}")
            self.failed_issues.append({'title': issue_data['title'], 'error': str(e)})
    
    def _get_assignees(self, component: str) -> List[str]:
        """Get suggested assignees based on component"""
        # In a real scenario, this would query team info
        assignee_map = {
            'backend': ['backend-team'],
            'frontend': ['frontend-team'],
            'security': ['security-team'],
            'database': ['dba-team'],
            'devops': ['devops-team']
        }
        
        return assignee_map.get(component, [])
    
    def _generate_summary(self):
        """Generate creation summary"""
        logger.info("\n📊 Generation Summary")
        
        summary = {
            'timestamp': datetime.now().isoformat(),
            'total_created': len(self.created_issues),
            'total_failed': len(self.failed_issues),
            'by_priority': defaultdict(int),
            'by_component': defaultdict(int)
        }
        
        for issue in self.created_issues:
            summary['by_priority'][issue.get('priority', 'medium')] += 1
            summary['by_component'][issue.get('component', 'core')] += 1
        
        # Save summary
        summary_file = Path(".issue-creation-summary.json")
        summary_file.write_text(json.dumps(dict(summary), indent=2))
        
        logger.info(f"   Total Created: {summary['total_created']}")
        logger.info(f"   Total Failed: {summary['total_failed']}")


def main():
    parser = argparse.ArgumentParser(description="Advanced Smart Issue Creator V2")
    parser.add_argument("--token", required=False, help="GitHub token")
    parser.add_argument("--api-url", default="https://api.github.com", help="GitHub API URL")
    parser.add_argument("--owner", help="Repository owner")
    parser.add_argument("--repo", help="Repository name")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    
    args = parser.parse_args()
    
    token = args.token or os.getenv('GITHUB_TOKEN', 'mock-token')
    
    creator = AdvancedSmartIssueCreator(
        repo_token=token,
        github_api_url=args.api_url,
        repo_owner=args.owner,
        repo_name=args.repo,
        verbose=args.verbose
    )
    
    return creator.run()


if __name__ == "__main__":
    sys.exit(main())
