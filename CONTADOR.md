# Contador Agroplant

El acceso `/agroplant/conteo` usa la sesión existente de Agroplant. Muestra los lotes enviados por la Raspberry y descarga la misma copia XLSX. El monitor RF existente conserva su funcionamiento.

La Raspberry envía por HTTPS a `POST /api/agroplant/conteo/sync` un snapshot y el Excel generado desde esa misma revisión. La API exige sesión Agroplant y origen del propio sitio, limita el cuerpo a 3 MB y almacena solamente la última copia en la tabla independiente `agroplant_counter_snapshot` de PostgreSQL. No necesita puertos abiertos hacia la Raspberry. La tabla se crea automáticamente; no modifica productos ni datos RF.

La pantalla consulta cada 2 segundos. La Raspberry sincroniza aproximadamente cada 3 segundos más la latencia de red. Tras 20 segundos sin recepción, muestra desconexión y conserva la última lectura. La descarga disponible corresponde a la última sincronización recibida.

El servicio de la Raspberry se llama `contador-web.service`. Su configuración privada está en `~/.config/contador/web.json`, fuera del repositorio. Usa el acceso existente de Agroplant y renueva su sesión. Las modificaciones de órdenes se realizan en la aplicación de la Raspberry.
