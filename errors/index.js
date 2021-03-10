exports.err500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Unhandled error' });
};

exports.err400 = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid type' });
  } else {
    next(err);
  }
};

exports.err405 = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};

// exports.err405 = (err, req, res, next) => {
//   console.log(err, req, res, next);
//   if (err.code === '23503') {
//     res.status(405).send({ msg: 'Method not allowed' });
//   } else {
//     next(err);
//   }
// };

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
