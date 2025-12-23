#!/usr/bin/env python3
"""
Fix markdown files that have code block wrappers
"""

import os
from pathlib import Path

MD_DIR = Path("/Users/simonwang/Documents/Usage/UE1/materials/MD")

def fix_file(file_path):
    """Remove markdown code block wrappers from file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if content has code block wrappers
        if '```markdown' in content or content.strip().startswith('```'):
            # Replace code block markers
            content = content.replace('```markdown', '').replace('```', '')
            content = content.strip()
            
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed: {file_path.name}")
            return True
        else:
            print(f"- Skipped (no code blocks): {file_path.name}")
            return False
    except Exception as e:
        print(f"✗ Error fixing {file_path.name}: {e}")
        return False

def main():
    """Fix all markdown files in MD directory"""
    print("Fixing markdown code block wrappers...\n")
    
    fixed = 0
    skipped = 0
    
    for md_file in MD_DIR.glob("*.md"):
        if fix_file(md_file):
            fixed += 1
        else:
            skipped += 1
    
    print(f"\n✓ Fixed: {fixed} files")
    print(f"- Skipped: {skipped} files")

if __name__ == "__main__":
    main()


