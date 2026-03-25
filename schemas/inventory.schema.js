const { sql, poolPromise } = require("./db");

const getAllInventories = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT
      i.id AS inventoryId,
      i.productId,
      i.stock,
      i.reserved,
      i.soldCount,
      i.createdAt AS inventoryCreatedAt,
      i.updatedAt AS inventoryUpdatedAt,
      p.id AS product_id,
      p.name,
      p.price,
      p.description,
      p.createdAt AS productCreatedAt,
      p.updatedAt AS productUpdatedAt
    FROM Inventories i
    INNER JOIN Products p ON i.productId = p.id
    ORDER BY i.id DESC
  `);

  return result.recordset;
};

const getInventoryById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT
        i.id AS inventoryId,
        i.productId,
        i.stock,
        i.reserved,
        i.soldCount,
        i.createdAt AS inventoryCreatedAt,
        i.updatedAt AS inventoryUpdatedAt,
        p.id AS product_id,
        p.name,
        p.price,
        p.description,
        p.createdAt AS productCreatedAt,
        p.updatedAt AS productUpdatedAt
      FROM Inventories i
      INNER JOIN Products p ON i.productId = p.id
      WHERE i.id = @id
    `);

  return result.recordset[0];
};

const getInventoryByProductId = async (productId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("productId", sql.Int, productId)
    .query(`
      SELECT * FROM Inventories WHERE productId = @productId
    `);

  return result.recordset[0];
};

const addStock = async (productId, quantity) => {
  const pool = await poolPromise;
  await pool.request()
    .input("productId", sql.Int, productId)
    .input("quantity", sql.Int, quantity)
    .query(`
      UPDATE Inventories
      SET stock = stock + @quantity,
          updatedAt = GETDATE()
      WHERE productId = @productId
    `);

  return await getInventoryByProductId(productId);
};

const removeStock = async (productId, quantity) => {
  const inventory = await getInventoryByProductId(productId);

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  if (inventory.stock < quantity) {
    throw new Error("Not enough stock to remove");
  }

  const pool = await poolPromise;
  await pool.request()
    .input("productId", sql.Int, productId)
    .input("quantity", sql.Int, quantity)
    .query(`
      UPDATE Inventories
      SET stock = stock - @quantity,
          updatedAt = GETDATE()
      WHERE productId = @productId
    `);

  return await getInventoryByProductId(productId);
};

const reservation = async (productId, quantity) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const currentResult = await new sql.Request(transaction)
      .input("productId", sql.Int, productId)
      .query(`
        SELECT * FROM Inventories WHERE productId = @productId
      `);

    const inventory = currentResult.recordset[0];

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    if (inventory.stock < quantity) {
      throw new Error("Not enough stock to reserve");
    }

    await new sql.Request(transaction)
      .input("productId", sql.Int, productId)
      .input("quantity", sql.Int, quantity)
      .query(`
        UPDATE Inventories
        SET stock = stock - @quantity,
            reserved = reserved + @quantity,
            updatedAt = GETDATE()
        WHERE productId = @productId
      `);

    await transaction.commit();
    return await getInventoryByProductId(productId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const sold = async (productId, quantity) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const currentResult = await new sql.Request(transaction)
      .input("productId", sql.Int, productId)
      .query(`
        SELECT * FROM Inventories WHERE productId = @productId
      `);

    const inventory = currentResult.recordset[0];

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    if (inventory.reserved < quantity) {
      throw new Error("Not enough reserved quantity to sell");
    }

    await new sql.Request(transaction)
      .input("productId", sql.Int, productId)
      .input("quantity", sql.Int, quantity)
      .query(`
        UPDATE Inventories
        SET reserved = reserved - @quantity,
            soldCount = soldCount + @quantity,
            updatedAt = GETDATE()
        WHERE productId = @productId
      `);

    await transaction.commit();
    return await getInventoryByProductId(productId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAllInventories,
  getInventoryById,
  getInventoryByProductId,
  addStock,
  removeStock,
  reservation,
  sold,
};