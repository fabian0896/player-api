import express from 'express';
import passport from 'passport';

import PlayersService from '../services/players.service';
import validatorHandler from '../middlewares/validate.handler';
import {
  createPlayerSchema,
  getPlayerSchema,
  updatePlayerSchema,
} from '../schemas/player.schema';
import validateRole from '../middlewares/validateRole.handler';

const router = express.Router();

// get all the players
router.get('/',
  passport.authenticate('jwt', { session: false }),
  validateRole(['admin', 'editor', 'reader']),
  async (req, res, next) => {
    try {
      const players = await PlayersService.findAll();
      res.status(200).json(players);
    } catch (error) {
      next(error);
    }
  });

// get one player by id
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  validateRole(['reader', 'editor', 'admin']),
  validatorHandler(getPlayerSchema, 'params'),
  (req, res) => {
    res.json({
      id: req.params.id,
    });
  });

// create a player
router.post('/',
  passport.authenticate('jwt', { session: false }),
  validateRole(['editor', 'admin']),
  validatorHandler(createPlayerSchema, 'body'),
  async (req, res) => {
    // logic to create a player
    res.json(req.body);
  });

// update a player
router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validateRole(['editor', 'admin']),
  validatorHandler(getPlayerSchema, 'params'),
  validatorHandler(updatePlayerSchema, 'body'),
  (req, res) => {
    res.json({
      id: req.params.id,
      ...req.body,
    });
  });

export default router;
