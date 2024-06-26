const { QueryTypes } = require('sequelize');
const sequelize = require('../db/db_config');
const Business_setting = require('./business_model')
const fs = require('fs');
const path = require('path');
const index = async (req, res) => {
    const bussiness_settings = await sequelize.query(
        `SELECT tbl_business_settings.* FROM tbl_business_settings
         `,
        {
            model: Business_setting,
            mapToModel: true, // Map the result to the Customer model
        }
    );
    // Modify business_logo path in each entry of the result
    bussiness_settings.forEach((setting) => {
        setting.business_logo = `/business_setting/${setting.business_logo}`;
        // Modify the field directly in each object
    });

    res.json(bussiness_settings);
}


const store = async (req, res) => {
    try {
        const data = await Business_setting.findAll();
        // return res.json(data);
        console.log(data.length);
        if (data.length > 0) {
            return res.status(201).json({ message: 'Bussiness Setting already added!', status: 1 });
        } else {
            const {
                business_name,
                business_company_phone_no,
                business_company_email,
                business_billing_address,
                business_state,
                business_state_code,
                business_pincode,
                business_city,
                business_gst_no,
                business_pan_number,
                business_type,
                business_registration_type,
            } = req.body;


            const business_logo = req.files.business_logo;




            const validateAndMove = (file, uploadPath) => {
                if (!file) {
                    // Skip the file if it's null
                    console.log("File is null");
                    return null;
                }

                if (!file.name) {
                    return res.status(400).json({ error: "Invalid file object" });
                }

                return new Promise((resolve, reject) => {
                    file.mv(uploadPath, (err) => {
                        if (err) {
                            console.error("Error moving file:", err);
                            reject({ error: "Error uploading file" });
                        }
                        // Resolve with the file path after successful move
                        resolve(uploadPath);
                    });
                });
            };

            const rootPath = process.cwd();
            const uploadedFilePath = await validateAndMove(
                business_logo,
                path.join(
                    rootPath,
                    "public/images/business_setting",
                    (business_logo ? business_logo.name : "")
                )
            );

            const business = await Business_setting.create({
                business_name,
                business_company_phone_no,
                business_billing_address,
                business_company_email,
                business_state,
                business_state_code,
                business_pincode,
                business_city,
                business_gst_no,
                business_pan_number,
                business_type,
                business_registration_type,
                business_logo: uploadedFilePath ? path.basename(uploadedFilePath) : null // Store file path in the database
            });

            // res.json(business);
            return res.status(201).json({ message: 'Bussiness Setting added successfully !', status: 1 });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed To Create Business Setting!" });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query(
            `SELECT * FROM tbl_business_settings 
     
      
      WHERE tbl_business_settings.business_id = :id
      `,
            {
                replacements: { id },
                type: QueryTypes.SELECT,// Specify the model for Sequelize to map the result to
            }
        );

        res.json(data)
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Show By Id " })
    }
}



const update = async (req, res) => {
    try {
        const {
            business_id,
            business_name,
            business_company_phone_no,
            business_company_email,
            business_billing_address,
            business_state,
            business_state_code,
            business_pincode,
            business_city,
            business_gst_no,
            business_pan_number,
            business_type,

            business_registration_type,
        } = req.body;

        const existingBusiness = await Business_setting.findByPk(business_id);
        if (!existingBusiness) {
            return res.status(404).json({ message: "Business Not Found" });
        }

        // Check if a new file is provided in the request
        if (req.files && req.files.business_logo) {
            const uploadedFile = req.files.business_logo;

            // Remove the existing file
            const filePath = `public/images/business_setting/${existingBusiness.business_logo}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting existing file:', err);
                }
            });

            // Save the new file
            uploadedFile.mv(`public/images/business_setting/${uploadedFile.name}`, (err) => {
                if (err) {
                    console.error('Error saving new file:', err);
                }
            });

            // Update business logo in the database
            await existingBusiness.update({
                business_name,
                business_company_phone_no,
                business_billing_address,
                business_company_email,
                business_state,
                business_state_code,
                business_pincode,
                business_city,
                business_gst_no,
                business_pan_number,
                business_type,
                business_registration_type,
                business_logo: uploadedFile.name,
            });
        } else {
            // If no new file is provided, update other business details without changing the logo
            await existingBusiness.update({
                business_name,
                business_company_phone_no,
                business_billing_address,
                business_company_email,
                business_state,
                business_state_code,
                business_pincode,
                business_city,
                business_gst_no,
                business_pan_number,
                business_type,
                business_registration_type,
            });
        }

        return res.json({ message: "Category updated successfully!", status: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update business" });
    }
};

const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const bussiness = await Business_setting.findByPk(id);
        if (!bussiness) {
            return res.status(404).json({ error: "Business_setting not found" });
        }
        await bussiness.destroy();
        return res.json({ message: "Business_setting deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Business_setting:", error);
        res.status(500).json({ error: "Error deleting Business_setting:" });
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    deleted,
}