module.exports = function(sequelize, DataTypes){

	var customer = sequelize.define("customer", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
    	autoIncrement: true,
			allowNull: false
		},
		customer_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:[0, 64]
			}
		}
	});

	customer.associate = function(models){
		customer.hasMany(models.burger, {
			onDelete: "cascade"
		});
	};
	
	return customer;
};