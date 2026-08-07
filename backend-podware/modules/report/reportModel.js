const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Report = sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'videos', key: 'id' }
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'reports',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['user_id', 'video_id'], name: 'idx_unique_report' } // Um usuário só pode denunciar um vídeo uma vez
    ]
});

module.exports = Report;