const express = require('express');
const router = express.Router();
const Task = require('../models/task.js');



// Obtener todos los gastos
router.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Task.find();
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }  
});

// Agregar un nuevo gasto
router.post('/api/expenses', async (req, res) => {
  try {
    const { charge, amount } = req.body;
    const newExpense = new Task({ charge, amount, date: new Date() });
    await newExpense.save();
    res.json(newExpense);
    console.log(newExpense)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el gasto' });
  }
});

// Eliminar un gasto
router.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Gasto eliminado correctamente' });
    console.log({ message: 'Gasto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
});

// Actualizar un gasto existente
router.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { charge, amount } = req.body;
    const updatedExpense = await Task.findByIdAndUpdate(id, { charge, amount }, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
});


router.get('/api/expensesGrouped', async (req, res) => {
  try {
    const expenses = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          charges: { $push: { charge: '$charge', amount: '$amount' } }
        }
      }
    ]);

    res.json(expenses);
    console.log(expenses)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }  
});

module.exports = router;
