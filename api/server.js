// BUILD YOUR SERVER HERE
const express = require('express')
const User = require("./users/model")

const server = express()
server.use(express.json())

// ENDPOINTS
// GET
server.get("/api/users", (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({
        message: "The users information could not be retrieved",
        err: err.message
      })
    })
})

// GET BY ID:
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params
  User.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist"
        })
      } else {
        res.status(200).json(user)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "The user information could not be retrieved",
        err: err.message
      })
    })
})

// POST
server.post('/api/users', (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user"
    })
  } else {
    User.insert(user)
      .then(createdUser => {
        res.status(201).json(createdUser)
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          err: err.message
        })
      })
  }
})


// DELETE
server.delete("/api/users/:id", async (req, res) => {
  try {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    } else {
      const deletedUser = await User.remove(possibleUser.id)
      res.status(200).json(deletedUser)
    }
  } catch (err) {
    res.status(500).json({
      message: "The user could not be removed",
      err: err.message
    })
  }
})

// PUT
server.put('/api/users/:id', async (req, res) => {
  try {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    } else {
      if (!req.body.name || !req.body.bio) {
        res.status(400).json({
          message: "Please provide name and bio for the user"
        })
      } else {
        const updatedUser = await User.update(req.params.id, req.body)
        res.status(200).json(updatedUser)
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
      err: err.message
    })
  }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
