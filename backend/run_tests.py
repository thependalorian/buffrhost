#!/usr/bin/env python3
"""
Test runner script for Buffr Host Hospitality Platform
"""
import os
import subprocess
import sys
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {command}")
    print(f"{'='*60}")

    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {description}:")
        print(f"Return code: {e.returncode}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False


def main():
    """Main test runner function."""
    print("🧪 Buffr Host Hospitality Platform - Test Runner")
    print("=" * 60)

    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)

    # Install test dependencies
    if not run_command(
        "pip install -r requirements-test.txt", "Installing test dependencies"
    ):
        print("❌ Failed to install test dependencies")
        sys.exit(1)

    # Run linting
    print("\n🔍 Running code linting...")
    if not run_command(
        "python -m flake8 backend/ --max-line-length=100 --ignore=E203,W503",
        "Code linting",
    ):
        print("⚠️  Linting issues found, but continuing with tests...")

    # Run unit tests
    print("\n🧪 Running unit tests...")
    if not run_command("python -m pytest tests/ -v --tb=short", "Unit tests"):
        print("❌ Unit tests failed")
        sys.exit(1)

    # Run tests with coverage
    print("\n📊 Running tests with coverage...")
    if not run_command(
        "python -m pytest tests/ --cov=backend --cov-report=html --cov-report=term",
        "Tests with coverage",
    ):
        print("❌ Coverage tests failed")
        sys.exit(1)

    # Run AI module tests specifically
    print("\n🤖 Running AI module tests...")
    if not run_command(
        "python -m pytest tests/test_ai_modules.py -v -m ai", "AI module tests"
    ):
        print("❌ AI module tests failed")
        sys.exit(1)

    # Run database model tests
    print("\n🗄️  Running database model tests...")
    if not run_command(
        "python -m pytest tests/test_database_models.py -v", "Database model tests"
    ):
        print("❌ Database model tests failed")
        sys.exit(1)

    # Run API endpoint tests
    print("\n🌐 Running API endpoint tests...")
    if not run_command(
        "python -m pytest tests/test_api_endpoints.py -v", "API endpoint tests"
    ):
        print("❌ API endpoint tests failed")
        sys.exit(1)

    print("\n✅ All tests completed successfully!")
    print("\n📈 Coverage report generated in htmlcov/index.html")
    print("🎉 Buffr Host backend is ready for deployment!")


if __name__ == "__main__":
    main()
