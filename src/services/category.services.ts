import CategoryModel, { CategoryDocument } from "../models/category.model";
import mongoose from "mongoose";

class Category {
  private categoryModel: mongoose.Model<CategoryDocument>;
  constructor(categoryModel: mongoose.Model<CategoryDocument>) {
    this.categoryModel = categoryModel;
  }
  private createCategories(
    categories: CategoryDocument[],
    parentId: any = null
  ): Array<{
    _id: string;
    name: string;
    filters: Array<object>;
    parentId?: string;
    children: Array<object>;
  }> {
    const categoryList = [];
    let category;
    if (parentId == null) {
      category = categories.filter((cat) => cat.parentId == undefined);
    } else {
      category = categories.filter((cat) => cat.parentId == parentId);
    }
    for (const cate of category) {
      categoryList.push({
        _id: cate._id,
        name: cate.name,
        filters: cate.filters,
        children: this.createCategories(categories, cate._id),
      });
    }
    return categoryList;
  }
  async getCategoriesId(id: string) {
    try {
      let ids = [];
      const category = await this.categoryModel.findById(id);
      ids.push(category?._id);
      let parentId = category?.parentId;
      while (parentId) {
        const parent = await this.categoryModel.findById(parentId);
        ids.push(parent?._id);
        parentId = parent?.parentId;
      }
      return ids;
    } catch (err) {
      return null;
    }
  }
  async create(name: string, parent: string | null = null) {
    const category = new this.categoryModel({
      name,
      parent,
    });
    await category.save();
    return category;
  }
  async update(id: string, name: string) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true }
    );
    if (!category) {
      return null;
    }
    return category;
  }
  async delete(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      return null;
    }
    return category;
  }
  async getAll() {
    const categories = await this.categoryModel.find({});
    const categoryList = this.createCategories(categories);
    return categoryList;
  }
  async get(id: string) {
    const categories = await this.getAll();
    const category = categories.find((cat) => cat._id == id);
    return category;
  }
}

export default new Category(CategoryModel);
