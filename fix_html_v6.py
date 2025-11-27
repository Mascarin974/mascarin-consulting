
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the first occurrence of the appointment modal
first_marker = '<div id="appointment-modal" class="modal">'
first_pos = content.find(first_marker)

if first_pos == -1:
    print("Error: Could not find appointment modal.")
    exit(1)

# Find the second occurrence
second_pos = content.find(first_marker, first_pos + 1)

if second_pos == -1:
    print("Error: Could not find second appointment modal. Already clean?")
    exit(0)

print(f"Found duplicate blocks at char {first_pos} and {second_pos}.")

# We need to find where the "bad" block starts. 
# It seems the bad block starts exactly at `first_pos` (line 550).
# And it ends just before `second_pos` (line 744).
# However, looking at the file, there might be some closing tags before the second modal that belong to the previous section.
# The previous section is the Invoice Modal.
# The bad block seems to have been pasted *inside* or *after* the invoice modal.
# Let's look at the content just before first_pos.
# It should be `</div></div>` closing the invoice modal.

# Let's remove from `first_pos` up to `second_pos`.
# This will remove the first modal block and everything in between.
# content[first_pos:second_pos] will be removed.

new_content = content[:first_pos] + content[second_pos:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Removed duplicate block. New length: {len(new_content)} chars.")
