"""
Langfuse Configuration for AI Service
"""
import os
from langfuse import get_client

# Initialize Langfuse client
langfuse = get_client()

# Verify connection
def verify_langfuse_connection():
    """Verify Langfuse connection"""
    try:
        if langfuse.auth_check():
            print("✅ Langfuse client authenticated successfully!")
            return True
        else:
            print("❌ Langfuse authentication failed. Check your credentials.")
            return False
    except Exception as e:
        print(f"❌ Langfuse connection error: {e}")
        return False

# Environment variables check
def check_environment_variables():
    """Check required environment variables"""
    required_vars = [
        "LANGFUSE_PUBLIC_KEY",
        "LANGFUSE_SECRET_KEY", 
        "LANGFUSE_HOST",
        "OPENAI_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All required environment variables are set")
        return True

if __name__ == "__main__":
    print("🔍 Checking Langfuse configuration...")
    env_check = check_environment_variables()
    conn_check = verify_langfuse_connection()
    
    if env_check and conn_check:
        print("🎉 Langfuse configuration is ready!")
    else:
        print("⚠️  Please fix the configuration issues above")
