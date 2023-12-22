const { QueryTypes } = require('sequelize');
const sequelize = require('../db/db_config');
const Leads = require('./leads_model')
const path = require("path");
const fs = require('fs');

const store = async(req,res)=>{
try {
const {
customer,
  product,
  value,
  today_date,
  minimum_due_date,
  ref_by,
  maximum_due_date,
  source,
  priority,
  description,
  assigned_by,
  tags,
  status,
 
} = req.body;
    const leadsImage = req.files.image;
  

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
      };

      const rootPath = process.cwd();
       validateAndMove(
        leadsImage,
        path.join(
          rootPath,
          "public/images/leads",
          "crm"+ "-" + (leadsImage ? leadsImage.name : "")
        )
      );
   const newLead = await Leads.create({
    customer:customer,
  product:product,
  value:value,
  today_date:today_date,
  minimum_due_date:minimum_due_date,
  ref_by:ref_by,
  maximum_due_date:maximum_due_date,
  source:source,
  priority:priority,
  description:description,
  assigned_by:assigned_by,
  tags:tags,
  status:status,
  image:req.files.image.name
    })
    res.json(newLead)
} catch (error) {
    console.log(error);
    return res.json({error:"Failed To Create Lead !!"})
}

}

const index = async(req,res)=>{
  try {
    const data = await sequelize.query(
      `SELECT * FROM tbl_leads 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_id
      `,
      {
          type: QueryTypes.SELECT,
          model: Leads, // Specify the model for Sequelize to map the result to
      }
  );
  res.json(data)
  } catch (error) {
    console.log(error);
    res.json({error:"Failed To Get Leads"})
  }
}

const show = async(req,res)=>{
  try{
    const {id} = req.params;
  const data = await sequelize.query(
    `SELECT * FROM tbl_leads 
    INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
    INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
    INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
    INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
    INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_id
    WHERE tbl_leads.lead_id = :id
    `,
    {
      replacements: { id },
      type: QueryTypes.SELECT,// Specify the model for Sequelize to map the result to
    }
);

res.json(data)
  }catch(error){
    console.log(error);
    res.json({error:"Failed To Show By Id "})
  }
}

const update = async(req,res)=>{
  try {
    const {
      lead_id,
    customer,
  product,
  value,
  today_date,
  minimum_due_date,
  ref_by,
  maximum_due_date,
  source,
  priority,
  description,
  assigned_by,
  tags,
  status,}= req.body;
    const existinglead = await Leads.findByPk(lead_id);
    if (!existinglead) {
      return res.status(404).json({ message: "Lead Not Found" });
    }

    // res.json(existinglead)
    // Check if a new file is provided in the request
    if (req.files && req.files.image) {
      const uploadedFile = req.files.image;
      const filePath = `public/images/leads/${"crm-"+existinglead.image}`;

      // Remove the existing file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting existing file:', err);
        }
      });

      // Save the new file
      uploadedFile.mv(`public/images/leads/${"crm-"+uploadedFile.name}`, (err) => {
        if (err) {
          console.error('Error saving new file:', err);
        }
      });
    }

    const updatedlead = await existinglead.update({
      customer:customer,
      product:product,
      value:value,
      today_date:today_date,
      minimum_due_date:minimum_due_date,
      ref_by:ref_by,
      maximum_due_date:maximum_due_date,
      source:source,
      priority:priority,
      description:description,
      assigned_by:assigned_by,
      tags:tags,
      status:status,
      file: req.files && req.files.image ? req.files.image.name : existinglead.image,

    })

    if(updatedlead){
      res.json({message:"Lead Updated SuccessFully"})
    }else {
      res.json({message:"Lead Updated Failed"})
    }
  
  } catch (error) {
    console.log(error);
  }
}

module.exports  ={
    store,
    index,
    show,
    update
}