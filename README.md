## 📦 Vanilla HTML Deployment with Docker & Nginx
Este repositorio contiene un ejemplo simple de cómo desplegar un sitio web estático construido con HTML puro (vanilla HTML) utilizando Docker y Nginx como servidor web.

### 🚀 Características:

- Sitio web estático con HTML puro

- Configuración ligera y lista para producción

- Dockerfile para contenerizar la aplicación

- Configuración personalizada de Nginx

- Instrucciones para levantar el contenedor

### 🛠️ Tecnologías utilizadas:

- HTML5

- Docker

- Nginx

### Comandos

#### Construir una imagen
```cmd
docker build . -t [a-image-name]:[a-image-version]
```

#### Levantar un contenedor desde la imagen

```cmd
docker run -p [a-port]:80 [image-name]:[image-version]
```

---

> Nota: El puerto por defecto de Nginx es el puerto: 80