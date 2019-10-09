const Sequelize = require('sequelize');
class SnapBody extends Sequelize.Model {}

SnapBody.init({
  date: {
    type: Sequelize.DataTypes.INTEGER,
  },
  time: {
    type: Sequelize.DataTypes.INTEGER,
  },
})
