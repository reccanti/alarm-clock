function User(name, id) {
    this.name = name;
    this.id = id || generateId();
};
var generateId = function () {
    return '7777777777';
}
module.exports = User;