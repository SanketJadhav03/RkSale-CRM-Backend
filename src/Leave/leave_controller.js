const { QueryTypes } = require("sequelize");
const User = require("../Auth/User_model");
const sequelize = require("../db/db_config");
const Leave = require("./leave_model");
const path = require("path");

// const store = async (req, res) => {
//     try {
//         const {
//             leave_user_id,
//             leave_reason,
//             to_date,
//             from_date,

//         } = req.body;




//         const newAttendance = await Leave.create({
//             leave_user_id: leave_user_id ? leave_user_id : null,
//             leave_reason: leave_reason ? leave_reason : null,
//             to_date: to_date ? to_date : null,
//             from_date: from_date ? from_date : null,
//             leave_status: 1,

//         });

//         res.json(newAttendance);
//     } catch (error) {
//         console.log(error);
//         res.json({ error: "Failed To Store Attendance" });
//     }
// };

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

        const newAttendance = await Leave.create({
            leave_user_id: leave_user_id ? leave_user_id : null,
            leave_reason: leave_reason ? leave_reason : null,
            to_date: to_date ? convertDateFormat(to_date) : null,
            from_date: from_date ? convertDateFormat(from_date) : null,
            leave_status: 1,
        });

        return res.status(201).json({ message: 'Leave Application Submitted successfully', status: 1 });
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Attendance" });
    }
};

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const user_leave = await sequelize.query(
            `SELECT 
                leaves.*,
                users_leave.*
            FROM tbl_leaves AS leaves
            INNER JOIN users AS users_leave ON leaves.leave_user_id = users_leave.uid
            LIMIT :limit OFFSET :offset`,
            {
                replacements: { limit: limitPerPage, offset: offset },
                type: QueryTypes.SELECT,
            }
        );

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

        // return res.json(approved_by);

        // Merge data based on leave_id using an INNER JOIN
        const mergedData = user_leave.map(leave => {
            const approvedByData = approved_by.find(approved => approved.leave_id === leave.leave_id);
            return { ...leave, approved_by: approvedByData };
        });

        // Handling the case where a join may return null for some columns
        const result = mergedData.map(row => {
            // Check if the joined data is null and handle accordingly
            if (row.approved_by === null) {
                // Handle the scenario where the join failed
                // Assign default values or perform necessary actions
                // For example:
                row.approved_by = {


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




module.exports = {
    store,
    index,

};
