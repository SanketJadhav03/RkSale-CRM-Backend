const Shift = require('./shift_model')

const store = async(req,res)=>{
    try {
        const {shift_name,shift_intime,shift_outime}= req.body;
        const newShift = await Shift.create({
            shift_name:shift_name,
            shift_intime:shift_intime,
            shift_outime:shift_outime
        })
        res.json(newShift)
    } catch (error) {
        console.log(error);
        res.json({error:"Failed To Create Shift"})
    }
}

const index = async(req,res) =>{
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const shifts = await Shift.findAll({
          limit: limitPerPage,
          offset: offset,
        });
      
        res.json(shifts);
      } catch (error) {
        console.error("Error getting shifts:", error);
        res.status(500).json({ error: "Error getting shifts" });
      }
      
}

const show = async(req,res) =>{
    try {
        const {id} = req.params;
        const shift = await Shift.findByPk(id);
if(shift){
        res.json(shift);
}else {
    res.json({message:"Shift Not Found By Id "})
}
    } catch (error) {
        console.log(error);
        res.json({error:"Failed Find By Id "})
    }
}

const update = async(req,res)=>{
try {
    const {shift_id,shift_name,shift_intime,shift_outime}= req.body;
    const existingShift = await Shift.findByPk(shift_id);
    if (existingShift){
       const updatedshift = await existingShift.update({
            shift_name:shift_name,
            shift_intime:shift_intime,
            shift_outime:shift_outime

        })

        if (updatedshift){
            res.json({message:"Shift Updated Successfully"})
        }else {
            res.json({message:"Failed to Updated Shift "})
        }
    }else{
        return res.status(404).json({message:"Shift Not Found 404"})
    }
    
} catch (error) {
    console.log(error);
    res.json({error:"Error To Update List "})
}
}

const deleted = async(req,res)=>{
    try {
const {id} = req.params;
    const existingshift = await Shift.findByPk(id)
    if (existingshift){
       const deleted =  await existingshift.destroy();
       if (deleted){
        res.json({message:"Shift Deleted SuccessFully"})
       }
    }else {
        res.json({message:"Shift Not Found "})
    }
            
} catch (error) {
 console.log(error);       
 res.json({error:"Failed To Delete Shift"})
}
}
module.exports ={
    store,
    index,
    show,
    update,
    deleted
}