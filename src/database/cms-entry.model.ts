import mongoose, { Schema } from "mongoose";

// One document per item of a Website Content collection (menu item, stat,
// expertise card, ...). The collection's field layout lives in
// src/lib/cms/definitions.ts; `data` holds those fields.
// The "_meta" collection records which collections were loaded from defaults.
const cmsEntrySchema = new Schema(
  {
    collection_key: { type: String, required: true, index: true },
    sort_order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

cmsEntrySchema.index({ collection_key: 1, sort_order: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.CmsEntry) {
  mongoose.deleteModel("CmsEntry");
}

const CmsEntry = mongoose.models.CmsEntry || mongoose.model("CmsEntry", cmsEntrySchema);
export default CmsEntry;
