const { QueryTypes } = require('sequelize');
const Notification = require('./notification_model');
const sequelize = require('../db/db_config');

const index = async(req,res)=>{
try {
    const {id} = req.params;
     const data = await sequelize.query(
        `
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