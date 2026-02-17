# 🚀 Guide de Déploiement - EcoleDirecte

Guide pas à pas pour déployer la plateforme sur Internet en 5 minutes.

---

## 🌟 Option 1: Netlify (PLUS SIMPLE!)

### Étape 1: Préparer les fichiers

1. Créer un dossier `ecoledirecte-ent` contenant:
   ```
   pronote.html
   pronote-style.css
   pronote-script.js
   README.md
   package.json
   netlify.toml
   _redirects
   ```

2. Compresser le dossier en ZIP (optionnel)

### Étape 2: Créer un compte Netlify

1. Aller sur https://app.netlify.com
2. Cliquer sur "Sign up"
3. Choisir "GitHub", "GitLab", "Email", ou "Google"
4. Compléter l'inscription

### Étape 3: Déployer

**Option A - Glisser-déposer (Plus simple):**
1. Aller à https://app.netlify.com/drop
2. Glisser-déposer votre dossier du projet
3. ✅ Site déployé! (URL fournie automatiquement)

**Option B - GitHub (Déploiement automatique):**
1. Créer un repository GitHub
2. Pousser vos fichiers
3. Sur Netlify: "Connect Git"
4. Sélectionner votre repository
5. Cliquer "Deploy site"

### Étape 4: Accéder à votre site

```
Votre URL Netlify:
https://[nomAleatoire].netlify.app/pronote.html

Ou configurer un domaine personnalisé:
https://monecole.fr/
```

### Avantages Netlify:
- ✅ Gratuit (jusqu'à 100GB/mois)
- ✅ HTTPS automatique
- ✅ CDN global
- ✅ Déploiement instantané
- ✅ Gestion simple
- ✅ Support 24/7

---

## 📦 Option 2: Vercel

### Étape 1: Créer un compte
1. Aller sur https://vercel.com
2. S'inscrire avec GitHub, GitLab, ou Email

### Étape 2: Importer le projet
1. Cliquer "New Project"
2. Sélectionner "Import Git Repository"
3. Connecter votre repository GitHub
4. Cliquer "Deploy"

### Étape 3: Accéder au site
```
https://[votreprojet].vercel.app/pronote.html
```

---

## 💻 Option 3: GitHub Pages

### Étape 1: Créer un repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votreusername/pronote.git
git push -u origin main
```

### Étape 2: Activer Pages

1. Aller sur GitHub > Paramètres du repository
2. Descendez à "Pages"
3. Source: Sélectionner "main" branch
4. Cliquer "Save"

### Étape 3: Accéder au site

```
https://votreusername.github.io/pronote/pronote.html
```

**Avantages:**
- ✅ Gratuit
- ✅ Intégré à GitHub
- ✅ HTTPS gratuit
- ✅ Domaine personnalisé possible

---

## 🖥️ Option 4: Serveur Propre (Avancé)

### Prérequis:
- Serveur VPS ou dédié
- Accès SSH
- Domaine configuré (optionnel)

### Étape 1: Préparer le serveur

```bash
# Se connecter au serveur
ssh user@votredomaine.com

# Créer le dossier
mkdir -p /var/www/pronote
cd /var/www/pronote

# Télécharger les fichiers
wget https://github.com/votreusername/pronote/archive/main.zip
unzip main.zip
```

### Étape 2: Configurer Nginx (Recommandé)

```nginx
# /etc/nginx/sites-available/pronote

server {
    listen 80;
    listen [::]:80;
    server_name votredomaine.com www.votredomaine.com;

    root /var/www/pronote;
    index pronote.html;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name votredomaine.com www.votredomaine.com;

    # Certificats SSL (via Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votredomaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votredomaine.com/privkey.pem;

    root /var/www/pronote;
    index pronote.html;

    # SPA Routing
    location / {
        try_files $uri $uri/ /pronote.html;
    }

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Étape 3: Activer et redémarrer Nginx

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/pronote /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer
sudo systemctl restart nginx

# Activer le démarrage automatique
sudo systemctl enable nginx
```

### Étape 4: SSL avec Let's Encrypt (Gratuit)

```bash
# Installer Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Générer le certificat
sudo certbot certonly --nginx -d votredomaine.com -d www.votredomaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

---

## 🔐 Sécurité: Points Importants

Avant de mettre en production, vérifiez:

- [ ] HTTPS activé (certificat SSL valide)
- [ ] Headers de sécurité configurés
- [ ] CORS configuré si vous avez un backend
- [ ] Authentification réelle implémentée (backend)
- [ ] Validation côté serveur
- [ ] Rate limiting sur les endpoints sensibles
- [ ] Logs et monitoring actifs
- [ ] Sauvegarde des données automatique

---

## 📱 Configuration du Domaine Personnalisé

### Dans Netlify:
```
1. Aller à "Domain Management"
2. Cliquer "Add a domain"
3. Entrer votre domaine
4. Suivre les instructions DNS
5. Vérifier après quelques minutes
```

### Dans GitHub Pages:
```
1. Aller à "Repository Settings" > "Pages"
2. Sous "Custom domain", entrer votre domaine
3. Mettre à jour vos DNS records
4. Vérifier après quelques minutes
```

### Records DNS à ajouter:

**Pour Netlify:**
```
Type: CNAME
Name: www (ou votredomaine)
Value: votredomaine.netlify.app
```

**Pour GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

---

## 📊 Vérification du Déploiement

### Tester l'accès:

```bash
# Depuis votre terminal
curl -I https://votredomaine.com

# Devrait retourner: HTTP/2 200

# Vérifier les headers de sécurité
curl -I https://votredomaine.com | grep -i "strict-transport"
```

### Utiliser les outils en ligne:

- https://www.whatismyipaddress.com/https-checker
- https://mxtoolbox.com/
- https://www.ssllabs.com/ssltest/ (vérifier SSL)
- https://webpagetest.org/ (tester la performance)

---

## 🐛 Troubleshooting

### "Domaine ne résout pas"
```
Vérifier: DNS Records propagation peut prendre 24-48h
Utiliser: nslookup votredomaine.com
```

### "Erreur 404"
```
Vérifier: Routes / redirections configurées
Solution: Vérifier netlify.toml ou nginx.conf
```

### "Pas de HTTPS"
```
Vérifier: Certificat SSL valide
Solution: Régénérer avec Let's Encrypt ou Netlify
```

### "Site très lent"
```
Vérifier: Compression gzip activée
Solution: Minifier CSS/JS, optimiser images
```

---

## 📈 Performance: Optimisations Supplémentaires

### Minification (Optionnel):

```bash
# CSS
npm install csso-cli
csso pronote-style.css -o pronote-style.min.css

# JavaScript
npm install terser
terser pronote-script.js -o pronote-script.min.js
```

### Caching Headers:

```nginx
# Fichiers statiques - cache 1 an
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML - pas de cache (toujours frais)
location ~ \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 📞 Support Déploiement

Si vous avez des problèmes:

1. **Netlify Support**: https://support.netlify.com
2. **GitHub Pages**: https://docs.github.com/en/pages
3. **Vercel Docs**: https://vercel.com/docs
4. **Stack Overflow**: Tag `deployment`, `nginx`, `dns`

---

## ✅ Checklist Avant Going Live

- [ ] Fichiers téléchargés sans erreurs
- [ ] HTTPS fonctionnel
- [ ] Login fonctionne avec les démos
- [ ] Navigation complète testée
- [ ] Responsive design vérifié (mobile/tablet/desktop)
- [ ] Console JS sans erreurs
- [ ] Performance acceptable (< 3s page load)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring/Analytics configuré (optionnel)
- [ ] Backups en place (pour production réelle)

---

**Date:** 17 février 2026  
**Version:** 1.0.0  
**Status:** ✅ Prêt pour déploiement
