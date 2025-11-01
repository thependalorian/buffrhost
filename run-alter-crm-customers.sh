#!/bin/bash

# Script to alter crm_customers table to add missing columns for ML pipeline
# This addresses the schema mismatch and enables the recommendation engine

echo "[BuffrIcon name=\"database\"] ALTERING crm_customers TABLE FOR ML PIPELINE"
echo "=================================================="

# Load environment variables if .env exists
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set default DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not set. Please check your .env file."
    exit 1
fi

echo "Database URL: ${DATABASE_URL:0:50}..."
echo ""

# Run the ALTER TABLE script
echo "Executing ALTER TABLE commands..."
psql "$DATABASE_URL" -f alter-crm-customers.sql

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "[BuffrIcon name=\"check\"] SUCCESS: crm_customers table altered successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run db:check-seed-data"
    echo "2. Run: npm run verify:all"
    echo "3. The ML pipeline and recommendation engine should now work with real data"
else
    echo ""
    echo "[BuffrIcon name=\"warning\"] ERROR: Failed to alter crm_customers table"
    echo "Please check the error messages above and try again."
    exit 1
fi
