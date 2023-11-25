const { admin } = require("../utils");
const User = require("../models/user")
const Product = require("../models/product")
const axios = require("axios")


const notification = async (req, res) => {
  const { productIds, userid } = req.body;
  try {
    const user = await User.findById(userid);
    const notificationSender = async (productId)=>{
      const product = await Product.findById(productId);
      const manufacturer  = await User.findById(product.user)
      const message = JSON.stringify({
        tokens: manufacturer.fbToken || "",
        notification: {
          "body": "Your order is successfully placed!",
          "title": "Order Successful!!"
        },
        webpush: {
          notification: {
            "body": "Your order is successfully placed!",
            "title": "Order Successful!!"
          },
         
        },
        data: {
          mutable_content: "1", // Use this to allow displaying image in notification
        },
  
        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
          fcm_options: {},
        },
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
        console.log(error);
      });
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


module.exports.notification = notification;
