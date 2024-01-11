const { QueryTypes } = require('sequelize');
const Notification = require('./notification_model');
const sequelize = require('../db/db_config');

const index = async (req, res) => {
  try {
    const { id } = req.params;
  
    // Find all notifications for a user with status 1, ordered by createdAt in descending order
    const notifications = await Notification.findAll({
      where: {
        user_id: id,
        status: 1
      },
      order: [
        ['createdAt', 'DESC']
      ],
    });
  

      res.json(notifications);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};



  
  
const showFullData = async(req,res)=>{
try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    
    if (notification) {
      let data;
      if (notification.lead_id !== null) {
        data = await sequelize.query(
          `
          SELECT * FROM tbl_leads 
          LEFT JOIN tbl_notifications ON tbl_leads.lead_id = tbl_notifications.lead_id
          LEFT JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
          LEFT JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id 
          LEFT JOIN tbl_sources ON  tbl_leads.source = tbl_sources.source_id 
          LEFT JOIN tbl_products ON  tbl_leads.product = tbl_products.product_id 
          LEFT JOIN tbl_lead_statuses ON  tbl_leads.lead_status = tbl_lead_statuses.lead_status_id 
          WHERE tbl_notifications.notification_id = :id
          `,
          {
            replacements: { id: notification.notification_id },
            type: QueryTypes.SELECT,
          }
        );
      } else if (notification.task_id !== null) {
        data = await sequelize.query(
          `
          SELECT * FROM tbl_tasks 
          LEFT JOIN tbl_notifications ON tbl_tasks.task_id = tbl_notifications.task_id
          LEFT JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
          LEFT JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id 
          LEFT JOIN tbl_sources ON  tbl_tasks.source = tbl_sources.source_id 
          LEFT JOIN tbl_products ON  tbl_tasks.product = tbl_products.product_id 
          WHERE tbl_notifications.notification_id = :id
          `,
          {
            replacements: { id: notification.notification_id },
            type: QueryTypes.SELECT,
          }
        );
      }
    
      if (data && data.length > 0) {
        res.json(data);
      } else {
        res.json({ msg: "No data found" });
      }
    } else {
        res.json({ msg: "No notifications found" });
    }
} catch (error) {
    console.log(error);
    res.json("Failed To Show Lead ")
} 
}

const statuschange = async(req,res)=>{
try {
    const  {id} =req.params;
    const notification = await Notification.findByPk(id);
    if (notification){
await notification.update({
    status:0
})
    }

    res.json({message:"status changed"})
} catch (error) {
    console.log(error);
    res.json({message:"Notification Not Found"})
}
}

const showreaded = async(req,res) =>{
    try {
        const { id } = req.params;
    
        const notifications = await Notification.findAll({
            where: {    
                user_id: id,
                status:0
            }
        });

        res.json(notifications)
    
        // if (notifications.length > 0) {
        //     let data;
        //     if (notifications[0].lead_id !== null) {
        //         data = await sequelize.query(
        //             `
        //             SELECT *
        //             FROM tbl_notifications
        //             LEFT JOIN tbl_leads ON tbl_notifications.lead_id = tbl_leads.lead_id
        //             WHERE tbl_notifications.customer_id = :id
        //             AND tbl_notifications.status = 0
        //             `,
        //             {
        //                 replacements: { id },
        //                 type: QueryTypes.SELECT,
        //             }
        //         );
        //     } else if (notifications[0].task_id !== null) {
        //         data = await sequelize.query(
        //             `
        //             SELECT *
        //             FROM tbl_notifications
        //             LEFT JOIN tbl_tasks ON tbl_notifications.task_id = tbl_tasks.task_id
        //             WHERE tbl_notifications.customer_id = :id
        //             AND tbl_notifications.status = 0
        //             `,
        //             {
        //                 replacements: { id },
        //                 type: QueryTypes.SELECT,
        //             }
        //         );
        //     }
    
        //     if (data) {
        //         res.json(data);
        //     } else {
        //         res.json({ msg: "No data found" });
        //     }
        // } else {
        //     res.json({ msg: "No notifications found" });
        // }
    } catch (error) {
        // Handle errors here
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



// Update the state with the merged array

const deleted = async(req,res)=>{
   
  try {
    const deletedRows = await Notification.destroy({
      where: {
        notification_id: req.body,
      },
    });
  
    console.log(`Successfully deleted ${deletedRows} rows.`);
    res.json({ success: true, deletedRows });
  } catch (error) {
    console.error("Failed To Delete", error);
    res.status(500).json({ error: "Failed To Delete" });
  }
  
}
module.exports = {
    index,
    showFullData,
    statuschange,
    showreaded,
    deleted
}   