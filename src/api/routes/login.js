module.exports = (app) => {
  const controller = app.controllers.login;

  app.route('/v1/login')
      .post(controller.login);
};
