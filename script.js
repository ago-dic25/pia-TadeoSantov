let map;
let marker;

// Función para descargar PDFs
function descargar(ruta) {
    const link = document.createElement("a");
    link.href = ruta;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Validación de Bootstrap para formularios
(function() {
    'use strict';
    
    // Obtener todos los formularios que necesitan validación
    const forms = document.querySelectorAll('.needs-validation');
    
    // Validar cada formulario
    Array.from(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Manejo del formulario de pedidos
document.addEventListener('DOMContentLoaded', function() {
    const formPedido = document.getElementById('formPedido');
    
    if (formPedido) {
        // Establecer fecha mínima como hoy
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            const today = new Date().toISOString().split('T')[0];
            fechaInput.setAttribute('min', today);
        }
        
        // Contador de caracteres para comentarios
        const comentariosInput = document.getElementById('comentarios');
        const contadorComentarios = document.getElementById('contadorComentarios');
        
        if (comentariosInput && contadorComentarios) {
            comentariosInput.addEventListener('input', function() {
                contadorComentarios.textContent = this.value.length;
            });
        }
        
        // Validación de teléfono en tiempo real
        const telefonoInput = document.getElementById('telefono');
        if (telefonoInput) {
            telefonoInput.addEventListener('input', function() {
                // Remover caracteres no numéricos
                this.value = this.value.replace(/\D/g, '');
            });
        }
        
        // Manejo del envío del formulario
        formPedido.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Verificar si el formulario es válido
            if (!formPedido.checkValidity()) {
                formPedido.classList.add('was-validated');
                return;
            }
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const sucursal = document.getElementById('sucursal').value;
            const producto = document.getElementById('producto').value;
            const cantidad = document.getElementById('cantidad').value;
            const fecha = document.getElementById('fecha').value;
            const comentarios = document.getElementById('comentarios').value;
            
            // Mostrar spinner de carga
            const btnTexto = document.getElementById('btnTexto');
            const btnSpinner = document.getElementById('btnSpinner');
            btnTexto.textContent = 'Enviando...';
            btnSpinner.classList.remove('d-none');
            
            // Simular envío (en un proyecto real, aquí se enviaría al servidor)
            setTimeout(function() {
                // Ocultar spinner
                btnTexto.textContent = 'Enviar Pedido';
                btnSpinner.classList.add('d-none');
                
                // Mostrar mensaje de éxito
                const mensajeExito = document.getElementById('mensajeExito');
                mensajeExito.classList.remove('d-none');
                
                // Scroll al mensaje de éxito
                mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Limpiar formulario después de 3 segundos
                setTimeout(function() {
                    formPedido.reset();
                    formPedido.classList.remove('was-validated');
                    mensajeExito.classList.add('d-none');
                    if (contadorComentarios) contadorComentarios.textContent = '0';
                }, 5000);
            }, 1500);
        });
    }
    
    // Manejo del formulario de contacto
    const formContacto = document.getElementById('formContacto');
    
    if (formContacto) {
        // Contador de caracteres para mensaje
        const mensajeInput = document.getElementById('contactoMensaje');
        const contadorMensaje = document.getElementById('contadorMensaje');
        
        if (mensajeInput && contadorMensaje) {
            mensajeInput.addEventListener('input', function() {
                contadorMensaje.textContent = this.value.length;
            });
        }
        
        // Manejo del envío del formulario de contacto
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Verificar si el formulario es válido
            if (!formContacto.checkValidity()) {
                formContacto.classList.add('was-validated');
                return;
            }
            
            // Mostrar spinner de carga
            const btnContactoTexto = document.getElementById('btnContactoTexto');
            const btnContactoSpinner = document.getElementById('btnContactoSpinner');
            btnContactoTexto.textContent = 'Enviando...';
            btnContactoSpinner.classList.remove('d-none');
            
            // Simular envío
            setTimeout(function() {
                // Ocultar spinner
                btnContactoTexto.textContent = 'Enviar Mensaje';
                btnContactoSpinner.classList.add('d-none');
                
                // Mostrar mensaje de éxito
                const mensajeContactoExito = document.getElementById('mensajeContactoExito');
                mensajeContactoExito.classList.remove('d-none');
                
                // Scroll al mensaje de éxito
                mensajeContactoExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Limpiar formulario después de 3 segundos
                setTimeout(function() {
                    formContacto.reset();
                    formContacto.classList.remove('was-validated');
                    if (contadorMensaje) contadorMensaje.textContent = '0';
                }, 5000);
            }, 1500);
        });
    }
});

// Función para Google Maps (si se necesita en el futuro)
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.6866, lng: -100.3161 },
        zoom: 12
    });

    marker = new google.maps.Marker({
        position: { lat: 25.6866, lng: -100.3161 },
        map: map
    });
}

function irAlMapa(lat, lng) {
    const posicion = { lat: lat, lng: lng };
    map.panTo(posicion);
    map.setZoom(15);
    marker.setPosition(posicion);
    document.getElementById("mapa").scrollIntoView({
        behavior: 'smooth'
    });
}

