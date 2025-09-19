const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');
const { ObjectId } = require('mongodb');

// Crear thread
router.post('/threads/:board', async (req, res) => {
  const { text, delete_password } = req.body;
  const board = req.params.board;

  const thread = new Thread({
    board,
    text,
    delete_password,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    replies: []
  });

  await thread.save();
  return res.redirect(`/b/${board}/`);
});

// Ver 10 threads
router.get('/threads/:board', async (req, res) => {
  const board = req.params.board;
  const threads = await Thread.find({ board })
    .sort({ bumped_on: -1 })
    .limit(10)
    .lean();

  const sanitized = threads.map(th => ({
    _id: th._id,
    text: th.text,
    created_on: th.created_on,
    bumped_on: th.bumped_on,
    replycount: th.replies.length,
    replies: th.replies.slice(-3).map(r => ({
      _id: r._id,
      text: r.text,
      created_on: r.created_on
    }))
  }));

  res.json(sanitized);
});

// Reportar thread
router.put('/threads/:board', async (req, res) => {
  const { thread_id } = req.body;
  await Thread.findByIdAndUpdate(thread_id, { reported: true });
  res.send('reported');
});

// Borrar thread
router.delete('/threads/:board', async (req, res) => {
  const { thread_id, delete_password } = req.body;
  const thread = await Thread.findById(thread_id);
  if (!thread) return res.send('not found');
  if (thread.delete_password !== delete_password) return res.send('incorrect password');
  await Thread.findByIdAndDelete(thread_id);
  res.send('success');
});

// Crear reply
router.post('/replies/:board', async (req, res) => {
  const { text, delete_password, thread_id } = req.body;
  const reply = {
    _id: new ObjectId(),
    text,
    delete_password,
    created_on: new Date(),
    reported: false
  };

  const updatedThread = await Thread.findByIdAndUpdate(
    thread_id,
    { $set: { bumped_on: new Date() }, $push: { replies: reply } },
    { new: true }
  );

  if (!updatedThread) return res.send('thread not found');
  return res.redirect(`/b/${req.params.board}/${thread_id}/`);
});

// Ver replies de un thread
router.get('/replies/:board', async (req, res) => {
  const { thread_id } = req.query;
  const thread = await Thread.findById(thread_id).lean();
  if (!thread) return res.send('not found');

  const sanitized = {
    _id: thread._id,
    text: thread.text,
    created_on: thread.created_on,
    bumped_on: thread.bumped_on,
    replies: thread.replies.map(r => ({
      _id: r._id,
      text: r.text,
      created_on: r.created_on
    }))
  };

  res.json(sanitized);
});

// Reportar reply
router.put('/replies/:board', async (req, res) => {
  const { thread_id, reply_id } = req.body;
  const thread = await Thread.findById(thread_id);
  if (!thread) return res.send('not found');
  const reply = thread.replies.id(reply_id);
  if (!reply) return res.send('not found');
  reply.reported = true;
  await thread.save();
  res.send('reported');
});

// Borrar reply
router.delete('/replies/:board', async (req, res) => {
  const { thread_id, reply_id, delete_password } = req.body;
  const thread = await Thread.findById(thread_id);
  if (!thread) return res.send('not found');
  const reply = thread.replies.id(reply_id);
  if (!reply) return res.send('not found');
  if (reply.delete_password !== delete_password) return res.send('incorrect password');
  reply.text = '[deleted]';
  await thread.save();
  res.send('success');
});

module.exports = router;
