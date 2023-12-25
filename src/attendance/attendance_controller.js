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

    }= req.body;
    const rootPath = process.cwd();
if (req.file && req.files.in_photo){
    const intime_image = req.files.in_photo;

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
      
        }
     const newAttendance = await Attendance.create({
        user_id:user_id ? user_id : null,
        attendance_date:attendance_date ? attendance_date : null,
        in_time:in_time ? in_time : null,
        in_location:in_location ? in_location :null,
        remark:1,
        in_photo:req.files ? req.files.in_photo.name : null,
        

      })

      res.json(newAttendance)
} catch (error) {
    console.log(error);
res.json({error:"Failed To Store Attendance"})
}
}

const index = async (req, res) => {
    try {
        const today = new Date();
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const seconds = String(today.getSeconds()).padStart(2, '0');
        
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        
        const usersWithNoAttendance = await sequelize.query(
            `SELECT u.uid AS user_id
            FROM users u
            INNER JOIN tbl_shifts s ON u.shift_id = s.shift_id
            WHERE NOT EXISTS (
                SELECT 1
                FROM tbl_attendances a
                WHERE a.user_id = u.uid
            )
            AND :formattedTime > s.shift_intime;            
            `
        ,
            {
                type: QueryTypes.SELECT,
                replacements:{
                    formattedTime
                }
            }
        );
        
        for (const user of usersWithNoAttendance) {
            // Check if the user already has an attendance record for today
            const existingAttendance = await sequelize.query(
                `SELECT 1
                FROM tbl_attendances
                WHERE user_id = :userId AND attendance_date = :attendanceDate`,
                {
                    type: QueryTypes.SELECT,
                    replacements: {
                        userId: user.user_id,
                        attendanceDate: today,
                    },
                }
            );
        
            if (!existingAttendance || existingAttendance.length === 0) {
                // If no attendance record exists, insert a new record
                for (const user of usersWithNoAttendance) {
                    await sequelize.query(
                        `INSERT INTO tbl_attendances (user_id, attendance_date,remark)
                        VALUES (:userId, :attendanceDate,0)`,
                        {
                            type: QueryTypes.INSERT,
                            replacements: {
                                userId: user.user_id,
                                attendanceDate: today,
                            },
                        }
                    );
                }
            }
        }
        
        const updatedData = await sequelize.query(
            `SELECT 
                tbl_attendances.*,
                users.*,
                tbl_shifts.shift_intime,
                tbl_shifts.shift_outime
            FROM tbl_attendances
            INNER JOIN users ON tbl_attendances.user_id = users.uid
            INNER JOIN tbl_shifts ON users.shift_id = tbl_shifts.shift_id
            WHERE tbl_attendances.attendance_date = :today`,
            {
                type: QueryTypes.SELECT,
                replacements:{today}
            }
        );
        
        // Return or handle updatedData as needed
        
    
        res.json(updatedData);
    } catch (error) {
        console.log(error);
        res.json({ error: 'Failed To Get Attendance' });
    }
    
};



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

const attendancebyuser = async(req,res)=>{
try {
    const {id} = req.params;
const UserAttendance = await Attendance.findAll({
    where:{
     user_id:id   
    }
})
    
    res.json(UserAttendance);
} catch (error) {
    console.log(error);
    res.json({error:"Failed To Find Attendance By User"})
}
}

const store_outime = async(req,res)=>{
try {
 
    
} catch (error) {
    console.log(error);
    res.json({error:"Failed To Store Outtime"})
}
}
module.exports = {
    store,
    index,
    todayattendance,
    attendancebyuser,
    store_outime
}