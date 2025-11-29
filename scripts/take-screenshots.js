const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URLs a capturar
const urls = [
  { name: 'index', url: 'http://localhost:8080/index.html' },
  { name: 'ordenar', url: 'http://localhost:8080/ordenar.html' },
  { name: 'questions', url: 'http://localhost:8080/questions.html' }
];

// Crear directorio para capturas si no existe
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot(url, name) {
  console.log(`📸 Capturando pantalla de: ${name}...`);
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navegar a la página
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Esperar un poco para que todo cargue
    await page.waitForTimeout(2000);
    
    // Tomar captura completa
    const screenshotPath = path.join(screenshotsDir, `${name}-full.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`   ✅ Guardada: ${screenshotPath}`);
    
    // Captura de viewport normal
    const viewportPath = path.join(screenshotsDir, `${name}-viewport.png`);
    await page.screenshot({
      path: viewportPath,
      fullPage: false
    });
    
    console.log(`   ✅ Guardada: ${viewportPath}`);
    
    await browser.close();
    return true;
  } catch (error) {
    console.error(`   ❌ Error al capturar ${name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando capturas de pantalla...');
  console.log('⚠️  Asegúrate de tener un servidor local corriendo en http://localhost:8080');
  console.log('   Ejecuta: npm run server\n');
  
  for (const { name, url } of urls) {
    await takeScreenshot(url, name);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Capturas completadas. Revisa la carpeta screenshots/');
}

main().catch(console.error);

