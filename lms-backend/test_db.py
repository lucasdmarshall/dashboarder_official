#!/usr/bin/env python3

import psycopg2
import sys

def test_db_connection():
    try:
        # Test connection to your PostgreSQL database
        conn = psycopg2.connect(
            host="localhost",
            database="lms_db",
            user="leon",
            port=5432
        )
        
        cursor = conn.cursor()
        
        # Test basic query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Successfully connected to PostgreSQL!")
        print(f"Database version: {version[0]}")
        
        # Check if your tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        if tables:
            print(f"\n📊 Found {len(tables)} tables in your database:")
            for table in tables:
                print(f"  - {table[0]}")
                
            # Check if users table has data
            cursor.execute("SELECT COUNT(*) FROM users;")
            user_count = cursor.fetchone()[0]
            print(f"\n👥 Users in database: {user_count}")
            
            if user_count > 0:
                cursor.execute("SELECT email, role FROM users LIMIT 5;")
                users = cursor.fetchall()
                print("Sample users:")
                for user in users:
                    print(f"  - {user[0]} ({user[1]})")
        else:
            print("\n⚠️  No tables found in database")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("Testing connection to your PostgreSQL database...")
    success = test_db_connection()
    sys.exit(0 if success else 1) 