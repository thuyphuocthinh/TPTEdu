const mongoose = require("mongoose");

const generalSettingsSchema = new mongoose.Schema(
  {
    phone: String,
    address: String,
    logo: String,
    name: String,
    email: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      user_id: String,
      created_at: Date,
    },
    updatedBy: {
      user_id: String,
      updated_at: Date,
    },
    deletedBy: {
      user_id: String,
      updated_at: Date,
    },
  },
  { timestamps: true }
);

const GeneralSettings = mongoose.model("GeneralSettings", generalSettingsSchema, "general-settings");
module.exports = GeneralSettings;
