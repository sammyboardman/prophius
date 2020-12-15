module.exports = function( schema, options ) {
  schema.pre('save', function( next ) {
    this._isNew = this.isNew;
    this._modifiedPaths = this.modifiedPaths();
    this._isModified = this.isModified();
    next();
  });

  schema.method('wasNew', function() {
    return this.hasOwnProperty('_isNew') ? this._isNew : this.isNew;
  });

  schema.method('wasModified', function( path ) {
    if (this.hasOwnProperty('_modifiedPaths') && this.hasOwnProperty('_isModified')) {
      return path ? !!~this._modifiedPaths.indexOf(path) : this._isModified;
    }
    return this.isModified.apply(this, arguments);
  });
};