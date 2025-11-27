
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We want to remove lines 549 to 743 (1-based).
# In 0-based index: 548 to 743.
# lines[548] is the 549th line.
# lines[743] is the 744th line (which we want to KEEP).

# Verify start
print(f"Line 549 (Index 548): {lines[548].strip()}") # Should be <!-- Appointment Modal -->
# Verify end
print(f"Line 744 (Index 743): {lines[743].strip()}") # Should be <!-- Appointment Modal --> (The good one)

# Slice: Keep 0 to 548, and 743 to end.
new_lines = lines[:548] + lines[743:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed lines 549-743. New line count: {len(new_lines)}")
