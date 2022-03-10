exports.getNotificationLabel = (code) => {
  const notifications = require('../data/notification-types')
  const notification = notifications.find(notification => notification.code === code)

  let label = code

  if (notification) {
    label = notification.name
  }

  return label
}
