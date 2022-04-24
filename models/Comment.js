const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const CommentSchema = new Schema({
  writtenBy: {
    type: String
  },
  commentBody: {
    type: String
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

// thia ia  a sub document so we do not need to cinitialize a model for it at te end like we did with comment
const ReplySchema = new Schema(
  {
     // set custom id to avoid confusion with parent comment _id
     replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String
    },
    writtenBy: {
      type: String
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

const Comment = model('Comment', CommentSchema);

module.exports = Comment;