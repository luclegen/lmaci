module.exports.toName = phrase => phrase.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');

module.exports.toKeyword = phrase => phrase.trim().split(/\s+/).map(w => w.toLowerCase()).join(' ');
