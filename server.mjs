import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { processImage } from './processor.mjs';

// Configurazione
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware per file statici
app.use(express.static(path.join(__dirname, 'public')));

// Configurazione Multer (in memoria per semplicità)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Limite 50MB per file
});

// Endpoint ottimizzazione
app.post('/api/optimize', upload.array('images'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nessuna immagine caricata' });
    }

    // Crea cartella temporanea per questo job
    const jobId = Date.now().toString();
    const jobDir = path.join(__dirname, 'temp_output', jobId);

    try {
        await fs.mkdir(jobDir, { recursive: true });

        // Leggi configurazione dal body (o usa default)
        const maxWidth = parseInt(req.body.maxWidth) || 1600;
        const qualityJpg = parseInt(req.body.qualityJpg) || 75;
        const qualityWebp = parseInt(req.body.qualityWebp) || 75;

        // Processa tutte le immagini
        const tasks = req.files.map(file => {
            return processImage(file.buffer, jobDir, file.originalname, {
                maxWidth,
                qualityJpg,
                qualityWebp
            });
        });

        await Promise.all(tasks);

        // Prepara lo ZIP
        const archive = archiver('zip', { zlib: { level: 9 } });

        res.attachment('images-optimized.zip');

        // Pulizia post-download
        res.on('finish', async () => {
            try {
                await fs.rm(jobDir, { recursive: true, force: true });
                console.log(`🧹 Pulizia completata per job ${jobId}`);
            } catch (e) {
                console.error(`❌ Errore pulizia job ${jobId}:`, e);
            }
        });

        // Gestione errori archivio
        archive.on('error', (err) => {
            throw err;
        });

        // Pipe dell'archivio alla risposta
        archive.pipe(res);

        // Aggiungi i file dalla cartella temporanea
        archive.directory(jobDir, false);

        await archive.finalize();
        console.log(`✅ Job ${jobId} completato: ${req.files.length} immagini ottimizzate.`);

    } catch (err) {
        console.error(`❌ Errore server:`, err);
        // Tenta pulizia in caso di errore
        try { await fs.rm(jobDir, { recursive: true, force: true }); } catch (e) { }

        if (!res.headersSent) {
            res.status(500).json({ error: 'Errore durante l\'elaborazione delle immagini' });
        }
    }
});

// Avvio server
app.listen(PORT, () => {
    console.log(`\n🚀 Server avviato su http://localhost:${PORT}`);
});
