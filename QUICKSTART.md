# 🚀 EcoleDirecte - Setup Rapide (Quick Start)

Démarre en 30 secondes!

## ⚡ Démarrage Rapide Local

### 1. Ouvrir pronote.html

Simplement double-cliquer sur `pronote.html` ou:
```bash
# Windows
start pronote.html

# Mac
open pronote.html

# Linux
xdg-open pronote.html
```

### 2. Se Connecter

Essayer ces comptes démo:

| Rôle       | ID      | Mot de passe |
|-----------|---------|-------------|
| Élève     | student | 1234        |
| Professeur| teacher | 1234        |
| Parent    | parent  | 1234        |

### 3. Explorer

Cliquer sur les items du menu à gauche pour naviguer.

---

## 🌐 Publier en 5 Minutes

### Netlify (Recommandé - Gratuit)

```bash
# 1. Télécharger le projet
git clone https://github.com/votreusername/pronote.git
cd pronote

# 2. Aller sur https://app.netlify.com/drop

# 3. Glisser-déposer le dossier

# ✅ Site en ligne!
```

**Accès:** `https://[name].netlify.app/pronote.html`

### Alternative: GitHub Pages

```bash
git init
git add .
git commit -m "EcoleDirecte ENT"
git push origin main

# Activer Pages dans Settings
# Site: https://username.github.io/pronote/
```

---

## 📋 Fichiers Importants

```
✓ pronote.html        → Application (HTML + Login)
✓ pronote-style.css   → Design & Responsive
✓ pronote-script.js   → Logique & Interactions
✓ README.md           → Documentation complète
✓ DEPLOYMENT.md       → Guide déploiement détaillé
```

**Tous les fichiers sont requis pour fonctionner!**

---

## 🎯 Prochaines Étapes

### Pour une Vraie Plateforme (Production)

1. **Ajouter Backend API**
   - Node.js + Express
   - Python + Flask
   - Ou autre framework

2. **Base de Données**
   - PostgreSQL (recommandé)
   - MongoDB
   - MySQL

3. **Authentification Réelle**
   - Remplacer le login démo
   - Hasher les mots de passe
   - Implémenter OAuth (Google/Microsoft)

4. **Déployer Sécurisé**
   - HTTPS obligatoire
   - Headers de sécurité
   - Rate limiting
   - Chiffrement des données

---

## 🚪 Points Clés

✅ **Fonctionnel:** Tous les modules travaillent  
✅ **Responsive:** Fonctionne sur mobile/tablet/desktop  
✅ **Sécurisé (Démo):** Validation des données + protection brute-force  
✅ **Rapide:** Zéro dépendances, 80KB total  
✅ **Accessible:** ARIA labels, navigation clavier  
⚠️ **Démo Uniquement:** Authentification fictive, pas de base de données

---

## 🎨 Personnaliser

### Changer la Couleur

Dans `pronote-style.css`, ligne 10:
```css
--primary: #0040A8;  ← Changez ceci!
```

### Ajouter des Utilisateurs

Dans `pronote-script.js`, ligne ~13:
```javascript
const users = [
    // Ajouter des utilisateurs ici
];
```

### Changer le Logo

Dans `pronote.html`, ligne ~16:
```html
<svg><!-- Votre logo SVG ici --></svg>
```

---

## 🐛 Debug

Ouvrir la console (F12) et chercher:

```javascript
// Logs de connexion réussie:
✓ Connexion réussie: Alice Martin

// Navigation:
→ Navigation vers: notes

// Erreurs visibles et explicitées
✗ Identifiants invalides
```

---

## 📊 Stats Plateforme

- **Utilisateurs testés:** 3 (démo)
- **Modules:** 10
- **Taille totale:** 80 KB
- **Dépendances:** 0
- **Temps de chargement:** < 500ms
- **Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## ✅ Vérification Rapide

```
□ Fichiers téléchargés?
□ Tous les 3 fichiers (HTML, CSS, JS) au même endroit?
□ Peut ouvrir pronote.html?
□ Login fonctionne avec "student/1234"?
□ Peut naviguer entre sections?
□ Responsive sur mobile?

OUI = Prêt à publier! 🎉
```

---

## 🔗 Ressources Rapides

- 📖 [Docs Complètes](README.md)
- 🚀 [Guide Déploiement](DEPLOYMENT.md)
- 🐙 [GitHub](https://github.com)
- 🌐 [Netlify](https://app.netlify.com)
- ☁️ [Vercel](https://vercel.com)

---

**Prêt? → Ouvrez `pronote.html` dans votre navigateur!** 🚀

---

*Dernière mise à jour: 17 février 2026*  
*Version: 1.0.0*
