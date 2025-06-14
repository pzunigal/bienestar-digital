📚 Aplicación de Bienestar Digital Estudiantil
¡Bienvenido a la aplicación de Bienestar Digital Estudiantil! Esta herramienta está diseñada para ayudarte a gestionar tu tiempo frente a la pantalla, promover pausas activas y recordar hidratarse con notificaciones por navegador

🌟 Características Principales
Esta aplicación incluye las siguientes funcionalidades clave para apoyar tu bienestar digital:

⏰ Control de Horario de Pantalla:

Establece un límite de tiempo diario para el uso de la pantalla.
Un cronómetro de sesión te muestra el tiempo exacto que llevas en tu sesión actual (horas, minutos, segundos).
Puedes iniciar, pausar y reiniciar el seguimiento del tiempo de pantalla.

Recibirás recordatorios para tomar un descanso después de un tiempo prolongado de uso de pantalla.

🍅 Temporizador Pomodoro:

Implementa la técnica Pomodoro para sesiones de estudio o trabajo enfocadas.

Configura tiempos de trabajo y descanso personalizados.

Inicia, pausa y reinicia el temporizador fácilmente.

Notificaciones claras al cambiar entre fases de trabajo y descanso.

💧 Recordatorios de Hidratación:

Configura un intervalo personalizado para recibir recordatorios de hidratación.

Activa o desactiva los recordatorios según tus necesidades.

Mensajes de notificación que te indican cuándo es hora de beber agua.

💦 Contador de Vasos de Agua:

Establece una meta diaria de vasos de agua a consumir.

Añade vasos a tu contador con un simple clic.

Reinicia el contador al inicio de un nuevo día.

🚀 Cómo Empezar
Sigue estos pasos para poner en marcha la aplicación en tu entorno local.

📋 Pre-requisitos
Asegúrate de tener instalados los siguientes programas en tu sistema:

Node.js y npm (Node Package Manager):

Puedes descargarlos desde el sitio oficial: https://nodejs.org/

Verifica la instalación ejecutando en tu terminal:

node -v
npm -v

📦 Instalación
Crea un nuevo proyecto React con Vite:
Abre tu terminal y ejecuta:

npm create vite@latest

Cuando te pregunte, nombra tu proyecto (ej. bienestar-digital-app), selecciona React como framework y JavaScript como variante.

Navega al directorio del proyecto:

cd bienestar-digital-app

Instala las dependencias:

npm install

Abre el proyecto en VS Code:

code .

⚙️ Configuración de Estilos (Tailwind CSS)
Para asegurar que la aplicación se vea correctamente con el estilo minimalista de Tailwind CSS:

Vacía los archivos CSS predeterminados:

En VS Code, ve a la carpeta src.

Abre src/App.css y src/index.css.

Borra todo el contenido de ambos archivos. Déjalos completamente vacíos y guárdalos.

Elimina las importaciones de CSS en src/main.jsx:

Abre src/main.jsx.

Busca y elimina (o comenta) las líneas que importan index.css y App.css, que se verán así:

import './index.css'
// import './App.css' // Esta línea podría estar o no

Guarda el archivo.

Mueve el CDN de Tailwind CSS al index.html:

Abre index.html (está en la raíz de tu proyecto, no en src).

Dentro de la etiqueta <head>, justo antes del cierre de </head>, pega las siguientes líneas:

<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

Guarda el archivo.

Reemplaza el código de App.jsx:

Abre src/App.jsx.

Borra todo el contenido existente.

Copia y pega todo el código de la aplicación React que te he proporcionado (la última versión completa de ``).

Asegúrate de NO incluir las líneas del CDN de Tailwind, la meta de viewport, ni el link de Google Fonts, ya que esas ya las moviste a index.html. Copia solo el código React puro desde import React... hasta export default App;.

Guarda el archivo.

▶️ Ejecutar la Aplicación
Inicia el servidor de desarrollo:
En tu terminal, desde el directorio raíz del proyecto (bienestar-digital-app), ejecuta:

npm run dev

Abre la aplicación en tu navegador:
Una vez que el servidor esté activo, la terminal te proporcionará una dirección local (ej. http://localhost:5173/). Copia esa dirección y pégala en la barra de direcciones de tu navegador web.

🖥️ Uso de la Aplicación
Una vez que la aplicación esté en funcionamiento, verás un panel de control con tres secciones principales:

⏰ Horario de Pantalla
Límite Diario (min): Ajusta el tiempo máximo de pantalla que deseas usar al día.

Uso Actual: Muestra los minutos simulados de uso de pantalla acumulados.

Cronómetro de Sesión: Un contador HH:MM:SS en tiempo real que indica cuánto tiempo llevas en la sesión actual.

Botones:

Iniciar: Comienza el seguimiento del tiempo de pantalla y el cronómetro.

Pausar: Detiene el seguimiento temporalmente.

Reiniciar: Pone a cero el "Uso Actual" y el "Cronómetro de Sesión", y detiene el seguimiento.

Recomendación de Descanso: La aplicación te notificará con un mensaje en la parte superior cuando lleves un tiempo prolongado frente a la pantalla, sugiriéndote una pausa.

🍅 Temporizador Pomodoro
Trabajo (min) / Pausa (min): Configura la duración de tus sesiones de trabajo y de tus pausas.

Contador: Muestra el tiempo restante para la fase actual.

Fase Actual: Indica si estás en la fase de "Trabajo" o "Descanso".

Botones:

Iniciar / Pausar: Alterna entre iniciar y pausar el temporizador.

Reiniciar: Restablece el temporizador al inicio de la fase de trabajo.

💧 Hidratación y Agua
Esta sección se divide en dos partes:

Recordatorios de Hidratación:

Intervalo (min): Define cada cuánto tiempo deseas recibir un recordatorio para beber agua.

Activar Recordatorios: Usa el interruptor para activar o desactivar las notificaciones. Los mensajes aparecerán en la parte superior de la aplicación.

Próximo Recordatorio: Muestra la hora estimada del siguiente recordatorio.

Vasos de Agua Consumidos:

Meta Diaria: Establece la cantidad de vasos de agua que quieres beber al día.

Contador: Muestra cuántos vasos has consumido de tu meta.

Botones:

Añadir Vaso: Incrementa el contador de vasos consumidos.

Reiniciar: Pone el contador de vasos a cero.

🛠️ Tecnologías Utilizadas
React: Biblioteca JavaScript para construir interfaces de usuario.

Vite: Herramienta de construcción rápida para proyectos web.

Tailwind CSS: Framework CSS utility-first para un diseño rápido y responsivo.

💡 Próximas Mejoras (Ideas)
Persistencia de datos (guardar configuraciones y progreso entre sesiones).

Gráficos de progreso de tiempo de pantalla y consumo de agua.

Sonidos de notificación personalizables.

Modo de seguimiento de tiempo de pantalla más avanzado (si el entorno lo permite).

¡Disfruta usando tu aplicación de Bienestar Digital Estudiantil!