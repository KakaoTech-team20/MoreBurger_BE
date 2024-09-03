const burgerRepository = require('../model/burgers.js');


async function getBurgers(req, res) {
  const role = req.role;
  const data = await (role === 'seller'
    ? burgerRepository.getAllByUserRole(role)
    : burgerRepository.getAll());
  return res.status(200).json({
    burgers: data,
    totalCount: data.length,
    pageNum: null,
    pageLimit: null,
  });
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
  req.body.managerId = req.userId;
  const [created, burger] = await burgerRepository.create(req.body, req.userId);
  if (created) {
    return res.status(201).json({message: `Burger ${burger} successfully created`});
  } else {
    return res.status(403).json({message: `Burger ${burger} already exists`});
  }
}

async function updateBurger(req, res, next) {
  const id = req.params.id;
  const burger = await burgerRepository.getById(id);
  if (!burger) {
    return res.status(404).json({ message: `Burger not found: ${id}` });
  }
  if (burger.managerId !== req.userId) {
    return res.sendStatus(403);
  }
  const updateObj = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value !== null && burger[key] !== value));
  const updated = await burgerRepository.update(id, updateObj);
  res.status(200).json(updated);
}

async function deleteBurger(req, res, next) {
  const id = req.params.id;
  const burger = await burgerRepository.getById(id);
  if (!burger) {
    return res.status(404).json({ message: `Burger id(${id}) not found` });
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