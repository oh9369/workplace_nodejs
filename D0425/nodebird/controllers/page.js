const { User, Post, Hashtag } = require("../models");

exports.renderProfile = (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
};

exports.renderJoin = (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,// user 정보를 가져와
        attributes: ["id", "nick"], // 아이디와 닉네임을 json 해서 제공
      },
      order: [["createdAt", "DESC"]],
    }) || [];
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.renderHashtag = async (req,res,next) => {
  const query = req.query.hashtag;
  if(!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({where:{title:query}});
    let posts = [];
    if(hashtag) {
      posts = await hashtag.getPosts({include: [{model:User}]});
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts || [],
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
}
