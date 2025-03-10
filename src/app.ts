// Archivo principal de la aplicación.
// Se han reforzado los middlewares de seguridad y se ha centralizado el manejo asíncrono en las rutas.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { manejoErrores } from './middlewares/errorMiddleware';

// Importación de rutas
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import carritoRoutes from './routes/carritoRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import direccionRoutes from './routes/direccionRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import pagoRoutes from './routes/pagoRoutes';
import productoRoutes from './routes/productoRoutes';
import variantesRoutes from './routes/variantesRoutes';
import imagenesRoutes from './routes/imagenesRoutes';
import categoriaConProductosRoutes from './routes/categoriaConProductosRoutes';
import carritoResumenRoutes from './routes/carritoResumenRoutes';
import ofertasDiaRoutes from './routes/ofertasDiaRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middlewares de seguridad y logging
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000'] // Ajustar según el frontend
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 solicitudes por ventana
}));

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/variantes', variantesRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/categorias', categoriaConProductosRoutes);
app.use('/api/carrito', carritoResumenRoutes);
app.use('/api/ofertas', ofertasDiaRoutes);

// Ruta raíz de la API
app.get('/', (req, res) => {
  res.send('API de Tienda de Ropa');
});

// Middleware de manejo global de errores
app.use(manejoErrores);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
