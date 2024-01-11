const Salary = require("./salary_model")


const store = async(req,res) =>{
try {
    const {
        salary_generator_id,
        salary_receiver_id,
        salary_date,
        salary_start_date,
        salary_end_date,
        salary_amount,
        salary_absent_days,
        salary_present_days,
        salary_total_days,
        salary_incentive,
        salary_payment_id
    } = req.body;
  const newSalary = await Salary.create({
    salary_generator_id,
    salary_receiver_id,
    salary_date,
    salary_start_date,
    salary_end_date,
    salary_amount,
    salary_absent_days,
    salary_present_days,
    salary_total_days,
    salary_incentive,
    salary_payment_id
  }) 
  if(newSalary)
  {
res.json({message:"Salary Generated SuccessFully"})
  }else{
    res.json({message:"Failed To Salary Generated"})
  }
} catch (error) {
    console.log(error);
    res.json({error:"Failed To Store Salary"})
}
}

module.exports = {
    store
}