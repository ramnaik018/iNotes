const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const fetchuser = require("../midleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1
//Get all note by GET request at "api/notes/fetchallnotes"  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});


//Route 2
//Add a new note by POST request at "api/notes/fetchallnotes"  login required
router.post("/addnote",fetchuser,[
    body("title", "Enter a valid name").isLength({ min: 5 }),
    body("description", "Description must be at least 5 characters").isLength({min: 5,}),
  ],
  async (req, res) => {
    //if there are error in validation return bad req to response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //create and save a new note
    try {
      const { title, description, tag } = req.body;

      const note = new Note({ title, description, tag, user: req.user.id });
      const savedNotes = await note.save();
      res.send(savedNotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);


//Route 3
//Update a existing note by PUT request at "api/notes/update/:id"  login required
router.put("/update/:id", fetchuser, async (req, res) => {
  //create and save a new note
  try {
    const { title, description, tag } = req.body;
    //create a new object
    const newNote = {};
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //Allow updation only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{ $set: newNote },{ new: true });
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});


//Route 4
//Delete a existing note by DELETE request at "api/notes/delete/:id"  login required
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be delted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

module.exports = router;
