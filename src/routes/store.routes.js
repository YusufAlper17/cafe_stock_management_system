const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.jwt');
const {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore
} = require('../controllers/store.controller');

router.post('/', verifyToken, createStore);
router.get('/', verifyToken, getStores);
router.get('/:id', verifyToken, getStore);
router.put('/:id', verifyToken, updateStore);
router.delete('/:id', verifyToken, deleteStore);

module.exports = router;
