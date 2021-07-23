const moment = require("moment")
const {
  Property,
  Query,
  User,
  Role,
  Customui,
  Question,
  Sequelize,
} = require("../models")

const op = Sequelize.Op

exports.getValuation = async (req, res) => {
  try {
    const { startDate, endDate, user } = req.body
    var query, allValuationNumber, allValuations, daylist, list
    query = {
      status: "valuation",
      createdAt: {
        [op.gte]: new Date(new Date(startDate).toISOString()),
        [op.lt]: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1)
        ).toISOString(),
      },
    }
    getDaysArray = function (start, end) {
      for (
        var arr = [], dt = new Date(start);
        dt <= end;
        dt.setDate(dt.getDate() + 1)
      ) {
        arr.push(new Date(dt))
      }
      return arr
    }
    allValuationNumber = await Query.count({
      where: {
        status: "valuation",
      },
    })
    if (user.roles.name === "company") {
      allValuationNumber = await Query.count({
        where: {
          toCompany: user.id,
          status: "valuation",
        },
      })
      query.toCompany = user.id
    }
    allValuations = await Query.findAll({ where: query })
    daylist = getDaysArray(new Date(startDate), new Date(endDate))
    list = daylist.map((v) => ({
      date: moment(v).format("YYYY-MM-DD"),
      count: allValuations.filter(
        (value) =>
          moment(value.createdAt).format("YYYY-MM-DD") ===
          moment(v).format("YYYY-MM-DD")
      ).length,
    }))

    return res.status(200).send({
      all: allValuationNumber,
      graphData: list,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getLead = async (req, res) => {
  try {
    const { startDate, endDate, user } = req.body
    var query, allValuationNumber, allValuations, daylist, list
    query = {
      status: "lead",
      createdAt: {
        [op.gte]: new Date(new Date(startDate).toISOString()),
        [op.lt]: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1)
        ).toISOString(),
      },
    }
    getDaysArray = function (start, end) {
      for (
        var arr = [], dt = new Date(start);
        dt <= end;
        dt.setDate(dt.getDate() + 1)
      ) {
        arr.push(new Date(dt))
      }
      return arr
    }
    allValuationNumber = await Query.count({
      where: {
        status: "lead",
      },
    })
    if (user.roles.name === "company") {
      query.toCompany = user.id
      allValuationNumber = await Query.count({
        where: {
          toCompany: user.id,
          status: "lead",
        },
      })
    }
    allValuations = await Query.findAll({ where: query })
    daylist = getDaysArray(new Date(startDate), new Date(endDate))
    list = daylist.map((v) => ({
      date: moment(v).format("YYYY-MM-DD"),
      count: allValuations.filter(
        (value) =>
          moment(value.createdAt).format("YYYY-MM-DD") ===
          moment(v).format("YYYY-MM-DD")
      ).length,
    }))
    return res.status(200).send({
      all: allValuationNumber,
      graphData: list,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.inputProperty = async (req, res) => {
  try {
    await req.body.inputData.map((row) => {
      const inputData = new Property(row)
      inputData.save()
    })
    // const resData = await Property.find()
    return res.status(200).send({
      message: "Saved successfuly!",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.deleteAllProperty = (req, res) => {
  Property.destroy({ truncate: true }).then(() => {
    return res.status(200).send({
      message: "All data deleted successfuly!",
    })
  })
}

exports.getAllProperty = (req, res) => {
  Property.findAll().then((result) => {
    return res.status(200).send({
      property: result,
    })
  })
}

exports.getAllLeads = async (req, res) => {
  try {
    const { user } = req.body
    var leads
    var query = {
      status: "lead",
    }
    if (user.roles.name === "admin") {
      leads = await Query.findAll({ where: query })
    } else if (user.roles.name === "company") {
      query.toCompany = user.id
      leads = await Query.findAll({ where: query })
    }
    return res.status(200).send({
      leads,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getAllValuations = async (req, res) => {
  try {
    const { user } = req.body
    var valuations
    var query = {
      status: "valuation",
    }
    if (user.roles.name === "admin") {
      valuations = await Query.findAll({ where: query })
    } else if (user.roles.name === "company") {
      query.toCompany = user.id
      valuations = await Query.findAll({ where: query })
    }
    return res.status(200).send({
      valuations,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.selectedLeadValuationDelete = async (req, res) => {
  try {
    const { ids } = req.body
    console.log(ids)
    await Query.destroy({
      where: {
        id: { [op.in]: ids },
      },
    })
    return res.status(200).send({
      message: "success!",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getAllCompany = async (req, res) => {
  try {
    const role = await Role.findOne({
      where: {
        name: "company",
      },
    })
    const companies = await User.findAll({
      where: {
        role: role.id,
      },
    })
    return res.status(200).send({
      companies,
    })
  } catch (error) {
    console.log(error)
  }
}

exports.changeAllow = async (req, res) => {
  try {
    const { id, allow } = req.body
    await User.update({ allow: allow }, { where: { id: id } })
    return res.status(200).send({
      message: "success",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body
    await User.destroy({ where: { id: id } })
    return res.status(200).send({
      message: "success",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.changeReceiver = async (req, res) => {
  try {
    const { email, user } = req.body
    await User.update({ receiver: email }, { where: { id: user.id } })
    res.status(200).send({
      message: "Success!",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.changeContactText = async (req, res) => {
  try {
    const { contactTextE, contactTextF, user } = req.body
    await User.update(
      { contactTextE, contactTextF },
      { where: { id: user.id } }
    )
    res.status(200).send({
      message: "success",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.changeUI = async (req, res) => {
  try {
    const {
      backImg,
      normalFont,
      labelFont,
      cardBackCol,
      headerCol,
      headerText,
      labelCol,
      popupText,
      popupCol,
      user,
    } = req.body
    console.log(labelCol, popupCol, "===========")
    const exist = await Customui.findOne({ where: { user: user.id } })
    console.log(exist)
    if (exist) {
      await Customui.update(
        {
          backgroundImg: backImg,
          normalFont,
          labelFont,
          cardBackCol,
          headerCol,
          labelCol,
          popupText,
          headerText,
          popupCol,
        },
        {
          where: { user: user.id },
        }
      )
    } else {
      await Customui.create({
        backgroundImg: backImg,
        normalFont,
        labelFont,
        cardBackCol,
        headerCol,
        labelCol,
        popupText,
        headerText,
        popupCol,
        user: user.id,
      })
    }
    res.status(200).send({
      message: "success",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.addQuestion = async (req, res) => {
  try {
    const { questions, user } = req.body
    console.log(questions, "1111111111")
    await Question.destroy({
      where: {
        company: user.id,
      },
    })
    questions.map(async (question) => {
      await Question.create({
        name: question.name,
        next: question.next ? parseInt(question.next) : null,
        node: question.node,
        end: question.end ? question.end : false,
        question: question.question,
        subHeading: question.subHeading,
        status: question.status,
        title: question.title,
        answers: question.answers,
        company: user.id,
      })
    })
    return res.status(200).send({
      messasge: "Success",
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getQuestion = async (req, res) => {
  try {
    const user = req.body.user.id
    const questions = await Question.findAll({
      where: {
        company: user,
      },
      order: [["node", "ASC"]],
    })
    console.log(questions, "-----------")
    return res.status(200).send({
      questions,
    })
  } catch (error) {
    console.log(error)
  }
}
