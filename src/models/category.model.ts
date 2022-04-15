import mongoose from "mongoose";

interface FiltersDocument {
  title: string;
  type: string;
  options: Array<any>;
  finder: string;
}
export interface CategoryDocument extends mongoose.Document {
  name: string;
  parentId: mongoose.Types.ObjectId | null;
  filters: Array<FiltersDocument>;
  createdAt: Date;
  updatedAt: Date;
}

const FiltersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: Array, required: true, default: [] },
  finder: { type: String, required: true },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    filter: { type: [FiltersSchema], required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

//set default filters
categorySchema.pre<CategoryDocument>("save", async function (next) {
  if (!this.isModified("filter")) next();
  this.filters = [
    { title: "برند", type: "checkbox", options: [], finder: "brand" },
    {
      title: "فقط کالاهای موجود",
      type: "switch",
      options: [false],
      finder: "availability",
    },
    {
      title: "فقط کالاهای دارای تخفیف",
      type: "switch",
      options: [false],
      finder: "discount",
    },
    { title: "قیمت", type: "range", options: [0, 0], finder: "price" },
  ];
  await this.save();
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
