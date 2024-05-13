const { QueryTypes } = require("sequelize");
const User = require("../Auth/User_model");
const sequelize = require("../db/db_config");
const Leave = require("./leave_model");
const path = require("path");
const Notifaction = require("../notification/notification_model");

const store = async (req, res) => {
    try {
        const {
            leave_user_id,
            leave_reason,
            to_date,
            from_date,
        } = req.body;
        // return res.json(req.body);

        // Function to convert "dd-mm-yyyy" to "yyyy-mm-dd" format
        const convertDateFormat = (dateString) => {
            const [day, month, year] = dateString.split('-');
            return `${year}-${month}-${day}`;
        };

        const newleave = await Leave.create({
            leave_user_id: leave_user_id ? leave_user_id : null,
            leave_reason: leave_reason ? leave_reason : null,
            to_date: to_date ? convertDateFormat(to_date) : null,
            from_date: from_date ? convertDateFormat(from_date) : null,
            leave_status: 1,
        });
        const admins = await User.findAll({
            where: { u_type: 1 }, // Assuming role 1 corresponds to the condition you mentioned
            attributes: ['uid'], // Fetch only the 'id' attribute
        });
        const user = await User.findByPk(leave_user_id);
        if (admins.length > 0) {
            // If admins with role 1 are found, create a notification for each of them
            const notificationPromises = admins.map(async (admin) => {
                return await Notifaction.create({
                    user_id: admin.uid,
                    assigned_data_id: newleave.leave_id,
                    notification_type: 4,
                    notification_description: `${user.name} New Leave Stored`,
                });
            });

            // Wait for all notifications to be created
            await Promise.all(notificationPromises);
        req.app.io.emit('fetchNotifications');

        } else {
            // Handle the case where no user with role 1 is found
            console.error("No admins with role 1 found");
        }
        return res.status(201).json({ message: 'Leave Application Submitted successfully', status: 1 });
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Attendance" });
    }
};
const updated = async (req, res) => {
    try {
        const {
            leave_id,
            leave_status,
            leave_reject_reason,
            leave_approved_by,
        } = req.body;
        // return res.json(req.body);


        const leave = await Leave.findOne({
            where: {
                leave_id: leave_id,
                //   user_id: user_id,

            },
        });
        const updatedleave = await leave.update({
            leave_approved_by: leave_approved_by,
            leave_status: leave_status,
            leave_reject_reason: leave_reject_reason,

        });

        const user = await User.findByPk(updatedleave.leave_user_id);
        if (user) {
            await Notifaction.create({
                user_id: user.uid,
                assigned_data_id: updatedleave.leave_id,
                notification_type: 4,
                notification_description: `Your Leave Application Is  
                ${updatedleave.leave_status == 1 ? 'Pending' : updatedleave.leave_status == 2 ? 'Approved' : updatedleave.leave_status == 3 ? 'Rejected' : ''}`,
            });
        } else {
            // Handle the case where the user is not found
            console.log('User not found');
        }
        return res.status(201).json({ message: 'Leave Updated successfully', status: 2 });
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Attendance" });
    }
};
const index = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const { type, start_date, end_date, leave_status, user_id } = req.body;

        let sql = `
            SELECT 
            leaves.createdAt AS leaveCreatedAt,
                leaves.*,
                users_leave.*
            FROM tbl_leaves AS leaves
            INNER JOIN users AS users_leave ON leaves.leave_user_id = users_leave.uid
            WHERE 1=1`;

        const replacements = {};

        if (type > 0) {
            sql += ` AND leaves.leave_id = :Id`;
            replacements.Id = type;
        }

        if (start_date && end_date) {
            sql += ` AND leaves.createdAt >= :startDate AND leaves.createdAt <= :endDate`;
            replacements.startDate = start_date;
            replacements.endDate = end_date;
        }

        if (leave_status > 0) {
            sql += ` AND leaves.leave_status = :leave_status`;
            replacements.leave_status = leave_status;
        }

        if (user_id) {
            sql += ` AND leaves.leave_user_id = :user_id`;
            replacements.user_id = user_id;
        }

        const user_leave = await sequelize.query(sql, {
            replacements: replacements,
            type: QueryTypes.SELECT,
        });

        // Fetching approved_by data
        const approved_by = await sequelize.query(
            `SELECT 
                leaves.*,
                users_approve.*
            FROM tbl_leaves AS leaves
            INNER JOIN users AS users_approve ON leaves.leave_approved_by = users_approve.uid
            LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limitPerPage, offset: offset },
                type: QueryTypes.SELECT,
            }
        );

        // Merging data based on leave_id using an INNER JOIN
        const mergedData = user_leave.map(leave => {
            const approvedByData = approved_by.find(approved => approved.leave_id === leave.leave_id);
            return { ...leave, approved_by: approvedByData };
        });

        // Handling the case where a join may return null for some columns
        const result = mergedData.map(row => {
            if (row.approved_by === null) {
                row.approved_by = {
                    // Default values for joined data columns
                    "leave_id": null,
                    "leave_user_id": null,
                    "leave_reason": null,
                    "to_date": null,
                    "from_date": null,
                    "leave_approved_by": null,
                    "leave_reject_reason": null,
                    "leave_status": null,
                    "createdAt": null,
                    "updatedAt": null,
                    "uid": null,
                    "u_type": null,
                    "name": null,
                    "address": null,
                    "user_role_id": null,
                    "salary": null,
                    "mobile_no": null,
                    "emergency_contact": null,
                    "profile_photo": null,
                    "email": null,
                    "password": null,
                    "aadhar_no": null,
                    "aadhar_photo": null,
                    "pan_no": null,
                    "pan_photo": null,
                    "bank_passbook_photo": null,
                    "date_of_joining": null,
                    "last_experience": null,
                    "last_working_company": null,
                    "last_company_salary": null,
                    "shift_id": null,
                    "user_upi": null,
                    "status": null
                };
            }
            return row;
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to get leaves' });
    }
};


const userleave = async (req, res) => {

    const { id } = req.params; // Get the page number from the query parameters or default to page 1
    try {
        const user_leave = await sequelize.query(
            `SELECT 
                leaves.*,
                users_leave.*
            FROM tbl_leaves AS leaves
            INNER JOIN users AS users_leave ON leaves.leave_user_id = users_leave.uid
            WHERE leaves.leave_user_id =:id
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { id },

            }
        );

        // const approved_by = await sequelize.query(
        //     `SELECT 
        //         leaves.*,
        //         users_approve.*
        //     FROM tbl_leaves AS leaves
        //     INNER JOIN users AS users_approve ON leaves.leave_approved_by = users_approve.uid
        //     LIMIT :limit OFFSET :offset`,
        //     {
        //         replacements: { limit: limitPerPage, offset: offset },
        //         type: QueryTypes.SELECT,
        //     }
        // );

        // // return res.json(approved_by);

        // // Merge data based on leave_id using an INNER JOIN
        // const mergedData = user_leave.map(leave => {
        //     const approvedByData = approved_by.find(approved => approved.leave_id === leave.leave_id);
        //     return { ...leave, approved_by: approvedByData };
        // });

        // // Handling the case where a join may return null for some columns
        // const result = mergedData.map(row => {
        //     // Check if the joined data is null and handle accordingly
        //     if (row.approved_by === null) {
        //         // Handle the scenario where the join failed
        //         // Assign default values or perform necessary actions
        //         // For example:
        //         row.approved_by = {


        //             "leave_id": null,
        //             "leave_user_id": null,
        //             "leave_reason": null,
        //             "to_date": null,
        //             "from_date": null,
        //             "leave_approved_by": null,
        //             "leave_reject_reason": null,
        //             "leave_status": null,
        //             "createdAt": null,
        //             "updatedAt": null,
        //             "uid": null,
        //             "u_type": null,
        //             "name": null,
        //             "address": null,
        //             "user_role_id": null,
        //             "salary": null,
        //             "mobile_no": null,
        //             "emergency_contact": null,
        //             "profile_photo": null,
        //             "email": null,
        //             "password": null,
        //             "aadhar_no": null,
        //             "aadhar_photo": null,
        //             "pan_no": null,
        //             "pan_photo": null,
        //             "bank_passbook_photo": null,
        //             "date_of_joining": null,
        //             "last_experience": null,
        //             "last_working_company": null,
        //             "last_company_salary": null,
        //             "shift_id": null,
        //             "user_upi": null,
        //             "status": null
        //         };
        //     }
        //     return row;
        // });

        res.json(user_leave);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to get leaves' });
    }
};

const singleview = async (req, res) => {
    const { id } = req.params; // Get the page number from the query parameters or default to page 1
    try {
        const user_leave = await sequelize.query(
            `SELECT 
                leaves.*,
                users_leave.*
            FROM tbl_leaves AS leaves
            INNER JOIN users AS users_leave ON leaves.leave_user_id = users_leave.uid
            WHERE leaves.leave_id =:id
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { id },
            }
        );


        // Remove all HTML tags from leave_reason if it's not null or undefined
        if (user_leave[0].leave_reason !== null) {
            user_leave[0].leave_reason = user_leave[0].leave_reason.replace(/<[^>]+>/g, '');
        }

        // Remove all HTML tags from leave_reject_reason if it's not null or undefined
        if (user_leave[0].leave_reject_reason !== null) {
            user_leave[0].leave_reject_reason = user_leave[0].leave_reject_reason.replace(/<[^>]+>/g, '');
        }


        res.json(user_leave[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to get leaves' });
    }
};


module.exports = {
    store,
    index,
    userleave,
    singleview,
    updated,
};
