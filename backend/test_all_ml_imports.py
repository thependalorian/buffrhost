#!/usr/bin/env python3
"""
Comprehensive ML Module Import Test
Tests all 18 ML systems to identify missing dependencies and import issues.
"""

import sys
import traceback
from typing import Dict, List, Tuple

def test_import(module_name: str) -> Tuple[bool, str, List[str]]:
    """Test importing a module and return status, error message, and warnings."""
    warnings = []
    try:
        # Capture warnings
        import warnings as warnings_module
        with warnings_module.catch_warnings(record=True) as w:
            warnings_module.simplefilter("always")
            
            # Import the module
            __import__(module_name)
            
            # Collect warnings
            for warning in w:
                warnings.append(f"{warning.category.__name__}: {warning.message}")
            
            return True, "SUCCESS", warnings
            
    except ImportError as e:
        return False, f"ImportError: {str(e)}", warnings
    except Exception as e:
        return False, f"Error: {str(e)}", warnings

def main():
    """Test all ML modules and generate a comprehensive report."""
    
    # All 18 ML modules from backend.md
    ml_modules = [
        "ai.credit_scoring_model",
        "ai.fraud_detection_system", 
        "ai.spending_analysis_nlp",
        "ai.financial_education_system",
        "ai.savings_goals_ml",
        "ai.gamification_ml",
        "ai.mlops_infrastructure",
        "ai.advanced_analytics_system",
        "ai.customer_segmentation_system",
        "ai.demand_forecasting_system",
        "ai.dynamic_pricing_system",
        "ai.churn_prediction_system",
        "ai.feature_store_system",
        "ai.model_interpretability_system",
        "ai.real_time_inference_system",
        "ai.data_quality_monitoring_system",
        "ai.ab_testing_framework",
        "ai.model_monitoring_system"
    ]
    
    print("🧪 COMPREHENSIVE ML MODULE IMPORT TEST")
    print("=" * 60)
    
    results = {}
    success_count = 0
    partial_count = 0
    failure_count = 0
    
    for module in ml_modules:
        print(f"\n🔍 Testing: {module}")
        success, error_msg, warnings = test_import(module)
        
        results[module] = {
            'success': success,
            'error': error_msg,
            'warnings': warnings
        }
        
        if success:
            if warnings:
                print(f"   ✅ SUCCESS (with warnings)")
                partial_count += 1
                for warning in warnings:
                    print(f"      ⚠️  {warning}")
            else:
                print(f"   ✅ SUCCESS")
                success_count += 1
        else:
            print(f"   ❌ FAILED: {error_msg}")
            failure_count += 1
    
    # Summary Report
    print("\n" + "=" * 60)
    print("📊 SUMMARY REPORT")
    print("=" * 60)
    print(f"✅ Fully Working: {success_count}/18")
    print(f"⚠️  Partial (with warnings): {partial_count}/18") 
    print(f"❌ Failed: {failure_count}/18")
    print(f"📈 Total Functional: {success_count + partial_count}/18")
    
    # Detailed Results
    print("\n" + "=" * 60)
    print("📋 DETAILED RESULTS")
    print("=" * 60)
    
    print("\n✅ FULLY WORKING:")
    for module, result in results.items():
        if result['success'] and not result['warnings']:
            print(f"   • {module}")
    
    print("\n⚠️  PARTIAL (with warnings):")
    for module, result in results.items():
        if result['success'] and result['warnings']:
            print(f"   • {module}")
            for warning in result['warnings']:
                print(f"     - {warning}")
    
    print("\n❌ FAILED:")
    for module, result in results.items():
        if not result['success']:
            print(f"   • {module}: {result['error']}")
    
    # Missing Dependencies Analysis
    print("\n" + "=" * 60)
    print("🔍 MISSING DEPENDENCIES ANALYSIS")
    print("=" * 60)
    
    missing_deps = set()
    for module, result in results.items():
        if not result['success'] and "ModuleNotFoundError" in result['error']:
            error_msg = result['error']
            # Extract module name from error message
            if "No module named '" in error_msg:
                dep_name = error_msg.split("No module named '")[1].split("'")[0]
                missing_deps.add(dep_name)
    
    if missing_deps:
        print("Missing packages to install:")
        for dep in sorted(missing_deps):
            print(f"   pip install {dep}")
    else:
        print("No missing package dependencies detected.")
    
    return results

if __name__ == "__main__":
    results = main()
    sys.exit(0)