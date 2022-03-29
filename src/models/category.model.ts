import mongoose from "mongoose";

const FilterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: Array, required: true, default: [] },
  finder: { type: String, required: true },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    filter: { type: [FilterSchema], required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
