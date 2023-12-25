
const Related = require("./related_model")

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const related = await Related.findAll({
          limit: limitPerPage,
          offset: offset,
        });
      
        res.json(related);
      } catch (error) {
        console.error("Error getting related entries:", error);
        res.status(500).json({ error: "Error getting related entries" });
      }
      
}
const store = async (req, res) => {
    try {
        const { related_name } = req.body;
        const existingRelated = await Related.findOne({
            where: {
                related_name: related_name,
            },
        });

        if (existingRelated) {
            return res.json({ message: "Related name already exists", status: 0 });
        }
        await Related.create({
            related_name
        });
        return res.status(201).json({ message: 'Related added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding Related:", error);
        res.status(500).json({ error: "Error adding Related" });
    }
}
const show = async (req, res) => {
    try {
        const { id } = req.params;
        const related = await Related.findByPk(id);
        if (!related) {
            return res.status(404).json({ error: "Related not found" });
        }
        res.json(related);
    } catch (error) {
        console.error("Error showing Related by id:", error);
        res.status(500).json({ error: "Error showing Related by id" });
    }
}
const updated = async (req, res) => {
    try {
        const { related_id, related_name } = req.body;

        const related = await Related.findByPk(related_id);
        if (!related) {
            return res.status(404).json({ error: "Related not found" });
        }

        await related.update({
            related_name,
        })
        return res.json({ message: "Related updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Related:", error);
        res.status(500).json({ error: "Error updating Related" });
    }
}
const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const related = await Related.findByPk(id);
        if (!related) {
            return res.status(404).json({ error: "Related not found" });
        }
        await related.destroy();
        return res.json({ message: "Related deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Related:", error);
        res.status(500).json({ error: "Error deleting Related:" });
    }
}
module.exports = {
    index,
    store,
    show,
    updated,
    deleted
};