import express from 'express';
import passport from 'passport';
import boom from '@hapi/boom';

import reziseImage from '../libs/reziseImage';
import PlayersService, { PlayerCreate } from '../services/players.service';
import validatorHandler from '../middlewares/validate.handler';
import {
  createPlayerSchema,
  getPlayerSchema,
  updatePlayerSchema,
  getPlayerPaginationSchema,
} from '../schemas/player.schema';
import validateRole from '../middlewares/validateRole.handler';
import uploadHandler from '../middlewares/uploadImage.handler';

const router = express.Router();

// get all the players
router.get('/',
  passport.authenticate('jwt', { session: false }),
  validateRole(['admin', 'editor', 'reader']),
  validatorHandler(getPlayerPaginationSchema, 'query'),
  async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    try {
      const players = await PlayersService.findAll(page, size);
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
  async (req, res, next) => {
    try {
      const playerId = Number(req.params.id);
      const player = await PlayersService.findOne(playerId);
      res.json(player);
    } catch (error) {
      next(error);
    }
  });

// create a player
router.post('/',
  passport.authenticate('jwt', { session: false }),
  validateRole(['editor', 'admin']),
  validatorHandler(createPlayerSchema, 'body'),
  async (req, res, next) => {
    // logic to create a player
    try {
      const data: PlayerCreate = req.body;
      const payload: any = req.user!;
      const creatorId = Number(payload.sub);
      const player = await PlayersService.create(data, creatorId);
      res.status(201).json(player);
    } catch (error) {
      next(error);
    }
  });

// add or update image of a player
router.post('/:id/image',
  validatorHandler(getPlayerSchema, 'params'),
  uploadHandler('image'),
  async (req, res, next) => {
    if (!req.file) {
      next(boom.badRequest('no file found'));
      return;
    }

    try {
      const playerId = Number(req.params.id);
      await PlayersService.findOne(playerId);
      const images = await reziseImage(req.file!.buffer);
      const updatedPlayer = await PlayersService.addImage(playerId, images);
      res.json(updatedPlayer);
    } catch (error) {
      next(error);
    }
  });

// update a player
router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  validateRole(['editor', 'admin']),
  validatorHandler(getPlayerSchema, 'params'),
  validatorHandler(updatePlayerSchema, 'body'),
  async (req, res, next) => {
    try {
      const data: Partial<PlayerCreate> = req.body;
      const playerId = Number(req.params.id);
      const player = await PlayersService.update(playerId, data);
      res.json(player);
    } catch (error) {
      next(error);
    }
  });

export default router;
