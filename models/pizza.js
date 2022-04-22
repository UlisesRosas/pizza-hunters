// schema cpnstructor for mongoose
const { Schema, model } = require('mongoose');
// imports getter from dareFormat file
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // this is called a getter which helps with fomatting and it comes from the utils folder
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    // tells the schema it canuse virtual properties
    toJSON: {
      virtuals: true,
      //this enables us to use getters in the schema
      getters: true
    },
    // we dont need ids foe virtuals
    id: false
  }
);
// get total count of comments and replies on retrieval
// is a virtual property 
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

