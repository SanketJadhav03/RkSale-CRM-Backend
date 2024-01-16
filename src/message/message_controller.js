const Message = require("./message_model");
const path = require('path')
const fs = require("fs");


const store = async(req,res) =>{
    try {
        const {message_title,message_description} = req.body;



if (req.files)
{

    const messageImage =  req.files.image;

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

    const rootPath = process.cwd();
    if (req.files.image) {
      validateAndMove(
        messageImage,
        path.join(
          rootPath,
          "public/images/message",
           (messageImage ? messageImage.name : "")
        )
      );
    }

    }

   const newMessage = await Message.create({
    message_title:message_title,
    message_description:message_description,
    message_image:req.files ? req.files.image.name : null

    })

    res.json({message:"Message Created SuccessFully"})
    } catch (error) {
        res.json({error:"Failed To Store Message"})
        console.log(error);
    }


}
const list = async(req,res) =>{
    try {
        const messages = await Message.findAll({
            where:{
                message_status:1
            }
        });
        res.json(messages);
    } catch (error) {
        console.log(error);
        res.json({error:"Failed To Show Messages"})
    }
}

const update = async (req, res) => {
    try {
      const {
        message_id,
        message_title,
        message_description,
      } = req.body;
  
      const existingMessage = await Message.findByPk(message_id);
  
      if (req.files !== null) {
        const uploadedFile = req.files.image;
        const filePath = `public/images/message/${existingMessage.message_image}`;
  
        // Remove the existing file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
  
        // Save the new file
        uploadedFile.mv(`public/images/message/${uploadedFile.name}`, (err) => {
          if (err) {
            console.error("Error saving new file:", err);
          }
        });
      }
  
      const status = await existingMessage.update({
        message_title: message_title,
        message_description: message_description,
        message_image: req.files !== null ? req.files.image.name : null,
      });
  
      if (status) {
        res.json({ message: "Updated Successfully" ,status:1});
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Failed To Update" });
    }
  };

  const deleted = async(req,res) =>{
    try {
        const {id} = req.params;
        const existingMessage = await Message.findByPk(id);
if(existingMessage)
{
        const filePath = `public/images/message/${existingMessage.message_image}`;
  
        // Remove the existing file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting existing file:", err);
          }
        });
  
        // Save the new file

      }

      if (existingMessage)
      {
        await existingMessage.destroy();

        res.json({message:"Deleted SuccessFully"})
      }else {
        res.json({message:"Message Not Found 404 "})
      }
  


    } catch (error) {
        console.log(error);
        res.json({error:"Failed To Delete Message"})
    }
  }
module.exports = {
    store,
    list,
    update,
    deleted
}