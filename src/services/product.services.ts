import mongoose from "mongoose";
import ProductModel, { productDocument } from "../models/product.model";
import Category from "./category.services";

interface productInterface {
  id: string;
  name: string;
  brand: string;
  number: number;
  price: number;
  discount?: number;
  image: string;
  gallery: { filename: string; thumbnail: string }[];
  review?: string;
  specification?: { title: string; value: any[] }[];
}

class Product {
  private productModel: mongoose.Model<productDocument>;
  constructor(protectedModel: mongoose.Model<productDocument>) {
    this.productModel = protectedModel;
  }
  private convertFiltersToQuery(filters: any[]) {
    let search: object = {};
    filters.forEach((filter: { finder: string; option: any[] }) => {
      if (filter.finder == "brand") {
        search = {
          ...search,
          brand: { $in: filter.option },
        };
      } else if (filter.finder == "price") {
        search = {
          ...search,
          price: { $gte: filter.option[0], $lte: filter.option[1] },
        };
      } else if (filter.finder == "availability") {
        search = {
          ...search,
          availability: filter.option,
        };
      } else if (filter.finder == "discount") {
        if (filter.option[0]) {
          search = {
            ...search,
            discount: { $nin: 0 },
          };
        }
      } else {
        search = {
          ...search,
          specification: {
            $elemMatch: {
              title: filter.finder,
              value: { $in: filter.option },
            },
          },
        };
      }
    });
    return search;
  }
  private convertSortToQuery(sort: string) {
    switch (sort) {
      case "ارزان ترين":
        return {
          price: 1,
        };
      case "گران ترين":
        return {
          price: -1,
        };
      case "جديدترين":
        return {
          createdAt: -1,
        };
      case "پربازديدترين":
        return {
          views: -1,
        };
      case "پرفروش ترین":
        return {
          sales: -1,
        };
      default:
        return {
          createdAt: -1,
        };
    }
  }

  async add(product: productInterface) {
    const categories = await Category.getCategoriesId(product.id);
    if (!categories) {
      throw new Error("Category not found");
    }
    const newProduct = new this.productModel({
      ...product,
      categories,
    });
    await newProduct.save();
    return newProduct;
  }
  async update(id: string, information: Partial<productInterface>) {
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...information,
        },
      }
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async delete(id: string) {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async getOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.views++;
    await product.save();
    return product;
  }
  async getProducts(
    catId: string,
    filters: any[],
    page: number,
    limit: number,
    sort: string
  ) {
    const search = this.convertFiltersToQuery(filters);
    const sortQuery = this.convertSortToQuery(sort);
    const products = await this.productModel.find(
      {
        category: { $in: new mongoose.Types.ObjectId(catId as string) },
        ...search,
      },
      {},
      {
        limit: limit,
        skip: (page - 1) * limit,
        sort: sortQuery,
      }
    );
    return products;
  }
  async addImage(id: string, image: { filename: string; thumbnail: string }) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.gallery.length >= 5) {
      throw new Error("You can't add more than 5 images");
    }
    product.gallery.push(image);
    await product.save();
    return product;
  }
  async deleteImage(id: string, image: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const index = product.gallery.findIndex(
      (image: any) => image.filename == image
    );
    if (index == -1) {
      throw new Error("Image not found");
    }
    if (product.gallery.length == 1) {
      throw new Error("You can't delete the last image");
    }
    product.gallery.splice(index, 1);
    await product.save();
    return product;
  }
}

export default new Product(ProductModel);
