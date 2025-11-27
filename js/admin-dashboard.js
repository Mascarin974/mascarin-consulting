// Admin Dashboard - Mascarin Consulting
// Complete appointment management system

const ADMIN_EMAIL = 'abonnelchristian@hotmail.com';
const ADMIN_PASSWORD = 'Kheter@admin_masca974';

let appointments = [];
let invoices = [];
let clients = [];
let requests = [];
let contacts = [];
let currentView = 'overview';
let currentDate = new Date();
let editingAppointmentId = null;
let editingInvoiceId = null;
let editingClientId = null;
let currentSelectedDate = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  loadAppointments();
  loadInvoices();
  loadClients();
  loadRequests();
  loadContacts();
  setupEventListeners();
  setupRealtimeListeners();

  // Refresh badges periodically to detect changes in localStorage
  badgeInterval = setInterval(() => {
    updateBadges();
  }, 2000); // Update every 2 seconds
});

// Authentication
function checkAuthentication() {
  const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';

  if (isAuthenticated) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
  try {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    updateDashboard();
  } catch (error) {
    console.error('Error showing dashboard:', error);
    alert('Une erreur est survenue lors du chargement du tableau de bord: ' + error.message);
  }
}

// Emergency Reset Function
function resetApp() {
  if (confirm('Attention : Cela va effacer toutes les données locales et vous déconnecter. Voulez-vous continuer ?')) {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }
}

// Event Listeners
function setupEventListeners() {
  console.log('DEBUG: setupEventListeners called');
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.currentTarget.dataset.view;
      switchView(view);
    });
  });

  // Appointment form
  document.getElementById('appointment-form').addEventListener('submit', handleAppointmentSubmit);

  // Calendar controls
  document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
  document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
  document.getElementById('today-btn').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
  });

  // Filters
  document.getElementById('status-filter').addEventListener('change', renderAppointmentsTable);
  document.getElementById('search-appointments').addEventListener('input', renderAppointmentsTable);

  document.getElementById('client-form').addEventListener('submit', handleClientSubmit);

  // Invoice form
  const invoiceForm = document.getElementById('invoice-form');
  if (invoiceForm) {
    invoiceForm.addEventListener('submit', handleInvoiceSubmit);
  }

  // Confirmation Modal
  const confirmBtn = document.getElementById('confirm-action-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmDeletion);
  }
}

// State
// (Moved to top of file)

// Login
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuthenticated', 'true');
    showDashboard();
  } else {
    errorEl.textContent = 'Identifiant ou mot de passe incorrect';
    errorEl.classList.add('show');
  }
}

// Logout
function handleLogout() {
  sessionStorage.removeItem('adminAuthenticated');
  showLogin();
}


// Appointment Form Handler
function handleAppointmentSubmit(e) {
  e.preventDefault();
  console.log('💾 handleAppointmentSubmit called');

  const clientSelect = document.getElementById('client-select');
  let clientName, clientEmail, clientPhone;

  if (clientSelect && clientSelect.value) {
    const selectedOption = clientSelect.options[clientSelect.selectedIndex];
    clientName = selectedOption.text;
    clientEmail = selectedOption.dataset.email || '';
    clientPhone = selectedOption.dataset.phone || '';
  } else {
    // Fallback if manual entry is allowed or for legacy support
    clientName = document.getElementById('client-name') ? document.getElementById('client-name').value : '';
    clientEmail = document.getElementById('client-email') ? document.getElementById('client-email').value : '';
    clientPhone = document.getElementById('client-phone') ? document.getElementById('client-phone').value : '';
  }

  const formData = {
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: clientPhone,
    clientId: clientSelect ? clientSelect.value : null,
    location: document.getElementById('appointment-location') ? document.getElementById('appointment-location').value : '',
    serviceType: document.getElementById('appointment-type').value,
    date: document.getElementById('appointment-date').value,
    time: document.getElementById('appointment-time').value,
    duration: document.getElementById('appointment-duration') ? document.getElementById('appointment-duration').value : '60',
    status: document.getElementById('appointment-status') ? document.getElementById('appointment-status').value : 'pending',
    notes: document.getElementById('appointment-notes').value
  };

  console.log('📝 Form Data:', formData);
  console.log('🆔 Editing ID:', editingAppointmentId);

  if (editingAppointmentId) {
    // Update existing
    const index = appointments.findIndex(a => a.id === editingAppointmentId);
    if (index !== -1) {
      console.log('Updating existing appointment at index:', index);
      appointments[index] = { ...appointments[index], ...formData };
    } else {
      console.error('❌ Could not find appointment to update with ID:', editingAppointmentId);
    }
  } else {
    // Create new
    const newAppointment = {
      id: Date.now().toString(),
      ...formData
    };
    console.log('Creating new appointment:', newAppointment);
    appointments.push(newAppointment);
  }

  saveAppointments();
  updateDashboard();

  document.getElementById('appointment-modal').classList.remove('active');
  document.getElementById('appointment-form').reset();
  editingAppointmentId = null;
}

function showNewAppointmentModal() {
  editingAppointmentId = null;
  document.getElementById('modal-title').textContent = 'Nouveau Rendez-vous';
  document.getElementById('appointment-form').reset();

  // Set default date/time
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().slice(0, 5);

  if (document.getElementById('appointment-date')) document.getElementById('appointment-date').value = dateStr;
  if (document.getElementById('appointment-time')) document.getElementById('appointment-time').value = timeStr;

  document.getElementById('appointment-modal').classList.add('active');
}

function editAppointment(id) {
  console.log('✏️ editAppointment called with ID:', id);
  const apt = appointments.find(a => a.id === id);
  if (!apt) {
    console.error('❌ Appointment not found:', id);
    return;
  }
  console.log('✅ Appointment found:', apt);

  editingAppointmentId = id;
  document.getElementById('modal-title').textContent = 'Modifier le rendez-vous';

  if (typeof updateClientSelect === 'function') {
    updateClientSelect();
  }

  // Debug element existence
  const elements = [
    'client-select', 'appointment-location', 'appointment-type',
    'appointment-date', 'appointment-time', 'appointment-duration',
    'appointment-status', 'appointment-notes', 'appointment-modal'
  ];

  elements.forEach(elId => {
    if (!document.getElementById(elId)) console.warn(`⚠️ Missing element: ${elId}`);
  });

  if (document.getElementById('client-select')) {
    document.getElementById('client-select').value = apt.clientId || '';
  }
  if (document.getElementById('appointment-location')) {
    document.getElementById('appointment-location').value = apt.location || '';
  }
  if (document.getElementById('appointment-type')) {
    document.getElementById('appointment-type').value = apt.serviceType;
  }
  if (document.getElementById('appointment-date')) {
    document.getElementById('appointment-date').value = apt.date;
  }
  if (document.getElementById('appointment-time')) {
    document.getElementById('appointment-time').value = apt.time;
  }
  if (document.getElementById('appointment-duration')) {
    document.getElementById('appointment-duration').value = apt.duration || '60';
  }
  if (document.getElementById('appointment-status')) {
    document.getElementById('appointment-status').value = apt.status;
  }
  if (document.getElementById('appointment-notes')) {
    document.getElementById('appointment-notes').value = apt.notes || '';
  }

  const modal = document.getElementById('appointment-modal');
  if (modal) {
    modal.classList.add('active');
    console.log('✅ Modal opened');
  } else {
    console.error('❌ Modal element not found');
  }
}

// Navigation
function switchView(view) {
  console.log('DEBUG: switchView called for:', view);
  currentView = view;

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === view) {
      item.classList.add('active');
    }
  });

  // Update views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
  });
  document.getElementById(`view-${view}`).classList.add('active');

  // Render view-specific content
  if (view === 'calendar') {
    renderCalendar();
  } else if (view === 'appointments') {
    renderAppointmentsTable();
  } else if (view === 'clients') {
    renderClients();
  } else if (view === 'invoices') {
    renderInvoicesTable();
  } else if (view === 'requests') {
    renderRequests();
  } else if (view === 'contacts') {
    renderContacts();
  }
}

// Update Dashboard
function updateDashboard() {
  updateStats();
  updateBadges();
  renderRecentAppointments();
  if (currentView === 'calendar') renderCalendar();
  if (currentView === 'appointments') renderAppointmentsTable();
  if (currentView === 'clients') renderClients();
  if (currentView === 'contacts') renderContacts();
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const requestsBadge = document.getElementById('requests-badge');
  if (requestsBadge) {
    requestsBadge.textContent = pendingRequests;
    requestsBadge.style.display = pendingRequests > 0 ? 'inline-block' : 'none';
  }

  // Contacts Badge
  let contactsData = [];
  try {
    const saved = localStorage.getItem('mascarinContacts');
    if (saved) {
      contactsData = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error parsing contacts for badges:', e);
    contactsData = [];
  }

  if (!Array.isArray(contactsData)) {
    contactsData = [];
  }

  const unreadContacts = contactsData.filter(c => c.status === 'unread').length;
  const contactsBadge = document.getElementById('contacts-badge');
  if (contactsBadge) {
    contactsBadge.textContent = unreadContacts;
    contactsBadge.style.display = unreadContacts > 0 ? 'inline-block' : 'none';
  }
}

// Stats
function updateStats() {
  const today = new Date().toDateString();
  const stats = {
    total: appointments.length,
    today: appointments.filter(a => new Date(a.date).toDateString() === today).length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-today').textContent = stats.today;
  document.getElementById('stat-pending').textContent = stats.pending;
  document.getElementById('stat-completed').textContent = stats.completed;
}

// Recent Appointments
function renderRecentAppointments() {
  const container = document.getElementById('recent-appointments');
  const recent = appointments
    .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light);">Aucun rendez-vous</p>';
    return;
  }

  container.innerHTML = recent.map(apt => `
    <div class="appointment-item status-${apt.status}">
      <div class="appointment-info">
        <h4>${apt.clientName}</h4>
        <div class="appointment-meta">
          <span>📅 ${formatDate(apt.date)}</span>
          <span>🕒 ${apt.time}</span>
          <span>📞 ${apt.clientPhone || 'N/A'}</span>
        </div>
      </div>
      <div class="appointment-actions">
        <button class="btn-sm btn-edit" onclick="editAppointment('${apt.id}')">✏️ Modifier</button>
        <button class="btn-sm btn-delete" onclick="deleteAppointment('${apt.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

// Calendar
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update month label
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

  // Get calendar data
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay() || 7; // 1 = Monday
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevLastDay.getDate();

  // Build calendar grid
  let html = '<div class="calendar-grid">';

  // Day headers
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  dayNames.forEach(day => {
    html += `<div class="calendar-day-header">${day}</div>`;
  });

  // Previous month days
  for (let i = firstDayOfWeek - 2; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    // Fix: Use local date components to avoid timezone shift from toISOString()
    const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateStr = offsetDate.toISOString().split('T')[0];

    const dayAppointments = appointments.filter(a => a.date === dateStr);
    const isToday = date.toDateString() === today.toDateString();

    let classes = 'calendar-day';
    if (isToday) classes += ' today';
    if (dayAppointments.length > 0) classes += ' has-appointments';

    html += `
      <div class="${classes}" onclick="showDayAppointments('${dateStr}')">
        <div class="calendar-day-number">${day}</div>
        ${dayAppointments.length > 0 ? `<div class="calendar-day-count">${dayAppointments.length} RDV</div>` : ''}
      </div>
    `;
  }

  // Next month days
  const totalCells = firstDayOfWeek - 1 + daysInMonth;
  const remainingCells = 42 - totalCells; // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }

  html += '</div>';
  document.getElementById('calendar-container').innerHTML = html;
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
}

function showDayAppointments(dateStr) {
  currentSelectedDate = dateStr;
  const dayAppointments = appointments.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));

  const date = new Date(dateStr + 'T00:00:00');
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById('day-modal-title').textContent = `Rendez-vous - ${formattedDate}`;

  const listContainer = document.getElementById('day-appointments-list');

  if (dayAppointments.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-light);">
        <p style="font-size: 18px; margin-bottom: 16px;">📅 Aucun rendez-vous prévu ce jour</p>
        <p>Cliquez sur "+ Ajouter un RDV" pour planifier un rendez-vous</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${dayAppointments.map(apt => `
          <div class="appointment-item status-${apt.status}" style="border: 2px solid var(--border); border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <span style="font-size: 24px; font-weight: 700; color: var(--secondary);">${apt.time}</span>
                  <span class="status-badge status-${apt.status}">${getStatusLabel(apt.status)}</span>
                </div>
                <h4 style="font-size: 20px; margin-bottom: 8px;">👤 ${apt.clientName}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; color: var(--text-light); margin-bottom: 12px;">
                  ${apt.clientEmail ? `<div>📧 ${apt.clientEmail}</div>` : ''}
                  ${apt.clientPhone ? `<div>📞 ${apt.clientPhone}</div>` : ''}
                  ${apt.location ? `<div>📍 ${apt.location}</div>` : ''}
                  <div>🕒 Durée: ${apt.duration} min</div>
                  <div>💼 ${apt.serviceType}</div>
                </div>
                ${apt.notes ? `<div style="background: var(--bg-main); padding: 12px; border-radius: 8px; margin-top: 8px;"><strong>Notes:</strong> ${apt.notes}</div>` : ''}
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn-sm btn-edit" onclick="editAppointment('${apt.id}')">✏️ Modifier</button>
                <button class="btn-sm btn-delete" onclick="deleteAppointmentFromDay('${apt.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  document.getElementById('day-modal').classList.add('active');
}

function closeDayModal() {
  document.getElementById('day-modal').classList.remove('active');
  currentSelectedDate = null;
}

function addAppointmentForDay() {
  closeDayModal();
  showNewAppointmentModal();
  if (currentSelectedDate) {
    document.getElementById('appointment-date').value = currentSelectedDate;
  }
}

// Appointments Table
function renderAppointmentsTable() {
  const container = document.getElementById('all-appointments');
  const statusFilter = document.getElementById('status-filter').value;
  const searchTerm = document.getElementById('search-appointments').value.toLowerCase();

  let filtered = appointments;

  if (statusFilter !== 'all') {
    filtered = filtered.filter(a => a.status === statusFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(a =>
      a.clientName.toLowerCase().includes(searchTerm) ||
      a.clientEmail?.toLowerCase().includes(searchTerm) ||
      a.clientPhone?.includes(searchTerm)
    );
  }

  filtered.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

  if (filtered.length === 0) {
    container.innerHTML = '<p style="padding: 32px; text-align: center; color: var(--text-light);">Aucun rendez-vous trouvé</p>';
    return;
  }

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid var(--border); text-align: left;">
          <th style="padding: 16px;">Client</th>
          <th style="padding: 16px;">Contact</th>
          <th style="padding: 16px;">Date & Heure</th>
          <th style="padding: 16px;">Service</th>
          <th style="padding: 16px;">Statut</th>
          <th style="padding: 16px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(apt => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 16px;"><strong>${apt.clientName}</strong></td>
            <td style="padding: 16px;">
              ${apt.clientEmail ? `📧 ${apt.clientEmail}<br>` : ''}
              ${apt.clientPhone ? `📞 ${apt.clientPhone}` : ''}
            </td>
            <td style="padding: 16px;">
              ${formatDate(apt.date)}<br>
              <span style="color: var(--text-light);">${apt.time} (${apt.duration}min)</span>
            </td>
            <td style="padding: 16px;">${apt.serviceType}</td>
            <td style="padding: 16px;">
              <span class="status-badge status-${apt.status}">
                ${getStatusLabel(apt.status)}
              </span>
            </td>
            <td style="padding: 16px;">
              <div style="display: flex; gap: 8px;">
                <button class="btn-sm btn-edit" onclick="editAppointment('${apt.id}')">✏️</button>
                <button class="btn-sm btn-delete" onclick="deleteAppointment('${apt.id}')">🗑️</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function closeAppointmentModal() {
  document.getElementById('appointment-modal').classList.remove('active');
}

// Data Management
function loadAppointments() {
  const saved = localStorage.getItem('mascarinAppointments');
  if (saved) {
    appointments = JSON.parse(saved);
  }
}

function saveAppointments() {
  localStorage.setItem('mascarinAppointments', JSON.stringify(appointments));
}

function exportAppointments() {
  const dataStr = JSON.stringify(appointments, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rendez - vous - ${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAppointments() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        appointments = JSON.parse(event.target.result);
        saveAppointments();
        updateDashboard();
        alert('Données importées avec succès !');
      } catch (error) {
        alert('Erreur lors de l\'importation');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearAllData() {
  if (!confirm('⚠️ ATTENTION: Cela supprimera TOUS vos rendez-vous. Êtes-vous sûr ?')) return;

  appointments = [];
  saveAppointments();
  updateDashboard();
  alert('Toutes les données ont été effacées');
}

// Utility Functions
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
}

// Confirmation Modal Logic
let pendingDeletionId = null;
let pendingDeletionType = null; // 'dashboard' or 'day'

function showConfirmationModal(id, type = 'dashboard') {
  pendingDeletionId = id;
  pendingDeletionType = type;
  document.getElementById('confirmation-modal').classList.add('active');
}

function closeConfirmationModal() {
  document.getElementById('confirmation-modal').classList.remove('active');
  pendingDeletionId = null;
  pendingDeletionType = null;
}

function confirmDeletion() {
  if (!pendingDeletionId) return;

  if (pendingDeletionType === 'dashboard') {
    performDeletion(pendingDeletionId);
  } else if (pendingDeletionType === 'day') {
    performDayDeletion(pendingDeletionId);
  } else if (pendingDeletionType === 'contact') {
    performContactDeletion(pendingDeletionId);
  }

  closeConfirmationModal();
}

function deleteAppointment(id) {
  showConfirmationModal(id, 'dashboard');
}

function deleteAppointmentFromDay(id) {
  showConfirmationModal(id, 'day');
}

function performDeletion(id) {
  try {
    console.log('--------------------------------------------------');
    console.log('PERFORMING DELETION FOR ID:', id);

    const initialLength = appointments.length;
    appointments = appointments.filter(a => a.id != id);
    const newLength = appointments.length;

    if (initialLength === newLength) {
      console.error('❌ DELETE FAILED: No appointment found with that ID.');
      alert('Erreur: Impossible de trouver le rendez-vous à supprimer.');
    } else {
      console.log('✅ DELETE SUCCESSFUL');
      saveAppointments();
      updateDashboard();
    }

    if (currentView === 'calendar') {
      renderCalendar();
    }
  } catch (error) {
    console.error('Error in performDeletion:', error);
    alert('Une erreur est survenue: ' + error.message);
  }
}

function performDayDeletion(id) {
  try {
    appointments = appointments.filter(a => a.id != id);
    saveAppointments();
    updateDashboard();
    if (currentSelectedDate) {
      showDayAppointments(currentSelectedDate);
    }
  } catch (error) {
    console.error('Error in performDayDeletion:', error);
  }
}

// Window Assignments
window.editAppointment = editAppointment;
window.deleteAppointment = deleteAppointment;
window.exportAppointments = exportAppointments;
window.importAppointments = importAppointments;
window.clearAllData = clearAllData;
window.showDayAppointments = showDayAppointments;
window.closeDayModal = closeDayModal;
window.addAppointmentForDay = addAppointmentForDay;
window.deleteAppointmentFromDay = deleteAppointmentFromDay;
window.closeConfirmationModal = closeConfirmationModal;
window.showNewAppointmentModal = showNewAppointmentModal;

// Debug: Log loaded functions
console.log('Admin Dashboard Script Loaded');
console.log('Exposed functions:', {
  deleteAppointment: typeof window.deleteAppointment,
  editAppointment: typeof window.editAppointment,
  handleAppointmentSubmit: typeof handleAppointmentSubmit
});

// ==========================================
// INVOICE & QUOTE MANAGEMENT
// ==========================================

function loadInvoices() {
  const saved = localStorage.getItem('mascarinInvoices');
  if (saved) {
    invoices = JSON.parse(saved);
  }
}

function saveInvoices() {
  localStorage.setItem('mascarinInvoices', JSON.stringify(invoices));
}

function renderInvoicesTable() {
  const container = document.getElementById('invoices-list');
  const typeFilter = document.getElementById('invoice-type-filter').value;
  const searchTerm = document.getElementById('search-invoices').value.toLowerCase();

  let filtered = invoices;

  if (typeFilter !== 'all') {
    filtered = filtered.filter(i => i.type === typeFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(i =>
      i.clientName.toLowerCase().includes(searchTerm) ||
      i.number.toLowerCase().includes(searchTerm)
    );
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = '<p style="padding: 32px; text-align: center; color: var(--text-light);">Aucun document trouvé</p>';
    return;
  }

  container.innerHTML = `
    <table style = "width: 100%; border-collapse: collapse;" >
      <thead>
        <tr style="border-bottom: 2px solid var(--border); text-align: left;">
          <th style="padding: 16px;">Numéro</th>
          <th style="padding: 16px;">Client</th>
          <th style="padding: 16px;">Date</th>
          <th style="padding: 16px;">Montant</th>
          <th style="padding: 16px;">Statut</th>
          <th style="padding: 16px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(inv => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 16px;">
              <strong>${inv.number}</strong><br>
              <span style="font-size: 0.8em; color: var(--text-light);">${inv.type === 'invoice' ? 'Facture' : 'Devis'}</span>
            </td>
            <td style="padding: 16px;">${inv.clientName}</td>
            <td style="padding: 16px;">${formatDate(inv.date)}</td>
            <td style="padding: 16px;"><strong>${parseFloat(inv.total).toFixed(2)} €</strong></td>
            <td style="padding: 16px;">
              <span class="status-badge status-${inv.status}">
                ${getInvoiceStatusLabel(inv.status)}
              </span>
            </td>
            <td style="padding: 16px;">
              <div style="display: flex; gap: 8px;">
                <button class="btn-sm btn-edit" onclick="editInvoice('${inv.id}')">✏️</button>
                <button class="btn-sm btn-delete" onclick="deleteInvoice('${inv.id}')">🗑️</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table >
    `;
}

function getInvoiceStatusLabel(status) {
  const labels = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    paid: 'Payé / Signé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
}

// Modal & Editing
function showNewInvoiceModal() {
  editingInvoiceId = null;
  document.getElementById('invoice-modal-title').textContent = 'Nouveau Document';
  document.getElementById('invoice-form').reset();
  document.getElementById('invoice-items-list').innerHTML = '';

  // Set default dates
  document.getElementById('invoice-date').valueAsDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  document.getElementById('invoice-due-date').valueAsDate = dueDate;

  updateInvoiceNumberPrefix();
  addInvoiceItem(); // Add one empty line
  calculateInvoiceTotal();

  if (typeof updateInvoiceClientSelect === 'function') {
    updateInvoiceClientSelect();
  }

  document.getElementById('invoice-modal').classList.add('active');
}

function closeInvoiceModal() {
  document.getElementById('invoice-modal').classList.remove('active');
}

function updateInvoiceNumberPrefix() {
  if (editingInvoiceId) return; // Don't change number if editing

  const type = document.getElementById('invoice-type').value;
  const prefix = type === 'invoice' ? 'FAC' : 'DEV';
  const date = new Date();

  // Format: DDMMYYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}${month}${year}`; // ex: 25112025

  // Find last number for this date and type
  const existingDocs = invoices.filter(i =>
    i.type === type &&
    i.number.startsWith(`${prefix}-${dateStr}-`)
  );

  let nextSeq = 1;
  if (existingDocs.length > 0) {
    const maxSeq = Math.max(...existingDocs.map(i => {
      const parts = i.number.split('-');
      return parseInt(parts[2]) || 0;
    }));
    nextSeq = maxSeq + 1;
  }

  const sequence = nextSeq.toString().padStart(3, '0');
  document.getElementById('invoice-number').value = `${prefix}-${dateStr}-${sequence}`;
}

function addInvoiceItem(item = null) {
  const tbody = document.getElementById('invoice-items-list');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style = "padding: 8px;" ><input type="text" class="item-desc" placeholder="Description" value="${item ? item.description : ''}" required style="width: 100%;"></td>
    <td style="padding: 8px;"><input type="number" class="item-qty" value="${item ? item.quantity : 1}" min="1" required style="width: 100%;" onchange="calculateInvoiceTotal()"></td>
    <td style="padding: 8px;"><input type="number" class="item-price" value="${item ? item.price : 0}" min="0" step="0.01" required style="width: 100%;" onchange="calculateInvoiceTotal()"></td>
    <td style="padding: 8px;"><span class="item-total">0.00 €</span></td>
    <td style="padding: 8px; text-align: center;"><button type="button" class="btn-sm btn-delete" onclick="this.closest('tr').remove(); calculateInvoiceTotal()">×</button></td>
  `;
  tbody.appendChild(tr);
  calculateInvoiceTotal();
}

function calculateInvoiceTotal() {
  const rows = document.querySelectorAll('#invoice-items-list tr');
  let subtotal = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;
    row.querySelector('.item-total').textContent = total.toFixed(2) + ' €';
    subtotal += total;
  });

  const tvaRate = 0.085;
  const tvaAmount = subtotal * tvaRate;
  const totalTTC = subtotal + tvaAmount;

  document.getElementById('invoice-subtotal').textContent = subtotal.toFixed(2) + ' €';

  const tvaEl = document.getElementById('invoice-tva');
  if (tvaEl) {
    tvaEl.textContent = tvaAmount.toFixed(2) + ' €';
  }

  document.getElementById('invoice-total').textContent = totalTTC.toFixed(2) + ' €';
}

function handleInvoiceSubmit(e) {
  e.preventDefault();

  const items = [];
  document.querySelectorAll('#invoice-items-list tr').forEach(row => {
    items.push({
      description: row.querySelector('.item-desc').value,
      quantity: parseFloat(row.querySelector('.item-qty').value),
      price: parseFloat(row.querySelector('.item-price').value)
    });
  });

  const formData = {
    type: document.getElementById('invoice-type').value,
    number: document.getElementById('invoice-number').value,
    status: document.getElementById('invoice-status').value,
    clientName: document.getElementById('invoice-client-select').options[document.getElementById('invoice-client-select').selectedIndex].text,
    clientId: document.getElementById('invoice-client-select').value,
    clientEmail: document.getElementById('invoice-client-email').value,
    date: document.getElementById('invoice-date').value,
    dueDate: document.getElementById('invoice-due-date').value,
    items: items,
    total: parseFloat(document.getElementById('invoice-total').textContent)
  };

  if (editingInvoiceId) {
    const index = invoices.findIndex(i => i.id === editingInvoiceId);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...formData };
    }
  } else {
    const newInvoice = {
      id: 'inv_' + Date.now(),
      ...formData
    };
    invoices.push(newInvoice);
  }

  saveInvoices();
  renderInvoicesTable();
  closeInvoiceModal();
}

function editInvoice(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  editingInvoiceId = id;
  document.getElementById('invoice-modal-title').textContent = 'Modifier Document';

  document.getElementById('invoice-type').value = inv.type;
  document.getElementById('invoice-number').value = inv.number;
  document.getElementById('invoice-status').value = inv.status;
  document.getElementById('invoice-status').value = inv.status;

  if (typeof updateInvoiceClientSelect === 'function') {
    updateInvoiceClientSelect();
  }

  if (document.getElementById('invoice-client-select')) {
    document.getElementById('invoice-client-select').value = inv.clientId || '';
    // If client ID is missing (legacy data), try to match by name or keep empty
    if (!inv.clientId && inv.clientName) {
      // Optional: logic to find client by name could go here
    }
  }

  document.getElementById('invoice-client-email').value = inv.clientEmail || '';
  document.getElementById('invoice-date').value = inv.date;
  document.getElementById('invoice-due-date').value = inv.dueDate;

  const tbody = document.getElementById('invoice-items-list');
  tbody.innerHTML = '';
  inv.items.forEach(item => addInvoiceItem(item));
  calculateInvoiceTotal();

  document.getElementById('invoice-modal').classList.add('active');
}

function updateInvoiceClientSelect() {
  const select = document.getElementById('invoice-client-select');
  if (!select) return;

  const currentValue = select.value;

  select.innerHTML = '<option value="">Sélectionner un client...</option>' +
    clients.map(c => `<option value="${c.id}" data-email="${c.email || ''}">${c.name}</option>`).join('');

  if (currentValue) {
    select.value = currentValue;
  }
}

function handleInvoiceClientChange() {
  const select = document.getElementById('invoice-client-select');
  const emailInput = document.getElementById('invoice-client-email');

  if (select && select.selectedIndex > 0) {
    const option = select.options[select.selectedIndex];
    if (emailInput) emailInput.value = option.dataset.email || '';
  } else {
    if (emailInput) emailInput.value = '';
  }
}

// Expose new functions
window.updateInvoiceClientSelect = updateInvoiceClientSelect;
window.handleInvoiceClientChange = handleInvoiceClientChange;

function deleteInvoice(id) {
  if (!confirm('Supprimer ce document ?')) return;
  invoices = invoices.filter(i => i.id !== id);
  saveInvoices();
  renderInvoicesTable();
}

// Expose functions
window.showNewInvoiceModal = showNewInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.addInvoiceItem = addInvoiceItem;
window.editInvoice = editInvoice;
window.deleteInvoice = deleteInvoice;
window.updateInvoiceNumberPrefix = updateInvoiceNumberPrefix;
window.calculateInvoiceTotal = calculateInvoiceTotal;
window.closeAppointmentModal = closeAppointmentModal;

// ==========================================
// CLIENT MANAGEMENT
// ==========================================

function loadClients() {
  const saved = localStorage.getItem('mascarinClients');
  if (saved) {
    clients = JSON.parse(saved);
  }
}

function saveClients() {
  localStorage.setItem('mascarinClients', JSON.stringify(clients));
}

function renderClients() {
  const container = document.getElementById('clients-list');

  if (!container) return;

  if (clients.length === 0) {
    container.innerHTML = '<p style="padding: 32px; text-align: center; color: var(--text-light);">Aucun client. Cliquez sur "+ Nouveau Client" pour en ajouter un.</p>';
    return;
  }

  container.innerHTML = clients.map(client => `
    <div class="client-card" >
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <h4>${client.name}</h4>
        <div style="display: flex; gap: 8px;">
          <button class="btn-sm btn-edit" onclick="editClient('${client.id}')">✏️</button>
          <button class="btn-sm btn-delete" onclick="deleteClient('${client.id}')">🗑️</button>
        </div>
      </div>
      <div class="client-info">
        ${client.email ? `<div>📧 ${client.email}</div>` : ''}
        ${client.phone ? `<div>📞 ${client.phone}</div>` : ''}
        ${client.address ? `<div>📍 ${client.address}</div>` : ''}
      </div>
      ${client.notes ? `<div style="margin-top: 12px; padding: 12px; background: var(--bg-main); border-radius: 8px; font-size: 0.9em;"><strong>Notes:</strong> ${client.notes}</div>` : ''}
    </div >
    `).join('');

  // Also update the select dropdown in appointment modal
  updateClientSelect();
}

function updateClientSelect() {
  const select = document.getElementById('client-select');
  if (!select) return;

  const currentValue = select.value;

  select.innerHTML = '<option value="">Sélectionner un client...</option>' +
    clients.map(c => `<option value="${c.id}" data-email="${c.email || ''}" data-phone="${c.phone || ''}">${c.name}</option>`).join('');

  if (currentValue) {
    select.value = currentValue;
  }
}

function showNewClientModal() {
  editingClientId = null;
  document.getElementById('client-modal-title').textContent = 'Nouveau Client';
  document.getElementById('client-form').reset();
  document.getElementById('client-modal').classList.add('active');
}

function closeClientModal() {
  document.getElementById('client-modal').classList.remove('active');
}

function handleClientSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('client-form-name').value,
    email: document.getElementById('client-form-email').value,
    phone: document.getElementById('client-form-phone').value,
    address: document.getElementById('client-form-address').value,
    notes: document.getElementById('client-form-notes').value
  };

  if (editingClientId) {
    const index = clients.findIndex(c => c.id === editingClientId);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...formData };
    }
  } else {
    const newClient = {
      id: 'client_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...formData
    };
    clients.push(newClient);
  }

  saveClients();
  renderClients();
  closeClientModal();
}

function editClient(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;

  editingClientId = id;
  document.getElementById('client-modal-title').textContent = 'Modifier Client';

  document.getElementById('client-form-name').value = client.name;
  document.getElementById('client-form-email').value = client.email || '';
  document.getElementById('client-form-phone').value = client.phone || '';
  document.getElementById('client-form-address').value = client.address || '';
  document.getElementById('client-form-notes').value = client.notes || '';

  document.getElementById('client-modal').classList.add('active');
}

function deleteClient(id) {
  if (!confirm('Supprimer ce client ? Cette action est irréversible.')) return;
  clients = clients.filter(c => c.id !== id);
  saveClients();
  renderClients();
}

// Expose client functions
window.showNewClientModal = showNewClientModal;
window.closeClientModal = closeClientModal;
window.editClient = editClient;
window.deleteClient = deleteClient;

// ==========================================
// REQUESTS MANAGEMENT (Demandes de RDV)
// ==========================================

function loadRequests() {
  const saved = localStorage.getItem('mascarinRequests');
  if (saved) {
    requests = JSON.parse(saved);
  }
}

function saveRequests() {
  localStorage.setItem('mascarinRequests', JSON.stringify(requests));
}

function loadContacts() {
  const saved = localStorage.getItem('mascarinContacts');
  if (saved) {
    contacts = JSON.parse(saved);
  }

  if (currentView === 'contacts') {
    renderContacts();
  }
}

function saveContacts() {
  localStorage.setItem('mascarinContacts', JSON.stringify(contacts));
}

function renderRequests() {
  const container = document.getElementById('requests-list');
  if (!container) return;

  if (requests.length === 0) {
    container.innerHTML = '<p style="padding: 32px; text-align: center; color: var(--text-light);">Aucune demande de rendez-vous en attente.</p>';
    return;
  }

  container.innerHTML = requests.map(req => `
    <div class="appointment-item status-pending" >
      <div class="appointment-info">
        <h4>${req.clientName}</h4>
        <div class="appointment-meta">
          <span>📅 ${req.preferredDate}</span>
          <span>🕒 ${req.preferredTime}</span>
          <span>📞 ${req.clientPhone || 'Non renseigné'}</span>
        </div>
        <div style="margin-top: 8px; font-size: 0.9em;">
            <div>📧 ${req.clientEmail}</div>
            <div>💼 ${req.serviceType}</div>
            ${req.message ? `<div>💬 "${req.message}"</div>` : ''}
        </div>
      </div>
      <div class="appointment-actions">
        <button class="btn-sm btn-primary" onclick="validateRequest('${req.id}')">✅ Valider</button>
        <button class="btn-sm btn-delete" onclick="rejectRequest('${req.id}')">❌ Refuser</button>
      </div>
    </div >
    `).join('');
}

function validateRequest(id) {
  const req = requests.find(r => r.id === id);
  if (!req) return;

  // Create new appointment from request
  const newAppointment = {
    id: Date.now().toString(),
    clientName: req.clientName,
    clientEmail: req.clientEmail,
    clientPhone: req.clientPhone,
    serviceType: req.serviceType,
    date: req.preferredDate,
    time: req.preferredTime,
    duration: "60", // Default duration
    status: "confirmed",
    location: "À définir",
    notes: req.message || "Validé depuis les demandes en ligne"
  };

  appointments.push(newAppointment);
  saveAppointments();

  // Remove from requests
  requests = requests.filter(r => r.id !== id);
  saveRequests();

  updateDashboard();
  alert('✅ Rendez-vous validé et ajouté au calendrier !');
}

function rejectRequest(id) {
  if (!confirm('Refuser cette demande de rendez-vous ?')) return;
  requests = requests.filter(r => r.id !== id);
  saveRequests();
  renderRequests();
}

function renderContacts() {
  console.log('DEBUG: renderContacts called. Contacts count:', contacts.length);
  const container = document.getElementById('contacts-list');
  if (!container) {
    console.error('DEBUG: contacts-list container NOT FOUND');
    return;
  }

  if (contacts.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="padding: 32px; text-align: center; color: var(--text-light);">Aucun message.</td></tr>';
    return;
  }

  container.innerHTML = contacts.map(contact => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 16px;">${new Date(contact.date).toLocaleDateString()}</td>
      <td style="padding: 16px;"><strong>${contact.name}</strong></td>
      <td style="padding: 16px;">${contact.email}</td>
      <td style="padding: 16px;">${contact.subject || 'Pas de sujet'}</td>
      <td style="padding: 16px;">
        <span class="status-badge status-${contact.status}">${contact.status === 'unread' ? 'Non lu' : 'Lu'}</span>
      </td>
      <td style="padding: 16px;">
        <div style="display: flex; gap: 8px;">
           <a href="mailto:${contact.email}" class="btn-sm btn-secondary">↩️</a>
           <button class="btn-sm btn-delete" onclick="deleteContact('${contact.id}')">🗑️</button>
        </div>
      </td>
    </tr>
    ${contact.message ? `
    <tr style="background-color: var(--bg-main);">
        <td colspan="6" style="padding: 12px 16px; font-style: italic; color: var(--text-light); border-bottom: 1px solid var(--border);">
            "${contact.message}"
        </td>
    </tr>
    ` : ''}
  `).join('');
}

function deleteContact(id) {
  showConfirmationModal(id, 'contact');
}

function performContactDeletion(id) {
  console.log('DEBUG: performContactDeletion called for id:', id);
  const initialCount = contacts.length;
  contacts = contacts.filter(c => c.id !== id);
  console.log(`DEBUG: Deleted. Count: ${initialCount} -> ${contacts.length}`);

  saveContacts();
  renderContacts();

  console.log('DEBUG: Calling updateBadges()...');
  updateBadges();
}

// ==========================================
// BACKUP SYSTEM
// ==========================================

function createBackup() {
  const backupData = {
    timestamp: new Date().toISOString(),
    version: "1.0",
    data: {
      appointments: appointments,
      requests: requests,
      contacts: contacts,
      clients: clients,
      invoices: invoices
    }
  };

  const dataStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `mascarin_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Update last backup info
  const infoEl = document.getElementById('last-backup-info');
  if (infoEl) {
    infoEl.textContent = `Dernière sauvegarde: ${new Date().toLocaleString()} `;
  }
}

function toggleAutoBackup() {
  const btn = document.getElementById('auto-backup-toggle');
  const status = document.getElementById('auto-backup-status');

  let isAuto = localStorage.getItem('mascarinAutoBackup') === 'true';

  if (isAuto) {
    localStorage.setItem('mascarinAutoBackup', 'false');
    btn.textContent = 'Activer la sauvegarde auto';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    status.textContent = 'Sauvegarde automatique désactivée';
  } else {
    localStorage.setItem('mascarinAutoBackup', 'true');
    btn.textContent = 'Désactiver la sauvegarde auto';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    status.textContent = '✅ Active (toutes les heures)';
    createBackup(); // Immediate backup
  }
}

// Initialize Auto Backup Check
if (localStorage.getItem('mascarinAutoBackup') === 'true') {
  setInterval(() => {
    console.log('Performing auto-backup...');
    createBackup();
  }, 3600000); // 1 hour
}

// Expose new functions
window.validateRequest = validateRequest;
window.rejectRequest = rejectRequest;
window.deleteContact = deleteContact;
window.createBackup = createBackup;
window.toggleAutoBackup = toggleAutoBackup;

// Initial Load for new modules
loadRequests();
loadContacts();

// ==========================================
// REAL-TIME NOTIFICATIONS
// ==========================================

function setupRealtimeListeners() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'mascarinRequests') {
      // Reload requests
      loadRequests();

      // If we are on the requests view, re-render
      if (currentView === 'requests') {
        renderRequests();
      }

      // Update stats
      updateStats();

      // Show notification
      const newRequests = JSON.parse(e.newValue || '[]');
      const oldRequests = JSON.parse(e.oldValue || '[]');

      if (newRequests.length > oldRequests.length) {
        showNotification('📅 Nouvelle demande de rendez-vous reçue !', 'info');
      }
    }

    if (e.key === 'mascarinContacts') {
      // Reload contacts
      loadContacts();

      // If we are on the contacts view, re-render
      if (currentView === 'contacts') {
        renderContacts();
      }

      // Show notification
      const newContacts = JSON.parse(e.newValue || '[]');
      const oldContacts = JSON.parse(e.oldValue || '[]');

      if (newContacts.length > oldContacts.length) {
        showNotification('📧 Nouveau message de contact reçu !', 'info');
      }
    }
  });
}

function showNotification(message, type = 'info') {
  // Create toast element if it doesn't exist
  let toast = document.getElementById('notification-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notification-toast';
    toast.className = 'notification-toast';
    document.body.appendChild(toast);
  }

  // Set content and type
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  toast.className = `notification-toast type-${type}`;
  toast.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${message}</span>
  `;

  // Show
  setTimeout(() => toast.classList.add('active'), 10);

  // Hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('active');
  }, 5000);
}

// Debug Function
window.debugBadges = function () {
  const saved = localStorage.getItem('mascarinContacts');
  let count = 0;
  let parsed = [];

  try {
    parsed = JSON.parse(saved || '[]');
    count = parsed.filter(c => c.status === 'unread').length;
  } catch (e) {
    console.error('DEBUG: Parse error', e);
  }

  const badge = document.getElementById('contacts-badge');

  const msg = `État actuel :
- LocalStorage : ${saved ? 'Données présentes' : 'VIDE'}
- Messages total : ${parsed.length}
- Non-lus : ${count}
- Badge visible : ${badge && badge.style.display !== 'none' ? 'OUI' : 'NON'}

Voulez-vous injecter un MESSAGE DE TEST pour vérifier le compteur ?`;

  if (confirm(msg)) {
    const testMsg = {
      id: 'debug_' + Date.now(),
      name: 'Debug User',
      email: 'debug@test.com',
      message: 'Ceci est un message de test injecté.',
      status: 'unread',
      date: new Date().toISOString()
    };

    const newData = [...parsed, testMsg];
    localStorage.setItem('mascarinContacts', JSON.stringify(newData));

    // Force reload and render
    console.log('DEBUG: Injecting message and reloading...');
    loadContacts();
    updateBadges();

    if (currentView === 'contacts') {
      renderContacts();
    } else {
      switchView('contacts');
    }

    alert('Message injecté ! Le badge devrait afficher ' + (count + 1));
  }

  if (confirm("Voulez-vous stopper le rafraîchissement automatique (pour que le badge ne disparaisse pas) ?")) {
    if (window.badgeInterval) clearInterval(window.badgeInterval);
    alert("Rafraîchissement stoppé.");
  }
};

function updateBadges() {
  // Requests Badge
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const requestsBadge = document.getElementById('requests-badge');
  if (requestsBadge) {
    requestsBadge.textContent = pendingRequests;
    requestsBadge.style.display = pendingRequests > 0 ? 'inline-block' : 'none';
  }

  // Contacts Badge
  let contactsData = [];
  try {
    const saved = localStorage.getItem('mascarinContacts');
    if (saved) {
      contactsData = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error parsing contacts for badges:', e);
    contactsData = [];
  }

  if (!Array.isArray(contactsData)) {
    contactsData = [];
  }

  const unreadContacts = contactsData.filter(c => c.status === 'unread').length;
  const contactsBadge = document.getElementById('contacts-badge');
  if (contactsBadge) {
    contactsBadge.textContent = unreadContacts;
    contactsBadge.style.display = unreadContacts > 0 ? 'inline-block' : 'none';
  }
}


// Contact Management Functions

function renderContacts() {
  const container = document.getElementById('contacts-list');
  if (!container) {
    return;
  }

  const statusFilter = document.getElementById('contact-status-filter') ? document.getElementById('contact-status-filter').value : 'all';

  let filteredContacts = contacts.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (statusFilter !== 'all') {
    filteredContacts = filteredContacts.filter(c => c.status === statusFilter);
  }

  if (filteredContacts.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-light);">Aucun message.</td></tr>';
    return;
  }

  container.innerHTML = filteredContacts.map(contact => `
    <tr class="contact-item ${contact.status === 'unread' ? 'unread' : ''}" style="${contact.status === 'unread' ? 'font-weight: bold; background-color: rgba(var(--primary-rgb), 0.05);' : ''}">
      <td style="padding: 16px;">${new Date(contact.date).toLocaleDateString('fr-FR')} ${new Date(contact.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
      <td style="padding: 16px;">${contact.name}</td>
      <td style="padding: 16px;">${contact.email}</td>
      <td style="padding: 16px;">
        <span class="status-badge status-${contact.status}" style="padding: 4px 8px; border-radius: 12px; font-size: 0.85em; background: ${getStatusColor(contact.status)}; color: white;">
          ${getStatusLabel(contact.status)}
        </span>
      </td>
      <td style="padding: 16px;">
        <button class="btn-icon" onclick="viewContact('${contact.id}')" title="Voir" style="background:none; border:none; cursor:pointer; font-size:1.2em;">👁️</button>
        <button class="btn-icon" onclick="toggleArchiveContact('${contact.id}')" title="${contact.status === 'archived' ? 'Désarchiver' : 'Archiver'}" style="background:none; border:none; cursor:pointer; font-size:1.2em;">${contact.status === 'archived' ? '📂' : '📦'}</button>
        <button class="btn-icon delete-btn" onclick="deleteContact('${contact.id}')" title="Supprimer" style="background:none; border:none; cursor:pointer; font-size:1.2em;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filterContacts() {
  renderContacts();
}

function getStatusColor(status) {
  switch (status) {
    case 'unread': return '#3b82f6'; // Blue
    case 'read': return '#10b981'; // Green
    case 'archived': return '#6b7280'; // Gray
    default: return '#9ca3af';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'unread': return 'Non lu';
    case 'read': return 'Lu';
    case 'archived': return 'Archivé';
    default: return status;
  }
}

function viewContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  // Mark as read if unread
  if (contact.status === 'unread') {
    contact.status = 'read';
    saveContacts();
    updateBadges();
    renderContacts();
  }

  const modalHtml = `
    <div id="contact-view-modal" class="modal" style="display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000;">
      <div class="modal-content" style="background: white; padding: 0; border-radius: 8px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div class="modal-header" style="padding: 16px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0;">Message de ${contact.name}</h3>
          <button class="modal-close" onclick="document.getElementById('contact-view-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="padding: 24px;">
          <div style="margin-bottom: 16px;">
            <strong>De:</strong> ${contact.name} (${contact.email})<br>
            <strong>Date:</strong> ${new Date(contact.date).toLocaleString('fr-FR')}<br>
            <strong>Sujet:</strong> ${contact.subject}
          </div>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap; margin-bottom: 24px;">${contact.message}</div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn-secondary" onclick="document.getElementById('contact-view-modal').remove()" style="padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer;">Fermer</button>
            <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" class="btn-primary" style="padding: 8px 16px; border-radius: 6px; background: #2563eb; color: white; text-decoration:none; display:inline-block;">Répondre</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function toggleArchiveContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    contact.status = contact.status === 'archived' ? 'read' : 'archived';
    saveContacts();
    renderContacts();
  }
}

function deleteContact(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    updateBadges();
    renderContacts();
  }
}
