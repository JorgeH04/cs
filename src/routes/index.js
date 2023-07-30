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



///////////////////////////////////////////////////////////////

router.get('/api/mostExpensiveDay', async (req, res) => {
  try {
    const expenses = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (expenses.length > 0) {
      res.json(expenses[0]);
    } else {
      res.json({ message: 'No se encontraron gastos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el día con mayor gasto' });
  }  
});




///////////////////////////////////////////////////////////////////////////

router.get('/api/leastExpensiveDay', async (req, res) => {
  try {
    const expenses = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { totalAmount: 1 }
      },
      {
        $limit: 1
      }
    ]);

    if (expenses.length > 0) {
      res.json(expenses[0]);
    } else {
      res.json({ message: 'No se encontraron gastos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el día con menor gasto' });
  }
});






////////////////////////////////////////////////////////////////////////////



router.get('/api/mostRepeatedExpense', async (req, res) => {
  try {
    const expenses = await Task.aggregate([
      {
        $group: {
          _id: '$charge',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (expenses.length > 0) {
      res.json(expenses[0]);
    } else {
      res.json({ message: 'No se encontraron gastos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el gasto más repetido' });
  }
});



//////////////////////////////////////////////////////////////////////



router.get('/api/totalExpensesByMonth', async (req, res) => {
  try {
    const expenses = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el total de gastos por mes' });
  }
});

module.exports = router;
