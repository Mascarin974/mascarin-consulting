
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Ranges to remove (1-based):
# 1. Lines 712 to 721 (Duplicate scripts and stray buttons)
#    Indices: 711 to 720
# 2. Lines 725 to 891 (Duplicate modals and toast)
#    Indices: 724 to 890

# We will construct the new content by keeping the parts we want.
# Keep 0..710 (lines 1..711)
# Skip 711..720 (lines 712..721)
# Keep 721..723 (lines 722..724) -> This is just closing divs, might be risky if structure is broken.
# Let's look at lines 722-724:
# 722:         </div>
# 723: 
# 724:         <!-- Appointment Modal -->
# Wait, line 721 was `</div>`.
# Line 722 was `</div>`.
# Line 719 was `</div>`.
# Line 720 was `</form>`.
# It seems lines 715-720 are stray buttons and closing tags from a broken form.
# Let's remove 712 to 891 entirely.
# Indices 711 to 890.

new_lines = lines[:711] + lines[891:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed lines 712-891. New line count: {len(new_lines)}")
