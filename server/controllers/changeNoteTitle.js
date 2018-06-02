const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var re_noteID = new RegExp("noteID=(\.+)&", "g");
  var id = re_noteID.exec(ctx.originalUrl)[1];

  var re_noteTitle = new RegExp("noteTitle=(\.+)", "g");
  var title = decodeURI(re_noteTitle.exec(ctx.originalUrl)[1]);

  await mysql('userData').update({ noteTitle: title }).where({ noteID: id });

  ctx.state.data = {
    context: "id: " + id + "更改标题为" + title
  }
}