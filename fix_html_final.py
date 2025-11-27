
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# IDs to clean up
ids_to_fix = [
    'id="appointment-modal"',
    'id="client-modal"',
    'id="restore-modal"'
]

new_content = content

for target_id in ids_to_fix:
    # Find first occurrence
    first_pos = new_content.find(target_id)
    if first_pos == -1:
        print(f"Skipping {target_id}: Not found.")
        continue
        
    # Find second occurrence
    second_pos = new_content.find(target_id, first_pos + 1)
    if second_pos == -1:
        print(f"Skipping {target_id}: Only one instance found.")
        continue
        
    print(f"Fixing {target_id}...")
    print(f"  First instance at char {first_pos}")
    print(f"  Second instance at char {second_pos}")
    
    # We want to remove the FIRST instance.
    # But we need to remove the whole DIV.
    # Finding the matching closing </div> is hard with simple string search.
    # However, we know the structure.
    # The duplicate block seems to be a contiguous chunk containing all three modals.
    # Let's try to identify the START and END of the duplicate block.
    
    # The block starts with <!-- Appointment Modal --> (maybe)
    # And ends before the "real" modals start.
    pass

# Alternative Strategy:
# The duplicates are:
# 1. Appointment Modal (First)
# 2. Client Modal (First)
# 3. Restore Modal (First)
#
# They appear in that order.
# And then they appear again at the end.
#
# Let's find the start of the FIRST Appointment Modal.
# And the start of the SECOND Appointment Modal.
# And remove everything in between?
# No, that would remove the content between them (which might be nothing, or might be important).

# Let's look at the file content again.
# The first block starts at line 550.
# The second block starts at line 745.
# The content between 550 and 745 is... likely just the first block of modals!
# If line 550 is Appointment Modal 1
# And line 651 is Client Modal 1
# And line 691 is Restore Modal 1
# And line 745 is Appointment Modal 2
#
# Then the "Duplicate Block" is from 550 to 745.
# Let's verify if there is anything else between 691 (Restore Modal 1) and 745 (Appointment Modal 2).
# Restore modal is usually short.
#
# Let's try to remove from the START of Appointment Modal 1
# UP TO the START of Appointment Modal 2.
# This assumes Appointment Modal 2 follows immediately after the end of the duplicate block.
#
# Wait, if I remove from Start1 to Start2, I remove the *entire* first block AND any spacing/comments between them.
# This seems correct, assuming the second block is the "good" one and follows the first one.

start_marker = '<div id="appointment-modal" class="modal">'
pos1 = content.find(start_marker)
pos2 = content.find(start_marker, pos1 + 1)

if pos1 != -1 and pos2 != -1:
    print(f"Removing content between char {pos1} and {pos2}...")
    # We also want to remove the comment <!-- Appointment Modal --> which likely precedes it.
    # Let's look back a bit.
    chunk_before = content[pos1-30:pos1]
    print(f"Context before: {chunk_before}")
    
    # If we see <!-- Appointment Modal -->, let's include it in removal.
    comment = '<!-- Appointment Modal -->'
    start_cut = content.rfind(comment, 0, pos1)
    
    if start_cut != -1:
        print(f"Found comment at {start_cut}, adjusting start.")
        final_content = content[:start_cut] + content[pos2:]
    else:
        final_content = content[:pos1] + content[pos2:]
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("File updated.")
else:
    print("Could not identify two distinct blocks.")

