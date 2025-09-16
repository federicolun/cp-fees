# Login + Fee AAVE App (MVP)

Este proyecto contiene un **backend en Node.js/Express** y un **frontend en Next.js/React**.

## 🚀 Cómo correr el proyecto

### 1. Backend
```bash
cd backend
npm install
npm start
```

El backend corre en `http://localhost:3000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:3001`.

## 🔑 Notas
- Crear un archivo `.env` en `backend/` con tu **clave privada de Polygon**:
  ```
  PRIVATE_KEY=0x...
  ```
- Nunca subas `.env` a GitHub (ya está en `.gitignore`).
- Para la pantalla de AAVE fee, visitá `http://localhost:3001/aave-fee`.
