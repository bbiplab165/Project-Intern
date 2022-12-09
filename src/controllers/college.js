
let nameRegex = /^[a-z]+(([',. -][a-z])?[a-z]*)*$/
let nameRegex1 = /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/
const pattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/

const collegeModel = require('../models/collegeModel')
const internModels = require('../models/internModel')



const college = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "data is not present" })
        let name = req.body.name.toString()
        let fullName = req.body.fullName
        let logoLink = req.body.logoLink
        if (!name || !fullName || !logoLink) {
            return res.status(400).send({ status: false, msg: "All fields are required" })
        }

        if (!nameRegex.test(name)) { return res.status(400).send({ status: false, message: "Name is not Valid, use lowercase alphabets only" }) }

        let nameExist = await collegeModel.findOne({ name: name })

        if (nameExist) { return res.status(400).send({ status: false, message: " College is already exist" }) }

        if (!nameRegex1.test(fullName)) { return res.status(400).send({ status: false, message: "fullName is not Valid, use Alphabets" }) }

        if (!pattern.test(logoLink)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid link" })
        }
        const create = await collegeModel.create(data)
        return res.status(201).send({ status: true, msg: create })
    }

    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const getcollegedetail = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let data = req.query.collegeName
        data = data.toLowerCase()

        if (!data) return res.status(400).send({ status: true, Message: "Please Enter College name" })

        let collegeData = await collegeModel.findOne({ name: data, isDeleted: false })
        if (!collegeData) return res.status(404).send({ status: true, Message: "College Name not found, please enter valid name" })


        let internData = await internModels.find({ collegeId: collegeData._id, isDeleted: false })

        if (internData.length == 0) { internData = "Intern not Found" }
        //collegeData.interns = internData
        Object.assign(collegeData._doc,{interns:internData})
        res.status(200).send({ status: true, data: collegeData })
    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}


module.exports.college = college
module.exports.getcollegedetail = getcollegedetail