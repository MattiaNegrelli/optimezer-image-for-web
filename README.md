# 🚀 OptiImg - Image Optimizer

**OptiImg** è un tool moderno e potente per l'ottimizzazione delle immagini, sviluppato in Node.js. Offre sia una **interfaccia web** intuitiva con Drag & Drop, sia uno **strumento CLI** per l'elaborazione batch da terminale.

![OptiImg Preview](https://via.placeholder.com/800x400?text=OptiImg+Preview)

## ✨ Funzionalità

- **Interfaccia Web Moderna**: Design "Glassmorphism", Drag & Drop, e download automatico dello ZIP.
- **CLI Potente**: Script per ottimizzare intere cartelle di immagini in un colpo solo.
- **Ottimizzazione Intelligente**:
  - Ridimensionamento automatico (max width configurabile).
  - Compressione JPG (MozJPEG) e PNG (Quantizzazione).
  - Conversione automatica in **WebP** per il web.
  - Rimozione metadati (EXIF) per la privacy.

## 🛠 Tecnologia

- **Runtime**: Node.js
- **Core**: [Sharp](https://sharp.pixelplumbing.com/) (elaborazione immagini ad alte prestazioni)
- **Server**: Express.js
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES Modules)

## 📦 Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuo-username/optiimg.git
   cd optiimg
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

## 🚀 Utilizzo

### 🌐 Interfaccia Web

Avvia il server locale:
```bash
npm start
```
Apri il browser su **`http://localhost:3000`**.
Trascina le immagini, configura la qualità e scarica lo ZIP ottimizzato!

### 💻 Riga di Comando (CLI)

Puoi ottimizzare una cartella di immagini senza avviare il server web.

1. Metti le tue immagini nella cartella `input` (o dove preferisci).
2. Esegui il comando:
   ```bash
   npm run optimize
   ```

**Opzioni Avanzate CLI:**
Puoi specificare cartelle e parametri personalizzati:
```bash
node optimize-images.mjs --input="./foto-raw" --output="./foto-web" --maxWidth=1920 --qualityJpg=80
```

## ☁️ Deploy su Render.com

Questo progetto è pronto per essere ospitato su **Render** (o altri PaaS come Railway/Fly.io).

1. Crea un nuovo **Web Service** su Render.
2. Collega il tuo repository GitHub.
3. Impostazioni:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Deploy! 🚀

> **Nota**: Non usare Vercel/Netlify standard perché il file system è in sola lettura. Serve un hosting Node.js attivo.

## 📄 Licenza

Distribuito sotto licenza MIT. Sentiti libero di usarlo e modificarlo!
