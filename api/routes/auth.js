const router = require("express").Router();/*gọi phương thức Router() trong thư viện express giúp định nghĩa các tuyến đường
 và đặt cho biến routes để định nghĩa tuyến đường và xử lý các yêu cầu HTTP*/
const User = require("../models/User");
const bcrypt = require("bcrypt") //nhập thư viện bcrypt - dùng để băm mật khẩu giữ an toàn để lưu trữ trong cơ sở dữ liệu

 //REGISTER
router.post("/register", async (req, res) => {//1 tuyến đường route POST giúp xử lý những yêu cầu POST từ phía client tới đường dẫn "/register"
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);//hàm này sinh một giá trị ngẫu nhận đối số là cost factor và sau đó thêm vào để băm cùng mật khẩu ban đầu
        const hashedPassword = await bcrypt.hash(req.body.password, salt);//băm mật khẩu cùng với giá trị salt vừa sinh để lưu vào cơ sở dữ liệu
        
        //create new user
        const newUser = new User({//tạo một đối tượng người dùng mới với dữ liệu được lấy từ thuộc tính của yêu cầu req.body
            username: req.body.username,//lấy giá trị trường username từ yêu cầu HTTP, req.body là một đối tượng chứa dữ liệu được gửi từ phần thân (body) của yêu cầu POST
            email: req.body.email,
            password: hashedPassword,
        })

        //save user and respond
        const user = await newUser.save();//lưu đối tượng bằng phương thức save của mongoose, thành công sẽ trả vè một đối tượng JSON chứa thông tin người dùng đã đky và một phản hồi thành công với ngừi dùng mã 200
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)//trong trường hợp có lỗi sever sẽ in ra lỗi
    }
});

//LOGIN
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });//dùng phương thức findOne của Mongoose để tìm người dùng dựa trên địa chỉ mail được gửi trog yêu cầu đăng nhập req.body.email, nếu người dùng tồn tại lưu thông tin trên csdl vào biến user, không thì là null
        !user && res.status(404).json("User not found");//kiểm tra nếu không tìm thấy user trong csdl thì trả về mã 404 và 1 thông báo JSON "User not found"
    
        const validPassword = await bcrypt.compare(req.body.password, user.password)//dùng phương thức compare so sánh mk được gửi lên từ phần body của yêu cầu post với mk của user lưu trong csdl
        !validPassword && res.status(400).json("wrong password")//nếu sai mk thì trả về mã 404 kèm lời nhắn wrong password 

        res.status(200).json(user)//trả về mã 200 tương ứng với đăng nhập thành công và trả về json các thông tin của user trong csdl
    
    } catch (err) {//nếu xảy ra lỗi trong quá trình tìm kiếm người dùng in lỗi ra console
        res.status(500).json(err)
    }
 
});

module.exports = router;//export đối tượng router để có thể sử dụng ở nơi khác trong ứng dụng 