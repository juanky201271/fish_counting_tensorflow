const Find = require('../models/find-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createFind = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a find', })
  }
  const find = new Find(body)
  if (!find) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json find', })
  }

  await find
    .save()
    .then(f => {
      Find.aggregate([
        {$match: {
          _id: f._id
        }},
        {$lookup: {
          from: "nca-bars",
          localField: "finds_business_id",
          foreignField: "bars_business_id",
          as: "businesses"
        }},
        {$unwind: {
          path: '$businesses',
          includeArrayIndex: 'businessesIndex',
          preserveNullAndEmptyArrays: true
        }},
        {$lookup: {
          from: 'nca-users-twitterids',
          localField: 'businesses.twitterId',
          foreignField: 'twitterId',
          as: 'businesses.users'
        }},
        {$unwind: {
          path: '$businesses.users',
          includeArrayIndex: 'businesses.usersIndex',
          preserveNullAndEmptyArrays: true
        }},
      ])
        .exec(function(err, find) {
          if (err) {
            return res.status(400).json({ success: false, error: 'aggregate - ' + err, })
          }
          if (!find.length) {
            return res.status(404).json({ success: false, error: 'Find not found', })
          }
          return res.status(201).json({
            success: true,
            _id: find[0]._id,
            ip: find[0].ip,
            businesses: find,
            message: 'Find created!',
          })
        })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: 'save - ' + err, })
    })
}

updateFind = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a find', })
  }
  await Find
    .findOne({ _id: ObjectId(req.params._id) }, (err, find) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!find) {
        return res.status(404).json({ success: false, error: 'Find not found', })
      }
      find.locale = body.locale
      find.location = body.location
      find.categories = body.categories
      find.json = body.json
      //await
      find
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: find._id,
            ip: find.ip,
            message: 'Find updated!',
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

deleteFind = async (req, res) => {
  await Find
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!find) {
      //  return res.status(404).json({ success: false, error: 'Find not found', })
      //}
      return res.status(200).json({ success: true, }) // data: find})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getFindById = async (req, res) => {
  await Find.aggregate([
    {$match: {
      _id: ObjectId(req.params._id)
    }},
    {$lookup: {
      from: "nca-bars",
      localField: "finds_business_id",
      foreignField: "bars_business_id",
      as: "businesses"
    }},
    {$unwind: {
      path: '$businesses',
      includeArrayIndex: 'businessesIndex',
      preserveNullAndEmptyArrays: true
    }},
    {$lookup: {
      from: 'nca-users-twitterids',
      localField: 'businesses.twitterId',
      foreignField: 'twitterId',
      as: 'businesses.users'
    }},
    {$unwind: {
      path: '$businesses.users',
      includeArrayIndex: 'businesses.usersIndex',
      preserveNullAndEmptyArrays: true
    }},
  ])
    .exec(function(err, find) {
      if (err) {
        return res.status(400).json({ success: false, error: 'aggregate - ' + err, })
      }
      if (!find.length) {
        return res.status(404).json({ success: false, error: 'Find not found', })
      }
      return res.status(201).json({
        success: true,
        _id: find[0]._id,
        ip: find[0].ip,
        businesses: find,
        message: 'Find created!',
      })
    })
}

getFindsByIp = async (req, res) => {
  await Find
    .find({ ip: req.params.ip }, (err, find) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!find) {
        return res.status(404).json({ success: false, error: 'Find not found', })
      }
      return res.status(200).json({ success: true, data: find})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getFindsByTwitterId = async (req, res) => {
  await Find
    .find({ twitterId: req.params.twitterId }, (err, find) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!find) {
        return res.status(404).json({ success: false, error: 'Find not found', })
      }
      return res.status(200).json({ success: true, data: find})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getFinds = async (req, res) => {
  await Find
    .find({}, (err, finds) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!finds.length) {
        return res.status(404).json({ success: false, error: 'Finds not found', })
      }
      return res.status(200).json({ success: true, data: finds})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createFind,
  updateFind,
  deleteFind,
  getFindById,
  getFindsByIp,
  getFindsByTwitterId,
  getFinds,
}
