module.exports = function( schema, options ) {

  if (!schema.paths.hasOwnProperty('createdAt')) {
    schema.add({
      createdAt: {
        type: Date,
        index: true
      }
    });
  }

  if (!schema.paths.hasOwnProperty('updatedAt')) {
    schema.add({
      updatedAt: {
        type: Date,
        index: true
      }
    });
  }

  schema.pre('save', function( next ) {
    if (this.isModified() && !this.isModified('updatedAt')) {
      this.updatedAt = new Date();
    }
    if (this.isNew) {
      this.createdAt = new Date();
    }
    next();
  });
};
