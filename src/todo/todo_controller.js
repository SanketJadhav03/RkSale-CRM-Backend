
const Todo = require("./todo_model")

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const Todos = await Todo.findAll({
            limit: limitPerPage,
            offset: offset,
        });

        res.json(Todos);
    } catch (error) {
        console.error("Error getting Todo:", error);
        res.status(500).json({ error: "Error getting Todo" });
    }

}
const store = async (req, res) => {
    try {
        const { todo_name, todo_user_id } = req.body;
        const existingTodo = await Todo.findOne({
            where: {
                todo_name: todo_name,
            },
        });

        if (existingTodo) {
            return res.json({ message: "Todo name already exists", status: 0 });
        }
        await Todo.create({
            todo_name,
            todo_user_id
        });
        return res.status(201).json({ message: 'Todo added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding Todo:", error);
        res.status(500).json({ error: "Error adding Todo" });
    }
}
const show = async (req, res) => {
    try {
        const { id } = req.params;
        const Todos = await Todo.findByPk(id);
        if (!Todos) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(Todos);
    } catch (error) {
        console.error("Error showing Todo by id:", error);
        res.status(500).json({ error: "Error showing Todo by id" });
    }
}
const updated = async (req, res) => {
    try {
        const { todo_id, todo_name } = req.body;

        const Todos = await Todo.findByPk(todo_id);
        if (!Todos) {
            return res.status(404).json({ error: "Todos not found" });
        }

        await Todo.update({
            todo_name,
        })
        return res.json({ message: "Todos updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Todos:", error);
        res.status(500).json({ error: "Error updating Todos" });
    }
}
const deleted = async (req, res) => {
    try {
        const { todo_id, todo_status } = req.body;

        const Todos = await Todo.findByPk(todo_id);
        // return res.json(todo_status);
        if (!Todos) {
            return res.status(404).json({ error: "Todos not found" });
        }
        if (todo_status === 1) {
            await Todos.update({
                todo_status: todo_status,
            })
            return res.json({ message: "Todos Resotred successfully!", status: 1 });
        } else if (todo_status === 2) {
            await Todos.update({
                todo_status: todo_status,
            })
            return res.json({ message: "Todos deleted successfully!", status: 2 });
        }

    } catch (error) {
        console.error("Error deleted Todos:", error);
        res.status(500).json({ error: "Error deleted Todos" });
    }
}
// const deleted = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const related = await Todo.findByPk(id);
//         if (!related) {
//             return res.status(404).json({ error: "Todo not found" });
//         }
//         await related.destroy();
//         return res.json({ message: "Todo deleted successfully!", status: 1 });
//     } catch (error) {
//         console.error("Error deleting Todo:", error);
//         res.status(500).json({ error: "Error deleting Todo:" });
//     }
// }
module.exports = {
    index,
    store,
    show,
    updated,
    deleted
};