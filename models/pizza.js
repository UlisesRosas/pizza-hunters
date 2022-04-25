// schema cpnstructor for mongoose
const { Schema, model } = require('mongoose');
// imports getter from dareFormat file
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      // removes whitespace before and aftrer the string
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // this is called a getter which helps with fomatting and it comes from the utils folder
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      // enumerable means that it can be itterated over
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
    // we dont need ids for virtuals
    id: false
  }
);
// get total count of comments and replies on retrieval
// is a virtual property 
PizzaSchema.virtual('commentCount').get(function () {
  // reduce is tallying up the number of comments. It is an array prototype
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

