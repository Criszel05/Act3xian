import { Books, sequelize } from "../models/Books.js";

// Make sure the database tables are synchronized before using the controller.
await sequelize.sync();

const book = {
  // GET /
  index: async (req, res) => {
    try {
      const data = await Books.findAll();
      res.render("home", { data });
    } catch (error) {
      console.error("Unable to load books:", error);
      res.status(500).send("Unable to load books.");
    }
  },

  // GET /add
  add: (req, res) => {
    res.render("add");
  },

  // POST /insert
  insert: async (req, res) => {
    try {
      const { Name, category, author, publisher, price, pub_year } = req.body;

      await Books.create({
        Name,
        category,
        author,
        publisher,
        price,
        pub_year
      });

      res.redirect("/");
    } catch (error) {
      console.error("Unable to add book:", error);
      res.status(500).send("Unable to add book.");
    }
  },

  // GET /edit/:id
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Books.findByPk(id);

      if (!data) {
        return res.status(404).send("Book not found.");
      }

      res.render("edit", { data });
    } catch (error) {
      console.error("Unable to open book:", error);
      res.status(500).send("Unable to open book.");
    }
  },

  // POST /update/:id
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { Name, category, author, publisher, price, pub_year } = req.body;
      const data = await Books.findByPk(id);

      if (!data) {
        return res.status(404).send("Book not found.");
      }

      await data.update({
        Name,
        category,
        author,
        publisher,
        price,
        pub_year
      });

      res.redirect("/");
    } catch (error) {
      console.error("Unable to update book:", error);
      res.status(500).send("Unable to update book.");
    }
  },

  // GET /delete/:id
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Books.findByPk(id);

      if (!data) {
        return res.status(404).send("Book not found.");
      }

      await data.destroy();
      res.redirect("/");
    } catch (error) {
      console.error("Unable to delete book:", error);
      res.status(500).send("Unable to delete book.");
    }
  }
};

export { book };
