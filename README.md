# ⚽ openGol - Backend API

Una API robusta construida con NestJS para gestionar complejos deportivos, automatizar reservas de canchas y administrar flujos de pago.

## 🚀 Tecnologías Principales
* **Framework:** NestJS
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL
* **ORM:** TypeORM
* **Autenticación:** JWT (JSON Web Tokens)
* **Infraestructura:** Docker (para la base de datos local)

## 💡 Funcionalidades Core (MVP)
Esta API resuelve los problemas del día a día de un complejo deportivo real:
* **Motor de Reservas Inteligente:** Lógica matemática con `QueryBuilder` para prevenir colisiones de turnos (Double Booking Prevention).
* **Sistema Híbrido de Usuarios:** Soporte tanto para usuarios registrados en la app como para reservas "Guest" (telefónicas/mostrador).
* **Gestión Financiera:** Control de estados de pago (Seña, Pagado, Pendiente) y cálculo de precios dinámicos por hora.
* **Dashboard Stats:** Endpoints optimizados con funciones de agregación SQL para métricas en tiempo real (Ingresos mensuales, ocupación diaria).
* **Control de Entidades:** CRUD completo de Clubes, Canchas y Usuarios con soft-deletes para mantener el historial intacto.

## 🛠️ Estructura del Proyecto
El proyecto sigue la arquitectura modular de NestJS, separando responsabilidades en:
* `/auth`: Autenticación y Guards.
* `/users`: Gestión de perfiles.
* `/clubs` & `/fields`: Administración del complejo y sus recursos.
* `/bookings`: Core del negocio, lógica de tiempos y disponibilidad.

## ⚙️ Instalación y Uso Local

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/opengol-backend.git](https://github.com/tu-usuario/opengol-backend.git)
