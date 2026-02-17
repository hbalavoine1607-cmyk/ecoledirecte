// ===========================
// BASE DE DONNÉES UTILISATEURS
// ===========================

const users = {
    'eleve2025': {
        password: '1234',
        name: 'Jean Dupont',
        role: 'Elève',
        class: '2de B',
        email: 'jean.dupont@school.fr'
    },
    'prof2025': {
        password: '1234',
        name: 'Mme Dupont',
        role: 'Professeur',
        subject: 'Français',
        email: 'mme.dupont@school.fr'
    },
    'parent2025': {
        password: '1234',
        name: 'Mr Dupont',
        role: 'Parent',
        child: 'Jean Dupont',
        email: 'parent@school.fr'
    }
};

// Variables globales
let currentUser = null;

// ===========================
// GESTION DE LA CONNEXION
// ===========================

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');
    const rememberMe = document.getElementById('remember').checked;

    errorMsg.textContent = '';

    if (!username || !password) {
        errorMsg.textContent = 'Veuillez entrer vos identifiants.';
        return;
    }

    if (users[username] && users[username].password === password) {
        currentUser = {
            username: username,
            ...users[username]
        };

        // Sauvegarde
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Affichage du dashboard
        showDashboard();
    } else {
        errorMsg.textContent = 'Identifiant ou mot de passe incorrect.';
    }
}

// ===========================
// AFFICHAGE DU DASHBOARD
// ===========================

function showDashboard() {
    document.getElementById('login-container').classList.remove('active');
    document.getElementById('dashboard-container').classList.add('active');

    // Mise à jour des infos utilisateur
    document.getElementById('user-name').textContent = currentUser.name;

    // Génération du contenu selon le rôle
    generateDashboard();
}

// ===========================
// GÉNÉRATION DYNAMIQUE DU DASHBOARD
// ===========================

function generateDashboard() {
    const role = currentUser.role;

    document.getElementById('accueil-content').innerHTML = getAccueilContent();
    document.getElementById('notes-content').innerHTML = getNotesContent();
    document.getElementById('emploi-content').innerHTML = getEmploiContent();
    document.getElementById('messages-content').innerHTML = getMessagesContent();
    document.getElementById('documents-content').innerHTML = getDocumentsContent();

    // Adaptation selon le rôle
    if (role === 'Professeur') {
        document.querySelector('.nav-btn:nth-child(3)').textContent = 'Classes';
    } else if (role === 'Parent') {
        document.querySelector('.nav-btn:nth-child(2)').textContent = 'Scolarité';
    }
}

// ===========================
// CONTENU ACCUEIL
// ===========================

function getAccueilContent() {
    let content = `
        <div class="cards-grid">
            <div class="card-stat">
                <div class="stat-label">Moyenne</div>
                <div class="stat-value">14.5/20</div>
            </div>
            <div class="card-stat">
                <div class="stat-label">Messages</div>
                <div class="stat-value">5</div>
            </div>
            <div class="card-stat">
                <div class="stat-label">Absences</div>
                <div class="stat-value">2h</div>
            </div>
            <div class="card-stat">
                <div class="stat-label">Devoirs</div>
                <div class="stat-value">3</div>
            </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #E0E0E0;">
            <h3 style="margin-bottom: 15px; color: #333;">Actualités</h3>
            <p><strong>Conseil de classe</strong><br>Prévu le 25 février 2026 à 17h00</p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #E0E0E0;">
            <p><strong>Sortie pédagogique</strong><br>Visite du musée le 10 mars 2026</p>
        </div>
    `;
    return content;
}

// ===========================
// CONTENU NOTES
// ===========================

function getNotesContent() {
    const subjects = [
        { name: 'Mathématiques', grades: [16, 14, 15], avg: 15 },
        { name: 'Français', grades: [13, 14, 12], avg: 13 },
        { name: 'Sciences Physiques', grades: [14, 13], avg: 13.5 },
        { name: 'Histoire-Géographie', grades: [16, 17, 15], avg: 16 }
    ];

    let html = `<div class="grades-table"><table><thead><tr>
        <th>Matière</th>
        <th>Évaluation 1</th>
        <th>Évaluation 2</th>
        <th>Évaluation 3</th>
        <th>Moyenne</th>
    </tr></thead><tbody>`;

    subjects.forEach(subject => {
        html += `<tr>
            <td><strong>${subject.name}</strong></td>
            <td>${subject.grades[0] || '-'}/20</td>
            <td>${subject.grades[1] || '-'}/20</td>
            <td>${subject.grades[2] || '-'}/20</td>
            <td class="grade-value">${subject.avg}/20</td>
        </tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
}

// ===========================
// CONTENU EMPLOI DU TEMPS
// ===========================

function getEmploiContent() {
    const schedule = [
        ['08:00-09:00', 'Mathématiques', 'Français', '', 'Anglais', 'Mathématiques'],
        ['09:00-10:00', 'Mathématiques', 'Histoire-Géo', 'EPS', 'Anglais', 'Sciences Physiques'],
        ['10:00-11:00', 'Français', 'Histoire-Géo', 'Français', 'SVT', 'Sciences Physiques'],
        ['11:00-12:00', 'Anglais', '', 'Mathématiques', 'SVT', ''],
        ['13:30-14:30', 'Sciences Physiques', 'SVT', '', 'Technologie', 'Français'],
        ['14:30-15:30', 'SVT', 'Anglais', '', 'Technologie', 'Histoire-Géo']
    ];

    let html = `<div class="schedule"><table><thead><tr>
        <th>Heure</th>
        <th>Lundi</th>
        <th>Mardi</th>
        <th>Mercredi</th>
        <th>Jeudi</th>
        <th>Vendredi</th>
    </tr></thead><tbody>`;

    schedule.forEach(row => {
        html += '<tr>';
        html += `<td class="time">${row[0]}</td>`;
        for (let i = 1; i < row.length; i++) {
            const cell = row[i];
            const cssClass = cell ? 'course' : 'empty';
            html += `<td class="${cssClass}">${cell || ''}</td>`;
        }
        html += '</tr>';
    });

    html += `</tbody></table></div>`;
    return html;
}

// ===========================
// CONTENU MESSAGES
// ===========================

function getMessagesContent() {
    const messages = [
        { from: 'Principal', subject: 'Réunion parents-professeurs', preview: 'Réunion prévue le 25 février...', date: '17 fév 2026', unread: true },
        { from: 'Mme Dupont (Français)', subject: 'Devoir maison', preview: 'Exercice 3 pages 45-46...', date: '16 fév 2026', unread: true },
        { from: 'Infirmerie', subject: 'Visite médicale', preview: 'Passage obligatoire...', date: '10 fév 2026', unread: false }
    ];

    let html = '<div class="messages-list">';
    messages.forEach(msg => {
        const unread = msg.unread ? 'unread' : '';
        html += `
            <div class="message-item ${unread}">
                <div class="message-from">${msg.from}</div>
                <div class="message-subject">${msg.subject}</div>
                <div class="message-preview">${msg.preview}</div>
                <div class="message-date">${msg.date}</div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// ===========================
// CONTENU DOCUMENTS
// ===========================

function getDocumentsContent() {
    const docs = {
        'Bulletins': [
            { name: 'Bulletin 1er trimestre', file: 'bulletin-t1.pdf' },
            { name: 'Bulletin 2e trimestre', file: 'bulletin-t2.pdf' }
        ],
        'Certificats': [
            { name: 'Certificat de scolarité', file: 'cert-scol.pdf' },
            { name: 'Attestation demi-pensionnaire', file: 'att-demi.pdf' }
        ],
        'Ressources': [
            { name: 'Cours Mathématiques Ch.5', file: 'math-ch5.pdf' },
            { name: 'Exercices SVT Correction', file: 'svt-ex.pdf' }
        ]
    };

    let html = '<div class="documents-grid">';
    for (const [category, items] of Object.entries(docs)) {
        html += `<div class="document-card"><h3>${category}</h3>`;
        items.forEach(item => {
            html += `<div class="document-item"><span>${item.name}</span><a href="#">Télécharger</a></div>`;
        });
        html += '</div>';
    }
    html += '</div>';
    return html;
}

// ===========================
// CHANGEMENT DE TAB
// ===========================

function switchTab(tabName) {
    // Masquer tous les sections
    document.querySelectorAll('.dashboard-section').forEach(el => {
        el.classList.remove('active');
    });

    // Désactiver tous les boutons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Afficher la section et activer le bouton
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ===========================
// DÉCONNEXION
// ===========================

function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        currentUser = null;
        sessionStorage.removeItem('currentUser');

        document.getElementById('login-form').reset();
        document.getElementById('error-message').textContent = '';

        document.getElementById('dashboard-container').classList.remove('active');
        document.getElementById('login-container').classList.add('active');

        document.getElementById('username').focus();
    }
}

// ===========================
// INITIALISATION
// ===========================

window.addEventListener('DOMContentLoaded', function() {
    // Vérification si un utilisateur se souvient de nous
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && users[rememberedUser]) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('remember').checked = true;
    }

    // Vérification si déjà connecté
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        document.getElementById('login-container').classList.add('active');
        document.getElementById('username').focus();
    }

    // Permettre Enter pour la connexion
    document.getElementById('login-form').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
});
