import fs from 'fs/promises';
import path from 'path';
import minimist from 'minimist';
import { processImage } from './processor.mjs';

const args = minimist(process.argv.slice(2), {
    string: ['input', 'output'],
    default: {
        input: './input',
        output: './output',
        maxWidth: 1600,
        qualityJpg: 75,
        qualityWebp: 75
    }
});

async function main() {
    const inputDir = path.resolve(args.input);
    const outputDir = path.resolve(args.output);

    console.log(`🚀 Avvio ottimizzazione immagini...`);
    console.log(`📂 Input: ${inputDir}`);
    console.log(`📂 Output: ${outputDir}`);
    console.log(`⚙️  Config: MaxWidth=${args.maxWidth}, Q-JPG=${args.qualityJpg}, Q-WebP=${args.qualityWebp}\n`);

    // Verifica input
    try {
        await fs.access(inputDir);
    } catch (e) {
        console.error(`❌ Errore: La cartella di input "${inputDir}" non esiste.`);
        process.exit(1);
    }

    // Crea output se non esiste
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (e) {
        console.error(`❌ Errore creazione cartella output: ${e.message}`);
        process.exit(1);
    }

    // Leggi file
    let files = [];
    try {
        const allFiles = await fs.readdir(inputDir);
        files = allFiles.filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg', '.jpeg', '.png'].includes(ext);
        });
    } catch (e) {
        console.error(`❌ Errore lettura file: ${e.message}`);
        process.exit(1);
    }

    if (files.length === 0) {
        console.log("⚠️  Nessuna immagine trovata nella cartella di input.");
        return;
    }

    console.log(`📸 Trovate ${files.length} immagini. Inizio elaborazione...\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let processedCount = 0;

    for (const file of files) {
        const inputPath = path.join(inputDir, file);

        try {
            const stats = await fs.stat(inputPath);
            const originalSize = stats.size;

            process.stdout.write(`⏳ Elaborazione ${file}... `);

            const result = await processImage(inputPath, outputDir, file, {
                maxWidth: parseInt(args.maxWidth),
                qualityJpg: parseInt(args.qualityJpg),
                qualityWebp: parseInt(args.qualityWebp)
            });

            totalOriginalSize += originalSize;
            totalOptimizedSize += result.optimizedSize; // Consideriamo il risparmio sul formato originale ottimizzato per il report principale
            processedCount++;

            const saved = originalSize - result.optimizedSize;
            const savedPercent = ((saved / originalSize) * 100).toFixed(1);

            console.log(`✅ Fatto! (Risparmio: ${savedPercent}%)`);
        } catch (err) {
            console.log(`❌ Errore: ${err.message}`);
        }
    }

    // Report finale
    console.log(`\n--------------------------------------------------`);
    console.log(`🎉 Elaborazione completata!`);
    console.log(`🖼  Immagini processate: ${processedCount}/${files.length}`);

    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);
    console.log(`💾 Peso totale PRIMA: ${toMB(totalOriginalSize)} MB`);
    console.log(`💾 Peso totale DOPO:  ${toMB(totalOptimizedSize)} MB`);

    if (totalOriginalSize > 0) {
        const totalSaved = totalOriginalSize - totalOptimizedSize;
        const totalSavedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1);
        console.log(`📉 Risparmio totale: ${totalSavedPercent}%`);
    }
    console.log(`--------------------------------------------------\n`);
}

main();
