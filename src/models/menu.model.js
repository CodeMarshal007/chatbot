const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const MenuSchema = new Schema(
  {
    id: {
      type: Number,
      // required: [true, "id cannot be blank"],
    },
    name: {
      type: String,
      required: [true, "name cannot be blank"],
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
  },
  {
    timestamps: true,
    // _id: false, // disable default _id field
  }
);

// MenuSchema.set("toJSON", {
//   getters: true,
//   virtuals: false,
//   transform: (doc, ret, options) => {
//     delete ret.__v;
//     ret.id = ret._id; // set id to _id value
//     delete ret._id; // remove _id field from result
//   },
// });

// MenuSchema.set("toObject", {
//   getters: true,
//   virtuals: false,
//   transform: (doc, ret, options) => {
//     delete ret.__v;
//     ret.id = ret._id; // set id to _id value
//     delete ret._id; // remove _id field from result
//   },
// });
MenuSchema.plugin(uniqueValidator);

MenuSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  const highestMenu = await this.constructor.findOne().sort("-id");
  if (!highestMenu) {
    this.id = 100;
  } else {
    this.id = highestMenu.id + 1;
  }

  return next();
});
const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;
