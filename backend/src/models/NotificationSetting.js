const { connectNotificationsDB } = require('../config/notifications-database');

let notificationsConnection = null;
let NotificationSettingModel = null;

const getNotificationSettingModel = async () => {
  if (!NotificationSettingModel) {
    notificationsConnection = await connectNotificationsDB();
    
    const notificationSettingSchema = new notificationsConnection.Schema({
      userId: {
        type: notificationsConnection.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
      },
      dailyReminder: {
        enabled: { type: Boolean, default: false },
        time: { type: String, default: '09:00' },
        timezone: { type: String, default: 'UTC' }
      },
      emailNotifications: {
        enabled: { type: Boolean, default: true },
        newQuotes: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false }
      },
      pushNotifications: {
        enabled: { type: Boolean, default: true },
        newQuotes: { type: Boolean, default: true },
        favorites: { type: Boolean, default: true }
      },
      inAppNotifications: {
        enabled: { type: Boolean, default: true },
        newQuotes: { type: Boolean, default: true },
        favorites: { type: Boolean, default: true },
        comments: { type: Boolean, default: true }
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }, {
      timestamps: true
    });

    // Índices
    notificationSettingSchema.index({ userId: 1 });
    notificationSettingSchema.index({ 'dailyReminder.enabled': 1 });
    notificationSettingSchema.index({ isActive: 1 });

    NotificationSettingModel = notificationsConnection.model('NotificationSetting', notificationSettingSchema);
  }
  
  return NotificationSettingModel;
};

module.exports = getNotificationSettingModel;
