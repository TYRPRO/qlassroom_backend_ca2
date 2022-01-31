//ADES CA1 Play2Win
const { Sequelize, Model, DataTypes, BOOLEAN } = require("sequelize");

// ElephantSQL Credentials
const database = "ijlipomt";
const user = "ijlipomt";
const password = "e_rRJlw0RbrjeYODCGlFzBk4zcFPC8H8";
const host = "john.db.elephantsql.com";

const sequelize = new Sequelize("postgres://ijlipomt:e_rRJlw0RbrjeYODCGlFzBk4zcFPC8H8@john.db.elephantsql.com:5432/ijlipomt", {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 1000,
  },
  define: {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  },
});

// Checks Connection to Database
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize established connection with database successfully");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
}

checkConnection();

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  verification_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  grade_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  stream_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_temp: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

const Subforum = sequelize.define("Subforum", {
  subforum_id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  subforum_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  fk_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subforum_description: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  subforum_created_at: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  subforum_followers_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

async function syncing() {
  await User.sync();
  console.log("All Models synchronized successfully.");
}
syncing();
module.exports = sequelize;
