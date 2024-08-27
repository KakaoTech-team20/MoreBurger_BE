const burgerRepository = require('../model/burgers.js');


async function getBurgers(req, res) {
  console.log('getBurgers');
  const role = req.role;
  const data = await (role === 'seller'
    ? burgerRepository.getAllByUserRole(role)
    : burgerRepository.getAll());
  return res.status(200).json(data);
}

async function getBurger(req, res, next) {
  const id = req.params.id;
  const burger = await burgerRepository.getById(id);
  if (burger) {
    res.status(200).json(burger);
  } else {
    res.status(404).json({ message: `Burger id(${id}) not found` });
  }
}

async function createBurger(req, res, next) {
  console.log('creating');
  const burger = await burgerRepository.create(req.body, req.userId);
  console.log(burger);
  return res.status(201).json(burger);
}

async function updateBurger(req, res, next) {
  const id = req.params.id;
  const burger = await burgerRepository.getById(id);
  if (!burger) {
    return res.status(404).json({ message: `Burger not found: ${id}` });
  }
  if (burger.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await burgerRepository.update(id, req.body);
  res.status(200).json(updated);
}

async function deleteBurger(req, res, next) {
  const id = req.params.id;
  const burger = await burgerRepository.getById(id);
  if (!burger) {
    return res.status(404).json({ message: `Burger not found: ${id}` });
  }
  if (burger.userId !== burger.userId) {
    return res.sendStatus(403);
  }
  await burgerRepository.remove(id);
  res.sendStatus(204);
}

module.exports = {
  getBurgers,
  getBurger,
  createBurger,
  deleteBurger,
  updateBurger,
};