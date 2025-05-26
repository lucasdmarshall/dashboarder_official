#!/usr/bin/env python3
"""
Script to delete specific user accounts by name.
"""

from app.database import SessionLocal
from app.models import User, UserRole

def delete_users_by_name(names):
    """Delete users by their names."""
    db = SessionLocal()
    try:
        deleted_users = []
        
        for name in names:
            users = db.query(User).filter(User.name.ilike(f"%{name}%")).all()
            
            for user in users:
                print(f"Found user: {user.name} ({user.email}) - Role: {user.role}")
                deleted_users.append({
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                })
                db.delete(user)
        
        if deleted_users:
            db.commit()
            print(f"✅ Successfully deleted {len(deleted_users)} user(s):")
            for user in deleted_users:
                print(f"  - {user['name']} ({user['email']}) - {user['role']}")
        else:
            print("❌ No users found with the specified names.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error deleting users: {e}")
    finally:
        db.close()

def list_all_users():
    """List all users in the database."""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"📊 Total users in database: {len(users)}")
        
        for user in users:
            print(f"  - {user.name} ({user.email}) - Role: {user.role} - Active: {user.is_active}")
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🔍 Current users in database:")
    list_all_users()
    
    print("\n🗑️ Deleting specified users...")
    names_to_delete = ["Henry Cavill", "Patrick Bateman"]
    delete_users_by_name(names_to_delete)
    
    print("\n🔍 Users after deletion:")
    list_all_users() 