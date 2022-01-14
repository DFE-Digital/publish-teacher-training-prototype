// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {
  // Service name used in header. Eg: 'Renew your passport'
  serviceName: 'Publish teacher training courses',

  // Default port that prototype runs on
  port: '3000',

  // Enable or disable password protection on production
  useAuth: 'true',

  // Automatically stores form data, and send to all views
  useAutoStoreData: 'true',

  // Enable cookie-based session store (persists on restart)
  // Please note 4KB cookie limit per domain, cookies too large will silently be ignored
  useCookieSessionStore: 'false',

  // Force HTTP to redirect to HTTPS on production
  useHttps: 'true',

  // Enable or disable Browser Sync
  useBrowserSync: 'true',

  useLogin: 'false',

  // Current and next cycle prototypes
  currentCyclePrototype: 'https://manage-courses-prototype.herokuapp.com',
  nextCyclePrototype: 'https://manage-courses-prototype-next.herokuapp.com'
}
