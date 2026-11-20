# Maison Luxury — Frontend

Interfaz web de una perfumería desarrollada con React y Vite. Incluye catálogo, filtros, detalle de productos, carrito, cuentas de usuario y administración de productos y órdenes. La aplicación incorpora modos claro y oscuro y una presentación navideña.

El frontend y el backend están separados en dos repositorios. Esta aplicación consume la API del backend a través del gateway; para probar el flujo completo deben estar iniciados ambos proyectos.

## Requisitos

- Node.js y npm. En el laboratorio se utilizó Node.js 24 con npm 11.
- Backend de Maison Luxury iniciado en el mismo equipo, con gateway en el puerto 8080.
- Puerto 5173 disponible para Vite.

```powershell
node -v
npm.cmd -v
```

## Primera ejecución

Abrir PowerShell en la carpeta que contiene `package.json`. El nombre de la carpeta puede ser `Maison_Frontend` o el utilizado al clonar el repositorio.

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm.cmd ci
npm.cmd run dev
```

Abrir **http://localhost:5173**. Mantener la terminal abierta mientras se utiliza la página. En los siguientes inicios basta con `npm.cmd run dev`; repetir `npm.cmd ci` si cambió el archivo de dependencias o se está preparando otro PC.

Se usa `npm.cmd` para evitar el bloqueo de `npm.ps1` por las políticas de ejecución de PowerShell.

## Variables de configuración

El archivo `.env` de este repositorio contiene:

```dotenv
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_CLIENT_ID=
```

| Variable | Uso |
| --- | --- |
| VITE_API_URL | Dirección base de la API, incluyendo `/api/v1`. |
| VITE_GOOGLE_CLIENT_ID | ID del cliente OAuth para el acceso con Google. Debe coincidir con `GOOGLE_CLIENT_ID` del backend. |

Las variables `VITE_` quedan expuestas al navegador: no colocar contraseñas de PostgreSQL, SMTP ni claves JWT en este archivo. Esas credenciales pertenecen al `.env` privado del backend.

Reiniciar Vite después de modificar `.env`. Para utilizar Google, el origen de la página también debe estar autorizado en el cliente OAuth. El Client ID no es el Client Secret.

## Iniciar el backend

Los comandos siguientes se ejecutan en la carpeta del **otro repositorio**, no dentro del frontend. Antes de iniciar, preparar su `.env` y comprobar que la IP pública del equipo esté autorizada en Cloud SQL. El README del backend explica esa configuración.

### Con iniciar backend

Desde la raíz del repositorio backend:

```powershell
Unblock-File .\iniciar-backend.ps1
.\iniciar-backend.ps1 -Firebase
```

Se abren cuatro terminales. Esperar que cada servicio termine su arranque y después ejecutar `npm.cmd run dev` en este frontend. El script inicia el backend; no inicia Vite.

### Manualmente

Abrir cuatro terminales PowerShell, cada una inicialmente en la raíz del backend. Comprobar con `mvn.cmd -version` que utilizan el JDK previsto, preferiblemente 21.

**Catálogo**

```powershell
cd .\backend\ms-catalogo
mvn.cmd --% -Dmaven.repo.local=%LOCALAPPDATA%\MaisonLuxury\maven-repository -Dspring-boot.run.profiles=firebase spring-boot:run
```

**Usuarios**

```powershell
cd .\backend\ms-usuarios
mvn.cmd --% -Dmaven.repo.local=%LOCALAPPDATA%\MaisonLuxury\maven-repository -Dspring-boot.run.profiles=firebase spring-boot:run
```

**Órdenes**

```powershell
cd .\backend\ms-ordenes
mvn.cmd --% -Dmaven.repo.local=%LOCALAPPDATA%\MaisonLuxury\maven-repository -Dspring-boot.run.profiles=firebase spring-boot:run
```

**Gateway**

```powershell
cd .\backend\gateway
mvn.cmd --% -Dmaven.repo.local=%LOCALAPPDATA%\MaisonLuxury\maven-repository spring-boot:run
```

El arranque manual requiere que `MAISON_JWT_SECRET` ya esté configurado en el `.env` compartido del backend. Su README incluye cómo generarlo sin usar el lanzador. Usar una quinta terminal para `npm.cmd run dev` en el frontend.

Ambas formas utilizan los puertos 8080 a 8083. Detener todos los servicios antes de cambiar de método; no iniciar dos copias. La caché de Maven se reutiliza en el mismo computador con los argumentos indicados.

## Recorrido de prueba

1. Abrir el catálogo, buscar un perfume y aplicar filtros.
2. Entrar al detalle y comprobar foto, precio, descripción y notas.
3. Iniciar sesión con una cuenta de cliente y agregar un producto al carrito.
4. Registrar una compra de prueba y revisar la confirmación y la boleta.
5. Ingresar como administrador y crear un producto, editarlo y revisar su detalle público.
6. Revisar órdenes y comprobar las restricciones de una cuenta con otro rol.
7. Probar la navegación en una ventana estrecha y cambiar entre modos claro y oscuro.

En las herramientas del navegador, la pestaña Network permite revisar las peticiones. Un inicio de sesión correcto responde `200`; la creación de una orden responde `201`. Un `403` puede ser el resultado esperado si la cuenta intenta realizar una operación reservada a otro rol.

Para productos nuevos, utilizar una URL que abra directamente la imagen, no una publicación de Instagram. Las fotos de tarjetas y detalle usan un área cuadrada y conservan la imagen completa. Se puede usar una foto de 800 × 800 o mayor con proporción 1:1. El formulario también permite completar notas, historia, ocasiones y personalidad; las secciones sin información se ocultan.

## Pruebas y compilación

```powershell
npm.cmd run test:run
npm.cmd run coverage
npm.cmd run build
```

- `test:run`: ejecuta las pruebas de Vitest una vez.
- `coverage`: genera el informe de cobertura en `coverage/`.
- `build`: genera la versión compilada en `dist/`.

Para revisar la compilación localmente:

```powershell
npm.cmd run preview
```

La vista previa suele abrir en `http://localhost:4173`; comprobar la dirección que muestra la terminal. También necesita el backend para consultar los datos. Compilar el frontend no publica la página ni pone en marcha los microservicios.

## Estructura

- `src/pages`: pantallas de tienda, cuenta y administración.
- `src/components`: componentes reutilizables, incluidos los de producto.
- `src/services`: acceso a las APIs.
- `src/styles`: estilos generales, responsive y de temporada.
- `src/utils`: funciones auxiliares y etiquetas del catálogo.
- `public`: recursos estáticos.
- `vite.config.js`: configuración de Vite y pruebas.

El repositorio conserva comandos de una API simulada (`npm.cmd run api`). Para la presentación integrada se utiliza el backend Spring Boot. No ejecutar la API simulada junto al gateway: ambos usan el puerto 8080 y la API simulada no acredita persistencia en Cloud SQL.

## Problemas frecuentes

| Situación | Comprobación |
| --- | --- |
| La página abre, pero no carga productos | Revisar gateway, ms-catalogo y `VITE_API_URL`. Abrir `http://localhost:8080/api/v1/productos`. |
| Vite cambia a 5174 | El puerto 5173 está ocupado. Detener la instancia anterior y volver a iniciar; el gateway autoriza los orígenes configurados, no cualquier puerto. |
| Error CORS | Usar `http://localhost:5173` y comprobar los orígenes permitidos del gateway. |
| Los microservicios muestran timeout de PostgreSQL | Revisar la IP pública y el puerto 5432 siguiendo el README del backend. |
| Login devuelve 401 | Revisar credenciales, volver a iniciar sesión y comprobar la configuración JWT del backend. |
| Guardar producto devuelve 403 | Ingresar con una cuenta de administrador. |
| No llegan correos | Configurar SMTP y `MAIL_ENABLED` en el backend y reiniciar los servicios. |
| Una imagen no se muestra | Abrir su URL directamente y comprobar que sea pública y accesible. |

Para detener el frontend, usar `Ctrl+C` en la terminal de Vite. Detener también las cuatro terminales del backend al terminar. Al subir el repositorio, conservar `package-lock.json` y `.env.example`; no incluir `.env`, `node_modules`, `dist` ni `coverage`.

## Verificación de esta entrega

El 18 de noviembre de 2026 pasaron las 41 pruebas de Vitest y la compilación de producción. La cobertura medida con v8 fue 39,93 % de sentencias, 32,83 % de ramas, 35,40 % de funciones y 42,60 % de líneas. Es una cobertura parcial; los reportes HTML y LCOV acompañan la documentación de la entrega. La conexión real y los flujos completos se verifican con el backend iniciado.
