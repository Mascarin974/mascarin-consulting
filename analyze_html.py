
import re

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

ids_to_find = [
    'id="appointment-modal"',
    'id="client-modal"',
    'id="restore-modal"',
    'id="invoice-modal"',
    'id="day-modal"',
    'id="confirmation-modal"'
]

print(f"Analyzing {file_path} ({len(lines)} lines)...")

for target_id in ids_to_find:
    print(f"\nSearching for {target_id}:")
    count = 0
    for i, line in enumerate(lines):
        if target_id in line:
            count += 1
            print(f"  Found at line {i+1}: {line.strip()}")
    
    if count == 0:
        print("  NOT FOUND!")
    elif count > 1:
        print(f"  ⚠️ DUPLICATE FOUND ({count} times)")
