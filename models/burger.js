module.exports = function(sequelize, DataTypes){

	var burger = sequelize.define("burger", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
    	autoIncrement: true,
			allowNull: false
		},
		burger_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[0, 64]
			}
		},
		burger_devoured: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		burger_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	});

	burger.associate = function(models){
		burger.belongsTo(models.customer, {
			foreignKey: {
				allowNull: true
			}
		});
	};

	return burger;
};
