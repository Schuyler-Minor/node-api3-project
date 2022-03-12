const express = require("express");

const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const User = require("./users-model");
const Post = require("../posts/posts-model");

const router = express.Router();

router.get("/", (req, res, next) => {
  User.get()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const result = await Post.insert({
        text: req.text,
        user_id: req.params.id,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "you messed up!!",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
