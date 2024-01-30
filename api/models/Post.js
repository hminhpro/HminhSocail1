const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type:String,
            require: true,
        },
        desc: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },

    },
{timestamps: true} //tùy chọn timestamps giúp theo dõi thời gian tạo và cập nhật của đối tượng thời gian tài khoản được tạo hay cập nhật các thông tin sẽ đc ghi lại 
);
module.exports = mongoose.model("Post", PostSchema);//xuất mô hình người dùng(User) đã định nghĩa ở file này để sử dụng ở nơi khác