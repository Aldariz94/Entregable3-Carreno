document.addEventListener('DOMContentLoaded', () => {
  // Inicializa EmailJS con tu clave pública
  emailjs.init("qHnuOixwh_ZNv1193");

  const vehiculosContainer = document.getElementById('vehiculosContainer');
  const btnCarrito = document.getElementById('btnCarrito');
  const cartCountElem = document.getElementById('cartCount');

  let catalogo = [];
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Formatea precios a CLP
  function formatearCLP(numero) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(numero);
  }

  // Actualiza el contador de ítems en el carrito
  function actualizarContador() {
    cartCountElem.textContent = carrito.length;
  }

  // Guarda el carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Muestra el catálogo de vehículos
  function mostrarCatalogo() {
    vehiculosContainer.innerHTML = '';
    catalogo.forEach(vehiculo => {
      const div = document.createElement('div');
      div.classList.add('vehiculo');

      // Botones según las modalidades
      let botonesHTML = '';
      if (vehiculo.modalidades.includes('venta')) {
        botonesHTML += `<button class="btnVenta" data-id="${vehiculo.id}">Comprar</button>`;
      }
      if (vehiculo.modalidades.includes('arriendo')) {
        botonesHTML += `<button class="btnArriendo" data-id="${vehiculo.id}">Arrendar</button>`;
      }

      div.innerHTML = `
        <img src="${vehiculo.imagen}" alt="${vehiculo.marca} ${vehiculo.modelo}">
        <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
        <p>Año: ${vehiculo.anio}</p>
        <p>Precio Venta: ${formatearCLP(vehiculo.precioVenta)}</p>
        <p>Arriendo/día: ${formatearCLP(vehiculo.precioArriendoDia)}</p>
        <div class="botonesAccion">${botonesHTML}</div>
      `;
      vehiculosContainer.appendChild(div);
    });
  }

  // Comprar vehículo (tipo 'venta')
  function comprarVehiculo(id) {
    const vehiculo = catalogo.find(v => v.id === id);
    if (!vehiculo) return;
    const itemCarrito = {
      vehiculo: vehiculo,
      tipo: 'venta',
      dias: 0,
      precioTotal: vehiculo.precioVenta
    };
    carrito.push(itemCarrito);
    guardarCarrito();
    actualizarContador();
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `${vehiculo.marca} ${vehiculo.modelo} (venta)`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Arrendar vehículo (tipo 'arriendo')
  function arrendarVehiculo(id) {
    const vehiculo = catalogo.find(v => v.id === id);
    if (!vehiculo) return;
    Swal.fire({
      title: '¿Cuántos días deseas arrendar?',
      input: 'number',
      inputLabel: 'Número de días',
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return 'Ingresa un número de días válido.';
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        const dias = parseInt(result.value);
        const precioTotal = vehiculo.precioArriendoDia * dias;
        const itemCarrito = {
          vehiculo: vehiculo,
          tipo: 'arriendo',
          dias: dias,
          precioTotal: precioTotal
        };
        carrito.push(itemCarrito);
        guardarCarrito();
        actualizarContador();
        Swal.fire({
          icon: 'success',
          title: '¡Agregado al carrito!',
          text: `${vehiculo.marca} ${vehiculo.modelo} (arriendo ${dias} día/s)`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // Envía correo usando EmailJS (Opción A: un solo "message")
  function enviarCorreoConfirmacion(datosUsuario, carrito) {
    let contenido = `Confirmación de Compra\n\n`;
    contenido += `Nombre: ${datosUsuario.nombre} ${datosUsuario.apellidos}\n`;
    contenido += `RUT: ${datosUsuario.rut}\n`;
    contenido += `Fecha de Nacimiento: ${datosUsuario.fechaNacimiento}\n`;
    contenido += `Correo: ${datosUsuario.correo}\n\n`;
    contenido += `Detalle:\n`;

    carrito.forEach((item, index) => {
      if (item.tipo === 'venta') {
        contenido += `[Venta] ${item.vehiculo.marca} ${item.vehiculo.modelo} - ${formatearCLP(item.precioTotal)}\n`;
      } else {
        contenido += `[Arriendo] ${item.vehiculo.marca} ${item.vehiculo.modelo} - ${formatearCLP(item.precioTotal)} (${item.dias} día/s)\n`;
      }
    });

    // Envía el correo (Service ID y Template ID que compartiste)
    emailjs.send('service_e04vbo9', 'template_mbs2n3a', {
      to_email: datosUsuario.correo,
      message: contenido
    })
    .then(response => {
      console.log('Correo enviado con éxito!', response.status, response.text);
    })
    .catch(err => {
      console.error('Error al enviar el correo:', err);
    });
  }

  // Muestra el checkout
  function mostrarCheckout() {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'No hay vehículos en tu carrito.'
      });
      return;
    }

    let htmlCarrito = '<ul style="text-align:left;">';
    carrito.forEach((item, index) => {
      const { vehiculo, tipo, dias, precioTotal } = item;
      if (tipo === 'venta') {
        htmlCarrito += `
          <li>
            <b>[Venta]</b> ${vehiculo.marca} ${vehiculo.modelo} - ${formatearCLP(precioTotal)}
            <button class="eliminarItem" data-index="${index}">Eliminar</button>
          </li>`;
      } else {
        htmlCarrito += `
          <li>
            <b>[Arriendo]</b> ${vehiculo.marca} ${vehiculo.modelo} - ${formatearCLP(precioTotal)}
            (${dias} día/s)
            <button class="eliminarItem" data-index="${index}">Eliminar</button>
          </li>`;
      }
    });
    htmlCarrito += '</ul>';

    Swal.fire({
      title: 'Revisa tu Carrito',
      html: htmlCarrito,
      showCancelButton: true,
      confirmButtonText: 'Finalizar Compra',
      cancelButtonText: 'Seguir Comprando',
      preConfirm: () => {
        return Swal.fire({
          title: 'Ingresa tus datos',
          html: `
            <div style="text-align:left;">
              <div style="display:flex; align-items:center; margin-bottom:10px;">
                <label style="width:120px;">Nombre:</label>
                <input type="text" id="nombre" style="flex:1;" required />
              </div>
              <div style="display:flex; align-items:center; margin-bottom:10px;">
                <label style="width:120px;">Apellidos:</label>
                <input type="text" id="apellidos" style="flex:1;" required />
              </div>
              <div style="display:flex; align-items:center; margin-bottom:10px;">
                <label style="width:120px;">RUT:</label>
                <input type="text" id="rut" style="flex:1;" required />
              </div>
              <div style="display:flex; align-items:center; margin-bottom:10px;">
                <label style="width:120px;">Fecha de Nacimiento:</label>
                <input type="date" id="fechaNacimiento" style="flex:1;" required />
              </div>
              <div style="display:flex; align-items:center; margin-bottom:10px;">
                <label style="width:120px;">Correo:</label>
                <input type="email" id="correo" style="flex:1;" required />
              </div>
            </div>`,
          focusConfirm: false,
          confirmButtonText: 'OK',
          preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const apellidos = document.getElementById('apellidos').value;
            const rut = document.getElementById('rut').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const correo = document.getElementById('correo').value;
            if (!nombre || !apellidos || !rut || !fechaNacimiento || !correo) {
              Swal.showValidationMessage('Completa todos los campos.');
              return false;
            }
            return { nombre, apellidos, rut, fechaNacimiento, correo };
          }
        });
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const datosUsuario = result.value;
        enviarCorreoConfirmacion(datosUsuario, carrito);
        carrito = [];
        guardarCarrito();
        actualizarContador();
        Swal.fire({
          icon: 'success',
          title: 'Compra Finalizada',
          text: '¡Gracias por tu compra! Se ha enviado un correo de confirmación.'
        });
      }
    });

    setTimeout(() => {
      document.querySelectorAll('.eliminarItem').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          carrito.splice(idx, 1);
          guardarCarrito();
          actualizarContador();
          Swal.close();
          mostrarCheckout();
        });
      });
    }, 300);
  }

  // Carga el catálogo
  async function cargarCatalogo() {
    try {
      const response = await fetch('vehiculos.json');
      if (!response.ok) {
        throw new Error('Error al cargar el JSON');
      }
      catalogo = await response.json();
      mostrarCatalogo();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el catálogo de vehículos.'
      });
    }
  }

  // Listeners
  vehiculosContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnVenta')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      comprarVehiculo(id);
    } else if (e.target.classList.contains('btnArriendo')) {
      const id = parseInt(e.target.getAttribute('data-id'));
      arrendarVehiculo(id);
    }
  });

  btnCarrito.addEventListener('click', mostrarCheckout);

  // Inicialización
  actualizarContador();
  cargarCatalogo();
});
