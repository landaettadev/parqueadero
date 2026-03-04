export interface Vehicle {
  id: string;
  userId: string;
  plate: string;
  type: 'car' | 'motorcycle' | 'bicycle' | 'electric';
  brand?: string;
  model?: string;
  color?: string;
  isDefault: boolean;
  createdAt: Date;
}
