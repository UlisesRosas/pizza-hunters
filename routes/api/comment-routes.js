const router = require('express').Router();
 
const {
    addComment,
    removeComment,
    addReply,
    removeReply,
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);

// /api/comments/<pizzaId>/<commentId> 
// updates the comment and deletes the reply which is also a comment
router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment)

// /api/comments/<pizzaId>/<replyId> 
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;