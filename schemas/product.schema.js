const { sql, poolPromise } = require("./db");

const createProduct = async ({ name, price, description }) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const productResult = await new sql.Request(transaction)
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price || 0)
      .input("description", sql.NVarChar, description || null)
      .query(`
        INSERT INTO Products (name, price, description)
        OUTPUT INSERTED.*
        VALUES (@name, @price, @description)
      `);

    const product = productResult.recordset[0];

    await new sql.Request(transaction)
      .input("productId", sql.Int, product.id)
      .query(`
        INSERT INTO Inventories (productId, stock, reserved, soldCount)
        VALUES (@productId, 0, 0, 0)
      `);

    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllProducts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM Products ORDER BY id DESC
  `);
  return result.recordset;
};

const getProductById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT * FROM Products WHERE id = @id
    `);
  return result.recordset[0];
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};