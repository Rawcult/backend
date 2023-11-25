const { admin } = require("../utils");
const User = require("../models/user")
const Product = require("../models/product")
const axios = require("axios")

const  sendNotificaton = (token,title,body)=>{
  const message = JSON.stringify({
    to: token || "",
    notification: {
      body,
      title,
    },
    // webpush: {
    //   notification: {
    //     "body": "Your order is successfully placed!",
    //     "title": "Order Successful!!"
    //   },
     
    // },
    // data: {
    //   mutable_content: "1", // Use this to allow displaying image in notification
    // },

    // apns: {
    //   payload: {
    //     aps: {
    //       sound: "default",
    //     },
    //   },
    //   fcm_options: {},
    // },
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer AAAAr7Oo3UE:APA91bFFVitm9Wv5Gaa386gzdGwiKc3yfnU0o6BC1GSRrqG2wcF8HP9EqEaN_HaWdN2aVvo7_Jl14X15rSXrFCO2p6-_MJXLPqei2E-HRZhDhy2OTrD3P9oWtujFtu8Lm4mvdBUi8TWV'
    },
    data : message
  };
  
  axios.request(config).then((response) => {
    console.log(JSON.stringify(response.data.data));
  })
  .catch((error) => {
    console.log("adasdsa",error);
  });
}

const notification = async (req, res) => {
  const { productIds, userid } = req.body;
  try {
    const user = await User.findById(userid);
    const notificationSender = async (productId)=>{
      const product = await Product.findById(productId).populate("user");
      if(product.user.fbToken){
     sendNotificaton(product.user.fbToken ,"Order Recieved","Click here to view orders")
    }
  }
   productIds.map(val=>{
    notificationSender(val)
   })
    // await admin.messaging().send(message);
    res.status(200).json({ msg: "Notification sent successfully" });
  } catch (error) {
    console.log(error);
  }
};


const adminNotification = async (req, res) => {
  const { title, body} = req.body;
  try {
    const users = await User.find({});
    console.log("🚀 ~ file: firebaseController.js:78 ~ adminNotification ~ users:", users);
    users.map(val=> !["manufacturer","admin"].includes(val.role) && val.fbToken).filter(Boolean).map(token=>{
      console.log("🚀 ~ file: firebaseController.js:81 ~ users.map ~ token:", token)
      sendNotificaton(token,title,body)
    })
    res.status(200).json({ msg: "Notification sent successfully" });
  } catch (error) {
    console.log(error);
  }
};


module.exports.notification = notification;
module.exports.adminNotification = adminNotification
