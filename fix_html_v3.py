
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We need to:
# 1. Extract the modals from lines 359-700 (approx)
# 2. Remove the duplicate/stray HTML at lines 713-720 (approx)
# 3. Append the extracted modals to the end of the body (before scripts)
# 4. Remove the modals from their original location (inside view-backup)

# Let's identify the blocks more precisely.
# Modals start at line 360 (index 359) with <div id="day-modal" class="modal">
# They end around line 700 (index 699) with </div> (closing restore-modal)
# The view-backup div closes at line 357 (index 356)?? No, wait.
# Line 356: </div>
# Line 357: </div>
# Line 359: <!-- Day View Modal -->
# It seems the modals are AFTER the view-backup div closes?
# Let's check line 326: <div id="view-backup" class="view">
# It seems to close at line 357.
# If so, they are NOT inside view-backup.
# BUT, line 721 is </div>.
# Let's re-examine the nesting.

# Line 326: <div id="view-backup" ...>
# ...
# Line 357: </div> (Closes stat-card?)
# Line 356: </div> (Closes something inside stat-card?)
# Line 340: <div class="stat-card">
# Line 357 closes stat-card.
# So where does view-backup close?
# It might NOT be closed before the modals!
# If view-backup is not closed, then the modals ARE inside it.

# I will assume the modals are inside view-backup or some other container.
# I will cut lines 359 to 700 (indices 358 to 699) and move them to the end.
# Also remove lines 713-720 (indices 712 to 719).

# Indices to move: 358 to 700 (inclusive of restore modal closing div)
# Let's verify the end of restore modal.
# Line 700: </div>
# Line 701:
# Line 702: <div id="notification-toast" ...>
# So we move 358 to 700.

# Indices to remove (stray): 713 to 720.
# Line 713: <div id="notification-toast" ...> (Duplicate!)
# Line 720: </div>

# New structure:
# 1. lines[0:358] (Keep everything up to modals)
# 2. lines[701:713] (Keep toast and reset button, skip duplicate toast)
# 3. lines[721:728] (Keep security scripts)
# 4. MOVED MODALS (lines 358:701)
# 5. lines[728:] (Keep app scripts and closing body)

# Wait, line 702 is toast. Line 713 is duplicate toast.
# So we keep 702.
# We remove 713-720.

modals_block = lines[359:701] # Lines 360 to 701 (indices 359 to 700)
# Wait, python slice is [start:end] (end exclusive).
# So lines[359:701] gives indices 359...700.
# Line 360 is index 359.
# Line 701 is index 700.
# This seems correct.

# Construct new content
part1 = lines[:359] # 0 to 358
part2 = lines[701:713] # 702 to 713 (Toast and reset button)
part3 = lines[721:728] # Security scripts (skip stray lines 713-720)
part4 = modals_block
part5 = lines[728:] # App scripts

new_lines = part1 + part2 + part3 + part4 + part5

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Moved modals to end. New line count: {len(new_lines)}")
