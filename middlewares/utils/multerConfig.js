let multer = require("multer");

function multerConfig(path, name){
    let diskStorage = multer.diskStorage({
        destination: (req, file, callback) => {
          // Định nghĩa nơi file upload sẽ được lưu lại
          callback(null, path);
        },
        filename: (req, file, callback) => {
        // Kiểm tra ext 
          let math = ["image/png", "image/jpeg", "image/jpg"];
          if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg, png, jpg.`;
            return callback(errorMess, null);
          }
       
          // đổi file name
          let filename = `${name}-${Date.now()}-${file.originalname}`;
          callback(null, filename);
        }
      });
    
      return multer({storage: diskStorage}).single("file")
}

module.exports = multerConfig