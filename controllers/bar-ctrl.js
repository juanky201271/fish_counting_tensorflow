const Bar = require('../models/bar-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createBar = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a bar', })
  }
  const bar = new Bar(body)
  if (!bar) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json bar', })
  }

  await bar
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: bar._id,
        ip: bar.ip,
        message: 'Bar created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateBar = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a bar', })
  }
  await Bar
    .findOne({ _id: ObjectId(req.params._id) }, (err, bar) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bar) {
        return res.status(404).json({ success: false, error: 'Bar not found', })
      }
      bar.assist = body.assist
      //await
      bar
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: bar._id,
            ip: bar.ip,
            message: 'Bar updated!',
          })
        })
        .catch(err => {
          return res.status(400).json({ success: false, error: err, })
        })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

deleteBar = async (req, res) => {
  await Bar
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!bar) {
      //  return res.status(404).json({ success: false, error: 'Bar not found', })
      //}
      return res.status(200).json({ success: true, }) // data: bar})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getBarById = async (req, res) => {
  await Bar
    .findOne({ _id: ObjectId(req.params._id) })
    .populate("find_id")
    .exec((err, bars) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bars.length) {
        return res.status(404).json({ success: false, error: 'Bars not found', })
      }
      return res.status(200).json({ success: true, data: bars})
    })
}

getBarsByIp = async (req, res) => {
  await Bar
    .find({ ip: req.params.ip })
    .populate("find_id")
    .exec((err, bars) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bars.length) {
        return res.status(404).json({ success: false, error: 'Bars not found', })
      }
      return res.status(200).json({ success: true, data: bars})
    })
}

getBarsByTwitterId = async (req, res) => {
  await Bar
    .find({ twitterId: req.params.twitterId })
    .populate("find_id")
    .exec((err, bars) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bars.length) {
        return res.status(404).json({ success: false, error: 'Bars not found', })
      }
      return res.status(200).json({ success: true, data: bars})
    })
}

getBarsByBusinessId = async (req, res) => {
  await Bar
    .find({ bars_business_id: req.params.bars_business_id })
    .populate("find_id")
    .exec((err, bars) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bars.length) {
        return res.status(404).json({ success: false, error: 'Bars not found', })
      }
      return res.status(200).json({ success: true, data: bars})
    })
}

getBars = async (req, res) => {
  await Bar
    .find({})
    .populate("find_id")
    .exec((err, bars) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!bars.length) {
        return res.status(404).json({ success: false, error: 'Bars not found', })
      }
      return res.status(200).json({ success: true, data: bars})
    })
    //.catch(err => {
    //  return res.status(400).json({ success: false, error: err, })
    //})
}

module.exports = {
  createBar,
  updateBar,
  deleteBar,
  getBarById,
  getBarsByIp,
  getBarsByTwitterId,
  getBarsByBusinessId,
  getBars,
}
