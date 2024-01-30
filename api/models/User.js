const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({//nhập phương thức Schema từ thư viện mongoose giúp định nghĩa lược đồ người dùng
    username:{//đây là trường schema đại diện tên người dùng
        type:String, //kiểu dữ liệu của tên 
        require: true,//bắt buộc k để trống
        min: 3,//ít nhất 3 ký tự 
        max: 20,//nhiều nhất 20 ký tự
        unique: true//tên p là duy nhất
    },
    email:{
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required:true,
        min:6,
    },
    profilePicture:{
        type: String,
        default: " "
    },
    coverPicture: {
        type:String,
        default:""
    },
    followers: {
        type:Array,
        default:[]
    },
    followings: {
        type:Array,
        default:[]
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }, 
    desc: {
        type:String,
        max: 50
    },
    city: {
        type: String,
        max:50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3]
    }
},
{timestamps: true} //tùy chọn timestamps giúp theo dõi thời gian tạo và cập nhật của đối tượng thời gian tài khoản được tạo hay cập nhật các thông tin sẽ đc ghi lại 
);

module.exports = mongoose.model("User", UserSchema);//xuất mô hình người dùng(User) đã định nghĩa ở file này để sử dụng ở nơi khác