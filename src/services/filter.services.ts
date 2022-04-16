import Category, { CategoryDocument } from "../models/category.model";
import Product from "../models/product.model";
import mongoose from "mongoose";

interface Product {
  brand: string;
  categories: Array<any>;
  price: number;
  specification: Array<any>;
}

interface FilterInterface {
  title: string;
  type: string;
  options: Array<any>;
  finder: string;
}
class Filter {
  async update_add(product: Product) {
    for (const cat of product.categories) {
      const category = await Category.findById(cat);
      const filters = category.filters;
      for (const fil of filters as Array<FilterInterface>) {
        if (fil.finder === "brand") {
          if (!fil.options.includes(product.brand)) {
            fil.options.push(product.brand);
          }
        } else if (fil.finder === "price") {
          if (fil.options[0] > product.price) {
            fil.options[0] = product.price;
          } else if (fil.options[1] < product.price) {
            fil.options[1] = product.price;
          }
        } else {
          for (const spe of product.specification) {
            if (spe.title === fil.finder) {
              for (const value of spe.value) {
                if (!fil.options.includes(value)) {
                  fil.options.push(value);
                }
              }
            }
          }
        }
      }
      await category.save();
    }
  }
  async update_remove(product: Product) {
    for (const cat of product.categories) {
      const category = await Category.findById(cat);
      const filters = category.filters;
      for (const fil of filters as Array<FilterInterface>) {
        if (fil.finder === "brand") {
          const products = await Product.find({ brand: product.brand });
          if (products.length === 0) {
            fil.options = fil.options.filter(
              (option) => option !== product.brand
            );
          }
        } else if (fil.finder === "price") {
          if (fil.options[1] <= product.price) {
            const product = await Product.find(
              {},
              { sort: { price: -1 } }
            ).limit(1);
            fil.options[1] = product[0].price;
          }
        } else {
          for (const spe of product.specification) {
            if (spe.title === fil.finder) {
              for (const value of spe.value) {
                const products = await Product.find({
                  specification: {
                    $elemMatch: { title: spe.title, value: { $in: value } },
                  },
                });
                if (products.length === 0) {
                  fil.options = fil.options.filter(
                    (option) => option !== value
                  );
                }
              }
            }
          }
        }
      }
      await category.save();
    }
  }
  async setOptions(finder: string, id: string) {
    const category = await Category.findById(id);
    const products = await Product.find({
      category: { $in: new mongoose.Types.ObjectId(id) },
    });
    const filterIndex = category.filter.findIndex(
      (filter: any) => filter.finder === finder
    );
    const filter = category.filter[filterIndex];
    for (const product of products) {
      for (const spe of product.specification) {
        if (spe.title === filter.finder) {
          for (const value of spe.value) {
            if (!filter.options.includes(value)) {
              filter.options.push(value);
            }
          }
        }
      }
    }

    category.filter[filterIndex].options = filter.options;

    await category.save();
  }
  async add(id: string, title: string, finder: string) {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          filter: {
            title,
            type: "checkbox",
            finder,
          },
        },
      }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    this.setOptions(finder, id);
    return category;
  }
  async update(filterId: string, title?: string, finder?: string) {
    const category = await Category.findOneAndUpdate(
      {
        "filter._id": filterId,
      },
      {
        $set: {
          "filter.$.title": title,
          "filter.$.finder": finder,
        },
      }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }
  async remove(filterId: string) {
    const category = await Category.findOneAndUpdate(
      {
        "filter._id": filterId,
      },
      {
        $pull: {
          filter: {
            _id: filterId,
          },
        },
      }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }
}

export default new Filter();
