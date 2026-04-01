# Android: emulador (tablet mediana) y pantalla en blanco

## Ejecutar la app en el emulador (modo debug)

1. **Arranca el AVD** (en Android Studio → Device Manager, o por terminal):

   ```bash
   $HOME/Library/Android/sdk/emulator/emulator -avd Medium_Tablet_API_35
   ```

   Ajusta el nombre del AVD si el tuyo es distinto (`emulator -list-avds`).

2. **Comprueba el dispositivo:**

   ```bash
   $HOME/Library/Android/sdk/platform-tools/adb devices
   ```

   Anota el id (p. ej. `emulator-5554`).

3. **Genera el web export móvil y sincroniza Capacitor** (obligatorio para que `out/` tenga rutas válidas para WebView):

   ```bash
   cd /ruta/a/namy-frontend
   yarn mobile:build:android
   ```

4. **Instala y abre la app en ese emulador:**

   ```bash
   npx cap run android --target emulator-5554
   ```

   Cambia `emulator-5554` por el id que muestre `adb devices`.

### Recarga rápida tras cambios en el frontend

Vuelve a ejecutar `yarn mobile:build:android` y luego `npx cap run android --target <id>` (o solo `./gradlew installDebug` dentro de `android/` si ya sincronizaste).

---

## Pantalla en blanco en el emulador

### Causa habitual

Con `output: "export"`, Next puede generar URLs de assets **absolutas** (`/_next/static/...`). En el WebView de Capacitor esas rutas suelen resolverse mal frente a `file://` o al origen del WebView, **no cargan JS/CSS** y la app queda en blanco.

### Solución en este proyecto

En `next.config.js`, el build móvil (`MOBILE_BUILD=true`) incluye:

```js
assetPrefix: "./",
```

Así los chunks pasan a rutas **relativas** (`./_next/static/...`), que el WebView puede resolver.

Tras cualquier cambio en esta config, haz un export limpio:

```bash
yarn mobile:build:android
npx cap run android --target <tu-emulator-id>
```

### Si sigue en blanco

1. **Consola de Chrome (recomendado)**
   - Emulador con la app abierta.
   - En Chrome del Mac: `chrome://inspect` → _WebView in com.namyapp..._ → _inspect_.
   - Revisa errores en **Console** (404 de `.js`, CSP, etc.).

2. **API / HTTP**  
   Si el backend es `http://` y Android bloquea texto claro, puede fallar el fetch (a veces sin pintar bien la UI). Revisa política de red / HTTPS según tu entorno.

3. **Manifest / favicon**  
   Algunos enlaces pueden seguir siendo absolutos (`/manifest.webmanifest`). No suelen impedir el primer paint si los bundles ya cargan; si ves 404 concretos en consola, se pueden ajustar después.

### Live reload (opcional)

Con `next dev` en el puerto 3000 y el emulador levantado:

```bash
npx cap run android --target emulator-5554 -l --host 10.0.2.2 --port 3000
```

`10.0.2.2` es el alias del host desde el emulador hacia tu máquina. Puede hacer falta `adb reverse tcp:3000 tcp:3000` según la red.

---

## Resumen de comandos

| Objetivo                      | Comando                                                  |
| ----------------------------- | -------------------------------------------------------- |
| Listar AVDs                   | `$HOME/Library/Android/sdk/emulator/emulator -list-avds` |
| Build web + sync Android      | `yarn mobile:build:android`                              |
| Instalar debug en dispositivo | `npx cap run android --target <id>`                      |
