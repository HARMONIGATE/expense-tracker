import { profile } from "console";

export const environment = {
    production: true,
    baseurl:'protocol://host:port',
    userid:'integrationServerUserID',
    password:'integrationServerPassword',

    //image kit API details
    imageKitApiUrl:'https://upload.imagekit.io/api/v1/files/upload',
    imageKitUserId:'ImageKitPrivateKey',
    imageKitUserPass:'ImageKitPublicKey',
    imageKitFolder:'MoneyTracker',

    //Sign up otp url
    signupOtpUrl:'/restV2/HG_MoneyTracker.SendOTP.provider:sendOTP/sendOTP',
    registerUserUrl:'/restV2/HG_MoneyTracker.RegisterUser.provider:registerUser/registerUser',
    loginUserURL:'/restV2/HG_MoneyTracker.LogInUser.provider:logInUser/logInUser',
    forgetPassOTP:'/restV2/HG_MoneyTracker.ForgetPassword.provider:forgetPassword/sendOTP',
    forgetPass:'/restV2/HG_MoneyTracker.ForgetPassword.provider:forgetPassword/forgetPassword',
    profileUpdate:'/restV2/HG_MoneyTracker.UpdateProfileUrl.provider:updateProfileUrl/updateProfileUrl',

    //category
    getCategory:'/restV2/HG_MoneyTracker.Category.provider:category/getCategory',
    createCategory:'/restV2/HG_MoneyTracker.Category.provider:category/createCategory',
    deleteCategory:'/restV2/HG_MoneyTracker.Category.provider:category/deleteCategory',
    addTransaction:'/restV2/HG_MoneyTracker.Transactions.provider:transactions/insertTransaction',
    getTransaction:'/restV2/HG_MoneyTracker.Transactions.provider:transactions/getTransactions',
    deleteTransaction:'/restV2/HG_MoneyTracker.Transactions.provider:transactions/deleteTransaction',

    dashBoardInfo:'/restV2/HG_MoneyTracker.Dashboard.provider:getDashboardInfo/getDashboardInfo'

  };