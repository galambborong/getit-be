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

exports.err404 = (err, req, res, next) => {
  console.log(err, req, res, next);
  if (err.code === '23503') {
    res.status(404).send({ msg: 'Not found' });
  } else {
    next(err);
  }
};
exports.err405 = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
