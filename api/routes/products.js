const router = require('express').Router();
const adminController = require('../controls/products')

router.route('/')
  .get(adminController.GetProducts)

router.route('/')
  .post(adminController.PostProduct)

router.route('/:id')
  .get(adminController.filterProduct)

router.route('/:id')
  .patch(adminController.patchProduct)

router.route('/:id')
  .delete(adminController.delProduct)


module.exports = router;
