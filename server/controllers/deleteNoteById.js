const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var re_noteID = new RegExp("noteID=(\.+)", "g");
  var id = re_noteID.exec(ctx.originalUrl)[1];

  await mysql('userData').del().where({ noteID: id });

  ctx.state.data = {
    msg: "id: " + id + " 已删除"
  }
}