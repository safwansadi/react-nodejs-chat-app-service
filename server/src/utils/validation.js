"use strict";

const _ = require("lodash");

const getInvalidFileTypeMessage = (file, allowedExts) => {
  if (file.hapi && file.hapi.filename && file.hapi.headers) {
    if (
      !_.some(allowedExts, (ext) =>
        _.includes(file.hapi.headers["content-type"], ext)
      )
    ) {
      return `Attached file should be ${allowedExts.join(" or ")} format.`;
    }
  }

  return null;
};

module.exports = {
  options: {
    // if true then return with first error, if false then return with all the error
    abortEarly: false,
  },

  checkFileValidation(file) {
    if (!file) return null;

    const invalidFileTypeMessage = getInvalidFileTypeMessage(file, [
      "jpeg",
      "jpg",
      "png",
    ]);

    if (invalidFileTypeMessage)
      throw {
        name: "badRequest",
        message: _.upperFirst(invalidFileTypeMessage),
      };
    else return file;
  },
};
