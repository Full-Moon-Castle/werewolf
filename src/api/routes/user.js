
module.exports = (app) => {
  const controller = app.controllers.user;

  app.route('/v1/users')
      .post(controller.create);
};
