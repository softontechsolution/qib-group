let strapiInstance = null;

function setStrapi(instance) {
  strapiInstance = instance;
}

function getStrapi() {
  if (!strapiInstance) {
    throw new Error("Strapi not initialized in worker context");
  }
  return strapiInstance;
}

module.exports = {
  setStrapi,
  getStrapi,
};