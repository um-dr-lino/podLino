const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    actorId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Pode ser nulo se a notificação não tiver um ator específico (ex: sistema)
        references: { model: 'users', key: 'id' }
    },
    type: {
        type: DataTypes.ENUM('like', 'comment', 'follow', 'new_video', 'report_status'),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true // Link para a página relacionada à notificação
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    indexes: [
        { fields: ['recipient_id'], name: 'idx_notifications_recipientId' }
    ]
});

module.exports = Notification;