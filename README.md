# ADN Salvaje — prototipo 0.10.0

RPG de colección de monstruos originales, en español, con combate por turnos y crianza procedural. Android 8.0 o posterior, sin conexión ni permisos de Internet. Interfaz HTML/Canvas dentro de una aplicación Android WebView. No usa servicios de IA ni recursos descargados durante el juego.

## Jugar

Instala `ADN-Salvaje.apk` en Android, permitiendo la instalación desde el gestor de archivos si Android lo solicita. Está firmado con una clave de desarrollo. No es una publicación de Google Play. No se ha probado en un teléfono o emulador Android; se ha compilado y verificado su firma, manifiesto y contenido. El juego se ha probado con Chromium a distintos tamaños de pantalla.

El juego abre directamente en el mapa. Pulsa ☰ arriba a la izquierda para abrir la colección, el laboratorio, la guía y la historia. Desplázate con la cruceta o con flechas/WASD; el personaje camina con una transición animada. También puedes abrir `web/index.html` en un navegador moderno o ejecutar `python3 -m http.server 8000 --directory web` y visitar http://localhost:8000.

Las partidas nuevas empiezan con siete criaturas, una de cada anatomía, 100 esencias y 12 cápsulas. Explora un bioma para iniciar un encuentro; cambia de bioma para encontrar otros elementos. Cada bioma tiene un mapa explorable por casillas. La cruceta táctil mueve al personaje chibi; mantener pulsado camina continuamente. En computadora se usan las flechas o WASD. Los árboles y el agua bloquean el paso. La hierba alta produce encuentros a partir de cuatro pasos, con uno garantizado al alcanzar doce; se cuentan pasos en la hierba desde el último encuentro. Cambiar de bioma devuelve al personaje a su campamento. La posición se guarda automáticamente.

Atacar, usar una técnica, defenderse o fallar una captura consume un turno. La defensa recupera energía y reduce el golpe enemigo. Flora vence a Agua; Agua a Fuego; Fuego a Flora. Los compañeros se recuperan al volver al campamento. Las victorias dan experiencia y esencias. Cada encuentro da 3 esencias; cada tres encuentros, 2 cápsulas.

## Herencia y representación

- 24 loci: cuerpo, color, orejas, cuernos, cola, patrón, ojos, elemento, tamaño, anatomía, cabeza, proporción cefálica, cuello, longitud corporal, tipo y longitud de extremidades, alas, antenas, superficie, caparazón, hocico, color secundario, cresta y brazos.
- Los brazos pueden estar ausentes, ser cortos, largos o tener aletas. El cuello puede ser corto, largo, arqueado o estar ausente. Cada uno es un gen de dos alelos heredado de ambos padres.
- Siete anatomías con estructuras de dibujo independientes: bípeda, cuadrúpeda, serpentina, alada, gelatinosa, artrópoda y acuática. Cinco cabezas: felina, reptiliana, aviar, anfibia e insectoide.
- Las proporciones y los apéndices se colocan en puntos de unión de cada anatomía. Se pueden heredar alas sobre un cuerpo serpentino, una cabeza aviar sobre un cuadrúpedo o una coraza sobre un cuerpo gelatinoso.
- Cada locus conserva dos alelos y un selector de expresión. El sprite se dibuja en 288 × 288 con contornos suavizados a partir de los alelos expresados. El elemento afecta el combate; los otros 23 genes modifican el aspecto.
- Los monstruos silvestres son deterministas para una misma semilla. Los encuentros asignan el elemento del bioma después de crear el ADN.
- Un cruce recibe un alelo por locus de cada progenitor. Anatomía y cuerpo transmiten y expresan el alelo visible de A; cabeza, color y superficie, el de B. Esos cinco rasgos ancla garantizan un parecido con ambos si sus rasgos son distintos.
- En los otros 19 loci, se elige al azar un alelo de cada padre y cuál expresar. Los alelos ocultos pueden reaparecer. No se mezclan imágenes ni se genera una criatura aleatoria independiente de sus padres.
- Es un modelo de juego con herencia controlada, no una simulación mendeliana estricta. No hay mutaciones en esta versión. Los rasgos idénticos de los padres seguirán siendo idénticos en sus crías.
- Cada cruce cuesta 30 esencias, conserva los padres y crea una cría de nivel 1. Las crías pueden volver a cruzarse. La ficha muestra los dos alelos y el origen A/B del alelo visible.

Algunos rasgos quedan parcialmente cubiertos por otros: un caparazón puede ocultar las marcas de la piel; una anatomía acuática usa aletas en lugar de patas convencionales. El alelo se conserva aunque quede oculto. Las alas de la anatomía alada son estructurales: sin alas adicionales conserva sus alas básicas.

El espacio de combinaciones es finito: sprites modulares, no ilustraciones infinitas. Las criaturas pueden compartir nombre y apariencia con distinto ADN oculto.

## Guardado

Guardado automático en almacenamiento local. Esta versión lee las partidas y exportaciones anteriores, conserva sus nueve genes originales y completa los genes que falten de forma determinista usando la semilla del monstruo; las partidas 0.2–0.5 conservan sus 23 genes y reciben el nuevo gen de brazos. Conserva colección, nivel, recursos y progreso; su aspecto cambia al nuevo sistema anatómico. Instala la actualización sobre la anterior para conservar los datos; usa la misma firma de desarrollo. No se agregan siete iniciales a las partidas existentes. La guía permite exportar e importar JSON. En Android 10+ la copia se guarda en Descargas; en Android 8/9, en la carpeta externa privada de la aplicación (`Android/data/com.adnsalvaje.game/files/Download`). Desinstalar puede borrar el progreso y esa carpeta. Importar sustituye la partida actual.

## Desarrollo y compilación

Requiere Linux, Java 21, Python 3, curl, unzip y zip. No requiere Gradle ni Android Studio.

```bash
bash android/setup.sh
bash android/build.sh
node tests/genetics.test.js
node tests/world.test.js
```

La preparación descarga Android SDK Build Tools 35, plataforma 35 y el compilador Eclipse ECJ 3.38 desde sus distribuidores. La compilación produce `dist/ADN-Salvaje.apk`. La clave local se genera en `tools/development.keystore` con alias `development` y contraseña `android`; consérvala para instalar actualizaciones sobre la misma aplicación. El paquete fuente distribuido no incluye una clave privada. Para una publicación real se necesita una clave de producción propia.

Pruebas de interfaz: `node tests/ui.test.js`, con Playwright disponible y Chromium en `/usr/bin/chromium`. La prueba sirve los archivos en localhost:8765 y verifica nacimiento, herencia, persistencia, combate, captura, retirada y que cuatro vistas no desborden a 360, 768 y 1280 píxeles. Las pruebas de genética verifican 3.000 cruces y dos generaciones, transmisión de los 24 loci y los cinco rasgos ancla. Las pruebas gráficas comprueban siete anatomías diferentes, cambios visibles al variar cada uno de los 23 genes visuales en una criatura sin partes oclusoras y migración determinista de partidas v1. La imagen `dist/diversidad-v06.png` compara 21 criaturas silvestres generadas desde semillas.

## Campaña y mazmorras

Los biomas tienen mapas de 61 × 45 casillas, con cámara móvil y pasos en los extremos del camino horizontal. Los símbolos ●, ◆ y ▲ señalan aliados, miembros de la Orden del Eclipse y entradas a mazmorras; camina a su casilla y pulsa **Interactuar**. El botón **Historia** muestra la jerarquía, las victorias y la siguiente pista. Los cuatro miembros se desbloquean en orden y tienen niveles crecientes. Las partidas anteriores conservan su colección y empiezan la campaña desde el principio.

Hay tres santuarios: Bosque Espora (10,20), Caldera Ámbar (20,10) y Laguna Nácar (30,10). Cada uno presenta tres oleadas, un guardián y un escenario propio. Mueve el joystick para caminar y disparar automáticamente; al soltarlo se detienen los disparos. Tras derrotar al guardián puedes capturarlo una vez por partida. La corona de raíces, las placas de magma o las aletas de cristal se transmiten visiblemente al cruzarlos y pueden heredarse en generaciones posteriores. Los tres guardianes tienen dibujos vectoriales y ADN fijos; sus esbirros usan versiones juveniles. La arena y los escenarios se dibujan a la resolución física de la pantalla, incluida su densidad de píxeles, y se reajustan al girar el dispositivo. El progreso se guarda automáticamente.

## Alcance

Incluye tres biomas de encuentros, colección, progreso hasta nivel 50, combate individual, captura, laboratorio y genealogía inmediata. Quedan para próximas versiones: animaciones de combate más avanzadas por anatomía, sonido musical, habilidades heredables adicionales y pruebas de instalación en dispositivos. No hay multijugador, cuentas, anuncios ni compras.

Validación adicional: `node tests/adventure.test.js` y `node tests/guardians.test.js` (Playwright + Chromium).

## Campaña ampliada (0.10)

Diez personajes ofrecen conversaciones y testimonios sobre la Orden. El diario de Historia conserva las conversaciones terminadas y cuatro hallazgos de lore. Tres memorias se encuentran fuera del camino principal: Semilla (Bosque, 20/30), Placa (Caldera, 40/30) y Prisma (Laguna, 30/30). Descubrirlas y derrotar a Vera, Bruno y Nara activa el arco de Laguna Nácar (50/10).

El arco lleva a un mapa independiente: Ciudadela del Eclipse. Allí puedes hablar con Vera, descubrir el cuaderno de Umbra (20/20) y desafiar al líder (30/10). La salida (10/40) devuelve a Laguna Nácar; posición y zona se conservan al recargar. La retirada no completa la campaña. Después de la victoria, los aliados cuentan el epílogo. Las partidas anteriores conservan colección y victorias; las nuevas conversaciones y memorias se descubren al explorarlas.

Las arenas mantienen una sola pantalla y pasan de 320 a 420 unidades de anchura útil, con resolución adaptada al dispositivo. Los personajes del mapa y sus retratos se dibujan con detalles de ropa, rostro y profesión. Prueba adicional: `node tests/story.test.js`.
