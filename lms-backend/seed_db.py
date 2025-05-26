import sys
import os

# Add the parent directory to the path to allow importing the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.seed import main

if __name__ == "__main__":
    print("Seeding database with test users...")
    main()
    print("Database seeding complete.") 