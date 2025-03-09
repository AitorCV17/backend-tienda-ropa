import { Request, Response } from 'express';
import prisma from '../config/db';

export const obtenerPedidosCliente = async (req: Request, res: Response) => {
  const userId = req.usuario?.id;
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { id_usuario: userId },
      include: { detalles: true }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const obtenerTodosPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({ include: { detalles: true } });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  const pedidoId = parseInt(req.params.id, 10);
  const { estado } = req.body;
  try {
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { estado }
    });
    res.json(pedidoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
};
