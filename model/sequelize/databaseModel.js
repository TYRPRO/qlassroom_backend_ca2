//ADES CA1 Play2Win
const { Sequelize, DataTypes } = require("sequelize");

// ElephantSQL Credentials
// const database = "ijlipomt";
// const user = "ijlipomt";
// const password = "e_rRJlw0RbrjeYODCGlFzBk4zcFPC8H8";
// const host = "john.db.elephantsql.com";


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
		defaultValue: Sequelize.UUIDV4,
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
		allowNull: true,
	},
	phone_number: {
		type: DataTypes.INTEGER,
		allowNull: true,
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

const Post = sequelize.define("Post", {
	post_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	fk_subforum_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	post_title: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	post_content: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	post_is_pinned: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: true,
	},
	post_created_at: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.CurrentTimestamp,
		allowNull: true,
	},
	post_is_answered: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: true,
	},
	fk_grade_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	post_rating: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: true,
	},
	post_answers_count: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	fk_response_id: {
		type: DataTypes.UUID,
		allowNull: true,
	}

});

const PostVote = sequelize.define("PostVote", {
	post_vote_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	vote_type: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: false,
	}
});

const ResponseVote = sequelize.define("ResponseVote", {
	response_vote_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	vote_type: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_response_id: {
		type: DataTypes.UUID,
		allowNull: false,
	}
});

const SavedPost = sequelize.define("SavedPost", {
	saved_post_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	}
});

const Response = sequelize.define("Response", {
	response_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	response: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	parent_response_id: {
		type: DataTypes.UUID,
		allowNull: true,
	},
	fk_response_type_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	response_popularity_rating: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	response_created_at: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.CurrentTimestamp,
		allowNull: true,
	}
});

const Subforum = sequelize.define("Subforum", {
	subforum_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
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
		type: DataTypes.DATE,
		defaultValue: Sequelize.CurrentTimestamp,
		allowNull: true,
	},
	subforum_followers_count: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

const Grade = sequelize.define("Grade", {
	grade_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	grade_name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
});

const ResponseType = sequelize.define("ResponseType", {
	response_type_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	response_type: {
		type: DataTypes.STRING(10),
		allowNull: false,
	}
});

const Authenticate = sequelize.define("Authenticate", {
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: true,
		primaryKey: true,
	},
	password: {
		type: DataTypes.TEXT,
		allowNull: false,
	},

});

const Label = sequelize.define("Label", {
	label_id: {
		type: DataTypes.UUID,
		allowNull: true,
		primaryKey: true,
	},
	label_name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	editable: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	usage_type: {
		type: DataTypes.STRING,
		allowNull: true
	},
	stream_id: {
		type: DataTypes.UUID,
		allowNull: true
	},
	fk_subforum_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	fk_grade_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	created_at: {
		type: DataTypes.TIME,
		allowNull: false
	},
	parent_label_id: {
		type: DataTypes.UUID,
		allowNull: true
	}

});

const PostLabel = sequelize.define("PostLabel", {
	post_label_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true
	},
	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	fk_label_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
});

const UserOAuth = sequelize.define("UserOAuth", {
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	oauth_id: {
		type: DataTypes.STRING(255),
		allowNull: false,
		primaryKey: true
	},
});

const UserProfile = sequelize.define("UserProfile", {
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true
	},
	profile_pic: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	school: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	date_of_birth: {
		type: DataTypes.DATE,
		allowNull: true
	},
	gender: {
		type: DataTypes.TEXT,
		allowNull: true
	}
});

const Report = sequelize.define("Report", {
	report_id: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	report_content: {
		type: DataTypes.STRING(255),
		allowNull: false
	},

	fk_post_id: {
		type: DataTypes.UUID,
		allowNull: true
	},
	fk_response_id: {
		type: DataTypes.UUID,
		allowNull: true
	},
	fk_user_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	created_at: {
		type: "TIMESTAMP",
		allowNull: true
	}
});

// Response Table
Response.belongsTo(Post, { foreignKey: "fk_post_id" });
Post.hasMany(Response, { foreignKey: "fk_post_id" });

Response.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Response, { foreignKey: "fk_user_id" });

// Post Table
Post.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Post, { foreignKey: "fk_user_id" });

Post.belongsTo(Subforum, { foreignKey: "fk_subforum_id" });
Subforum.hasMany(Post, { foreignKey: "fk_subforum_id" });

Post.belongsTo(Grade, { foreignKey: "fk_grade_id" });
Grade.hasMany(Post, { foreignKey: "fk_grade_id" });

// PostVote Table
PostVote.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(PostVote, { foreignKey: "fk_user_id" });

PostVote.belongsTo(Post, { foreignKey: "fk_post_id" });
Post.hasMany(PostVote, { foreignKey: "fk_post_id" });

// ResponseVote Table
ResponseVote.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(ResponseVote, { foreignKey: "fk_user_id" });

ResponseVote.belongsTo(Response, { foreignKey: "fk_response_id" });
Response.hasMany(ResponseVote, { foreignKey: "fk_response_id" });

// SavedPost Table
SavedPost.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(SavedPost, { foreignKey: "fk_user_id" });

SavedPost.belongsTo(Post, { foreignKey: "fk_post_id" });
Post.hasMany(SavedPost, { foreignKey: "fk_post_id" });

// Authenticate Table
Authenticate.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasOne(Authenticate, { foreignKey: "fk_user_id" });

// Subforum Table
Subforum.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Subforum, { foreignKey: "fk_user_id" });

// Post Table
Post.belongsTo(Subforum, { foreignKey: "fk_subforum_id" });
Subforum.hasMany(Post, { foreignKey: "fk_subforum_id" });

// Response Table
Response.hasMany(Response, { foreignKey: "parent_response_id" });
Response.belongsTo(ResponseType, { foreignKey: "fk_response_type_id" });
ResponseType.hasMany(Response, { foreignKey: "fk_response_type_id" });
Response.belongsTo(Post, { foreignKey: "fk_post_id" });
Post.hasMany(Response, { foreignKey: "fk_post_id" });
Response.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(Response, { foreignKey: "fk_user_id" });

// ResponseVote Table
ResponseVote.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasMany(ResponseVote, { foreignKey: "fk_user_id" });

ResponseVote.belongsTo(Response, { foreignKey: "fk_response_id" });
Response.hasMany(ResponseVote, { foreignKey: "fk_response_id" });

//Label Table
Label.belongsTo(Subforum, { foreignKey: "fk_subforum_id" });
Label.belongsTo(Grade, { foreignKey: "fk_grade_id" });
Subforum.hasMany(Label, { foreignKey: "fk_subforum_id" });
Grade.hasMany(Label, { foreignKey: "fk_grade_id" });

//PostLabel Table
PostLabel.belongsTo(Post, { foreignKey: "fk_post_id" });
PostLabel.belongsTo(Label, { foreignKey: "fk_label_id" });
Post.hasMany(PostLabel, { foreignKey: "fk_post_id" });
Label.hasMany(PostLabel, { foreignKey: "fk_label_id" });


UserOAuth.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasOne(UserOAuth, { foreignKey: "fk_user_id" });

//UserProfile Table
UserProfile.belongsTo(User, { foreignKey: "fk_user_id" });
User.hasOne(UserProfile, { foreignKey: "fk_user_id" });

//Report Table
Report.belongsTo(User, { foreignKey: "fk_user_id" });

Report.belongsTo(Post, { foreignKey: "fk_post_id" });

Report.belongsTo(Response, { foreignKey: "fk_response_id" });

async function syncing() {
	await User.sync();
	console.log("Test synchronized successfully.");
}
syncing();
module.exports = sequelize;
