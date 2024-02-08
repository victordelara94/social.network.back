export interface Repository<T extends { id: string }> {
  getAll?(): Promise<T[]>;
  getById?(_id: T['id']): Promise<T>;
  // eslint-disable-next-line no-unused-vars
  search?({ key, value }: { key: keyof T; value: unknown }): Promise<T[]>;
  create(_newItem: Omit<T, 'id'>): Promise<T>;
  update?(_id: T['id'], _updatedItem: Partial<T>): Promise<T>;
  delete?(_id: T['id']): Promise<void>;
}
