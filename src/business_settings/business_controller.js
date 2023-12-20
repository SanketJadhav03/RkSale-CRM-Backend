const Business_setting = require('./business_model')

const store = async(req,res)=>{
try {
   const newBusiness = await Business_setting.create({

    })
} catch (error) {
console.log(error);
res.json({message:"Failed To Create Business "})
}
}

module.exports ={
    store
}