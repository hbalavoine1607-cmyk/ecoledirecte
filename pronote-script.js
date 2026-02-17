// ========================================
// DONNÉES ET CONFIGURATION
// ========================================

// Base de données des utilisateurs (démo seulement - à remplacer par une API en production)
const users = [
    {
        id: 1,
        username: "student",
        password: "1234", // À hasher en production
        name: "Alice Martin",
        role: "Élève",
        email: "alice.martin@ecole.fr",
        classe: "3e A",
        avatar: "👩‍🎓"
    },
    {
        id: 2,
        username: "teacher",
        password: "1234", // À hasher en production
        name: "M. Laurent",
        role: "Professeur",
        email: "laurent@ecole.fr",
        classe: "Mathématiques",
        avatar: "👨‍🏫"
    },
    {
        id: 3,
        username: "parent",
        password: "1234", // À hasher en production
        name: "Jean Martin (Parent)",
        role: "Parent",
        email: "jean.martin@email.fr",
        classe: "Parent d'Alice",
        avatar: "👨‍💼"
    }
];

let currentUser = null;

// Configuration de sécurité
const CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

let loginAttempts = 0;
let lastLoginAttempt = null;

// ========================================
// UTILITAIRES DE SÉCURITÉ
// ========================================

/**
 * Valide les données d'entrée
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().substring(0, 100); // Limiter la longueur
}

/**
 * Vérifie si le compte est verrouillé
 */
function isAccountLocked() {
    if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - lastLoginAttempt;
        if (timeSinceLastAttempt < CONFIG.LOCKOUT_DURATION) {
            const minutesRemaining = Math.ceil((CONFIG.LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
            return `Trop de tentatives. Réessayez dans ${minutesRemaining} minute(s)`;
        } else {
            loginAttempts = 0; // Réinitialiser après la période
        }
    }
    return null;
}

// ========================================
// GESTION DE LA CONNEXION
// ========================================

function handleLogin(event) {
    event.preventDefault();

    // Vérifier si le compte est verrouillé
    const lockMessage = isAccountLocked();
    if (lockMessage) {
        showError(lockMessage);
        return;
    }

    try {
        const username = sanitizeInput(document.getElementById('username').value);
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Validation basique
        if (!username || !password) {
            showError('Veuillez remplir tous les champs');
            return;
        }

        if (username.length < 3) {
            showError('L\'identifiant doit contenir au moins 3 caractères');
            return;
        }

        // Chercher l'utilisateur
        const user = users.find(u => 
            u.username === username && u.password === password
        );

        if (!user) {
            loginAttempts++;
            lastLoginAttempt = Date.now();
            
            if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
                showError('Compte verrouillé. Réessayez dans 15 minutes.');
            } else {
                showError(`Identifiants invalides (${loginAttempts}/${CONFIG.MAX_LOGIN_ATTEMPTS})`);
            }
            return;
        }

        // Connexion réussie
        loginAttempts = 0;
        currentUser = { ...user }; // Clone l'objet
        
        // Sauvegarder la session
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Afficher l'application
        showApplication();
        console.log(`✓ Connexion réussie: ${user.name}`);
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showError('Une erreur est survenue. Veuillez réessayer.');
    }
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showApplication() {
    try {
        const loginPage = document.getElementById('login-page');
        const appContainer = document.getElementById('app-container');
        
        if (loginPage && appContainer) {
            loginPage.classList.remove('active');
            appContainer.classList.add('active');
            
            // Nettoyer le formulaire
            document.getElementById('login-form').reset();
            document.getElementById('login-error').textContent = '';
            
            updateHeader();
            switchSection('accueil');
        }
    } catch (error) {
        console.error('Erreur lors de l\'affichage de l\'application:', error);
    }
}

function updateHeader() {
    try {
        if (currentUser) {
            const usernameEl = document.getElementById('header-username');
            const avatarEl = document.getElementById('header-avatar');
            
            if (usernameEl) usernameEl.textContent = currentUser.name;
            if (avatarEl) avatarEl.textContent = currentUser.avatar;
        }
    } catch (error) {
        console.error('Erreur mise à jour header:', error);
    }
}

// ========================================
// GESTION DE LA DÉCONNEXION
// ========================================

function handleLogout() {
    try {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            currentUser = null;
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('currentSessionToken');
            
            const appContainer = document.getElementById('app-container');
            const loginPage = document.getElementById('login-page');
            
            if (appContainer) appContainer.classList.remove('active');
            if (loginPage) loginPage.classList.add('active');
            
            document.getElementById('login-error').textContent = '';
            document.getElementById('login-form').reset();
            
            console.log('✓ Déconnexion réussie');
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}

// ========================================
// NAVIGATION ENTRE SECTIONS
// ========================================

const SECTION_TITLES = {
    'accueil': 'Accueil',
    'cahier-textes': 'Cahier de textes',
    'notes': 'Notes et résultats',
    'emploi-temps': 'Emploi du temps',
    'absences': 'Absences et justificatifs',
    'messagerie': 'Messagerie',
    'devoirs': 'Devoirs',
    'documents': 'Documents',
    'ressources': 'Ressources',
    'profil': 'Profil'
};

function switchSection(sectionName) {
    try {
        // Valider le nom de la section
        if (!sectionName || !SECTION_TITLES[sectionName]) {
            console.warn(`Section invalide: ${sectionName}`);
            sectionName = 'accueil'; // Fallback
        }

        // Cacher toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const sectionEl = document.getElementById(`section-${sectionName}`);
        if (sectionEl) {
            sectionEl.classList.add('active');
        } else {
            console.warn(`Élément section non trouvé: section-${sectionName}`);
            return;
        }

        // Mettre à jour le titre du header
        const headerTitle = document.querySelector('.top-header h2');
        if (headerTitle) {
            headerTitle.textContent = SECTION_TITLES[sectionName];
        }

        // Mettre à jour la navigation active
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Populer le contenu de certaines sections
        if (sectionName === 'profil') {
            populateProfile();
        }

        console.log(`→ Navigation vers: ${sectionName}`);
        
    } catch (error) {
        console.error('Erreur lors du changement de section:', error);
    }
}

// ========================================
// EMPLOI DU TEMPS - NAVIGATION SEMAINE
// ========================================

let currentWeekOffset = 0;

function switchWeek(direction) {
    try {
        // Limiter la navigation à ±8 semaines
        const newOffset = currentWeekOffset + direction;
        if (Math.abs(newOffset) > 8) {
            console.warn('Navigation semaine limitée');
            return;
        }

        currentWeekOffset = newOffset;
        const weekLabel = document.getElementById('week-label');
        
        if (!weekLabel) {
            console.warn('Élément week-label non trouvé');
            return;
        }

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeekOffset * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        weekLabel.textContent = `Semaine du ${weekStart.toLocaleDateString('fr-FR', options)} au ${weekEnd.toLocaleDateString('fr-FR', options)}`;
        
        console.log(`→ Navigation semaine: ${currentWeekOffset}`);
        
    } catch (error) {
        console.error('Erreur lors du changement de semaine:', error);
    }
}

// ========================================
// MESSAGERIE
// ========================================

function openMessage(element) {
    try {
        if (!element) return;
        
        const messageFrom = element.querySelector('.message-header strong');
        const messageSubject = element.querySelector('.message-subject');
        const messagePreview = element.querySelector('.message-preview');
        const messageDate = element.querySelector('.message-date');
        const messageDisplay = document.getElementById('message-display');

        if (!messageDisplay || !messageFrom || !messageSubject) {
            console.warn('Éléments de message manquants');
            return;
        }

        messageDisplay.innerHTML = `
            <div style="background-color: var(--light-gray); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <strong>De :</strong> ${messageFrom.textContent}<br>
                <strong>Sujet :</strong> ${messageSubject.textContent}<br>
                <strong>Date :</strong> ${messageDate ? messageDate.textContent : 'Date inconnue'}
            </div>
            <p>${messagePreview ? messagePreview.textContent : 'Contenu du message'}</p>
        `;

        // Marquer comme lu
        element.classList.remove('unread');
        console.log('✓ Message ouvert');
        
    } catch (error) {
        console.error('Erreur lors de l\'ouverture du message:', error);
    }
}

function sendMessage() {
    try {
        const toField = document.getElementById('message-to');
        const subjectField = document.getElementById('message-subject');
        const bodyField = document.getElementById('message-body');

        if (!toField || !subjectField || !bodyField) {
            console.warn('Champs de message manquants');
            return;
        }

        const to = sanitizeInput(toField.value);
        const subject = sanitizeInput(subjectField.value);
        const body = sanitizeInput(bodyField.value);

        // Validation
        if (!to.trim() || !subject.trim() || !body.trim()) {
            alert('⚠️ Veuillez remplir tous les champs du message');
            return;
        }

        if (to.length < 3 || subject.length < 3) {
            alert('⚠️ Les champs doivent contenir au moins 3 caractères');
            return;
        }

        // Confirmation
        if (confirm(`Envoyer le message à ${to} ?`)) {
            console.log(`✓ Message envoyé à: ${to}`);
            toField.value = '';
            subjectField.value = '';
            bodyField.value = '';
            alert('✓ Message envoyé avec succès');
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('✗ Une erreur est survenue lors de l\'envoi du message');
    }
}

// ========================================
// DEVOIRS - COCHER COMME FAIT
// ========================================

function toggleHomework(element) {
    try {
        if (!element || !element.closest('.homework-card')) {
            console.warn('Élément homework invalide');
            return;
        }
        
        const homeworkCard = element.closest('.homework-card');
        homeworkCard.classList.toggle('done');
        
        // Mettre à jour l'apparence du checkbox
        element.checked = element.checked;
        
        console.log(`→ Devoir ${element.checked ? 'marqué comme fait' : 'marqué comme non fait'}`);
        
    } catch (error) {
        console.error('Erreur lors du changement d\'état du devoir:', error);
    }
}

// ========================================
// PROFIL
// ========================================

function populateProfile() {
    try {
        if (!currentUser) {
            console.warn('Utilisateur non connecté');
            return;
        }

        const preferences = {
            'Élève': {
                notifications: true,
                emails: true,
                data: {
                    'Nom complet': currentUser.name,
                    'Email': currentUser.email,
                    'Classe': currentUser.classe,
                    'Rôle': currentUser.role,
                    'Téléphone': '06 12 34 56 78'
                }
            },
            'Professeur': {
                notifications: true,
                emails: true,
                data: {
                    'Nom complet': currentUser.name,
                    'Email': currentUser.email,
                    'Matière': currentUser.classe,
                    'Rôle': currentUser.role,
                    'Bureau': 'Salle 305'
                }
            },
            'Parent': {
                notifications: true,
                emails: true,
                data: {
                    'Nom complet': currentUser.name,
                    'Email': currentUser.email,
                    'Enfant': currentUser.classe,
                    'Rôle': currentUser.role,
                    'Téléphone': '06 98 76 54 32'
                }
            }
        };

        const userPrefs = preferences[currentUser.role] || { notifications: true, emails: true, data: {} };

        // Remplir les informations personnelles
        const infoSection = document.querySelector('#section-profil');
        const profileInfo = infoSection?.querySelector('.profile-info');

        if (profileInfo) {
            let infoHTML = '';
            for (const [label, value] of Object.entries(userPrefs.data)) {
                const safeValue = sanitizeInput(String(value));
                infoHTML += `
                    <div class="info-field">
                        <label>${label}</label>
                        <input type="text" value="${safeValue}" readonly>
                    </div>
                `;
            }
            profileInfo.innerHTML = infoHTML;
        }

        // Remplir les préférences
        const preferencesSection = infoSection?.querySelectorAll('.profile-card')[1];
        if (preferencesSection) {
            const checkboxes = preferencesSection.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox, index) => {
                if (index === 0) checkbox.checked = userPrefs.notifications;
                if (index === 1) checkbox.checked = userPrefs.emails;
            });
        }

        console.log('✓ Profil chargé');
        
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    }
}

// ========================================
// INITIALISATIONS AU CHARGEMENT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Initialisation de l\'application...');
        
        // Vérifier si l'utilisateur était connecté
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
            try {
                currentUser = JSON.parse(sessionUser);
                console.log(`✓ Session restaurée: ${currentUser.name}`);
                showApplication();
            } catch (e) {
                console.warn('Session corrompue, déconnexion forcée');
                sessionStorage.removeItem('currentUser');
            }
        } else {
            // Restaurer l'identifiant remembered si disponible
            const rememberedUser = localStorage.getItem('rememberedUser');
            if (rememberedUser) {
                document.getElementById('username').value = rememberedUser;
                console.log('✓ Identifiant restauré');
            }
            document.getElementById('login-page').classList.add('active');
        }

        // Configuration des écouteurs de navigation
        setupNavigationListeners();
        
        // Configuration des écouteurs de formulaires
        setupFormListeners();
        
        // Configuration des écouteurs d'employé du temps
        setupScheduleListeners();
        
        // Configuration des écouteurs de messagerie
        setupMessagingListeners();
        
        // Configuration des écouteurs de devoirs
        setupHomeworkListeners();
        
        console.log('✓ Application prête');
        
    } catch (error) {
        console.error('Erreur critique lors de l\'initialisation:', error);
        alert('Erreur lors du chargement de l\'application. Veuillez rafraîchir la page.');
    }
}, false);

/**
 * Configure les écouteurs de navigation
 */
function setupNavigationListeners() {
    try {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // Les onclick inline sont déjà présents
            });
        });

        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    } catch (error) {
        console.warn('Erreur configuration navigation:', error);
    }
}

/**
 * Configure les écouteurs de formulaires
 */
function setupFormListeners() {
    try {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
            
            // Ajouter visuellement le focus
            const inputs = loginForm.querySelectorAll('input[type="text"], input[type="password"]');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.style.borderColor = 'var(--primary)';
                });
                input.addEventListener('blur', function() {
                    this.style.borderColor = 'var(--border)';
                });
            });
        }
    } catch (error) {
        console.warn('Erreur configuration formulaires:', error);
    }
}

/**
 * Configure les écouteurs emploi du temps
 */
function setupScheduleListeners() {
    try {
        const prevWeekBtn = document.getElementById('prev-week');
        const nextWeekBtn = document.getElementById('next-week');
        
        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => switchWeek(-1));
        }
        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => switchWeek(1));
        }
        
        switchWeek(0); // Initialiser la semaine actuelle
    } catch (error) {
        console.warn('Erreur configuration emploi du temps:', error);
    }
}

/**
 * Configure les écouteurs messagerie
 */
function setupMessagingListeners() {
    try {
        // Messages
        document.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', function() {
                openMessage(this);
            });
        });

        // Envoi de message
        const sendMsgBtn = document.getElementById('send-message-btn');
        if (sendMsgBtn) {
            sendMsgBtn.addEventListener('click', sendMessage);
        }
    } catch (error) {
        console.warn('Erreur configuration messagerie:', error);
    }
}

/**
 * Configure les écouteurs devoirs
 */
function setupHomeworkListeners() {
    try {
        document.querySelectorAll('.homework-card input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                toggleHomework(this);
            });
        });
    } catch (error) {
        console.warn('Erreur configuration devoirs:', error);
    }
}

// ========================================
// UTILITAIRES
// ========================================

/**
 * Télécharger un document
 */
function downloadDocument(docName) {
    try {
        const safeName = sanitizeInput(docName);
        if (!safeName) {
            alert('❌ Nom de document invalide');
            return;
        }
        console.log(`⬇️ Téléchargement: ${safeName}`);
        // En production: créer une vraie requête de téléchargement
        alert(`✓ Téléchargement de "${safeName}" en cours...`);
    } catch (error) {
        console.error('Erreur téléchargement:', error);
        alert('❌ Erreur lors du téléchargement');
    }
}

/**
 * Ouvrir une ressource
 */
function openResource(resourceName) {
    try {
        const safeName = sanitizeInput(resourceName);
        if (!safeName) {
            alert('❌ Nom de ressource invalide');
            return;
        }
        console.log(`📂 Ouverture: ${safeName}`);
        // En production: ouvrir la ressource appropriée
        alert(`✓ Ouverture de "${safeName}"...`);
    } catch (error) {
        console.error('Erreur ouverture ressource:', error);
        alert('❌ Erreur lors de l\'ouverture');
    }
}

/**
 * Mettre à jour une préférence
 */
function updatePreference(prefName) {
    try {
        const safeName = sanitizeInput(prefName);
        if (!safeName) {
            alert('❌ Nom de préférence invalide');
            return;
        }
        console.log(`⚙️ Mise à jour: ${safeName}`);
        // En production: envoyer la mise à jour au serveur
        alert(`✓ Préférence "${safeName}" mise à jour`);
    } catch (error) {
        console.error('Erreur mise à jour:', error);
        alert('❌ Erreur lors de la mise à jour');
    }
}

/**
 * Gestion des touches clavier
 */
document.addEventListener('keydown', function(event) {
    try {
        // Appui sur Entrée pour se connecter si on est sur la page de connexion
        const loginPage = document.getElementById('login-page');
        if (loginPage && loginPage.classList.contains('active') && event.key === 'Enter') {
            const usernameField = document.getElementById('username');
            if (usernameField && usernameField.value) {
                const form = document.getElementById('login-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Échap pour quitter une modal (futur)
        if (event.key === 'Escape') {
            // À implémenter si des modals sont ajoutées
        }
    } catch (error) {
        console.error('Erreur gestion clavier:', error);
    }
}, false);

/**
 * Vérifier la connexion à intervalle régulier
 */
setInterval(function() {
    try {
        const sessionUser = sessionStorage.getItem('currentUser');
        if (!sessionUser && currentUser) {
            console.warn('Session perdue, déconnexion...');
            handleLogout();
        }
    } catch (error) {
        console.warn('Erreur vérification session:', error);
    }
}, 60000); // Vérifier toutes les minutes

console.log('✓ Script ENT chargé avec succès');
