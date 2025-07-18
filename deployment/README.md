# 🚀 Deployment Guide

Questa guida ti aiuterà a deployare il portfolio su diverse piattaforme.

## 📋 Prerequisiti

- **Node.js** 18+ e **pnpm**
- **Python** 3.8+ e **pip**
- **Git** configurato
- Account sui servizi di hosting scelti

## 🌐 Opzioni di Deployment

### 1. 🔥 Vercel (Raccomandato per semplicità)

Vercel è perfetto per progetti React + API Python.

#### Setup
```bash
# 1. Installa Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

#### Configurazione
- Il file `deployment/vercel.json` è già configurato
- Frontend servito da Vercel Edge Network
- Backend come Serverless Functions

#### Vantaggi
- ✅ Deploy automatico da GitHub
- ✅ HTTPS gratuito
- ✅ CDN globale
- ✅ Serverless scaling

### 2. 🐙 GitHub Pages + Backend separato

Per hosting gratuito del frontend su GitHub Pages.

#### Frontend su GitHub Pages
```bash
# 1. Build del frontend
cd frontend
pnpm run build

# 2. Deploy su gh-pages
npm install -g gh-pages
gh-pages -d dist

# 3. Configura GitHub Pages
# Vai su Settings > Pages > Source: gh-pages branch
```

#### Backend su Railway/Render
```bash
# 1. Crea account su Railway.app o Render.com
# 2. Connetti repository GitHub
# 3. Seleziona cartella backend/
# 4. Deploy automatico
```

### 3. 🐳 Docker (Per deployment personalizzato)

Per deployment su VPS o cloud provider.

#### Build e Run
```bash
# 1. Build containers
docker-compose -f deployment/docker-compose.yml build

# 2. Run
docker-compose -f deployment/docker-compose.yml up -d

# 3. Verifica
curl http://localhost:3000  # Frontend
curl http://localhost:5002  # Backend
```

#### Deploy su DigitalOcean/AWS/GCP
```bash
# 1. Push images su registry
docker tag portfolio-frontend your-registry/portfolio-frontend
docker push your-registry/portfolio-frontend

# 2. Deploy su cloud
# Usa docker-compose.yml sul server
```

### 4. 🔧 Netlify + Serverless

Alternativa a Vercel per frontend.

#### Setup
```bash
# 1. Build frontend
cd frontend && pnpm run build

# 2. Deploy su Netlify
# Drag & drop cartella dist/ su netlify.com
# O connetti repository GitHub
```

#### Backend su Netlify Functions
```bash
# 1. Crea netlify/functions/api.js
# 2. Proxy alle API Python
# 3. Deploy automatico
```

## ⚙️ Configurazione Ambiente

### Variabili d'ambiente

#### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=Your Portfolio
```

#### Backend (.env)
```bash
FLASK_ENV=production
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-frontend-url.com
```

### Database

#### SQLite (Default)
- Perfetto per portfolio personale
- File database incluso nel deployment
- Backup automatico

#### PostgreSQL (Opzionale)
```bash
# Per progetti più grandi
DATABASE_URL=postgresql://user:pass@host:port/db
pip install psycopg2-binary
```

## 🔒 Sicurezza

### HTTPS
- Vercel/Netlify: HTTPS automatico
- Custom domain: Usa Cloudflare

### CORS
```python
# Backend configurato per:
CORS_ORIGINS = [
    "https://your-domain.com",
    "https://your-domain.vercel.app"
]
```

### Headers di sicurezza
```nginx
# Nginx config inclusa
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## 📊 Monitoring

### Analytics
```javascript
// Google Analytics 4
// Aggiungi in frontend/index.html
gtag('config', 'GA_MEASUREMENT_ID');
```

### Error Tracking
```javascript
// Sentry (opzionale)
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "YOUR_DSN" });
```

### Performance
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

## 🚀 CI/CD Automatico

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy Portfolio
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### Vercel Auto-Deploy
- Connetti repository GitHub
- Deploy automatico su push
- Preview deployments su PR

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### CORS Issues
```python
# Backend: aggiungi dominio frontend
CORS(app, origins=["https://your-frontend.com"])
```

### Database Issues
```bash
# Reset database
rm backend/app.db
python backend/quick_server.py  # Ricrea automaticamente
```

## 📈 Ottimizzazione

### Frontend
```bash
# Bundle analysis
cd frontend
pnpm run build
npx vite-bundle-analyzer dist
```

### Backend
```python
# Caching con Redis (opzionale)
pip install redis flask-caching
```

### CDN
- Immagini: Cloudinary/ImageKit
- Assets: Vercel/Netlify CDN
- API: CloudFlare

## 🎯 Custom Domain

### Vercel
```bash
# 1. Aggiungi domain su Vercel dashboard
# 2. Configura DNS
# CNAME: www -> cname.vercel-dns.com
# A: @ -> 76.76.19.61
```

### GitHub Pages
```bash
# 1. Aggiungi CNAME file
echo "your-domain.com" > frontend/dist/CNAME

# 2. Configura DNS
# CNAME: www -> yourusername.github.io
```

## 📞 Supporto

Se hai problemi con il deployment:

1. **Controlla logs**: Vercel/Netlify dashboard
2. **Test locale**: `npm run dev`
3. **Verifica DNS**: `dig your-domain.com`
4. **CORS**: Controlla Network tab in DevTools

## 🎉 Post-Deployment

### SEO
- [ ] Sitemap.xml generato
- [ ] Meta tags configurati
- [ ] Open Graph images
- [ ] Schema.org markup

### Performance
- [ ] Lighthouse score > 90
- [ ] Images ottimizzate
- [ ] Lazy loading attivo
- [ ] Caching configurato

### Analytics
- [ ] Google Analytics attivo
- [ ] Search Console configurato
- [ ] Error tracking attivo

---

**Happy Deploying! 🚀**

