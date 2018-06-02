const { mysql } = require('../qcloud');

module.exports = async ctx => {
  var originalUrl = ctx.originalUrl;

  var re_noteID = new RegExp("noteID=(\.+)&", "g"),
    id = re_noteID.exec(originalUrl)[1];

  var re_noteContext = new RegExp("noteContext=(\.+)", "g"),
    context = re_noteContext.exec(originalUrl)[1];

  await mysql('userData').update({ noteContext: context }).where({ noteID: id });

  ctx.state.data = {
    context: decodeURIComponent(context)
  }
}