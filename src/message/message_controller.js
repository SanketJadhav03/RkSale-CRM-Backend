const Message = require("./message_model");
const path = require('path')

const store = async(req,res) =>{
    try {
        const {message_title,message_description} = req.body;



if (req.file )
{

    const messageImage =  req.file;

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
           (messageImage ? messageImage.filename : "")
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

const update = async(req,res) =>{

}
module.exports = {
    store,
    list
}