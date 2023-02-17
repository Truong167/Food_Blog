require('dotenv').config()

const  handleImage = file => {
    let img = `http://localhost:${process.env.PORT}/image/no_avatar.png`
    if(file){
        img = new Buffer(file, 'base64').toString('binary')
    }
    return img
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
})



module.exports = {
    handleImage,
    toBase64
}