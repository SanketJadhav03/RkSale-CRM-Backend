const { Op, Sequelize, QueryTypes } = require("sequelize");

const User = require("./User_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const sequelize = require("../db/db_config");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const data = await sequelize.query(
      `SELECT * FROM users 
      INNER JOIN roles ON users.user_role_id = roles.role_id 
      WHERE email = :email OR mobile_no = :mobileNo
      `,
      {
        replacements: { email, mobileNo: email },
        type: QueryTypes.SELECT,
      }
    );
    if (!data) {
      return res.status(401).json({ error: "Invalid Email" });
    }
    console.log(data);
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, data[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Check if the user is an admin (You can determine this based on a role or a specific field in the user model)

    // Generate a different token depending on whether the user is an admin or a regular user
    const token = jwt.sign(
      { userId: data[0].uid, email: data[0].email },
      "replace-with-a-strong-secret-key",
      { expiresIn: "1h" }
    );

    // const rows = await DB.sequelize.query(
    //   `
    //     SELECT * FROM role_has_permissions
    //     INNER JOIN permissions ON permissions.permission_id = role_has_permissions.rhp_permission_id
    //     WHERE role_has_permissions.rhp_role_id = :roleId
    //     `,
    //   {
    //     replacements: { roleId: user.user_role_id }, // Replace with the actual role ID
    //     type: Sequelize.QueryTypes.SELECT,
    //   }
    // );

    // console.log(rows);
    const user = data[0];
    res.json({
      token,
      user,
      authentication: true,
      // permissions: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const index = async (req, res) => {
  try {
    const userstatus = await sequelize.query(
      `SELECT * 
      FROM users 
      LEFT JOIN roles ON users.user_role_id = roles.role_id 
      LEFT JOIN tbl_shifts ON users.shift_id = tbl_shifts.shift_id 
      
      AND (roles.role_id IS NOT NULL OR users.user_role_id IS NULL) 
      AND (tbl_shifts.shift_id IS NOT NULL OR users.shift_id IS NULL)
      WHERE u_type = 2
      
        `,
      {
        model: User,
        mapToModel: true, // Map the result to the Customer model
      }
    );

    // const userstatus = await User.findAll({
    //   where: {
    //     u_type: 2
    //   }
    // });

    userstatus.forEach((user) => {
      user.bank_passbook_photo = `/user/${user.bank_passbook_photo}`; // Adjust field name if needed
      user.pan_photo = `/user/${user.pan_photo}`; // Adjust field name if needed
      user.aadhar_photo = `/user/${user.aadhar_photo}`; // Adjust field name if needed
      user.profile_photo = `/user/${user.profile_photo}`; // Adjust field name if needed
      // Modify the fields directly in each object
    });

    res.json(userstatus);
  } catch (error) {
    console.log(error);
  }
};
const store = async (req, res) => {
  try {
    const {
      u_type,
      name,
      address,
      user_role_id,
      date_of_joining,
      last_experience,
      last_working_company,
      last_company_salary,
      shift_id,
      salary,
      mobile_no,
      emergency_contact,
      email,
      password,
      aadhar_no,
      pan_no,
      user_upi,
    } = req.body;
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const rootPath = process.cwd();

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

      return file.filename; // Return the filename for use in the database
    }; // 10 is the number of salt rounds

    if (req.files && req.files.profile_photo) {
      const profile_photo = req.files.profile_photo || null;
      // Use the validateAndMove function for each file, allowing null files
      validateAndMove(
        profile_photo,
        path.join(
          rootPath,
          "public/images/user",
          profile_photo ? profile_photo.name : null
        )
      );
    }

    if (req.files && req.files.adhaar_photo) {
      const adhaar_photo = req.files.adhaar_photo || null;
      // Use the validateAndMove function for each file, allowing null files
      validateAndMove(
        adhaar_photo,
        path.join(
          rootPath,
          "public/images/user",
          adhaar_photo ? adhaar_photo.name : null
        )
      );
    }

    if (req.files && req.files.pan_photo) {
      const pan_photo = req.files.pan_photo || null;
      // Use the validateAndMove function for each file, allowing null files
      validateAndMove(
        pan_photo,
        path.join(
          rootPath,
          "public/images/user",
          pan_photo ? pan_photo.name : null
        )
      );
    }
    if (req.files && req.files.bank_passbook_photo) {
      const bank_passbook_photo = req.files.bank_passbook_photo || null;
      // Use the validateAndMove function for each file, allowing null files
      validateAndMove(
        bank_passbook_photo,
        path.join(
          rootPath,
          "public/images/user",
          bank_passbook_photo ? bank_passbook_photo.name : null
        )
      );
    }
    // const adhaar_photo = req.files.aadhar_photo || null;
    // const pan_photo = req.files.pan_photo || null;
    // const bank_passbook_photo = req.files.bank_passbook_photo || null;

    // validateAndMove(
    //   adhaar_photo,
    //   path.join(
    //     rootPath,
    //     "public/images/user",
    //     (adhaar_photo ? adhaar_photo.name : null)
    //   )
    // );

    // validateAndMove(
    //   pan_photo,
    //   path.join(
    //     rootPath,
    //     "public/images/user",
    //     (pan_photo ? pan_photo.name : null)
    //   )
    // );

    // validateAndMove(
    //   bank_passbook_photo,
    //   path.join(
    //     rootPath,
    //     "public/images/user",
    //     (bank_passbook_photo ? bank_passbook_photo.name : null)
    //   )
    // );

    // Create a new user in the database
    const newUser = await User.create({
      u_type: u_type,
      name: name,
      address: address,
      user_role_id: user_role_id,
      salary: salary,
      mobile_no: mobile_no,
      emergency_contact: emergency_contact,
      email: email,
      password: hashedPassword,
      aadhar_no: aadhar_no,
      pan_no: pan_no,
      user_upi: user_upi,
      date_of_joining: date_of_joining,
      last_experience: last_experience,
      last_working_company: last_working_company,
      last_company_salary: last_company_salary,
      shift_id: shift_id,

      profile_photo:
        req.files && req.files.profile_photo
          ? req.files.profile_photo.name
          : null,
      aadhar_photo:
        req.files && req.files.aadhar_photo
          ? req.files.aadhar_photo.name
          : null,
      pan_photo:
        req.files && req.files.pan_photo ? req.files.pan_photo.name : null,
      bank_passbook_photo:
        req.files && req.files.bank_passbook_photo
          ? req.files.bank_passbook_photo.name
          : null,
    });

    // Send a success response with the created user data
    res
      .status(201)
      .json({ message: "Employee added successfully", status: 1, newUser });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error showing User by id:", error);
    res.status(500).json({ error: "Error showing User by id" });
  }
};
const updated = async (req, res) => {
  try {
    const {
      uid,
      name,
      address,
      user_role_id,
      date_of_joining,
      last_experience,
      last_working_company,
      last_company_salary,
      shift_id,
      salary,
      mobile_no,
      emergency_contact,
      email,
      password,
      aadhar_no,
      pan_no,
      user_upi,
    } = req.body;

    const user = await User.findByPk(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (password) {
      const passwordMatch = password === user.password;
      if (!passwordMatch) {
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await user.update({
          password: hashedNewPassword
        });
      }
    }

    if (req.files && req.files.profile_photo) {
      const uploadedFile = req.files.profile_photo;
      const filePath = `public/images/user/${user.profile_photo}`;

      if (user.profile_photo !== null) {
        // Remove the existing file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
      }
      // Save the new file
      uploadedFile.mv(`public/images/user/${uploadedFile.name}`, (err) => {
        if (err) {
          console.error("Error saving new file:", err);
        }
      });
    }

    if (req.files && req.files.aadhar_photo) {
      const uploadedFile = req.files.aadhar_photo;
      const filePath = `public/images/user/${user.aadhar_photo}`;

      // Remove the existing file
      if (user.aadhar_photo !== null) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
      }
      // Save the new file
      uploadedFile.mv(`public/images/user/${uploadedFile.name}`, (err) => {
        if (err) {
          console.error("Error saving new file:", err);
        }
      });
    }

    if (req.files && req.files.pan_photo) {
      const uploadedFile = req.files.pan_photo;
      const filePath = `public/images/user/${user.pan_photo}`;

      // Remove the existing file
      if (user.pan_photo !== null) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
      }
      // Save the new file
      uploadedFile.mv(`public/images/user/${uploadedFile.name}`, (err) => {
        if (err) {
          console.error("Error saving new file:", err);
        }
      });
    }

    if (req.files && req.files.bank_passbook_photo) {
      const uploadedFile = req.files.pan_photo;
      const filePath = `public/images/user/${user.bank_passbook_photo}`;

      // Remove the existing file
      if (user.bank_passbook_photo !== null) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
      }
      // Save the new file
      uploadedFile.mv(`public/images/user/${uploadedFile.name}`, (err) => {
        if (err) {
          console.error("Error saving new file:", err);
        }
      });
    }

    const updateduser = await user.update({
      name: name,
      address: address,
      user_role_id: user_role_id,
      salary: salary,
      mobile_no: mobile_no,
      emergency_contact: emergency_contact,
      email: email,
      aadhar_no: aadhar_no,
      pan_no: pan_no,
      user_upi: user_upi,
      date_of_joining: date_of_joining,
      last_experience: last_experience,
      last_working_company: last_working_company,
      last_company_salary: last_company_salary,
      shift_id: shift_id,
      profile_photo:
        req.files && req.files.profile_photo
          ? req.files.profile_photo.name
          : user.profile_photo,
      aadhar_photo:
        req.files && req.files.aadhar_photo
          ? req.files.aadhar_photo.name
          : user.aadhar_photo,
      pan_photo:
        req.files && req.files.pan_photo
          ? req.files.pan_photo.name
          : user.pan_photo,
      bank_passbook_photo:
        req.files && req.files.bank_passbook_photo
          ? req.files.bank_passbook_photo.name
          : user.bank_passbook_photo,
    });

    res.status(200).json({ message: "User updated successfully", user, status: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleted = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await User.findByPk(id);
    if (!branch) {
      return res.status(404).json({ error: "User not found" });
    }
    await branch.destroy();
    return res.json({ message: "User deleted successfully!", status: 1 });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ error: "Error deleting User:" });
  }
};

const updatePass = async (req, res) => {
  try {
    const {
      old_pass, new_pass, confirm_pass, uid
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        uid: uid,
      }
    });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(old_pass, existingUser.password);

      if (passwordMatch) {
        // Hash the new password before updating
        const hashedNewPassword = await bcrypt.hash(confirm_pass, 10);

        // Update the user's password in the database
        await existingUser.update({
          password: hashedNewPassword
        });
        res.status(200).json({ message: "Password Updated Successfully!", status: 1 });
      } else {
        res.status(200).json({ message: "Old Password Not Matched", status: 2 });
      }
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }

  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Update Password" })
  }
}

module.exports = {
  index,
  login,
  show,
  store,
  updated,
  deleted,
  updatePass
};
