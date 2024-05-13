const { QueryTypes } = require("sequelize");
const User = require("../Auth/User_model");
const sequelize = require("../db/db_config");
const Attendance = require("./attendance_model");
const path = require("path");
const Notifaction = require("../notification/notification_model");
const moment = require("moment");

const store = async (req, res) => {
  try {



    const {
      user_id,
      attendance_date,
      in_time,
      in_location,
      attendance_in_latitude,
      attendance_in_longitude,

      // in_photo: '',
    } = req.body;

    const rootPath = process.cwd();

    const in_photo = req.files.in_photo;
    // const outime_image = req.files.out_photo;


    const Olddata = await Attendance.findAll({
      where: {
        user_id: user_id,
        attendance_date: attendance_date,
      },
    });
    // return res.json(Olddata);

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
      in_photo,
      path.join(
        rootPath,
        "public/images/attendance",
        (in_photo ? in_photo.name : null)
      )
    );
    if (Olddata && Olddata.length > 0) {

      return res.status(201).json({ message: 'already Check in  successfully', status: 1 });

    } else {
      const newAttendance = await Attendance.create({
        user_id: user_id ? user_id : null,
        attendance_date: attendance_date ? attendance_date : null,
        in_time: in_time ? in_time : null,
        in_location: in_location ? in_location : null,
        attendance_in_latitude: attendance_in_latitude
          ? attendance_in_latitude
          : null,
        attendance_in_longitude: attendance_in_longitude
          ? attendance_in_longitude
          : null,
        remark: 1,
        in_photo: in_photo ? imageintime : null,
      });

      const admins = await User.findAll({
        where: { u_type: 1 }, // Assuming role 1 corresponds to the condition you mentioned
        attributes: ['uid'], // Fetch only the 'id' attribute
      });
      const user = await User.findByPk(user_id);
      if (admins.length > 0) {
        // If admins with role 1 are found, create a notification for each of them

        const notificationPromises = admins.map(async (admin) => {
          return await Notifaction.create({
            user_id: admin.uid,
            assigned_data_id: newAttendance.attendance_id,
            notification_type: 1,
            notification_description: `${user.name} Checked In ${newAttendance.in_location}`
          });
        });

        // Wait for all notifications to be created
        await Promise.all(notificationPromises);
        req.app.io.emit('fetchNotifications');
      } else {
        // Handle the case where no user with role 1 is found
        console.error("No admins with role 1 found");
      }
      return res.status(201).json({ message: 'Check in  successfully', status: 1 });
    }
    // return res.status(201).json({ message: 'czdcxcvvxdcv xcfully', status: 1 });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Store Attendance" });
  }
};
const sotreFlutter = async (req, res) => {
  try {
    const {
      user_id,
      attendance_date,
      in_time,
      in_location,
      attendance_in_latitude,
      attendance_in_longitude,
    } = req.body;

    // Parse the date string with the correct format
    const attendanceDate = moment(attendance_date, 'DD/MM/YYYY');

    console.log(req.body);

    const rootPath = process.cwd();

    const in_photo = req.files.in_photo;

    const Olddata = await Attendance.findAll({
      where: {
        user_id: user_id,
        attendance_date: attendanceDate,
      },
    });

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
      in_photo,
      path.join(
        rootPath,
        "public/images/attendance",
        in_photo ? attendanceDate+in_photo.name : null
      )
    );

    if (Olddata && Olddata.length > 0) {
      return res.status(200).json({ message: 'already Check in  successfully', status: 1 });
    } else {
      const newAttendance = await Attendance.create({
        user_id: user_id ? user_id : null,
        attendance_date: attendanceDate.isValid() ? attendanceDate.toDate() : null,
        in_time: in_time ? in_time : null,
        in_location: in_location ? in_location : null,
        attendance_in_latitude: attendance_in_latitude ? attendance_in_latitude : null,
        attendance_in_longitude: attendance_in_longitude ? attendance_in_longitude : null,
        remark: 1,
        in_photo: in_photo ? attendanceDate+in_photo.name: null,
      });

      const admins = await User.findAll({
        where: { u_type: 1 },
        attributes: ['uid'],
      });
      const user = await User.findByPk(user_id);
      if (admins.length > 0) {
        const notificationPromises = admins.map(async (admin) => {
          return await Notifaction.create({
            user_id: admin.uid,
            assigned_data_id: newAttendance.attendance_id,
            notification_type: 1,
            notification_description: `${user.name} Checked In ${newAttendance.in_location}`
          });
        });

        await Promise.all(notificationPromises);
        req.app.io.emit('fetchNotifications');
      } else {
        console.error("No admins with role 1 found");
      }
      return res.status(200).json({ message: 'Check in successfully', status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Store Attendance" });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Attendance.findByPk(id);
    res.json(data)
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Show Attendance" })
  }
}

const index = async (req, res) => {
  try {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const usersWithNoAttendance = await sequelize.query(
      `SELECT u.uid AS user_id
            FROM users u
            LEFT JOIN tbl_shifts s ON u.shift_id = s.shift_id
            WHERE NOT EXISTS (
                SELECT 1
                FROM tbl_attendances a
                WHERE a.user_id = u.uid
            )
            AND :formattedTime > s.shift_intime;            
            `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          formattedTime,
        },
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
                        VALUES (:userId, :attendanceDate,2)`,
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
    const todaysss = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    const data = await sequelize.query(
      `SELECT 
                tbl_attendances.*,
                users.*,
                tbl_shifts.shift_intime,
                tbl_shifts.shift_outime
            FROM tbl_attendances
            INNER JOIN users ON tbl_attendances.user_id = users.uid
            LEFT JOIN tbl_shifts ON users.shift_id = tbl_shifts.shift_id
            WHERE tbl_attendances.attendance_date = :todaysss`,
      {
        type: QueryTypes.SELECT,
        replacements: { todaysss },
      }
    );

    // Return or handle updatedData as needed

    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get Attendance" });
  }
};

const todayattendance = async (req, res) => {
  const path = "/attendance";
  const { id } = req.params;
  const { Op, QueryTypes } = require("sequelize");

  try {
    // Execute the raw SQL query
    const data = await sequelize.query(
      `SELECT tbl_attendances.*, users.*, tbl_attendances.in_photo 
    FROM tbl_attendances
    INNER JOIN users ON tbl_attendances.user_id = users.uid
    WHERE tbl_attendances.user_id = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: { id },
      }
    );

    // Define the startOfDay and endOfDay variables here
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Filter the results based on the date
    const todayAttendance = data.filter(
      (item) =>
        new Date(item.attendance_date).getTime() >= startOfDay.getTime() &&
        new Date(item.attendance_date).getTime() <= endOfDay.getTime()
    );

    // Concatenate the folder path with image paths
    const attendanceWithCompletePaths = todayAttendance.map((attendance) => {
      return {
        ...attendance,
        in_photo: `/attendance/${attendance.in_photo}`, // Adjust field name if needed
        out_photo: `/attendance/${attendance.out_photo}`, // Adjust field name if needed
      };
    });

    res.json(attendanceWithCompletePaths);
  } catch (error) {
    res.json({ error: "Failed To Get Today Attendance" });
    console.error(error);
  }

};

const attendancebyuser = async (req, res) => {
  try {
    const { id } = req.params;
    // const UserAttendance = await Attendance.findAll({
    //   where: {
    //     user_id: id,
    //   },
    // });
    // Execute the raw SQL query
    const UserAttendance = await sequelize.query(
      `SELECT tbl_attendances.*, users.*, tbl_attendances.in_photo ,tbl_attendances.out_photo
    FROM tbl_attendances
    INNER JOIN users ON tbl_attendances.user_id = users.uid
    WHERE tbl_attendances.user_id = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: { id },
      }
    );
    const attendanceWithCompletePaths = UserAttendance.map((attendance) => {
      return {
        ...attendance,
        in_photo: `/attendance/${attendance.in_photo}`, // Adjust field name if needed
        out_photo: `/attendance/${attendance.out_photo}`, // Adjust field name if needed
      };
    });
    res.json(attendanceWithCompletePaths);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Find Attendance By User" });
  }
};

const store_outime = async (req, res) => {
  try {
    const { attendance_id, user_id, out_time, out_location, attendance_out_longitude, attendance_out_latitude } = req.body;
    const rootPath = process.cwd();

    const out_time_photo = req.files.out_photo;

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

    validateAndMove(
      out_time_photo,
      path.join(
        rootPath,
        "public/images/attendance",
        (out_time_photo ? out_time_photo.name : null)
      )
    );

    const attendance = await Attendance.findOne({
      where: {
        attendance_id: attendance_id,
        user_id: user_id,

      },
    });
    const updatedAttendance = await attendance.update({
      out_time: out_time,
      out_location: out_location,
      attendance_out_latitude: attendance_out_latitude,
      attendance_out_longitude: attendance_out_longitude,
      out_photo: req.files.out_photo.name,
    });
    // res.json(updatedAttendance);
    return res.status(201).json({ message: 'Check Out successfully', status: 1 });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Store Attendance" });
  }
};

const store_outimeFlutter = async (req, res) => {
  try {
    const { attendance_id, user_id, out_time, out_location, attendance_out_longitude, attendance_out_latitude } = req.body;
    console.log(req.body);
    const rootPath = process.cwd();

    const out_time_photo = req.files.out_photo;

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

    validateAndMove(
      out_time_photo,
      path.join(
        rootPath,
        "public/images/attendance",
        (out_time_photo ? attendance_id+out_time_photo.name : null)
      )
    );

    const attendance = await Attendance.findOne({
      where: {
        attendance_id: attendance_id,
        user_id: user_id,

      },
    });
    const updatedAttendance = await attendance.update({
      out_time: out_time,
      out_location: out_location,
      attendance_out_latitude: attendance_out_latitude,
      attendance_out_longitude: attendance_out_longitude,
      out_photo: attendance_id+req.files.out_photo.name,
    });
    // res.json(updatedAttendance);
    return res.status(200).json({ message: 'Check Out successfully', status: 1 });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Store Attendance" });
  }
};


const adminindex = async (req, res) => {
  try {
    const data = await sequelize.query(
      `SELECT 
                tbl_attendances.*,
                users.*,
                tbl_shifts.shift_intime,
                tbl_shifts.shift_outime
            FROM tbl_attendances
            INNER JOIN users ON tbl_attendances.user_id = users.uid
            LEFT JOIN tbl_shifts ON users.shift_id = tbl_shifts.shift_id
            `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // Return or handle updatedData as needed

    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get Attendance" });
  }
};

const filterData = async (req, res) => {

  try {
    const { start_date, end_date, remark, user_id, attendance_id } = req.body;
    let sql = `
      SELECT 
        tbl_attendances.*,
        users.*,
        tbl_shifts.shift_intime,
        tbl_shifts.shift_outime
      FROM tbl_attendances
      INNER JOIN users ON tbl_attendances.user_id = users.uid
      LEFT JOIN tbl_shifts ON users.shift_id = tbl_shifts.shift_id
      WHERE tbl_attendances.attendance_status = 1
    `;

    const replacements = {};

    if (start_date && end_date) {
      sql += ` AND tbl_attendances.attendance_date >= :startDate AND tbl_attendances.attendance_date <= :endDate`;
      replacements.startDate = start_date;
      replacements.endDate = end_date;
    }

    if (attendance_id > 0) {
      sql += ` AND tbl_attendances.attendance_id = :Attendance_id `;
      replacements.Attendance_id = attendance_id;
    }

    if (user_id > 0) {
      sql += ` AND tbl_attendances.user_id = :user_id`;
      replacements.user_id = user_id;
    }

    if (remark > 0) {
      sql += ` AND tbl_attendances.remark = :remark`;
      replacements.remark = remark;
    }

    const data = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      model: Attendance, // Replace with the appropriate model
    });

    data.map((attendance) => {
      attendance.in_photo = `/attendance/${attendance.in_photo}`; // Adjust field name if needed
      attendance.out_photo = `/attendance/${attendance.out_photo}`; // Adjust field name if needed
      return attendance; // Return the modified attendance object
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

};
const getPresentAbsent = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    // Query to get the count of present attendances for a specific month
    const presentAttendanceCountQuery = `
      SELECT COUNT(*) AS presentAttendanceCount
      FROM tbl_attendances  
      WHERE tbl_attendances.user_id = :employeeId
      AND tbl_attendances.remark = 1
      AND MONTH(tbl_attendances.attendance_date) = :month
    `;

    // Query to get the count of absent attendances for a specific month
    const absentAttendanceCountQuery = `
      SELECT COUNT(*) AS absentAttendanceCount
      FROM tbl_attendances
      WHERE tbl_attendances.user_id = :employeeId
      AND tbl_attendances.remark = 2
      AND MONTH(tbl_attendances.attendance_date) = :month
    `;

    // Execute both queries and await the results
    const [presentAttendanceResult, absentAttendanceResult] = await Promise.all([
      sequelize.query(presentAttendanceCountQuery, {
        type: QueryTypes.SELECT,
        replacements: { employeeId, month },
      }),
      sequelize.query(absentAttendanceCountQuery, {
        type: QueryTypes.SELECT,
        replacements: { employeeId, month },
      }),
    ]);

    // Extract the count values from the results
    const presentAttendanceCount = presentAttendanceResult[0]?.presentAttendanceCount || 0;
    const absentAttendanceCount = absentAttendanceResult[0]?.absentAttendanceCount || 0;

    // Send the counts along with user_id in JSON format as the response
    res.json({ user_id: employeeId, presentAttendanceCount, absentAttendanceCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed To Retrieve Attendance Counts" });
  }
};

const showFlutter = async (req, res) => {
  try {
    const { id } = req.body;
    // const UserAttendance = await Attendance.findAll({
    //   where: {
    //     user_id: id,
    //   },
    // });
    // Execute the raw SQL query
    const UserAttendance = await sequelize.query(
      `SELECT tbl_attendances.*, users.*, tbl_attendances.in_photo, tbl_attendances.out_photo
      FROM tbl_attendances
      INNER JOIN users ON tbl_attendances.user_id = users.uid
      WHERE tbl_attendances.user_id = :id
      ORDER BY tbl_attendances.createdAt DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: { id },
      }
    );
    const attendanceWithCompletePaths = UserAttendance.map((attendance) => {
      return {
        ...attendance,
        in_photo: `/attendance/${attendance.in_photo}`, // Adjust field name if needed
        out_photo: `/attendance/${attendance.out_photo}`, // Adjust field name if needed
      };
    });
    res.json(attendanceWithCompletePaths);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Find Attendance By User" });
  }
}
module.exports = {
  store,
  index,
  todayattendance,
  attendancebyuser,
  store_outime,
  adminindex,
  filterData,
  getPresentAbsent,
  show,
  sotreFlutter,
  showFlutter,
  store_outimeFlutter
};
