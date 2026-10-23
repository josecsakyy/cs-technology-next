"""Sincroniza el monitor USB abierto con el acceso privado de Agroplant.
Ejecutar con Python. No guarda la contraseña ni abre puertos a Internet.
"""
import getpass
import http.cookiejar
import json
import os
from pathlib import Path
import time
import urllib.request
import urllib.error
import urllib.parse

SITE = "https://cstechnology.com.ar"
port_file = Path(os.environ["LOCALAPPDATA"]) / "CSMonitorRF" / "port.txt"
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
credentials = {"username": input("Usuario Agroplant: "), "password": getpass.getpass("Contraseña: ")}

def post(path, data):
    request = urllib.request.Request(SITE + path, data=json.dumps(data).encode(), headers={"Content-Type": "application/json", "Origin": SITE})
    with opener.open(request, timeout=15) as response:
        return response.status

post("/api/agroplant/login", credentials)
print("Sesión iniciada. Mantené abierto Monitor USB RF NUCLEO. Ctrl+C para detener.")
last_status = None
while True:
    try:
        local_url = urllib.parse.urlsplit(port_file.read_text().strip())
        if local_url.scheme != "http" or local_url.hostname not in ("127.0.0.1", "localhost") or not local_url.port:
            raise ValueError("Dirección local del monitor inválida")
        port = local_url.port
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/state", timeout=5) as response:
            state = json.load(response)
        try:
            post("/api/agroplant/network", state)
        except urllib.error.HTTPError as error:
            if error.code != 401:
                raise
            post("/api/agroplant/login", credentials)
            post("/api/agroplant/network", state)
        status = "Sincronizando con la web cada 3 segundos."
    except KeyboardInterrupt:
        break
    except Exception as error:
        status = "Sin sincronizar: " + str(error)
    if status != last_status:
        print(status)
        last_status = status
    time.sleep(3)
