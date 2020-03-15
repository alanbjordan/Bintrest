const express = require('express'),
router = express.Router(),
imageModel = require('../models/imageModel'),
likesModel = require('../models/likesModel');



/* GET home page. */
router.get('/', async function(req, res, next) {
  const user_id = req.session.user_id;
  const resultData = await imageModel.getProfilePicture(user_id);
  const savedData = await likesModel.getPicturesById(user_id);
  const howManyLikes = savedData.length;
  // console.log('this is the array length: ', howManyLikes);
  // console.log("this is the user id: ", user_id);
  // console.log(resultData[0].picture);
  if (resultData[0] != undefined && user_id != undefined) {
  res.render('template', {
    locals: {
      title: 'Film Data',
      resultData: resultData,
      savedData: savedData,
      is_logged_in: req.session.is_logged_in,
      name: req.session.name
    },
    partials: {
      partial: 'partial-profile'
    }
  })
}
else if (resultData[0] == undefined && user_id != undefined) {
  res.render('template', {
    locals: {
      title: 'Film Data',
      is_logged_in: req.session.is_logged_in,
      name: req.session.name
    },
    partials: {
      partial: 'partial-profile-upload'
    }

  })
} else {
  res.redirect('/users/signup');
}
});



router.post("/", async function(req, res){
  if(req.files) {
      const file = req.files.image,
      filename = file.name;
      // console.log(filename) 
      const picture = "/images/"+filename;   
      const user_id = req.session.user_id;      
      const profilePic = new imageModel(null, picture, user_id); 
      profilePic.userPicture();   
      // console.log(req.session.user_id);
      file.mv("./public/images/"+filename,function(err){
          if(err) {
              console.log(err)
              res.send("error occured")   
              res.redirect('/profile')            
          }      
          else { 
            res.redirect('/profile');
          }
      })
  }
})

module.exports = router;
