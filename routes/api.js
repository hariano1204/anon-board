"use strict";

const ThreadController = require("../threadController");
const ReplyController = require("../replyController");

module.exports = function (app) {
  // ========================
  // THREADS
  // ========================
  app.route("/api/threads/:board")
    // Crear un nuevo thread
    .post(async (req, res) => {
      const board = req.params.board;
      const result = await ThreadController.createThread(board, req.body);
      // FCC espera redirect a la vista del board
      return res.redirect(`/b/${board}/`);
    })
    // Ver 10 threads
    .get(async (req, res) => {
      const board = req.params.board;
      const result = await ThreadController.getThreads(board);
      return res.json(result);
    })
    // Borrar un thread
    .delete(async (req, res) => {
      const board = req.params.board;
      const result = await ThreadController.deleteThread(board, req.body);
      return res.send(result);
    })
    // Reportar un thread
    .put(async (req, res) => {
      const board = req.params.board;
      const result = await ThreadController.reportThread(board, req.body);
      return res.send(result);
    });

  // ========================
  // REPLIES
  // ========================
  app.route("/api/replies/:board")
    // Crear un nuevo reply
    .post(async (req, res) => {
      const board = req.params.board;
      const { thread_id } = req.body;
      await ReplyController.createReply(board, req.body);
      // FCC espera redirect al thread
      return res.redirect(`/b/${board}/${thread_id}/`);
    })
    // Ver replies de un thread
    .get(async (req, res) => {
      const board = req.params.board;
      const { thread_id } = req.query;
      const result = await ReplyController.getReplies(board, thread_id);
      return res.json(result);
    })
    // Borrar un reply
    .delete(async (req, res) => {
      const board = req.params.board;
      const result = await ReplyController.deleteReply(board, req.body);
      return res.send(result);
    })
    // Reportar un reply
    .put(async (req, res) => {
      const board = req.params.board;
      const result = await ReplyController.reportReply(board, req.body);
      return res.send(result);
    });
};
