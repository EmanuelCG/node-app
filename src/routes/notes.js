const router = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const { isAuthenticated } = require('../helpers/auth');


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-notes');
});

router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please Write a Title' });
    }

    if (!description) {
        errors.push({ text: 'Please White a Description' });
    }

    if (errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.id = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada con éxito');
            // console.log(newNote);
            res.redirect('/notes');
    };

});

router.get('/notes', isAuthenticated, async (req, res) => {
    try { 
        const user = req.user;
        await Note.find({id: req.user.id}).sort({date:'desc'})
            .then(notes => {
                res.render('notes/all-notes', {
                    notes: notes.map(
                        notes => notes.toObject()
                    ), user: user.toObject()});
            });

    } catch (err) {
        console.log(err);
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note: note.toObject()});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota editada con éxito');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada con éxito');
    res.redirect('/notes');
});

module.exports = router;