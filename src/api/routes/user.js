
module.exports = (app) => {
  const controller = app.controllers.user;

  app.route('/v1/users')
      .post(controller.create);
  app.route('/v1/users/:id')
      .delete(controller.delete);
};
