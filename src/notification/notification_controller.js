const { QueryTypes } = require('sequelize');
const Notification = require('./notification_model');
const sequelize = require('../db/db_config');

const index = async(req,res)=>{
try {
    const {id} = req.params;
     const data = await sequelize.query(
        `SELECT 
        tbl_notifications.*,
    FROM tbl_notifications
    LEFT JOIN tbl_leads ON tbl_notifications.lead_id = tbl_leads.lead_id
    LEFT JOIN tbl_tasks ON tbl_notifications.task_id = tbl_tasks.task_id
    WHERE tbl_notifications.customer_id = :id;

        `,
        {
          replacements: { id },
          type: QueryTypes.SELECT,// Specify the model for Sequelize to map the result to
        }
    );

    res.json(data)
} catch (error) {
    console.log(error);
    res.json({error:"Failed To Show Notification"})
}
}

module.exports = {
    index
}