import { Category } from "./category.types";

export interface Product {
  id: number;
  categoria: Category,
  nombre: string;
  precio: number;
  descripcion: string;
}
