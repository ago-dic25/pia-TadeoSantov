const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuración de Lighthouse
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'interactive',
      'accessibility',
      'best-practices',
      'seo',
      'performance'
    ],
  },
};

// URLs a probar
const urls = [
  { name: 'index', url: 'http://localhost:8080/index.html' },
  { name: 'ordenar', url: 'http://localhost:8080/ordenar.html' },
  { name: 'questions', url: 'http://localhost:8080/questions.html' }
];

// Crear directorio para reportes si no existe
const reportsDir = path.join(__dirname, '..', 'reports', 'lighthouse');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function runLighthouse(url, name) {
  console.log(`\n🔍 Ejecutando Lighthouse para: ${name} (${url})`);
  
  try {
    // Lanzar Chrome
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    
    // Ejecutar Lighthouse
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'info',
    }, config);
    
    // Cerrar Chrome
    await chrome.kill();
    
    // Guardar reportes
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlReport = path.join(reportsDir, `lighthouse-${name}-${timestamp}.html`);
    const jsonReport = path.join(reportsDir, `lighthouse-${name}-${timestamp}.json`);
    
    fs.writeFileSync(htmlReport, runnerResult.report[0]);
    fs.writeFileSync(jsonReport, JSON.stringify(runnerResult.lhr, null, 2));
    
    // Mostrar resultados
    const scores = runnerResult.lhr.categories;
    console.log(`\n📊 Resultados para ${name}:`);
    console.log(`   Performance: ${Math.round(scores.performance.score * 100)}`);
    console.log(`   Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
    console.log(`   Best Practices: ${Math.round(scores['best-practices'].score * 100)}`);
    console.log(`   SEO: ${Math.round(scores.seo.score * 100)}`);
    console.log(`\n✅ Reporte HTML guardado en: ${htmlReport}`);
    console.log(`✅ Reporte JSON guardado en: ${jsonReport}`);
    
    return runnerResult;
  } catch (error) {
    console.error(`❌ Error al ejecutar Lighthouse para ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de Lighthouse...');
  console.log('⚠️  Asegúrate de tener un servidor local corriendo en http://localhost:8080');
  console.log('   Puedes usar: python -m http.server 8080 o npx serve -p 8080\n');
  
  const results = [];
  
  for (const { name, url } of urls) {
    const result = await runLighthouse(url, name);
    if (result) {
      results.push({ name, result });
    }
    // Esperar un poco entre pruebas
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generar resumen
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE RESULTADOS');
  console.log('='.repeat(60));
  
  results.forEach(({ name, result }) => {
    const scores = result.lhr.categories;
    console.log(`\n${name.toUpperCase()}:`);
    console.log(`  Performance: ${Math.round(scores.performance.score * 100)}/100`);
    console.log(`  Accessibility: ${Math.round(scores.accessibility.score * 100)}/100`);
    console.log(`  Best Practices: ${Math.round(scores['best-practices'].score * 100)}/100`);
    console.log(`  SEO: ${Math.round(scores.seo.score * 100)}/100`);
  });
  
  console.log('\n✅ Pruebas completadas. Revisa los reportes en la carpeta reports/lighthouse/');
}

main().catch(console.error);

