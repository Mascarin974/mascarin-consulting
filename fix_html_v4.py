
import os

file_path = r'c:/Users/nieto/.gemini/antigravity/playground/zonal-perseverance/mascarin-v2/admin-dashboard.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We identified duplicate modals between lines 549 and 740.
# Let's verify the content at these lines to be safe.
# Line 549 (index 548): <!-- Appointment Modal -->
# Line 740 (index 739): </div> (End of invoice modal wrapper?)
# Wait, let's look at the file content again.
# Line 741: </div>
# Line 743: <!-- Appointment Modal --> (The second one starts here)

# So we want to remove from the start of the FIRST Appointment Modal
# up to the start of the SECOND Appointment Modal.
# First Appointment Modal starts at line 549 (index 548).
# The block seems to go:
# Appointment Modal -> Client Modal -> Restore Modal -> Notes Section -> Invoice Modal closing?
# Wait, line 549 is inside `invoice-modal`?
# Line 547: </div>
# Line 548: 
# Line 549: <!-- Appointment Modal -->
# It looks like the first set of modals is nested inside the invoice modal or just after it?
# Let's look at line 547. It closes `modal-content` of `invoice-modal`?
# No, line 547 is `</div>`.
# Line 540: `onclick="closeInvoiceModal()">Annuler</button>`
# Line 545: `</form>`
# Line 546: `</div>`
# Line 547: `</div>`
# This closes `invoice-modal`.

# So the first set of duplicate modals starts at line 549.
# It ends at line 740?
# Line 740: `</div>`
# Line 741: `</div>`
# Line 743: `<!-- Appointment Modal -->`
# So lines 549 to 742 are the duplicates.

# Let's remove lines 549 to 742 (indices 548 to 742).
# lines[548:742] will be removed.

new_lines = lines[:548] + lines[742:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed duplicate modals (lines 549-742). New line count: {len(new_lines)}")
