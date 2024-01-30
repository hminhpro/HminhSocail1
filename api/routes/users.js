const User = require("../models/User")
const router = require("express").Router();/*gọi phương thức Router() trong thư viện express giúp định nghĩa các tuyến đường
 và đặt cho biến routes để định nghĩa tuyến đường và xử lý các yêu cầu HTTP*/
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => { //định nghĩa tuyến đường HTTP PUT để người dùng có thể truy cập bằng cách sự dụng id của mình vd: /user/123 và cập nhật thông tin
    if (req.body.userId === req.params.id || req.body.isAdmin) {//kiểm tra nếu userID trong yêu cầu người dùng gửi hoặc người dùng đang có quyền quản trị trùng với id trên đường dẫn thì nguwiof dùng được phép update
        if (req.body.password) {//nếu trong yêu cầu update req.body có mk thì băm mk mới này trước khi cập nhật 
            try {
                const salt = await bcrypt.genSalt(10); 
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {//phương thức findByIdAndUpdate là một phương thức của thư viên Mongoose sử dụng để tìm và cập nhật tài nguyên trong csdl , req.params.id là một giá trị ID tài nguyên cần cập nhật lấy từ yêu cầu người dùng, tham số thứ hai của phương thức là dự liệu cập nhật
                $set: req.body,//đây và dữ liệu cập nhật của người dùng trong phần thân yêu cầu, $set là toạn tử chỉ định các trường cập nhật
            });
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");//nếu id người dùng không trùng khớp trả vè JSON bạn không được cập nhật
    }
})

//delete user
router.delete("/:id", async (req, res) => { //định nghĩa tuyến đường xử lý yêu cầu DELETE đối với người dùng
    if (req.body.userId === req.params.id || req.body.isAdmin) {//kiểm tra nếu userID trong yêu cầu người dùng gửi hoặc người dùng đang có quyền quản trị trùng với id trên đường dẫn thì nguwiof dùng được phép xóa
        try {
            await User.findByIdAndDelete(req.params.id);//tìm và xóa người  dùng từ cơ sở dữ liệu dựa trên ID truyền vào
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");//nếu id người dùng không trùng khớp trả vè JSON bạn không được xóa
    }
})
//get a user
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err);
    }
});

//follow a user
 router.put("/:id/follow", async (req, res) => { //sử dụng yêu cầu put để cập nhật thoong tin follow cho người dùng
    if (req.body.userId !== req.params.id) {//nếu userId của người dùng hiện tại lấy tại phần body của yêu cầu HTTP khác với id của người đang được tìm kiếm có trên đường dẫn thì thực hiện follow còn không thì hiển thị bạn không thể fl chính mình
        try {
            const user = await User.findById(req.params.id);//sử dụng findById tìm người mà người dùng hiện tại muốn fl và lưu vào biến user 
            const currentUser = await User.findById(req.body.userId);//lấy luôn cả thông tin người dùng hiện tại và lưu vào currentUser để thay đổi số flwing
            if (!user.followers.includes(req.body.userId)) {//nếu trong danh sách người đã fl của ngừi kia ck có mình thì thực hiện fl còn k thì trả về bạn đã fl người này rồi 
                await user.updateOne({ $push: { followers: req.body.userId }});//sử dụng updateOne để cập nhật một hoặc nhiều bản ghi trong cơ sở dữ liệu, sau đó sử dụng $push để thêm mới vào mảng followers của người được tìm kiếm đồng thời thêm userId của người dùng hiện tại vào danh sách người fl họ 
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself")
    }
 })

//unfollow a user
 router.put("/:id/unfollow", async (req, res) => { //sử dụng yêu cầu put để cập nhật thoong tin follow cho người dùng
    if (req.body.userId !== req.params.id) {//nếu userId của người dùng hiện tại lấy tại phần body của yêu cầu HTTP khác với id của người đang được tìm kiếm có trên đường dẫn thì thực hiện follow còn không thì hiển thị bạn không thể fl chính mình
        try {
            const user = await User.findById(req.params.id);//sử dụng findById tìm người mà người dùng hiện tại muốn fl và lưu vào biến user 
            const currentUser = await User.findById(req.body.userId);//lấy luôn cả thông tin người dùng hiện tại và lưu vào currentUser để thay đổi số flwing
            if (user.followers.includes(req.body.userId)) {//nếu trong danh sách người đã fl của ngừi kia ck có mình thì thực hiện fl còn k thì trả về bạn đã fl người này rồi 
                await user.updateOne({ $pull: { followers: req.body.userId }});//sử dụng updateOne để cập nhật một hoặc nhiều bản ghi trong cơ sở dữ liệu, sau đó sử dụng $push để thêm mới vào mảng followers của người được tìm kiếm đồng thời thêm userId của người dùng hiện tại vào danh sách người fl họ 
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you dont follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfollow yourself")
    }
 })
module.exports = router;//export đối tượng router để có thể sử dụng ở nơi khác trong ứng dụng 