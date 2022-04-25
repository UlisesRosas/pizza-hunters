
const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// thia ia  a sub document so we do not need to cinitialize a model for it at te end like we did with comment
const ReplySchema = new Schema(
  {
     // set custom id to avoid confusion with parent comment _id
     replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);


const CommentSchema = new Schema({
  writtenBy: {
    type: String,
    required: true,
    trim: true
  },
  commentBody: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // enables getter and uses imported funtion to format date
    get: createdAtVal => dateFormat(createdAtVal)
  },
  // this populates the subschema in to the commentSchema
  replies: [ReplySchema]
},
{
  toJSON: {
    vertuals: true,
    getters: true
  },
  // we dont need ids for virtuals
  id: false
}
);

CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});


const Comment = model('Comment', CommentSchema);

module.exports = Comment;