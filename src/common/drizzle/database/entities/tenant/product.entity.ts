import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { categoryProduct } from './category-product.entity';
import { inventory } from './inventory.entity';
import { orderItem } from './order-item.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

export enum PRODUCT_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  PENDING = 'p',
}

export const productStatusEnum = d.pgEnum('status', [
  PRODUCT_STATUS_ENUM.ACTIVATED,
  PRODUCT_STATUS_ENUM.DEACTIVATED,
  PRODUCT_STATUS_ENUM.PENDING,
]);

// ------- PRODUCT TABLE ---------
export const product = d.pgTable('product', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }).notNull(),
  description: d.varchar('description', { length: 256 }).notNull(),
  price: d.decimal('price').notNull(),
  stockQuantity: d.integer('stock_quantity').notNull(),
  status: productStatusEnum('status').notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const productRelations = relations(product, ({ many, one }) => ({
  categoryProducts: many(categoryProduct), // *PIVOT TABLE*
  inventory: one(inventory, {
    fields: [product.id],
    references: [inventory.productId],
  }), // ONE TO ONE RELATION
  orderItem: many(orderItem), // *PIVOT CUSTOM* MANY TO ONE RELATION
}));