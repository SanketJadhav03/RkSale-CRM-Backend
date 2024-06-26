const Message = require("./message_model");
const path = require("path");
const fs = require("fs");

const store = async (req, res) => {
  try {
    const { message_title, message_description, message_category } = req.body;

    if (req.files) {
      const messageImage = req.files.image;

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
            messageImage ? messageImage.name : ""
          )
        );
      }
    }

    const newMessage = await Message.create({
      message_title: message_title,
      message_description: message_description,
      message_category: message_category,
      message_image: req.files ? req.files.image.name : null,
    });

    res.json({ message: "Message Created SuccessFully", status: 1 });
  } catch (error) {
    res.json({ error: "Failed To Store Message" });
    console.log(error);
  }
};
const list = async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
    const limitPerPage = 30;
    const offset = (page - 1) * limitPerPage;

    const message = await Message.findAll({
      limit: limitPerPage,
      offset: offset,
    });

    res.json(message);
  } catch (error) {
    console.error("Error getting message:", error);
    res.status(500).json({ error: "Error getting message" });
  }
};

const update = async (req, res) => {
  try {
    const { message_id, message_title, message_description, message_category } = req.body;

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
      message_image:
        req.files !== null
          ? req.files.image.name
          : existingMessage.message_image,
      message_category: message_category
    });

    if (status) {
      res.json({ message: "Updated Successfully", status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Update", status: 0 });
  }
};

const deleted = async (req, res) => {
  try {
    const { id } = req.params;
    const existingMessage = await Message.findByPk(id);
    if (existingMessage) {
      const filePath = `public/images/message/${existingMessage.message_image}`;

      // Remove the existing file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting existing file:", err);
        }
      });

      // Save the new file
    }

    if (existingMessage) {
      await existingMessage.destroy();

      res.json({ message: "Message Deleted SuccessFully !", status: 1 });
    } else {
      res.json({ message: "Message Not Found 404 ", status: 0 });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Delete Message" });
  }
};

const leadmsg = async (req, res) => {
  try {
    const msg = Message.findAll({
      where: { message_category: 2 }
    })

    res.json(msg);
  } catch (error) {
    console.log(error);
    res.json({ message: "Failed To Get Messages", status: 1 })
  }
}


const sendmsg = async (req, res) => {
  const url = 'https://wa.bizup.in/api/send';
  try {
    const { number, type, media, category_type } = req.body;
    let data = {}; // Initialize data object


    const formData = new URLSearchParams(data).toString();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text();
    console.log(result);
    res.json({ message: "Message Sent Successfully" });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }

};

module.exports = {
  store,
  list,
  update,
  deleted,
  sendmsg,
  leadmsg
};
