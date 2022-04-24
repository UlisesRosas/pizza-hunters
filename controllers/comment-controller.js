const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        //   this selects what pizza the comment belongs to and pushes the comment id to the pizza
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  // add a reply
  addReply({ params, body }, res) {
    // we are updating to form the reply functionality
    Comment.findOneAndUpdate(
      //getting id 
      { _id: params.commentId },
      // updating the array with new info
      { $push: { replies: body } },
      // displays the updated version instead of original
      { new: true }
    )
      .then(dbPizzaData => {
        // if no pizza data is retrieved
        if (!dbPizzaData) {
          // responds with error message in json
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        // responds with pizza data
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  // remove a reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        //   updates pizza data
        return Pizza.findOneAndUpdate(
          // gets the pizza id to get the comment from the specific pizza 
          { _id: params.pizzaId },
          // MongoDb $pull removes the comment id from the pizza because remember that the id is being stored not the actual comment
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = commentController;