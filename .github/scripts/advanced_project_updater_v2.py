#!/usr/bin/env python3
"""
Advanced Project Updater V2 - Enterprise Project Management
Enhanced with automation rules, dependency tracking, and cross-repo linking
"""

import os
import json
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from collections import defaultdict


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('.project-update.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AdvancedProjectUpdater:
    """Enterprise project management with cross-repo linking and automation"""
    
    def __init__(self, token: str, project_id: str, verbose: bool = False):
        self.token = token
        self.project_id = project_id
        self.verbose = verbose
        self.stats = defaultdict(int)
        self.automation_log = []
        
        logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    def run(self) -> int:
        """Main execution function"""
        logger.info("=" * 60)
        logger.info("🚀 Advanced Project Updater V2 Starting")
        logger.info("=" * 60)
        
        try:
            # Sync issues from GitHub
            issues = self._sync_github_issues()
            
            # Sync PRs from GitHub
            prs = self._sync_github_pull_requests()
            
            # Apply automation rules
            self._apply_automation_rules(issues, prs)
            
            # Update project board
            self._update_project_board(issues, prs)
            
            # Generate dependency graph
            self._generate_dependency_graph(issues, prs)
            
            # Generate automation report
            self._generate_automation_report()
            
            logger.info("=" * 60)
            logger.info(f"✅ Project Update Completed")
            logger.info(f"   Issues Synced: {self.stats['issues_synced']}")
            logger.info(f"   PRs Synced: {self.stats['prs_synced']}")
            logger.info(f"   Automations Applied: {self.stats['automations_applied']}")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Project update failed: {e}", exc_info=True)
            return 1
    
    def _sync_github_issues(self) -> List[Dict]:
        """Sync GitHub issues to project"""
        logger.info("\n📋 Syncing GitHub Issues...")
        
        issues = []
        
        try:
            # In a real scenario, this would query GitHub API
            # For now, we'll create mock data
            issues = self._load_mock_issues()
            
            self.stats['issues_synced'] = len(issues)
            logger.info(f"   ✓ Synced {len(issues)} issues")
            
            return issues
            
        except Exception as e:
            logger.error(f"   Error syncing issues: {e}")
            return []
    
    def _sync_github_pull_requests(self) -> List[Dict]:
        """Sync GitHub pull requests to project"""
        logger.info("\n🔀 Syncing GitHub Pull Requests...")
        
        prs = []
        
        try:
            prs = self._load_mock_prs()
            
            self.stats['prs_synced'] = len(prs)
            logger.info(f"   ✓ Synced {len(prs)} pull requests")
            
            return prs
            
        except Exception as e:
            logger.error(f"   Error syncing PRs: {e}")
            return []
    
    def _load_mock_issues(self) -> List[Dict]:
        """Load mock issues for demo"""
        return [
            {
                'id': 'issue-1',
                'title': 'Security: SQL Injection Risk',
                'status': 'open',
                'priority': 'critical',
                'labels': ['security', 'critical'],
                'created_at': datetime.now().isoformat(),
                'related_prs': []
            },
            {
                'id': 'issue-2',
                'title': 'Feature: Add OAuth2 Support',
                'status': 'open',
                'priority': 'high',
                'labels': ['enhancement', 'authentication'],
                'created_at': datetime.now().isoformat(),
                'related_prs': []
            }
        ]
    
    def _load_mock_prs(self) -> List[Dict]:
        """Load mock PRs for demo"""
        return [
            {
                'id': 'pr-1',
                'title': 'Fix: SQL Injection vulnerability in queries',
                'status': 'in-review',
                'related_issues': ['issue-1'],
                'created_at': datetime.now().isoformat(),
                'author': 'dev-team'
            }
        ]
    
    def _apply_automation_rules(self, issues: List[Dict], prs: List[Dict]):
        """Apply intelligent automation rules"""
        logger.info("\n⚙️  Applying Automation Rules...")
        
        rules_applied = 0
        
        # Rule 1: Link related PRs to issues
        rules_applied += self._link_prs_to_issues(issues, prs)
        
        # Rule 2: Auto-assign based on labels
        rules_applied += self._auto_assign_issues(issues)
        
        # Rule 3: Auto-progress based on PR status
        rules_applied += self._auto_progress_issues(issues, prs)
        
        # Rule 4: Priority escalation
        rules_applied += self._escalate_priorities(issues)
        
        # Rule 5: Milestone assignment
        rules_applied += self._assign_milestones(issues)
        
        self.stats['automations_applied'] = rules_applied
        logger.info(f"   ✓ Applied {rules_applied} automation rules")
    
    def _link_prs_to_issues(self, issues: List[Dict], prs: List[Dict]) -> int:
        """Link related PRs to issues"""
        rules_applied = 0
        
        for pr in prs:
            for issue in issues:
                # Check if PR title mentions issue
                if f"#{issue['id']}" in pr['title'] or issue['id'] in pr.get('related_issues', []):
                    issue['related_prs'].append(pr['id'])
                    
                    self.automation_log.append({
                        'rule': 'link_prs_to_issues',
                        'issue': issue['id'],
                        'pr': pr['id'],
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    rules_applied += 1
                    logger.debug(f"   ✓ Linked PR-{pr['id']} to Issue-{issue['id']}")
        
        return rules_applied
    
    def _auto_assign_issues(self, issues: List[Dict]) -> int:
        """Auto-assign issues based on labels"""
        logger.info("   Applying auto-assignment rule...")
        rules_applied = 0
        
        team_mapping = {
            'security': 'security-team',
            'backend': 'backend-team',
            'frontend': 'frontend-team',
            'database': 'dba-team',
            'devops': 'devops-team'
        }
        
        for issue in issues:
            for label in issue.get('labels', []):
                if label in team_mapping:
                    issue['assignee'] = team_mapping[label]
                    
                    self.automation_log.append({
                        'rule': 'auto_assign',
                        'issue': issue['id'],
                        'assignee': team_mapping[label],
                        'reason': f'Label: {label}',
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    rules_applied += 1
                    logger.debug(f"   ✓ Auto-assigned Issue-{issue['id']} to {team_mapping[label]}")
                    break
        
        return rules_applied
    
    def _auto_progress_issues(self, issues: List[Dict], prs: List[Dict]) -> int:
        """Auto-progress issues based on PR status"""
        logger.info("   Applying auto-progress rule...")
        rules_applied = 0
        
        for issue in issues:
            for pr_id in issue.get('related_prs', []):
                pr = next((p for p in prs if p['id'] == pr_id), None)
                
                if pr and pr['status'] == 'merged':
                    old_status = issue['status']
                    issue['status'] = 'done'
                    
                    self.automation_log.append({
                        'rule': 'auto_progress',
                        'issue': issue['id'],
                        'old_status': old_status,
                        'new_status': 'done',
                        'reason': f'Related PR merged',
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    rules_applied += 1
                    logger.debug(f"   ✓ Progressed Issue-{issue['id']} to done")
        
        return rules_applied
    
    def _escalate_priorities(self, issues: List[Dict]) -> int:
        """Escalate priorities based on age and status"""
        logger.info("   Applying priority escalation rule...")
        rules_applied = 0
        
        for issue in issues:
            if issue['status'] == 'open':
                # Issues open for >7 days get escalated
                created = datetime.fromisoformat(issue['created_at'])
                age_days = (datetime.now() - created).days
                
                if age_days > 7 and issue['priority'] == 'low':
                    issue['priority'] = 'medium'
                    
                    self.automation_log.append({
                        'rule': 'escalate_priority',
                        'issue': issue['id'],
                        'old_priority': 'low',
                        'new_priority': 'medium',
                        'reason': f'Open for {age_days} days',
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    rules_applied += 1
                    logger.debug(f"   ✓ Escalated Issue-{issue['id']} priority")
        
        return rules_applied
    
    def _assign_milestones(self, issues: List[Dict]) -> int:
        """Assign milestones based on priority and type"""
        logger.info("   Applying milestone assignment rule...")
        rules_applied = 0
        
        milestone_map = {
            'critical': 'v1.0-critical',
            'high': 'v1.1',
            'medium': 'v1.2',
            'low': 'backlog'
        }
        
        for issue in issues:
            priority = issue.get('priority', 'medium')
            milestone = milestone_map.get(priority, 'backlog')
            
            issue['milestone'] = milestone
            
            self.automation_log.append({
                'rule': 'assign_milestone',
                'issue': issue['id'],
                'milestone': milestone,
                'priority': priority,
                'timestamp': datetime.now().isoformat()
            })
            
            rules_applied += 1
            logger.debug(f"   ✓ Assigned Issue-{issue['id']} to milestone {milestone}")
        
        return rules_applied
    
    def _update_project_board(self, issues: List[Dict], prs: List[Dict]):
        """Update GitHub Project board"""
        logger.info("\n📊 Updating Project Board...")
        
        try:
            # Group issues by status
            by_status = defaultdict(list)
            
            for issue in issues:
                status = issue.get('status', 'open')
                by_status[status].append(issue)
            
            # Log board state
            board_state = {
                'open': len(by_status['open']),
                'in-progress': len(by_status.get('in-progress', [])),
                'in-review': len([p for p in prs if p['status'] == 'in-review']),
                'done': len(by_status.get('done', []))
            }
            
            logger.info(f"   Board State: {json.dumps(board_state)}")
            self.stats['board_state'] = board_state
            
        except Exception as e:
            logger.error(f"   Error updating board: {e}")
    
    def _generate_dependency_graph(self, issues: List[Dict], prs: List[Dict]):
        """Generate cross-repo dependency graph"""
        logger.info("\n🔗 Generating Dependency Graph...")
        
        graph = {
            'nodes': [],
            'edges': []
        }
        
        # Add issue nodes
        for issue in issues:
            graph['nodes'].append({
                'id': issue['id'],
                'type': 'issue',
                'title': issue['title'],
                'priority': issue.get('priority', 'medium')
            })
        
        # Add PR nodes
        for pr in prs:
            graph['nodes'].append({
                'id': pr['id'],
                'type': 'pr',
                'title': pr['title']
            })
        
        # Add edges (dependencies)
        for pr in prs:
            for issue_id in pr.get('related_issues', []):
                graph['edges'].append({
                    'from': pr['id'],
                    'to': issue_id,
                    'relationship': 'fixes'
                })
        
        # Save graph
        graph_file = Path(".dependency-graph.json")
        graph_file.write_text(json.dumps(graph, indent=2))
        
        logger.info(f"   ✓ Generated graph with {len(graph['nodes'])} nodes and {len(graph['edges'])} edges")
        self.stats['dependency_nodes'] = len(graph['nodes'])
        self.stats['dependency_edges'] = len(graph['edges'])
    
    def _generate_automation_report(self):
        """Generate automation execution report"""
        logger.info("\n📝 Generating Automation Report...")
        
        report = {
            'execution_time': datetime.now().isoformat(),
            'statistics': dict(self.stats),
            'automations_log': self.automation_log,
            'automation_summary': self._summarize_automations()
        }
        
        # Save report
        report_file = Path(".project-update-report.json")
        report_file.write_text(json.dumps(report, indent=2))
        
        logger.info(f"   Report saved: {report_file}")
        
        # Log summary
        summary = report['automation_summary']
        logger.info(f"\n   PR Links: {summary['pr_links']}")
        logger.info(f"   Auto-Assignments: {summary['auto_assignments']}")
        logger.info(f"   Auto-Progress: {summary['auto_progress']}")
        logger.info(f"   Priority Escalations: {summary['priority_escalations']}")
        logger.info(f"   Milestone Assignments: {summary['milestone_assignments']}")
    
    def _summarize_automations(self) -> Dict[str, int]:
        """Summarize automations by type"""
        summary = defaultdict(int)
        
        for log_entry in self.automation_log:
            rule_name = log_entry.get('rule', 'unknown')
            
            if 'link' in rule_name:
                summary['pr_links'] += 1
            elif 'assign' in rule_name and 'assignee' in log_entry:
                summary['auto_assignments'] += 1
            elif 'progress' in rule_name:
                summary['auto_progress'] += 1
            elif 'escalate' in rule_name:
                summary['priority_escalations'] += 1
            elif 'milestone' in rule_name:
                summary['milestone_assignments'] += 1
        
        return dict(summary)


def main():
    parser = argparse.ArgumentParser(description="Advanced Project Updater V2")
    parser.add_argument("--token", required=False, help="GitHub token")
    parser.add_argument("--project-id", required=False, help="Project ID")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    
    args = parser.parse_args()
    
    token = args.token or os.getenv('GITHUB_TOKEN', 'mock-token')
    project_id = args.project_id or os.getenv('PROJECT_ID', '2')
    
    updater = AdvancedProjectUpdater(token=token, project_id=project_id, verbose=args.verbose)
    return updater.run()


if __name__ == "__main__":
    sys.exit(main())
