const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      username : { type: DataTypes.STRING, unique: true },
      hash     : { type: DataTypes.STRING, required: true }
    });
  
    User.associate = function(models) {
        // Add relationships here
        User.hasMany(models.FreeTime)
        User.belongsToMany(models.Meeting, { through: 'UserMeeting' });
    };

    User.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.hash)
    }

    User.createWithEncryptedPassword = function(username, password, callback) {
      bcrypt.hash(password, saltRounds, function(error, hash) {
        if (error) {
          callback({success: "No", message: "create has failed"});
        }
        User.create({username, hash})
        .then(function(result) {
          callback({success: "Yes", message: "Created new user", user : {id: result.id, username: result.username}});
        })
        .catch(function(error) {
          let message = error.errors && error.errors[0] && error.errors[0].message ? 
                          error.errors[0].message : "Error";
          callback({success: "No", message: message});
        });
      });
    }
  
    return User;
  };


