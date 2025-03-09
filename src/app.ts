import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { manejoErrores } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import carritoRoutes from './routes/carritoRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import direccionRoutes from './routes/direccionRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import pagoRoutes from './routes/pagoRoutes';
import productoRoutes from './routes/productoRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000'] // Ajusta según tu frontend
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/productos', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Tienda de Ropa');
});

// Manejo de errores centralizado
app.use(manejoErrores);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
