const { connectNotificationsDB } = require('../config/notifications-database');

let notificationsConnection = null;
let ScheduledNotificationModel = null;

const getScheduledNotificationModel = async () => {
  if (!ScheduledNotificationModel) {
    notificationsConnection = await connectNotificationsDB();
    
    const scheduledNotificationSchema = new notificationsConnection.Schema({
      userId: {
        type: notificationsConnection.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      type: {
        type: String,
        enum: ['daily_reminder', 'weekly_digest', 'new_quote', 'favorite_quote'],
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
      },
      scheduledFor: {
        type: Date,
        required: true
      },
      isSent: {
        type: Boolean,
        default: false
      },
      sentAt: {
        type: Date,
        default: null
      },
      retryCount: {
        type: Number,
        default: 0
      },
      maxRetries: {
        type: Number,
        default: 3
      },
      metadata: {
        quoteId: {
          type: notificationsConnection.Schema.Types.ObjectId,
          ref: 'Quote'
        },
        categoryId: {
          type: notificationsConnection.Schema.Types.ObjectId,
          ref: 'Category'
        },
        customData: {
          type: notificationsConnection.Schema.Types.Mixed,
          default: {}
        }
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }, {
      timestamps: true
    });

    // Índices
    scheduledNotificationSchema.index({ userId: 1 });
    scheduledNotificationSchema.index({ type: 1 });
    scheduledNotificationSchema.index({ scheduledFor: 1 });
    scheduledNotificationSchema.index({ isSent: 1 });
    scheduledNotificationSchema.index({ isActive: 1 });

    ScheduledNotificationModel = notificationsConnection.model('ScheduledNotification', scheduledNotificationSchema);
  }
  
  return ScheduledNotificationModel;
};

module.exports = getScheduledNotificationModel;
