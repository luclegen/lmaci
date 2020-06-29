module.exports.toName = phrase => phrase.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');

module.exports.base64ToImg = base64 => base64.replace(/^data:image\/png;base64,/, "");

module.exports.toKeyword = phrase => phrase.trim().split(/\s+/).map(w => w.toLowerCase()).join(' ');
