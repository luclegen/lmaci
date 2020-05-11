module.exports.convertName = (phrase) => {
  return phrase.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}