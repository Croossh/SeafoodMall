import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
  async create(DTO) {
    const createdProduct = await Product.create(DTO);
    return createdProduct;
  }

  async update(DTO) {
    const filter = { _id: DTO._id, deleted_at: null };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filter, DTO, option);
    return updatedProduct;
  }

  async updateMany(oldDTO, newDTO) {
    const { _id, ...toUpdateDTO } = newDTO;
    const filter = {
      'category.parent_category': oldDTO.parent_category,
      'category.child_category': oldDTO.child_category,
      deleted_at: null,
    };
    const update = { category: toUpdateDTO };

    const updatedProducts = await Product.updateMany(filter, update);
    return updatedProducts;
  }

  async deleteMany(toDeleteDTO) {
    const filter = {
      'category.parent_category': toDeleteDTO.parent_category,
      'category.child_category': toDeleteDTO.child_category,
      deleted_at: null,
    };

    const deletedAtNow = { deleted_at: new Date() };
    await Product.updateMany(filter, deletedAtNow);
  }

  async find() {
    const filter = { deleted_at: null };
    const productList = await Product.find(filter);

    return productList;
  }

  async delete(DTO) {
    const filter = { _id: DTO._id };
    const deletedAtNow = { deleted_at: new Date() };
    const option = { returnOriginal: false };

    const deletedProduct = await Product.findOneAndUpdate(filter, deletedAtNow, option);
    return deletedProduct;
  }

  async searchByKeyword(searchKey, keyword) {
    const filter = {
      [searchKey]: new RegExp(keyword),
      deleted_at: null,
    };

    const foundProductsByKeyword = await Product.find(filter);
    return foundProductsByKeyword;
  }

  async findByKeyword(searchKey, keyword) {
    const filter = {
      [searchKey]: keyword,
      deleted_at: null,
    };

    const foundProductsByKeyword = await Product.find(filter);
    return foundProductsByKeyword;
  }

  async findById(_id) {
    const filter = { _id: _id, deleted_at: null };
    const foundProduct = await Product.find(filter);
    return foundProduct;
  }
}

const productModel = new ProductModel();

export { productModel };
