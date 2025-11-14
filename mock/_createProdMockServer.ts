import { createProdMockServer } from 'vite-plugin-mock/client';
import mockRoutes from './routes';

export function setupProdMockServer() {
  createProdMockServer(mockRoutes);
}
