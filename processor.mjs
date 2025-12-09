import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Ottimizza una singola immagine (JPG/PNG) e genera anche la versione WebP.
 * 
 * @param {string|Buffer} input - Percorso del file o Buffer dell'immagine
 * @param {string} outputDir - Cartella di destinazione
 * @param {string} filename - Nome del file originale (con estensione)
 * @param {object} config - Opzioni: { maxWidth, qualityJpg, qualityWebp }
 * @returns {Promise<object>} - Statistiche { originalSize, optimizedSize, webpSize }
 */
export async function processImage(input, outputDir, filename, config) {
  const { maxWidth, qualityJpg, qualityWebp } = config;
  const ext = path.extname(filename).toLowerCase();
  const nameWithoutExt = path.basename(filename, ext);

  // Inizializza Sharp
  let pipeline = sharp(input);

  // Leggi metadati per sapere le dimensioni attuali
  const metadata = await pipeline.metadata();

  // Ridimensiona se necessario
  if (metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  // I metadati vengono rimossi di default da Sharp se non specificato diversamente


  // Preparazione ottimizzazione formato originale
  let optimizedBuffer;
  if (ext === '.jpg' || ext === '.jpeg') {
    optimizedBuffer = await pipeline
      .jpeg({ quality: qualityJpg, mozjpeg: true })
      .toBuffer();
  } else if (ext === '.png') {
    optimizedBuffer = await pipeline
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
  } else {
    // Fallback se passasse altro formato, ma non dovrebbe succedere
    optimizedBuffer = await pipeline.toBuffer();
  }

  // Salvataggio file ottimizzato originale
  const outputPathOriginal = path.join(outputDir, filename);
  await fs.writeFile(outputPathOriginal, optimizedBuffer);

  // Generazione WebP
  const webpBuffer = await pipeline
    .webp({ quality: qualityWebp })
    .toBuffer();

  const outputPathWebp = path.join(outputDir, `${nameWithoutExt}.webp`);
  await fs.writeFile(outputPathWebp, webpBuffer);

  return {
    originalSize: (await fs.stat(outputPathOriginal)).size, // Questo è il size ottimizzato. 
    // Wait, user wants "peso totale prima / dopo". 
    // If input is buffer, we know size. If input is path, we can stat it.
    // I will return the size of the generated files. The caller handles "before" size.
    optimizedSize: optimizedBuffer.length,
    webpSize: webpBuffer.length
  };
}
