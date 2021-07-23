const express = require("express")
const formidable = require("formidable")
const path = require("path")
const fs = require("fs")
const moment = require("moment")
var csv = require("csv-parse")
const readXlsxFile = require("read-excel-file/node")
const iconv = require("iconv-lite")

const { Property, Customui, Sequelize } = require("../models")
const controller = require("../controllers/admin.controller")

const op = Sequelize.Op
const router = express.Router()

router.post("/get-valuation", controller.getValuation)
router.post("/get-lead", controller.getLead)
router.post("/input-property", controller.inputProperty)
router.get("/delete-all-property", controller.deleteAllProperty)
router.get("/get-all-property", controller.getAllProperty)
router.get("/get-all-lead", controller.getAllLeads)
router.get("/get-all-valuation", controller.getAllValuations)
router.post(
  "/selected-lead-valuation-delete",
  controller.selectedLeadValuationDelete
)
router.get("/get-all-company", controller.getAllCompany)
router.post("/change-allow", controller.changeAllow)
router.post("/delete-user", controller.deleteUser)
router.post("/change-receiver", controller.changeReceiver)
router.post("/change-contact-text", controller.changeContactText)
router.post("/custom-ui", controller.changeUI)
router.post("/image-upload", async (req, res) => {
  try {
    var form = new formidable.IncomingForm()
    let uploadPath = path.join(__dirname, `../../public/img`)
    form.uploadDir = uploadPath
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath)
    }
    form.parse(req, function (err, fields, files) {
      var oldpath = files.background.path
      var newpath = path.join(uploadPath, files.background.name)
      var url = newpath.split("/app/public/")[1]
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err
        Customui.update(
          {
            backgroundImg: url,
          },
          {
            where: { user: req.body.user.id },
          }
        ).then(() => {
          res.send({
            url,
          })
        })
      })
    })
  } catch (error) {
    console.log(error)
  }
})
router.post("/csv-upload", async (req, res) => {
  try {
    function pad(n, width, z) {
      z = z || "0"
      n = n + ""
      if (n.length == width) {
        return n
      } else {
        return new Array(width - n.length + 1).join(z) + n
      }
    }
    var form = new formidable.IncomingForm()
    var uploadPath = path.join(__dirname, `../files`)
    form.uploadDir = uploadPath
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath)
    }
    var newpath = (oldpath = "")
    form.parse(req, function (err, fields, files) {
      oldpath = files.csvFile.path
      newpath = path.join(uploadPath, files.csvFile.name)
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err
        if (files.csvFile.type === "application/vnd.ms-excel") {
          var rows = []
          fs.createReadStream(newpath)
            .pipe(iconv.decodeStream("ISO-8859-4"))
            .pipe(csv())
            .on("data", async function (data) {
              //do something with data
              rows.push(data)
            })
            .on("end", function () {
              console.log("csv")
              const datas = rows.slice(1)
              let property = []
              datas.map(async (data, index) => {
                let field = {
                  buildingType: data[0] && data[0],
                  city: data[1] && data[1],
                  cityPart: data[2] && data[2],
                  zip: pad(Number(data[3]), 5),
                  street: data[4] && data[4],
                  sqm: data[5] ? Number(data[5]) : null,
                  builtYear: data[6] ? Number(data[6]) : null,
                  roomNumber: data[7] ? Number(data[7]) : null,
                  price: data[13] ? Number(data[13]) : null,
                  sqmPrice: data[14] ? Number(data[14]) : null,
                  condition: data[16] && data[16],
                  saleDate: {
                    [op.gt]: new Date(
                      new Date(data[17]).setDate(
                        new Date(data[17]).getDate() - 1
                      )
                    ),
                    [op.lt]: new Date(
                      new Date(data[17]).setDate(
                        new Date(data[17]).getDate() + 1
                      )
                    ),
                  },
                  plot: data[18] && data[18],
                  transactionTime: data[21] ? Number(data[21]) : null,
                  consideration: data[22] && data[22],
                }
                let result = await Property.findOrCreate({
                  where: field,
                  defaults: {
                    saleDate: data[17] ? new Date(data[17]) : null,
                  },
                })
                if (result[1])
                  property.push({
                    ...field,
                    saleDate: data[17] ? new Date(data[17]) : "",
                  })
                if (datas.length === index + 1) {
                  console.log("done csv")
                  return res.send({
                    addedProperty: property,
                  })
                }
              })
            })
        } else {
          readXlsxFile(newpath).then((rows) => {
            console.log("xls")
            const datas = rows.slice(1)
            let property = []

            datas.map(async (data, index) => {
              let field = {
                buildingType: data[0] && data[0].toString(),
                city: data[1] && data[1].toString(),
                cityPart: data[2] && data[2].toString(),
                zip: pad(Number(data[3]), 5),
                street: data[4] && data[4].toString(),
                sqm: data[5] ? Number(data[5]) : null,
                builtYear: data[6] ? Number(data[6]) : null,
                roomNumber: data[7] ? Number(data[7]) : null,
                price: data[13] ? Number(data[13]) : null,
                sqmPrice: data[14] ? Number(data[14]) : null,
                condition: data[16] && data[16].toString(),
                saleDate: {
                  [op.gt]: new Date(
                    new Date(data[17]).setDate(new Date(data[17]).getDate() - 1)
                  ),
                  [op.lt]: new Date(
                    new Date(data[17]).setDate(new Date(data[17]).getDate() + 1)
                  ),
                },
                plot: data[18] && data[18].toString(),
                transactionTime: data[21] ? Number(data[21]) : null,
                consideration: data[22] && data[22].toString(),
              }
              let result = await Property.findOrCreate({
                where: field,
                defaults: {
                  saleDate: data[17] ? new Date(data[17]) : "",
                },
              })
              if (result[1])
                property.push({
                  ...field,
                  saleDate: data[17] ? new Date(data[17]) : "",
                })
              if (datas.length === index + 1) {
                console.log("done xls")
                return res.send({
                  addedProperty: property,
                })
              }
            })
          })
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
})
router.post("/save-question", controller.addQuestion)
router.post("/get-question", controller.getQuestion)

module.exports = router
