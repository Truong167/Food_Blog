
const db = require('../models/index')

class followController {
    index = (req, res) => {
        res.send('follow')
    }

    handleCreateFollow = async (req, res) => {
        try {
            let { userIdFollow, userIdFollowed } = req.params
            let user = await db.User.findByPk(userIdFollowed)
            if(user) {
                let follow = await db.Follow.create({
                    userIdFollow: userIdFollow,
                    userIdFollowed: userIdFollowed,
                    isSeen: false
                })
                res.status(200).json({
                    success: true,
                    message: 'Successfully',
                    data: follow
                })
                return
            }
            res.status(400).json({
                success: false, 
                message: 'User not found',
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
            })
        }
    }

    handleDeleteFollow = async (req, res) => {
        try {
            let { userIdFollow, userIdFollowed } = req.params
            let follow = await db.Follow.findOne({
                where: {
                    userIdFollow: userIdFollow, 
                    userIdFollowed: userIdFollowed,
                }
            })
            if(follow) {
                let followData = await follow.destroy()
                res.status(200).json({
                    success: true, 
                    message: 'Successfully',
                    data: followData
                })
                return
            }
            res.status(400).json({
                success: false, 
                message: 'Follow not found',
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
            })
        }
    }

}


module.exports = new followController