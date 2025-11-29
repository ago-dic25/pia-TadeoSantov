# Guía de Pruebas de Accesibilidad y Rendimiento

Este documento explica cómo ejecutar las pruebas de Lighthouse y Axe para evaluar la accesibilidad, rendimiento y mejores prácticas del sitio web.

## 📋 Requisitos Previos

1. **Node.js** (versión 14 o superior)
   - Descarga desde: https://nodejs.org/

2. **Servidor local** para servir los archivos HTML
   - Opción 1: Python (viene preinstalado en la mayoría de sistemas)
   - Opción 2: Node.js con `npx serve`

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

Esto instalará:
- `lighthouse` - Herramienta de auditoría de Google
- `@axe-core/cli` - Herramienta de accesibilidad Axe
- `puppeteer` - Navegador automatizado
- `chrome-launcher` - Para ejecutar Chrome

## 🏃 Ejecutar las Pruebas

### Paso 1: Iniciar el Servidor Local

**Opción A - Con el script incluido (Recomendado):**
```bash
npm run server
```

**Opción B - Con Python:**
```bash
python -m http.server 8080
```

**Opción C - Con Node.js serve:**
```bash
npx serve -p 8080
```

El servidor debe estar corriendo en `http://localhost:8080`

**Nota**: Mantén el servidor corriendo en una terminal mientras ejecutas las pruebas en otra.

### Paso 2: Ejecutar las Pruebas

**Ejecutar solo Lighthouse:**
```bash
npm run lighthouse
```

**Ejecutar solo Axe:**
```bash
npm run axe
```

**Ejecutar ambas pruebas:**
```bash
npm run test:all
```

**Ejecutar todas las pruebas incluyendo capturas:**
```bash
npm run test:complete
```

## 📊 Interpretar los Resultados

### Lighthouse

Lighthouse genera reportes en formato HTML y JSON en la carpeta `reports/lighthouse/`.

**Métricas evaluadas:**
- **Performance** (Rendimiento): Velocidad de carga, tiempo de respuesta
- **Accessibility** (Accesibilidad): Cumplimiento de estándares WCAG
- **Best Practices** (Mejores Prácticas): Seguridad, mejores prácticas web
- **SEO** (Optimización para motores de búsqueda): Meta tags, estructura

**Puntuación:**
- 90-100: Excelente (verde)
- 50-89: Necesita mejoras (amarillo)
- 0-49: Pobre (rojo)

### Axe

Axe genera reportes en formato HTML y JSON en la carpeta `reports/axe/`.

**Tipos de resultados:**
- ✅ **Pasadas**: Pruebas que cumplen con los estándares
- ❌ **Violaciones**: Problemas de accesibilidad encontrados
- ⚠️ **Incompletas**: Pruebas que requieren revisión manual

**Niveles de impacto:**
- **Critical**: Problemas graves que bloquean el uso
- **Serious**: Problemas importantes que dificultan el uso
- **Moderate**: Problemas que pueden causar inconvenientes
- **Minor**: Problemas menores

## 🔧 Correcciones Básicas Implementadas

### Accesibilidad

1. ✅ **Meta tags SEO**: Agregados description, keywords y author
2. ✅ **Skip links**: Enlace para saltar al contenido principal
3. ✅ **Estructura semántica**: Uso de `<main>` para contenido principal
4. ✅ **Alt text**: Todas las imágenes tienen texto alternativo descriptivo
5. ✅ **ARIA labels**: Agregados en elementos interactivos
6. ✅ **Contraste de colores**: Verificado en estilos personalizados

### Mejores Prácticas

1. ✅ **Validación de formularios**: HTML5 y Bootstrap
2. ✅ **Responsive design**: Media queries y Bootstrap grid
3. ✅ **Performance**: Optimización de imágenes y carga de recursos

## 📁 Estructura de Reportes

```
reports/
├── lighthouse/
│   ├── lighthouse-index-[timestamp].html
│   ├── lighthouse-index-[timestamp].json
│   ├── lighthouse-ordenar-[timestamp].html
│   └── lighthouse-questions-[timestamp].html
└── axe/
    ├── axe-index-[timestamp].html
    ├── axe-index-[timestamp].json
    ├── axe-ordenar-[timestamp].html
    └── axe-questions-[timestamp].json
```

## 📸 Capturas de Pantalla

### Opción 1: Automática (Recomendada)

Ejecuta el script para capturar automáticamente todas las páginas:

```bash
npm run screenshots
```

Esto generará capturas en la carpeta `screenshots/`:
- `index-full.png` - Captura completa de la página principal
- `index-viewport.png` - Captura del viewport (1920x1080)
- `ordenar-full.png` - Captura completa de la página de pedidos
- `questions-full.png` - Captura completa de la página de preguntas

### Opción 2: Manual

Para guardar capturas de los reportes manualmente:

1. Abre los archivos HTML de los reportes en tu navegador
2. Usa la herramienta de captura de pantalla de tu sistema:
   - **Windows**: `Win + Shift + S`
   - **Mac**: `Cmd + Shift + 4`
   - **Linux**: `Print Screen` o herramientas de captura

Guarda las capturas en una carpeta `screenshots/` con nombres descriptivos:
- `lighthouse-index-performance.png`
- `lighthouse-index-accessibility.png`
- `axe-violations-index.png`

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "ECONNREFUSED"
- Asegúrate de que el servidor local esté corriendo en el puerto 8080
- Verifica que no haya otro proceso usando ese puerto

### Error: "Chrome not found"
- Lighthouse intentará descargar Chrome automáticamente
- Si falla, instala Chrome manualmente

### Las pruebas son lentas
- Es normal, especialmente en la primera ejecución
- Lighthouse y Axe necesitan tiempo para analizar completamente la página

## 📚 Recursos Adicionales

- [Documentación de Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Documentación de Axe](https://www.deque.com/axe/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

## ✅ Checklist de Accesibilidad

- [ ] Todas las imágenes tienen `alt` text descriptivo
- [ ] Los formularios tienen labels asociados
- [ ] Los colores tienen suficiente contraste (mínimo 4.5:1)
- [ ] La navegación es accesible por teclado
- [ ] Los elementos interactivos tienen estados de focus visibles
- [ ] El contenido tiene estructura semántica (headings, landmarks)
- [ ] Los errores de formulario son claros y accesibles
- [ ] El sitio es responsive y funciona en diferentes tamaños de pantalla

---

**Nota**: Estas pruebas son parte del proceso de desarrollo. Los reportes ayudan a identificar áreas de mejora, pero siempre es importante probar manualmente con usuarios reales y herramientas de asistencia.

