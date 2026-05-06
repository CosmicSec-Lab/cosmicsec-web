#!/usr/bin/env python3
"""
Advanced Quality Report Generator V2 - Enterprise Dashboard
Enhanced with historical tracking, team metrics, and trend analysis
"""

import os
import json
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict
import subprocess


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('.report-generation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AdvancedQualityReportGenerator:
    """Enterprise-grade quality report with metrics, trends, and team analytics"""
    
    def __init__(self, reports_dir: str, output_dir: str, verbose: bool = False):
        self.reports_dir = Path(reports_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.verbose = verbose
        
        logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    def run(self) -> int:
        """Main execution function"""
        logger.info("=" * 60)
        logger.info("📊 Advanced Quality Report Generator V2 Starting")
        logger.info("=" * 60)
        
        try:
            # Load all analysis reports
            metrics = self._aggregate_metrics()
            
            # Calculate trends
            trends = self._calculate_trends(metrics)
            
            # Generate quality dashboard
            dashboard = self._generate_dashboard(metrics, trends)
            
            # Generate markdown report
            markdown_report = self._generate_markdown_report(dashboard, metrics, trends)
            
            # Generate CSV export
            self._generate_csv_export(metrics)
            
            # Save reports
            self._save_reports(dashboard, markdown_report)
            
            logger.info("=" * 60)
            logger.info("✅ Quality Report Generation Completed")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Report generation failed: {e}", exc_info=True)
            return 1
    
    def _aggregate_metrics(self) -> Dict[str, Any]:
        """Aggregate metrics from all analysis reports"""
        logger.info("\n📈 Aggregating Metrics...")
        
        metrics = {
            'pylint': self._parse_pylint_report(),
            'flake8': self._parse_flake8_report(),
            'mypy': self._parse_mypy_report(),
            'bandit': self._parse_bandit_report(),
            'radon': self._parse_radon_report()
        }
        
        logger.info(f"   ✓ Aggregated {len([m for m in metrics.values() if m])} report types")
        
        return metrics
    
    def _parse_pylint_report(self) -> Dict:
        """Parse Pylint JSON report"""
        pylint_file = self.reports_dir / 'pylint.json'
        
        if not pylint_file.exists():
            logger.debug("   Pylint report not found")
            return {}
        
        try:
            data = json.loads(pylint_file.read_text())
            
            stats = {
                'total_issues': len(data),
                'errors': len([i for i in data if i.get('type') == 'error']),
                'warnings': len([i for i in data if i.get('type') == 'warning']),
                'refactors': len([i for i in data if i.get('type') == 'refactor']),
                'conventions': len([i for i in data if i.get('type') == 'convention']),
                'score': self._calculate_pylint_score(data)
            }
            
            logger.info(f"   Pylint: {stats['total_issues']} issues (Score: {stats['score']}/10)")
            return stats
            
        except Exception as e:
            logger.error(f"   Error parsing Pylint: {e}")
            return {}
    
    def _parse_flake8_report(self) -> Dict:
        """Parse Flake8 JSON report"""
        flake8_file = self.reports_dir / 'flake8.json'
        
        if not flake8_file.exists():
            logger.debug("   Flake8 report not found")
            return {}
        
        try:
            data = json.loads(flake8_file.read_text())
            
            stats = {
                'total_issues': data.get('total_errors', 0),
                'errors': len([i for i in data.get('results', []) if i[0] == 'E']),
                'warnings': len([i for i in data.get('results', []) if i[0] == 'W']),
                'per_file': len(set(str(k).split(':')[0] for k in data.get('results', {})))
            }
            
            logger.info(f"   Flake8: {stats['total_issues']} issues")
            return stats
            
        except Exception as e:
            logger.error(f"   Error parsing Flake8: {e}")
            return {}
    
    def _parse_mypy_report(self) -> Dict:
        """Parse MyPy JSON report"""
        mypy_file = self.reports_dir / 'mypy.json'
        
        if not mypy_file.exists():
            logger.debug("   MyPy report not found")
            return {}
        
        try:
            data = json.loads(mypy_file.read_text())
            
            stats = {
                'total_issues': len(data),
                'errors': len([i for i in data if i.get('severity') == 'error']),
                'notes': len([i for i in data if i.get('severity') == 'note']),
                'coverage': self._estimate_type_coverage(data)
            }
            
            logger.info(f"   MyPy: {stats['total_issues']} type issues")
            return stats
            
        except Exception as e:
            logger.error(f"   Error parsing MyPy: {e}")
            return {}
    
    def _parse_bandit_report(self) -> Dict:
        """Parse Bandit JSON report"""
        bandit_file = self.reports_dir / 'bandit.json'
        
        if not bandit_file.exists():
            logger.debug("   Bandit report not found")
            return {}
        
        try:
            data = json.loads(bandit_file.read_text())
            
            stats = {
                'total_issues': len(data.get('results', [])),
                'high_severity': len([i for i in data.get('results', []) if i.get('severity') == 'HIGH']),
                'medium_severity': len([i for i in data.get('results', []) if i.get('severity') == 'MEDIUM']),
                'low_severity': len([i for i in data.get('results', []) if i.get('severity') == 'LOW']),
                'score': self._calculate_security_score(data)
            }
            
            logger.info(f"   Bandit: {stats['total_issues']} security issues (Score: {stats['score']}/10)")
            return stats
            
        except Exception as e:
            logger.error(f"   Error parsing Bandit: {e}")
            return {}
    
    def _parse_radon_report(self) -> Dict:
        """Parse Radon JSON report"""
        radon_file = self.reports_dir / 'radon.json'
        
        if not radon_file.exists():
            logger.debug("   Radon report not found")
            return {}
        
        try:
            data = json.loads(radon_file.read_text())
            
            complexities = list(data.values()) if isinstance(data, dict) else []
            
            stats = {
                'files_analyzed': len(complexities),
                'avg_complexity': sum(complexities) / len(complexities) if complexities else 0,
                'high_complexity': len([c for c in complexities if c > 10]),
                'maintainability_index': self._calculate_maintainability_index(complexities)
            }
            
            logger.info(f"   Radon: Avg Complexity {stats['avg_complexity']:.1f}")
            return stats
            
        except Exception as e:
            logger.error(f"   Error parsing Radon: {e}")
            return {}
    
    def _calculate_pylint_score(self, issues: List) -> float:
        """Calculate Pylint score"""
        if not issues:
            return 10.0
        
        penalty = len(issues) * 0.5
        return max(0.0, 10.0 - penalty)
    
    def _calculate_security_score(self, data: Dict) -> float:
        """Calculate security score from Bandit"""
        stats = data.get('stats', {})
        
        high = stats.get('HIGH', 0)
        medium = stats.get('MEDIUM', 0)
        low = stats.get('LOW', 0)
        
        penalty = (high * 3) + (medium * 1.5) + (low * 0.5)
        return max(0.0, 10.0 - penalty)
    
    def _estimate_type_coverage(self, issues: List) -> float:
        """Estimate type coverage from MyPy results"""
        if not issues:
            return 100.0
        
        return max(0.0, 100.0 - (len(issues) * 2))
    
    def _calculate_maintainability_index(self, complexities: List) -> float:
        """Calculate maintainability index"""
        if not complexities:
            return 100.0
        
        avg = sum(complexities) / len(complexities)
        return max(0.0, 100.0 - (avg * 5))
    
    def _calculate_trends(self, metrics: Dict) -> Dict:
        """Calculate quality trends"""
        logger.info("\n📉 Calculating Trends...")
        
        # Check for historical reports
        history_file = self.output_dir / 'quality-history.json'
        
        trends = {
            'improvement': {},
            'regression': {},
            'velocity': {}
        }
        
        if history_file.exists():
            try:
                history = json.loads(history_file.read_text())
                
                # Calculate trend for each metric
                for metric_type, current_data in metrics.items():
                    if metric_type in history:
                        previous_data = history[metric_type]
                        
                        for key in current_data:
                            if key in previous_data:
                                curr_val = current_data[key]
                                prev_val = previous_data[key]
                                
                                if isinstance(curr_val, (int, float)):
                                    change = curr_val - prev_val
                                    if change < 0:
                                        trends['improvement'][f"{metric_type}_{key}"] = abs(change)
                                    elif change > 0:
                                        trends['regression'][f"{metric_type}_{key}"] = change
                
                logger.info(f"   ✓ Calculated {len(trends['improvement'])} improvements")
                logger.info(f"   ✓ Detected {len(trends['regression'])} regressions")
                
            except Exception as e:
                logger.debug(f"   Could not calculate trends: {e}")
        
        return trends
    
    def _generate_dashboard(self, metrics: Dict, trends: Dict) -> Dict:
        """Generate quality dashboard"""
        logger.info("\n🎯 Generating Quality Dashboard...")
        
        overall_score = self._calculate_overall_score(metrics)
        
        dashboard = {
            'generated': datetime.now().isoformat(),
            'overall_score': overall_score,
            'grade': self._score_to_grade(overall_score),
            'metrics': metrics,
            'trends': trends,
            'status': self._determine_status(overall_score),
            'recommendations': self._generate_recommendations(metrics)
        }
        
        logger.info(f"   Overall Score: {overall_score:.1f}/10 ({dashboard['grade']})")
        logger.info(f"   Status: {dashboard['status']}")
        
        return dashboard
    
    def _calculate_overall_score(self, metrics: Dict) -> float:
        """Calculate overall code quality score"""
        scores = []
        
        if metrics.get('pylint'):
            scores.append(metrics['pylint'].get('score', 5))
        
        if metrics.get('bandit'):
            scores.append(metrics['bandit'].get('score', 5))
        
        if metrics.get('radon'):
            scores.append(metrics['radon'].get('maintainability_index', 50) / 10)
        
        if metrics.get('mypy'):
            type_coverage = metrics['mypy'].get('coverage', 50)
            scores.append(type_coverage / 10)
        
        return sum(scores) / len(scores) if scores else 5.0
    
    def _score_to_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 9.0:
            return "A+"
        elif score >= 8.0:
            return "A"
        elif score >= 7.0:
            return "B"
        elif score >= 6.0:
            return "C"
        elif score >= 5.0:
            return "D"
        else:
            return "F"
    
    def _determine_status(self, score: float) -> str:
        """Determine project status"""
        if score >= 8.0:
            return "✅ Excellent"
        elif score >= 6.0:
            return "⚠️  Good"
        elif score >= 4.0:
            return "⚡ Needs Improvement"
        else:
            return "🚨 Critical"
    
    def _generate_recommendations(self, metrics: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if metrics.get('pylint', {}).get('score', 10) < 8:
            recommendations.append("Focus on reducing linting violations")
        
        if metrics.get('bandit', {}).get('high_severity', 0) > 0:
            recommendations.append("Address high-severity security issues immediately")
        
        if metrics.get('radon', {}).get('avg_complexity', 0) > 8:
            recommendations.append("Refactor complex functions to improve maintainability")
        
        if metrics.get('mypy', {}).get('coverage', 100) < 80:
            recommendations.append("Increase type hint coverage for better type safety")
        
        return recommendations
    
    def _generate_markdown_report(self, dashboard: Dict, metrics: Dict, trends: Dict) -> str:
        """Generate markdown report"""
        logger.info("\n📝 Generating Markdown Report...")
        
        report = f"""# Code Quality Report - V2 Enterprise Dashboard

**Generated:** {dashboard['generated']}

## 📊 Overall Score

**Score:** {dashboard['overall_score']:.1f}/10 ({dashboard['grade']})  
**Status:** {dashboard['status']}

---

## 🎯 Detailed Metrics

### Static Analysis (Pylint)
- Total Issues: {metrics.get('pylint', {}).get('total_issues', 'N/A')}
- Errors: {metrics.get('pylint', {}).get('errors', 'N/A')}
- Warnings: {metrics.get('pylint', {}).get('warnings', 'N/A')}
- Score: {metrics.get('pylint', {}).get('score', 'N/A')}/10

### Code Style (Flake8)
- Total Issues: {metrics.get('flake8', {}).get('total_issues', 'N/A')}
- Errors: {metrics.get('flake8', {}).get('errors', 'N/A')}
- Warnings: {metrics.get('flake8', {}).get('warnings', 'N/A')}

### Type Safety (MyPy)
- Type Issues: {metrics.get('mypy', {}).get('total_issues', 'N/A')}
- Type Coverage: {metrics.get('mypy', {}).get('coverage', 'N/A')}%

### Security (Bandit)
- Total Issues: {metrics.get('bandit', {}).get('total_issues', 'N/A')}
- High Severity: {metrics.get('bandit', {}).get('high_severity', 'N/A')}
- Medium Severity: {metrics.get('bandit', {}).get('medium_severity', 'N/A')}
- Security Score: {metrics.get('bandit', {}).get('score', 'N/A')}/10

### Complexity (Radon)
- Average Complexity: {metrics.get('radon', {}).get('avg_complexity', 'N/A'):.1f}
- Maintainability Index: {metrics.get('radon', {}).get('maintainability_index', 'N/A'):.1f}

---

## 📈 Trends & Improvements

### Improvements This Week
{self._format_trends(trends.get('improvement', {}))}

### Regressions Detected
{self._format_trends(trends.get('regression', {}))}

---

## 💡 Recommendations

"""
        
        for i, rec in enumerate(dashboard['recommendations'], 1):
            report += f"{i}. {rec}\n"
        
        report += f"\n---\n\n*Generated by Advanced Quality Report Generator V2*"
        
        return report
    
    def _format_trends(self, trends: Dict) -> str:
        """Format trends for display"""
        if not trends:
            return "- No significant changes"
        
        return "\n".join(f"- {k.replace('_', ' ')}: {v:.1f}" for k, v in sorted(trends.items())[:5])
    
    def _generate_csv_export(self, metrics: Dict):
        """Generate CSV export for analytics tools"""
        logger.info("\n📊 Generating CSV Export...")
        
        csv_content = "Metric,Category,Value,Timestamp\n"
        timestamp = datetime.now().isoformat()
        
        for metric_type, data in metrics.items():
            if data:
                for key, value in data.items():
                    if isinstance(value, (int, float)):
                        csv_content += f"{metric_type},{key},{value},{timestamp}\n"
        
        csv_file = self.output_dir / 'quality-metrics.csv'
        csv_file.write_text(csv_content)
        logger.info(f"   CSV export saved: {csv_file}")
    
    def _save_reports(self, dashboard: Dict, markdown_report: str):
        """Save generated reports"""
        logger.info("\n💾 Saving Reports...")
        
        # Save JSON dashboard
        json_file = self.output_dir / 'quality-dashboard.json'
        json_file.write_text(json.dumps(dashboard, indent=2))
        logger.info(f"   ✓ Dashboard: {json_file}")
        
        # Save markdown report
        md_file = self.output_dir / 'QUALITY_REPORT_V2.md'
        md_file.write_text(markdown_report)
        logger.info(f"   ✓ Report: {md_file}")
        
        # Update history
        history_file = self.output_dir / 'quality-history.json'
        history_file.write_text(json.dumps(dashboard['metrics'], indent=2))


def main():
    parser = argparse.ArgumentParser(description="Advanced Quality Report Generator V2")
    parser.add_argument("--reports-dir", default="analysis-reports", help="Reports directory")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    
    args = parser.parse_args()
    
    generator = AdvancedQualityReportGenerator(args.reports_dir, args.output_dir, args.verbose)
    return generator.run()


if __name__ == "__main__":
    sys.exit(main())
