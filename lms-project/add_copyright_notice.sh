#!/bin/bash

# Strict Copyright Notice Script for Dashboarder LMS

# Absolute paths to our source directories
SAFE_DIRS=(
    "/Users/leon/Documents/New copy/lms-project/frontend/src"
)

# Copyright notice template
COPYRIGHT_NOTICE="/**
 * Dashboarder LMS - Learning Management System
 * 
 * @copyright 2025 Dashboarder Technologies. All Rights Reserved.
 * @license Proprietary and Confidential
 * 
 * This file is part of the Dashboarder LMS project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 */
"

# Backup function to prevent accidental modifications
safe_add_copyright() {
    local file="$1"
    
    # Verify file is in a safe directory
    safe_dir_match=0
    for safe_dir in "${SAFE_DIRS[@]}"; do
        if [[ "$file" == "$safe_dir"* ]]; then
            safe_dir_match=1
            break
        fi
    done
    
    # Exit if not in a safe directory
    if [ $safe_dir_match -eq 0 ]; then
        echo "BLOCKED: Attempted to modify file outside safe directories: $file"
        return 1
    fi
    
    # Check if file already has copyright notice
    if ! grep -q "Dashboarder LMS - Learning Management System" "$file"; then
        # Create a temporary file
        temp_file=$(mktemp)
        
        # Add copyright notice and then the rest of the file contents
        echo "$COPYRIGHT_NOTICE" > "$temp_file"
        cat "$file" >> "$temp_file"
        
        # Replace the original file
        mv "$temp_file" "$file"
        
        echo "Added copyright notice to $file"
    fi
}

# Export the function for use with find
export -f safe_add_copyright
export COPYRIGHT_NOTICE

# Find and process only JavaScript files in safe directories
for dir in "${SAFE_DIRS[@]}"; do
    find "$dir" -type f \( -name "*.js" -o -name "*.jsx" \) -print0 | while IFS= read -r -d '' file; do
        safe_add_copyright "$file"
    done
done

echo "Copyright notice addition complete and safe."
