// Admin Dashboard - Mascarin Consulting
// Complete appointment management system

const ADMIN_EMAIL = 'abonnelchristian@hotmail.com';
// Password is now hashed for security

let appointments = [];
let invoices = [];
let clients = [];
let requests = [];
let contacts = [];
let currentView = 'overview';
let currentDate = new Date();
// Global Click Logger for Debugging
document.addEventListener('click', (e) => {
  console.log('🖱️ Clicked:', e.target);
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
    console.log('🔘 Button clicked:', e.target.innerText || e.target.closest('button').innerText);
  }
});

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
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.currentTarget.dataset.view;
      switchView(view);
    });
  });

  // Appointment form
  const aptForm = document.getElementById('appointment-form');
  if (aptForm) aptForm.addEventListener('submit', handleAppointmentSubmit);

  // Calendar controls
  const prevMonthBtn = document.getElementById('prev-month');
  if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => changeMonth(-1));

  const nextMonthBtn = document.getElementById('next-month');
  if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => changeMonth(1));

  const todayBtn = document.getElementById('today-btn');
  if (todayBtn) todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
  });

  // Filters
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) statusFilter.addEventListener('change', renderAppointmentsTable);

  const searchApt = document.getElementById('search-appointments');
  if (searchApt) searchApt.addEventListener('input', renderAppointmentsTable);

  const clientForm = document.getElementById('client-form');
  if (clientForm) clientForm.addEventListener('submit', handleClientSubmit);

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

// Login
const ADMIN_PASSWORD_HASH = '0619dbd08e7602f359110ab9aedcf57675f8c7623e0343fc9303fcb8a4ac3309';

// ... (existing code)

// Login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  // Hash the input password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (email === ADMIN_EMAIL && hashHex === ADMIN_PASSWORD_HASH) {
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


// handleAppointmentSubmit removed (duplicate)

// showNewAppointmentModal removed (duplicate)

// editAppointment removed (duplicate)

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
  const viewEl = document.getElementById(`view-${view}`);
  if (viewEl) viewEl.classList.add('active');

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

// closeAppointmentModal removed (duplicate)

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
  a.download = `rendez-vous-${new Date().toISOString().split('T')[0]}.json`;
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

// APPOINTMENT MODAL & ACTIONS
function showNewAppointmentModal() {
  console.log('🚀 showNewAppointmentModal called (Version 2)');
  editingAppointmentId = null;
  document.getElementById('modal-title').textContent = 'Nouveau Rendez-vous';
  document.getElementById('appointment-form').reset();

  // Set default date/time
  document.getElementById('appointment-date').valueAsDate = new Date();
  document.getElementById('appointment-time').value = '09:00';

  updateClientSelect();
  document.getElementById('appointment-modal').classList.add('active');
}

function closeAppointmentModal() {
  document.getElementById('appointment-modal').classList.remove('active');
}

function handleAppointmentSubmit(e) {
  e.preventDefault();
  console.log('💾 handleAppointmentSubmit called (Version 2)');

  const clientSelect = document.getElementById('client-select');
  let clientId = clientSelect.value;
  let clientName = '';
  let clientEmail = '';
  let clientPhone = '';

  // Handle new client creation on the fly
  if (!clientId) {
    clientName = document.getElementById('client-name').value;
    clientEmail = document.getElementById('client-email').value;
    clientPhone = document.getElementById('client-phone').value;

    if (clientName) {
      const newClient = {
        id: Date.now().toString(),
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        createdAt: new Date().toISOString()
      };
      clients.push(newClient);
      saveClients();
      clientId = newClient.id;
    }
  } else {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      clientName = client.name;
      clientEmail = client.email;
      clientPhone = client.phone;
    }
  }

  const formData = {
    clientId: clientId,
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: clientPhone,
    location: document.getElementById('appointment-location').value,
    serviceType: document.getElementById('appointment-type').value,
    duration: parseInt(document.getElementById('appointment-duration').value),
    date: document.getElementById('appointment-date').value,
    time: document.getElementById('appointment-time').value,
    status: document.getElementById('appointment-status').value,
    notes: document.getElementById('appointment-notes').value
  };

  if (editingAppointmentId) {
    const index = appointments.findIndex(a => a.id === editingAppointmentId);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...formData };
    }
  } else {
    appointments.push({
      id: Date.now().toString(),
      ...formData
    });
  }

  saveAppointments();
  updateDashboard();
  closeAppointmentModal();

  if (currentView === 'calendar') {
    renderCalendar();
  }
}

function editAppointment(id) {
  console.log('✏️ editAppointment called (Version 2) with ID:', id);
  const apt = appointments.find(a => a.id === id);
  if (!apt) return;

  editingAppointmentId = id;
  document.getElementById('modal-title').textContent = 'Modifier Rendez-vous';

  updateClientSelect();
  document.getElementById('client-select').value = apt.clientId || '';

  // Fill other fields
  document.getElementById('client-name').value = apt.clientName || '';
  document.getElementById('client-email').value = apt.clientEmail || '';
  document.getElementById('client-phone').value = apt.clientPhone || '';
  document.getElementById('appointment-location').value = apt.location || '';
  document.getElementById('appointment-type').value = apt.serviceType;
  document.getElementById('appointment-duration').value = apt.duration;
  document.getElementById('appointment-date').value = apt.date;
  document.getElementById('appointment-time').value = apt.time;
  document.getElementById('appointment-status').value = apt.status;
  document.getElementById('appointment-notes').value = apt.notes || '';

  document.getElementById('appointment-modal').classList.add('active');
}

// CLIENTS MANAGEMENT
function loadClients() {
  try {
    const saved = localStorage.getItem('mascarinClients');
    if (saved) {
      clients = JSON.parse(saved);
    }
    if (!Array.isArray(clients)) clients = [];
  } catch (e) {
    console.error('Error loading clients:', e);
    clients = [];
  }
}

function saveClients() {
  try {
    localStorage.setItem('mascarinClients', JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients:', e);
    alert('Erreur lors de la sauvegarde des clients (Quota dépassé ?)');
  }
}

function renderClients() {
  try {
    const container = document.getElementById('clients-list');
    if (!container) return;

    const searchInput = document.getElementById('search-clients');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    let filtered = Array.isArray(clients) ? clients : [];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm)) ||
        (c.email && c.email.toLowerCase().includes(searchTerm)) ||
        (c.phone && c.phone.includes(searchTerm))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">Aucun client trouvé</p>';
      return;
    }

    container.innerHTML = filtered.map(client => {
      // Calculate client stats safely
      const clientApts = Array.isArray(appointments) ? appointments.filter(a => a.clientId === client.id) : [];
      const totalSpent = Array.isArray(invoices) ? invoices
        .filter(i => i.clientId === client.id && i.status === 'paid')
        .reduce((sum, i) => sum + (i.total || 0), 0) : 0;

      return `
        <div class="client-card">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <h4>${client.name || 'Sans nom'}</h4>
            <button class="btn-sm btn-edit" onclick="editClient('${client.id}')">✏️</button>
          </div>
          <div class="client-info">
            ${client.email ? `<div>📧 ${client.email}</div>` : ''}
            ${client.phone ? `<div>📞 ${client.phone}</div>` : ''}
            ${client.address ? `<div>📍 ${client.address}</div>` : ''}
          </div>
          <div class="client-stats">
            <div class="client-stat">
              <div class="client-stat-value">${clientApts.length}</div>
              <div class="client-stat-label">Rendez-vous</div>
            </div>
            <div class="client-stat">
              <div class="client-stat-value">${totalSpent.toFixed(2)}€</div>
              <div class="client-stat-label">Chiffre d'affaires</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error('Error rendering clients:', e);
    const container = document.getElementById('clients-list');
    if (container) container.innerHTML = '<p style="color:red">Erreur d\'affichage des clients</p>';
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
  console.log('💾 handleClientSubmit called');

  try {
    const nameInput = document.getElementById('client-form-name');
    if (!nameInput.value.trim()) {
      alert('Le nom du client est obligatoire.');
      return;
    }

    const formData = {
      name: nameInput.value.trim(),
      email: document.getElementById('client-form-email').value.trim(),
      phone: document.getElementById('client-form-phone').value.trim(),
      address: document.getElementById('client-form-address').value.trim(),
      notes: document.getElementById('client-form-notes').value.trim()
    };

    if (!Array.isArray(clients)) clients = [];

    if (editingClientId) {
      const index = clients.findIndex(c => c.id === editingClientId);
      if (index !== -1) {
        clients[index] = { ...clients[index], ...formData };
      }
    } else {
      clients.push({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...formData
      });
    }

    saveClients();
    renderClients();
    updateClientSelect();
    closeClientModal();

    // Show success message
    alert('Client enregistré avec succès ! ✅');

  } catch (err) {
    console.error('Error in handleClientSubmit:', err);
    alert('Une erreur est survenue lors de l\'enregistrement : ' + err.message);
  }
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

function updateClientSelect() {
  const selects = ['client-select', 'invoice-client-select'];

  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Sélectionner un client...</option>';

    clients.sort((a, b) => a.name.localeCompare(b.name)).forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = client.name;
      option.dataset.email = client.email || '';
      option.dataset.phone = client.phone || '';
      select.appendChild(option);
    });

    if (currentValue) select.value = currentValue;
  });
}

// INVOICES MANAGEMENT
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
      i.number.toLowerCase().includes(searchTerm) ||
      i.clientName.toLowerCase().includes(searchTerm)
    );
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = '<p style="padding: 32px; text-align: center; color: var(--text-light);">Aucun document trouvé</p>';
    return;
  }

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid var(--border); text-align: left;">
          <th style="padding: 16px;">Numéro</th>
          <th style="padding: 16px;">Date</th>
          <th style="padding: 16px;">Client</th>
          <th style="padding: 16px;">Montant TTC</th>
          <th style="padding: 16px;">Statut</th>
          <th style="padding: 16px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(inv => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 16px;"><strong>${inv.number}</strong></td>
            <td style="padding: 16px;">${formatDate(inv.date)}</td>
            <td style="padding: 16px;">${inv.clientName}</td>
            <td style="padding: 16px;">${inv.total.toFixed(2)} €</td>
            <td style="padding: 16px;">
              <span class="status-badge status-${inv.status === 'paid' ? 'completed' : (inv.status === 'sent' ? 'confirmed' : 'pending')}">
                ${inv.status === 'paid' ? 'Payé' : (inv.status === 'sent' ? 'Envoyé' : 'Brouillon')}
              </span>
            </td>
            <td style="padding: 16px;">
              <div style="display: flex; gap: 8px;">
                <button class="btn-sm btn-edit" onclick="editInvoice('${inv.id}')">✏️</button>
                <button class="btn-sm btn-delete" onclick="deleteInvoice('${inv.id}')">🗑️</button>
                <button class="btn-sm btn-secondary" onclick="printInvoice('${inv.id}')">🖨️</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function showNewInvoiceModal() {
  editingInvoiceId = null;
  document.getElementById('invoice-modal-title').textContent = 'Nouveau Document';
  document.getElementById('invoice-form').reset();
  document.getElementById('invoice-items-list').innerHTML = '';
  addInvoiceItem(); // Add one empty row

  // Set defaults
  document.getElementById('invoice-date').valueAsDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  document.getElementById('invoice-due-date').valueAsDate = dueDate;

  updateInvoiceNumberPrefix();
  updateClientSelect();

  document.getElementById('invoice-modal').classList.add('active');
}

function closeInvoiceModal() {
  document.getElementById('invoice-modal').classList.remove('active');
}

function updateInvoiceNumberPrefix() {
  const type = document.getElementById('invoice-type').value;
  const prefix = type === 'invoice' ? 'FAC-' : 'DEV-';
  const year = new Date().getFullYear();
  const count = invoices.filter(i => i.type === type).length + 1;
  document.getElementById('invoice-number').value = `${prefix}${year}-${String(count).padStart(4, '0')}`;
}

function handleInvoiceClientChange() {
  const select = document.getElementById('invoice-client-select');
  const emailInput = document.getElementById('invoice-client-email');
  const nameInput = document.getElementById('invoice-client-name');

  if (select.selectedIndex > 0) {
    const option = select.options[select.selectedIndex];
    emailInput.value = option.dataset.email || '';
    nameInput.value = option.text;
  } else {
    emailInput.value = '';
    nameInput.value = '';
  }
}

function addInvoiceItem(item = null) {
  const tbody = document.getElementById('invoice-items-list');
  const tr = document.createElement('tr');
  tr.style.borderBottom = '1px solid var(--border)';

  tr.innerHTML = `
    <td style="padding: 8px;">
      <input type="text" class="item-desc" placeholder="Description" value="${item ? item.description : ''}" required style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px;">
    </td>
    <td style="padding: 8px;">
      <input type="number" class="item-qty" value="${item ? item.qty : 1}" min="1" onchange="calculateInvoiceTotals()" style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px;">
    </td>
    <td style="padding: 8px;">
      <input type="number" class="item-price" value="${item ? item.price : 0}" step="0.01" onchange="calculateInvoiceTotals()" style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px;">
    </td>
    <td style="padding: 8px; text-align: right;">
      <span class="item-total">0.00 €</span>
    </td>
    <td style="padding: 8px; text-align: center;">
      <button type="button" class="btn-sm btn-delete" onclick="this.closest('tr').remove(); calculateInvoiceTotals()">×</button>
    </td>
  `;

  tbody.appendChild(tr);
  calculateInvoiceTotals();
}

function calculateInvoiceTotals() {
  let subtotal = 0;
  const rows = document.querySelectorAll('#invoice-items-list tr');

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;

    row.querySelector('.item-total').textContent = total.toFixed(2) + ' €';
    subtotal += total;
  });

  const tva = subtotal * 0.085; // 8.5% TVA
  const total = subtotal + tva;

  document.getElementById('invoice-subtotal').textContent = subtotal.toFixed(2) + ' €';
  document.getElementById('invoice-tva').textContent = tva.toFixed(2) + ' €';
  document.getElementById('invoice-total').textContent = total.toFixed(2) + ' €';

  return { subtotal, tva, total };
}

function handleInvoiceSubmit(e) {
  e.preventDefault();

  const items = [];
  document.querySelectorAll('#invoice-items-list tr').forEach(row => {
    items.push({
      description: row.querySelector('.item-desc').value,
      qty: parseFloat(row.querySelector('.item-qty').value),
      price: parseFloat(row.querySelector('.item-price').value)
    });
  });

  const totals = calculateInvoiceTotals();

  const formData = {
    type: document.getElementById('invoice-type').value,
    number: document.getElementById('invoice-number').value,
    status: document.getElementById('invoice-status').value,
    clientId: document.getElementById('invoice-client-select').value,
    clientName: document.getElementById('invoice-client-name').value,
    clientEmail: document.getElementById('invoice-client-email').value,
    date: document.getElementById('invoice-date').value,
    dueDate: document.getElementById('invoice-due-date').value,
    notes: document.getElementById('invoice-notes').value, // This might be missing in HTML, check later
    items: items,
    subtotal: totals.subtotal,
    tva: totals.tva,
    total: totals.total
  };

  if (editingInvoiceId) {
    const index = invoices.findIndex(i => i.id === editingInvoiceId);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...formData };
    }
  } else {
    invoices.push({
      id: Date.now().toString(),
      ...formData
    });
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

  updateClientSelect();
  document.getElementById('invoice-client-select').value = inv.clientId;
  document.getElementById('invoice-client-name').value = inv.clientName;
  document.getElementById('invoice-client-email').value = inv.clientEmail;

  document.getElementById('invoice-date').value = inv.date;
  document.getElementById('invoice-due-date').value = inv.dueDate;
  // document.getElementById('invoice-notes').value = inv.notes || ''; // Check if exists

  document.getElementById('invoice-items-list').innerHTML = '';
  inv.items.forEach(item => addInvoiceItem(item));
  calculateInvoiceTotals();

  document.getElementById('invoice-modal').classList.add('active');
}

function deleteInvoice(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    invoices = invoices.filter(i => i.id !== id);
    saveInvoices();
    renderInvoicesTable();
  }
}

function printInvoice(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${inv.number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .title { font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
          .totals { margin-top: 40px; text-align: right; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
          <img src="./logo-mascarin.png" alt="Mascarin Consulting" style="max-width: 250px; height: auto;">
          <div style="margin-top: 10px; font-size: 12px; color: #555;">
            <strong>Mascarin Consulting</strong><br>
            RCS : 953 401 874 | SIRET : 953 401 874 00011
          </div>
        </div>

        <div class="header">
          <div>
            <div class="title">${inv.type === 'invoice' ? 'FACTURE' : 'DEVIS'}</div>
            <div>${inv.number}</div>
          </div>
          <div style="text-align: right;">
            <div>Date: ${formatDate(inv.date)}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 40px;">
          <strong>Client:</strong><br>
          ${inv.clientName}<br>
          ${inv.clientEmail}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)} €</td>
                <td>${(item.qty * item.price).toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p>Sous-total: ${inv.subtotal.toFixed(2)} €</p>
          <p>TVA (8.5%): ${inv.tva.toFixed(2)} €</p>
          <h3>Total TTC: ${inv.total.toFixed(2)} €</h3>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// REQUESTS MANAGEMENT
function fetchRequests() {
  const saved = localStorage.getItem('mascarinRequests');
  if (saved) {
    requests = JSON.parse(saved);
  }
}

function saveRequests() {
  localStorage.setItem('mascarinRequests', JSON.stringify(requests));
}

function renderRequests() {
  const container = document.getElementById('requests-list');
  const statusFilter = document.getElementById('request-status-filter').value;

  let filtered = requests;

  if (statusFilter !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter);
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Aucune demande trouvée</td></tr>';
    return;
  }

  container.innerHTML = filtered.map(req => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 16px;">${new Date(req.date).toLocaleDateString()}</td>
      <td style="padding: 16px;">${req.name}</td>
      <td style="padding: 16px;">
        ${req.email}<br>
        ${req.phone}
      </td>
      <td style="padding: 16px;">${req.service}</td>
      <td style="padding: 16px;">
        <span class="status-badge status-${req.status === 'processed' ? 'completed' : 'pending'}">
          ${req.status === 'processed' ? 'Traitée' : 'En attente'}
        </span>
      </td>
      <td style="padding: 16px; white-space: nowrap;">
        <button class="btn-sm btn-primary" onclick="convertRequestToAppointment('${req.id}')">📅 Planifier</button>
        <button class="btn-sm btn-secondary" onclick="archiveRequest('${req.id}')" title="Archiver">📁</button>
        <button class="btn-sm btn-danger" onclick="deleteRequest('${req.id}')" title="Supprimer" style="background-color: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function convertRequestToAppointment(id) {
  const req = requests.find(r => r.id === id);
  if (!req) return;

  showNewAppointmentModal();

  // Pre-fill form
  document.getElementById('client-name').value = req.name;
  document.getElementById('client-email').value = req.email;
  document.getElementById('client-phone').value = req.phone;
  document.getElementById('appointment-type').value = req.service;
  document.getElementById('appointment-notes').value = `Demande web du ${new Date(req.date).toLocaleDateString()}`;

  // Mark as processed
  req.status = 'processed';
  saveRequests();
}

function archiveRequest(id) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = 'archived';
    saveRequests();
    renderRequests();
  }
}

function deleteRequest(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
    requests = requests.filter(r => r.id !== id);
    saveRequests();
    renderRequests();
  }
}

// CONTACTS MANAGEMENT
function fetchContacts() {
  const saved = localStorage.getItem('mascarinContacts');
  if (saved) {
    contacts = JSON.parse(saved);
  }
}

function saveContacts() {
  localStorage.setItem('mascarinContacts', JSON.stringify(contacts));
}

function renderContacts() {
  const container = document.getElementById('contacts-list');
  const statusFilter = document.getElementById('contact-status-filter').value;

  let filtered = contacts;

  if (statusFilter !== 'all') {
    filtered = filtered.filter(c => c.status === statusFilter);
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aucun message</td></tr>';
    return;
  }

  container.innerHTML = filtered.map(contact => `
    <tr style="border-bottom: 1px solid var(--border); background-color: ${contact.status === 'unread' ? '#f0f9ff' : 'transparent'}">
      <td style="padding: 16px;">${new Date(contact.date).toLocaleDateString()}</td>
      <td style="padding: 16px;">${contact.name}</td>
      <td style="padding: 16px;">${contact.email}</td>
      <td style="padding: 16px;">
        <span class="status-badge status-${contact.status === 'unread' ? 'pending' : 'completed'}">
          ${contact.status === 'unread' ? 'Non lu' : 'Lu'}
        </span>
      </td>
      <td style="padding: 16px;">
        <button class="btn-sm btn-secondary" onclick="viewContact('${contact.id}')">👁️ Voir</button>
        <button class="btn-sm btn-delete" onclick="deleteContact('${contact.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function viewContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    alert(`Message de ${contact.name}:\n\n${contact.message}`);
    if (contact.status === 'unread') {
      contact.status = 'read';
      saveContacts();
      renderContacts();
      updateBadges();
    }
  }
}

function deleteContact(id) {
  if (confirm('Supprimer ce message ?')) {
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    renderContacts();
    updateBadges();
  }
}


function setupRealtimeListeners() {
  window.addEventListener('storage', (e) => {
    if (e.key === 'mascarinAppointments') {
      loadAppointments();
      updateDashboard();
    } else if (e.key === 'mascarinRequests') {
      loadRequests();
      renderRequests();
      updateDashboard();
    } else if (e.key === 'mascarinContacts') {
      loadContacts();
      renderContacts();
      updateDashboard();
    }
  });
}

function updateBadges() {
  // Requests Badge
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const requestsBadge = document.getElementById('requests-badge');
  if (requestsBadge) {
    requestsBadge.textContent = pendingRequests;
    requestsBadge.style.display = pendingRequests > 0 ? 'inline-block' : 'none';
  }

  // Contacts Badge
  const unreadContacts = contacts.filter(c => c.status === 'unread').length;
  const contactsBadge = document.getElementById('contacts-badge');
  if (contactsBadge) {
    contactsBadge.textContent = unreadContacts;
    contactsBadge.style.display = unreadContacts > 0 ? 'inline-block' : 'none';
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
window.closeAppointmentModal = closeAppointmentModal;
window.switchView = switchView;
window.handleLogin = handleLogin;
window.fixData = () => {
  if (confirm('Cela va réinitialiser les données de test (Demandes et Contacts). Continuer ?')) {
    const sampleRequests = [
      {
        id: 'req_1',
        date: new Date().toISOString(),
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        phone: '06 12 34 56 78',
        service: 'conseil',
        status: 'pending'
      },
      {
        id: 'req_2',
        date: new Date(Date.now() - 86400000).toISOString(),
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        phone: '06 98 76 54 32',
        service: 'formation',
        status: 'processed'
      }
    ];

    const sampleContacts = [
      {
        id: 'msg_1',
        date: new Date().toISOString(),
        name: 'Pierre Durand',
        email: 'pierre.durand@example.com',
        message: 'Bonjour, je souhaiterais avoir plus d\'informations sur vos services.',
        status: 'unread'
      }
    ];

    localStorage.setItem('mascarinRequests', JSON.stringify(sampleRequests));
    localStorage.setItem('mascarinContacts', JSON.stringify(sampleContacts));

    alert('Données réparées ! La page va se recharger.');
    location.reload();
  }
};
window.showNewClientModal = showNewClientModal;
window.closeClientModal = closeClientModal;
window.editClient = editClient;
window.showNewInvoiceModal = showNewInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.addInvoiceItem = addInvoiceItem;
window.calculateInvoiceTotals = calculateInvoiceTotals;
window.handleInvoiceClientChange = handleInvoiceClientChange;
window.updateInvoiceNumberPrefix = updateInvoiceNumberPrefix;
window.editInvoice = editInvoice;
window.deleteInvoice = deleteInvoice;
window.printInvoice = printInvoice;
window.loadRequests = () => { fetchRequests(); renderRequests(); };
window.filterRequests = renderRequests;
window.convertRequestToAppointment = convertRequestToAppointment;
window.archiveRequest = archiveRequest;
window.deleteRequest = deleteRequest;
window.loadContacts = () => { fetchContacts(); renderContacts(); };
window.filterContacts = renderContacts;
window.viewContact = viewContact;
window.deleteContact = deleteContact;
window.resetApp = resetApp;
// Backup System
function downloadBackup() {
  const backup = {
    appointments,
    clients,
    invoices,
    requests,
    contacts,
    exportDate: new Date().toISOString()
  };

  const dataStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mascarin-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Expose to window
window.downloadBackup = downloadBackup;

window.handleRestoreFile = (input) => {
  // Placeholder for backup-restore.js functionality
  if (window.handleRestoreFileImpl) window.handleRestoreFileImpl(input);
};

window.performRestore = () => {
  if (window.performRestoreImpl) window.performRestoreImpl();
};

console.log('Admin Dashboard Script Loaded (Full Rewrite v61)');
