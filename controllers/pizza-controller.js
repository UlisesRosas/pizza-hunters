// this file will hold the route functionality
const { Pizza } = require('../models');

// performs CRUD for Pizza
const pizzaController = {
    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
        // this populates the comment field inside of the pizza collection
            .populate({
                path: 'comments',
                // the '-' means to exclude a specific bitfield 
                select: '-__v'
            })
            .select('-__v')
            // this gets the newest pizza first
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // If no pizza is found, send 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // createPizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // update pizza by id
    updatePizza({ params, body }, res) {
        // this new true and runValidators true makes sure that validation occurs on any new data
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.status(400).json(err));
      },
    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

}

module.exports = pizzaController;