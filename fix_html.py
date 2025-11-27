
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines to remove are 356 to 450 (1-based)
# In 0-based index: 355 to 449
# We want to keep 0..354 and 450..end
# 355 is the first line to remove.
# 450 is the first line to KEEP (line 451 in 1-based).
# Wait, line 450 was `</form>`. Line 451 was `</div>`.
# I want to remove 356..450.
# So indices 355..449.
# So I keep lines[:355] and lines[450:]

new_lines = lines[:355] + lines[450:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed lines 356-450. New line count: {len(new_lines)}")
