const { QueryTypes } = require('sequelize');
const User = require('../Auth/User_model');
const sequelize = require('../db/db_config');
const Attendance = require('./attendance_model')
const path = require('path')

const store = async(req,res)=>{
try {
    const {
        user_id,
        attendance_date,
        in_time,
        in_location,
        out_time,
        out_location,
        remark,

    }= req.body;
    const rootPath = process.cwd();

    const intime_image = req.files.in_photo;
    const outime_image = req.files.out_photo;

    const validateAndMove = (file, uploadPath) => {
        if (!file) {
          // Skip the file if it's null
          console.log("File is null");
          return null;
        }
  
        if (!file.name) {
          return res.status(400).json({ error: "Invalid file object" });
        }
  
        file.mv(uploadPath, (err) => {
          if (err) {
            console.error("Error moving file:", err);
            return res.status(500).json({ error: "Error uploading file" });
          }
          // Do something with the file path, for example, save it in the database
          // ...
        });
  
        return file.name; // Return the filename for use in the database
      };

      const imageintime = validateAndMove(
        intime_image,
        path.join(
          rootPath,
          "public/images/attendance",
          "crm" + "-" + (intime_image ? intime_image.name : null)
        )
      );
      const outtimeimage = validateAndMove(
        outime_image,
        path.join(
          rootPath,
          "public/images/attendance",
          "crm" + "-" + (outime_image ? outime_image.name : null)
        )
      );

     const newAttendance = await Attendance.create({
        user_id:user_id ? user_id : null,
        attendance_date:attendance_date ? attendance_date : null,
        in_time:in_time ? in_time : null,
        in_location:in_location ? in_location :null,
        out_time:out_time ? out_time : null,
        out_location:out_location ? out_location : null,
        remark:remark ? remark : null,
        in_photo:intime_image ? imageintime : null,
        out_photo:outime_image ? outime_image: null,

      })

      res.json(newAttendance)
} catch (error) {
    console.log(error);
res.json({error:"Failed To Store Attendance"})
}
}

const index = async(req,res) =>{
    try {   

            // Define the startOfDay and endOfDay variables here
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setUTCHours(0, 0, 0, 0);
    
            const endOfDay = new Date(today);
            endOfDay.setUTCHours(23, 59, 59, 999);
    
            // Execute a query to find an existing entry for the specific time
            const existingEntry = await sequelize.query(
                `SELECT * FROM tbl_attendances
                INNER JOIN users ON tbl_attendances.user_id = users.uid
                WHERE tbl_attendances.attendance_date BETWEEN :startOfDay AND :endOfDay`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {
                        startOfDay,
                        endOfDay,
                    },
                }
            );
    
            // If there is no existing entry, create a new one with random null fields
            if (!existingEntry || existingEntry.length === 0) {
                // Generate random values for fields (adjust based on your actual field names and types)
                const randomFields = {
                    field1: Math.random() > 0.5 ? 'value1' : null,
                    field2: Math.random() > 0.5 ? 'value2' : null,
                    // Add more fields as needed
                };
    
                // Create a new entry with the specific time and random null fields
                await sequelize.query(
                    `INSERT INTO tbl_attendances (user_id, attendance_date, field1, field2)
                    VALUES (:userId, :attendanceDate, :field1, :field2)`,
                    {
                        type: QueryTypes.INSERT,
                        replacements: {
                            userId: 1,
                            attendanceDate: today,
                            ...randomFields,
                        },
                    }
                );
            }
    
            // Retrieve the updated data after creating the entry
            const updatedData = await sequelize.query(
                `SELECT * FROM tbl_attendances
                INNER JOIN users ON tbl_attendances.user_id = users.uid
                WHERE tbl_attendances.attendance_date BETWEEN :startOfDay AND :endOfDay`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {
                        startOfDay,
                        endOfDay,
                    },
                }
            );
    
            res.json(updatedData);

} catch (error) {
        console.log(error);
        res.json({error:"Failed To Get Attendance"})
}
}

const todayattendance = async(req,res) =>{

    const { Op, QueryTypes } = require('sequelize');

    try {
        // Execute the raw SQL query
        const data = await sequelize.query(
            `SELECT * FROM tbl_attendances
            INNER JOIN users ON tbl_attendances.user_id = users.uid
            `,
            {
                type: QueryTypes.SELECT,
            }
        );
    
        // Define the startOfDay and endOfDay variables here
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setUTCHours(0, 0, 0, 0);
    
        const endOfDay = new Date(today);
        endOfDay.setUTCHours(23, 59, 59, 999);
    
        // Filter the results based on the date
        const todayAttendance = data.filter(item =>
            new Date(item.attendance_date).getTime() >= startOfDay.getTime() &&
            new Date(item.attendance_date).getTime() <= endOfDay.getTime()
        );
    
        // Do something with todayAttendance, e.g., send it in the response
        res.json(todayAttendance);
    } catch (error) {
        res.json({ error: "Failed To Get Today Attendance" });
        console.error(error);
    }
    
    
    
}
module.exports = {
    store,
    index,
    todayattendance
}