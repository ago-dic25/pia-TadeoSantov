const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URLs a probar
const urls = [
  { name: 'index', url: 'http://localhost:8080/index.html' },
  { name: 'ordenar', url: 'http://localhost:8080/ordenar.html' },
  { name: 'questions', url: 'http://localhost:8080/questions.html' }
];

// Crear directorio para reportes si no existe
const reportsDir = path.join(__dirname, '..', 'reports', 'axe');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function runAxe(url, name) {
  console.log(`\n🔍 Ejecutando Axe para: ${name} (${url})`);
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navegar a la página
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Ejecutar Axe
    const results = await new AxePuppeteer(page).analyze();
    
    // Cerrar navegador
    await browser.close();
    
    // Guardar reporte
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonReport = path.join(reportsDir, `axe-${name}-${timestamp}.json`);
    const htmlReport = path.join(reportsDir, `axe-${name}-${timestamp}.html`);
    
    fs.writeFileSync(jsonReport, JSON.stringify(results, null, 2));
    
    // Generar reporte HTML
    const htmlContent = generateHTMLReport(results, name, url);
    fs.writeFileSync(htmlReport, htmlContent);
    
    // Mostrar resultados
    const violations = results.violations.length;
    const passes = results.passes.length;
    const incomplete = results.incomplete.length;
    
    console.log(`\n📊 Resultados para ${name}:`);
    console.log(`   ✅ Pruebas pasadas: ${passes}`);
    console.log(`   ❌ Violaciones: ${violations}`);
    console.log(`   ⚠️  Incompletas: ${incomplete}`);
    
    if (violations > 0) {
      console.log(`\n   Violaciones encontradas:`);
      results.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`      Impacto: ${violation.impact}`);
        console.log(`      Elementos afectados: ${violation.nodes.length}`);
      });
    }
    
    console.log(`\n✅ Reporte JSON guardado en: ${jsonReport}`);
    console.log(`✅ Reporte HTML guardado en: ${htmlReport}`);
    
    return results;
  } catch (error) {
    console.error(`❌ Error al ejecutar Axe para ${name}:`, error.message);
    return null;
  }
}

function generateHTMLReport(results, name, url) {
  const violations = results.violations || [];
  const passes = results.passes || [];
  
  let violationsHTML = '';
  if (violations.length > 0) {
    violationsHTML = violations.map(v => `
      <div class="violation">
        <h3>${v.id}: ${v.description}</h3>
        <p><strong>Impacto:</strong> ${v.impact}</p>
        <p><strong>Ayuda:</strong> ${v.help}</p>
        <p><strong>Elementos afectados:</strong> ${v.nodes.length}</p>
        <details>
          <summary>Ver detalles</summary>
          <pre>${JSON.stringify(v.nodes, null, 2)}</pre>
        </details>
      </div>
    `).join('');
  } else {
    violationsHTML = '<p class="success">✅ No se encontraron violaciones de accesibilidad.</p>';
  }
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Axe - ${name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    .summary { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .violation { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .success { color: #155724; background: #d4edda; padding: 15px; border-radius: 4px; }
    details { margin-top: 10px; }
    pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat { flex: 1; padding: 15px; background: #e9ecef; border-radius: 5px; text-align: center; }
    .stat-number { font-size: 2em; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reporte de Accesibilidad Axe - ${name}</h1>
    <p><strong>URL:</strong> <a href="${url}">${url}</a></p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-number" style="color: #28a745;">${passes.length}</div>
        <div>Pruebas Pasadas</div>
      </div>
      <div class="stat">
        <div class="stat-number" style="color: #dc3545;">${violations.length}</div>
        <div>Violaciones</div>
      </div>
      <div class="stat">
        <div class="stat-number" style="color: #ffc107;">${results.incomplete?.length || 0}</div>
        <div>Incompletas</div>
      </div>
    </div>
    
    <h2>Violaciones de Accesibilidad</h2>
    ${violationsHTML}
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Iniciando pruebas de accesibilidad con Axe...');
  console.log('⚠️  Asegúrate de tener un servidor local corriendo en http://localhost:8080');
  console.log('   Puedes usar: python -m http.server 8080 o npx serve -p 8080\n');
  
  const results = [];
  
  for (const { name, url } of urls) {
    const result = await runAxe(url, name);
    if (result) {
      results.push({ name, result });
    }
    // Esperar un poco entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generar resumen
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE RESULTADOS');
  console.log('='.repeat(60));
  
  let totalViolations = 0;
  let totalPasses = 0;
  
  results.forEach(({ name, result }) => {
    const violations = result.violations.length;
    const passes = result.passes.length;
    totalViolations += violations;
    totalPasses += passes;
    
    console.log(`\n${name.toUpperCase()}:`);
    console.log(`  ✅ Pasadas: ${passes}`);
    console.log(`  ❌ Violaciones: ${violations}`);
  });
  
  console.log(`\n📊 TOTALES:`);
  console.log(`  ✅ Pruebas pasadas: ${totalPasses}`);
  console.log(`  ❌ Violaciones: ${totalViolations}`);
  
  console.log('\n✅ Pruebas completadas. Revisa los reportes en la carpeta reports/axe/');
}

main().catch(console.error);

