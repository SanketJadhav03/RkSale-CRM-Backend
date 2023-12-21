const Leads = require('./leads_model')
const path = require("path");

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
  image:"df"
    })
    res.json(newLead)
} catch (error) {
    console.log(error);
    return res.json({error:"Failed To Create Lead !!"})
}

}

module.exports  ={
    store
}