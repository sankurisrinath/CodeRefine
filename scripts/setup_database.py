#!/usr/bin/env python3
"""
Database setup script for CodeRefine - Local PostgreSQL
Creates database, runs migrations, and sets up initial data
"""

import os
import sys
import subprocess
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Add backend to path - resolve relative to this script's location
_scripts_dir = os.path.dirname(os.path.abspath(__file__))
_repo_root = os.path.dirname(_scripts_dir)
backend_dir = os.path.join(_repo_root, 'CodeRefine-main', 'backend')
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, '.env'))

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "coderefine")


def create_database():
    """Create the CodeRefine database if it doesn't exist"""
    print(f"🔧 Connecting to PostgreSQL at {POSTGRES_HOST}:{POSTGRES_PORT}...")

    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            database="postgres"
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (POSTGRES_DB,)
        )

        if cursor.fetchone():
            print(f"✅ Database '{POSTGRES_DB}' already exists")
        else:
            # Create database
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(POSTGRES_DB)
            ))
            print(f"✅ Database '{POSTGRES_DB}' created successfully")

        cursor.close()
        conn.close()
        return True

    except psycopg2.Error as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        print("\n💡 Make sure PostgreSQL is running and credentials are correct")
        print(f"   Host: {POSTGRES_HOST}")
        print(f"   Port: {POSTGRES_PORT}")
        print(f"   User: {POSTGRES_USER}")
        return False


def run_migrations():
    """Run Alembic migrations"""
    print("\n🔄 Running database migrations...")

    try:
        # Initialize Alembic if no migration versions exist
        versions_dir = os.path.join(backend_dir, 'migrations', 'versions')
        if not os.path.exists(versions_dir) or not os.listdir(versions_dir):
            print("📝 Generating initial migration...")
            subprocess.run(
                ["alembic", "revision", "--autogenerate", "-m", "Initial migration"],
                cwd=backend_dir,
                check=True
            )

        # Run migrations
        subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=backend_dir,
            check=True
        )
        print("✅ Migrations completed successfully")
        return True

    except subprocess.CalledProcessError as e:
        print(f"❌ Error running migrations: {e}")
        return False


def verify_setup():
    """Verify database setup"""
    print("\n🔍 Verifying database setup...")

    try:
        conn = psycopg2.connect(
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            database=POSTGRES_DB
        )
        cursor = conn.cursor()

        # Check tables
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)

        tables = cursor.fetchall()
        if tables:
            print(f"✅ Found {len(tables)} tables:")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("⚠️  No tables found")

        cursor.close()
        conn.close()
        return True

    except psycopg2.Error as e:
        print(f"❌ Error verifying setup: {e}")
        return False


def main():
    print("=" * 60)
    print("🚀 CodeRefine Database Setup - Local PostgreSQL")
    print("=" * 60)

    if not POSTGRES_PASSWORD:
        print("❌ POSTGRES_PASSWORD not set in .env file")
        sys.exit(1)

    # Step 1: Create database
    if not create_database():
        sys.exit(1)

    # Step 2: Run migrations
    if not run_migrations():
        sys.exit(1)

    # Step 3: Verify setup
    if not verify_setup():
        sys.exit(1)

    print("\n" + "=" * 60)
    print("✅ Database setup completed successfully!")
    print("=" * 60)
    print(f"\n📊 Database Details:")
    print(f"   Host: {POSTGRES_HOST}")
    print(f"   Port: {POSTGRES_PORT}")
    print(f"   Database: {POSTGRES_DB}")
    print(f"   User: {POSTGRES_USER}")
    print(f"\n🎉 You can now start the backend server!")
    print(f"   cd CodeRefine-main/backend")
    print(f"   python main.py")


if __name__ == "__main__":
    main()
