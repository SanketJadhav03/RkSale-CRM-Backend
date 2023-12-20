
const Tags = require("./tags_model")

const index = async (req, res) => {
    try {
        const tags = await Tags.findAll();
        res.json(tags);
    } catch (error) {
        console.log(error);
    }
}
const store = async (req, res) => {
    try {
        const { tag_name } = req.body;
        const existingTag = await Tags.findOne({
            where: {
                tag_name: tag_name,
            },
        });

        if (existingTag) {
            return res.json({ message: "Tags name already exists", status: 0 });
        }
        await Tags.create({
            tag_name
        });
        return res.status(201).json({ message: 'Tags added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding Tags:", error);
        res.status(500).json({ error: "Error adding Tags" });
    }
}
const show = async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await Tags.findByPk(id);
        if (!tags) {
            return res.status(404).json({ error: "Tags not found" });
        }
        res.json(tags);
    } catch (error) {
        console.error("Error showing Tags by id:", error);
        res.status(500).json({ error: "Error showing Tags by id" });
    }
}
const updated = async (req, res) => {
    try {
        const { tag_id, tag_name } = req.body;

        const tags = await Tags.findByPk(tag_id);
        if (!tags) {
            return res.status(404).json({ error: "Tags not found" });
        }

        await tags.update({
            tag_name,
        })
        return res.json({ message: "Tags updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Tags:", error);
        res.status(500).json({ error: "Error updating Tags" });
    }
}
const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const related = await Tags.findByPk(id);
        if (!related) {
            return res.status(404).json({ error: "Tags not found" });
        }
        await related.destroy();
        return res.json({ message: "Tags deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Tags:", error);
        res.status(500).json({ error: "Error deleting Tags:" });
    }
}
module.exports = {
    index,
    store,
    show,
    updated,
    deleted
};