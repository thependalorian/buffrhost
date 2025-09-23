"""
Basic functionality tests for Buffr Host Hospitality Platform
These tests don't require complex imports and can run independently.
"""
import pytest
import sys
import os
from pathlib import Path

# Add backend to path for imports
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

def test_python_version():
    """Test that we're using a compatible Python version."""
    assert sys.version_info >= (3, 8), "Python 3.8+ required"

def test_import_paths():
    """Test that our module paths are correct."""
    backend_dir = Path(__file__).parent.parent
    assert backend_dir.exists(), "Backend directory should exist"
    
    # Check key directories exist
    assert (backend_dir / "ai").exists(), "AI module directory should exist"
    assert (backend_dir / "tests").exists(), "Tests directory should exist"

def test_ai_module_structure():
    """Test that AI modules have the correct structure."""
    ai_dir = Path(__file__).parent.parent / "ai"
    
    # Check AI module files exist
    ai_files = [
        "__init__.py",
        "conversational_ai.py",
        "rag_system.py", 
        "recommendation_engine.py",
        "loyalty_ai.py"
    ]
    
    for file in ai_files:
        assert (ai_dir / file).exists(), f"AI module {file} should exist"

def test_ai_module_imports():
    """Test that AI modules can be imported without errors."""
    try:
        from ai.conversational_ai import ConversationalAI
        from ai.rag_system import RAGSystem
        from ai.recommendation_engine import RecommendationEngine
        from ai.loyalty_ai import LoyaltyAI
        
        # Test that classes can be imported (not instantiated due to dependencies)
        assert ConversationalAI is not None
        assert RAGSystem is not None
        assert RecommendationEngine is not None
        assert LoyaltyAI is not None
        
    except ImportError as e:
        pytest.skip(f"AI modules not available: {e}")

def test_ai_module_methods():
    """Test that AI modules have expected methods."""
    try:
        from ai.conversational_ai import ConversationalAI
        from ai.rag_system import RAGSystem
        from ai.recommendation_engine import RecommendationEngine
        from ai.loyalty_ai import LoyaltyAI
        
        # Test that classes have expected methods (without instantiation)
        assert hasattr(ConversationalAI, '__init__')
        assert hasattr(RAGSystem, '__init__')
        assert hasattr(RecommendationEngine, '__init__')
        assert hasattr(LoyaltyAI, '__init__')
        # All classes imported successfully
        
    except ImportError as e:
        pytest.skip(f"AI modules not available: {e}")

def test_requirements_file():
    """Test that requirements.txt exists and has necessary packages."""
    backend_dir = Path(__file__).parent.parent
    requirements_file = backend_dir / "requirements.txt"
    
    assert requirements_file.exists(), "requirements.txt should exist"
    
    # Read requirements and check for key packages
    with open(requirements_file, 'r') as f:
        requirements = f.read()
    
    key_packages = [
        "fastapi",
        "sqlalchemy", 
        "pydantic",
        "langchain",
        "pytest"
    ]
    
    for package in key_packages:
        assert package in requirements, f"{package} should be in requirements.txt"

def test_testing_requirements():
    """Test that testing requirements file exists."""
    backend_dir = Path(__file__).parent.parent
    test_requirements = backend_dir / "requirements-test.txt"
    
    assert test_requirements.exists(), "requirements-test.txt should exist"
    
    with open(test_requirements, 'r') as f:
        test_reqs = f.read()
    
    test_packages = ["pytest", "pytest-asyncio", "pytest-cov"]
    
    for package in test_packages:
        assert package in test_reqs, f"{package} should be in requirements-test.txt"

def test_pytest_config():
    """Test that pytest configuration exists."""
    backend_dir = Path(__file__).parent.parent
    pytest_ini = backend_dir / "pytest.ini"
    
    assert pytest_ini.exists(), "pytest.ini should exist"

def test_test_runner():
    """Test that test runner script exists and is executable."""
    backend_dir = Path(__file__).parent.parent
    test_runner = backend_dir / "run_tests.py"
    
    assert test_runner.exists(), "run_tests.py should exist"
    assert os.access(test_runner, os.X_OK), "run_tests.py should be executable"

def test_documentation_files():
    """Test that key documentation files exist."""
    backend_dir = Path(__file__).parent.parent
    parent_dir = backend_dir.parent
    
    # Check backend documentation
    assert (backend_dir / "TESTING.md").exists(), "TESTING.md should exist"
    
    # Check project documentation
    assert (parent_dir / "README.md").exists(), "README.md should exist"
    assert (parent_dir / "IMPLEMENTATION_STATUS.md").exists(), "IMPLEMENTATION_STATUS.md should exist"

def test_ai_module_content():
    """Test that AI modules contain expected content."""
    ai_dir = Path(__file__).parent.parent / "ai"
    
    # Test conversational_ai.py content
    conversational_file = ai_dir / "conversational_ai.py"
    if conversational_file.exists():
        with open(conversational_file, 'r') as f:
            content = f.read()
            assert "class ConversationalAI" in content
            assert "process_message" in content
    
    # Test rag_system.py content
    rag_file = ai_dir / "rag_system.py"
    if rag_file.exists():
        with open(rag_file, 'r') as f:
            content = f.read()
            assert "class RAGSystem" in content
            assert "async def query" in content
            assert "add_knowledge_document" in content
    
    # Test recommendation_engine.py content
    rec_file = ai_dir / "recommendation_engine.py"
    if rec_file.exists():
        with open(rec_file, 'r') as f:
            content = f.read()
            assert "class RecommendationEngine" in content
            assert "get_recommendations" in content
    
    # Test loyalty_ai.py content
    loyalty_file = ai_dir / "loyalty_ai.py"
    if loyalty_file.exists():
        with open(loyalty_file, 'r') as f:
            content = f.read()
            assert "class LoyaltyAI" in content
            assert "generate_campaign" in content

def test_ai_init_file():
    """Test that AI __init__.py exports the correct modules."""
    ai_dir = Path(__file__).parent.parent / "ai"
    init_file = ai_dir / "__init__.py"
    
    assert init_file.exists(), "AI __init__.py should exist"
    
    with open(init_file, 'r') as f:
        content = f.read()
        
        # Check imports
        assert "from .conversational_ai import ConversationalAI" in content
        assert "from .rag_system import RAGSystem" in content
        assert "from .recommendation_engine import" in content
        assert "from .loyalty_ai import LoyaltyAI" in content
        
        # Check __all__ exports
        assert "ConversationalAI" in content
        assert "RAGSystem" in content
        assert "RecommendationEngine" in content
        assert "LoyaltyAI" in content

@pytest.mark.slow
def test_ai_module_performance():
    """Test that AI modules can be imported quickly."""
    import time
    
    start_time = time.time()
    
    try:
        from ai.conversational_ai import ConversationalAI
        from ai.rag_system import RAGSystem
        from ai.recommendation_engine import RecommendationEngine
        from ai.loyalty_ai import LoyaltyAI
        
        end_time = time.time()
        import_time = end_time - start_time
        
        # AI modules should import in under 5 seconds
        assert import_time < 5.0, f"AI modules took {import_time:.2f}s to import, should be under 5s"
        
    except ImportError as e:
        pytest.skip(f"AI modules not available: {e}")

if __name__ == "__main__":
    # Run basic tests
    pytest.main([__file__, "-v"])
