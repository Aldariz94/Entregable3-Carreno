Proyecto Final: Concesionaria Interactiva 🚗🚙
Descripción del Proyecto
Este proyecto es una aplicación web que simula la venta y el arriendo de vehículos. Los usuarios pueden navegar por un catálogo (cargado desde un archivo JSON), agregar vehículos a un carrito (ya sea para comprar o arrendar), y al finalizar, ingresar sus datos personales (nombre, apellidos, RUT, fecha de nacimiento y correo). Posteriormente, se intenta enviar un correo de confirmación mediante EmailJS.

Nota del Estudiante:
Aunque en el panel de EmailJS se registran las "Requests received", los correos no llegan al destinatario. He verificado la carpeta de spam y la configuración, pero el problema persiste. Esto podría deberse a la autorización del dominio o a la configuración de la plantilla. Estoy atento a cualquier retroalimentación para mejorar este aspecto.

Objetivos
Generales
Crear un simulador interactivo que permita simular el proceso de compra o arriendo de vehículos.
Específicos
Cargar datos remotos desde un archivo JSON.
Generar HTML dinámicamente a partir de JavaScript.
Utilizar herramientas modernas de JavaScript, como SweetAlert2 para modales y EmailJS para el envío de correos.
Implementar un flujo completo de proceso: selección de vehículos, administración del carrito (agregar, eliminar), captura de datos personales y finalización de la compra/arriendo.
Persistir la información del carrito mediante localStorage.
Estructura del Proyecto
index.html:
Contiene la estructura principal de la aplicación, enlaza con la hoja de estilos y las librerías necesarias (SweetAlert2, EmailJS) y carga el script principal de JavaScript.

style.css:
Define la apariencia visual de la aplicación. Se establecen estilos para el header, el catálogo de vehículos (tarjetas con imagen, información y botones de acción) y el footer, el cual muestra “© 2025 - ProyectoFinal+Daniel Carreño”.

vehiculos.json:
Archivo que simula la base de datos de vehículos. Cada objeto contiene atributos como id, marca, modelo, anio, precioVenta, precioArriendoDia, modalidades y imagen.

script.js:
Contiene toda la lógica de la aplicación:

Carga el catálogo desde vehiculos.json mediante fetch().
Renderiza dinámicamente el catálogo en el DOM.
Gestiona el carrito de compra/arriendo (agregar, eliminar y actualizar el contador).
Al finalizar la compra, solicita datos personales a través de modales de SweetAlert2.
Envía un correo de confirmación utilizando EmailJS (envío real mediante API, con Public Key, Service ID y Template ID).
Flujo de Usuario
Carga del Catálogo:
Al abrir la página, se carga el catálogo de vehículos (cargado desde el archivo JSON) y se muestran en tarjetas con imagen, detalles y botones de acción.

Selección de Vehículos:

Comprar: Si el vehículo está disponible para venta, se puede agregar al carrito pulsando el botón "Comprar".
Arrendar: Si el vehículo está disponible para arriendo, se solicita el número de días y se agrega al carrito con el cálculo correspondiente.
Administración del Carrito:
El usuario puede ver el carrito haciendo clic en "Ver Carrito", donde se listan todos los ítems agregados, con la posibilidad de eliminar cada uno.

Checkout:
Al finalizar la compra, se muestra un formulario (a través de un modal) para ingresar datos personales (nombre, apellidos, RUT, fecha de nacimiento y correo).

Envío de Correo:
Con EmailJS, se construye un mensaje con los datos del usuario y el detalle de la compra/arriendo, y se envía un correo de confirmación.

Nota: Aunque se registran las solicitudes (Requests received) en EmailJS, los correos aún no llegan al destinatario. Esto se debe revisar en la configuración (dominio autorizado, campos de la plantilla, etc.).

Requisitos Técnicos y Configuración
Servidor Local:
Para que fetch() funcione correctamente y se cargue el archivo vehiculos.json, se debe ejecutar el proyecto mediante un servidor local (por ejemplo, usando Live Server en Visual Studio Code o python -m http.server).

EmailJS:

Public Key: qHnuOixwh_ZNv1193 (se utiliza en emailjs.init()).
Service ID: service_e04vbo9.
Template ID: template_mbs2n3a.
Estos valores deben estar configurados exactamente en el código y en el panel de EmailJS. Asegúrate de que el dominio de origen (por ejemplo, http://127.0.0.1:5500) esté autorizado en EmailJS.
LocalStorage:
El carrito se guarda en localStorage para persistir la información entre recargas de página.

Problemas Conocidos y Próximos Pasos
Envío de Correo:
Aunque EmailJS recibe las solicitudes, los correos no se entregan al destinatario. Posibles causas a investigar:
Dominio no autorizado en la configuración de EmailJS.
Variables o campos en la plantilla que no coinciden exactamente con los enviados desde el código.
Restricciones del proveedor de correo.
Revisión y Depuración:
Se recomienda revisar la consola del navegador para identificar posibles errores y ajustar la configuración en EmailJS según sea necesario.
Conclusión
Este proyecto demuestra la integración de diversas herramientas y conceptos aprendidos en el curso de JavaScript, tales como:

Carga y manipulación dinámica de datos (JSON, DOM).
Gestión de un carrito de compra con persistencia en localStorage.
Uso de librerías externas (SweetAlert2 y EmailJS) para mejorar la interactividad y funcionalidad.
Flujo completo de compra/arriendo con captura de datos y envío de correo de confirmación.
A pesar de que actualmente se muestran las "Requests received" en EmailJS y aún no llegan los correos, se han realizado todas las configuraciones según la documentación. Se continuará trabajando en la depuración de este aspecto para lograr un envío exitoso.

¡Muchas gracias por revisar mi proyecto! Espero tus comentarios y sugerencias para seguir mejorando.