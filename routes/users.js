const tableUsers = require('@/sequelize/user/index.js')
const router = require('koa-router')()
const { Op } = require('sequelize')

router.prefix('/users')

// 获取用户信息列表
router.get('/', async (ctx, next) => {
  try {
    const users = await tableUsers.findAll()

    ctx.body = {
      code: 0,
      data: users.map(user => user.toJSON()),
      msg: ""
    }

  }
  catch (err) {
    console.log(err)
    ctx.body = {
      code: -1,
      data: null,
      msg: err
    }
  }
})

// 获取某一个用户信息数据
router.get('/find/one', async (ctx, next) => {
  try {
    const { query } = ctx.request;
    const keys = ["userId", "email"];

    const params = {
      userId: 1,
    }

    const user = await tableUsers.findOne({ where: params })

    console.log(user.toJSON())

    if (user) {
      ctx.body = {
        code: 0,
        data: user.toJSON(),
        msg: ""
      }
    } else {
      ctx.body = {
        code: -1,
        data: '未找到符合条件的用户'
      }
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      data: err
    }
  }
})

// 创建用户信息
router.post('/', async (ctx, next) => {
  const { body } = ctx.request;
  const keys = ['userName', 'password', 'email'];

  try {
    const user = await tableUsers.create({

    })

    ctx.body = {
      code: 0,
      data: user.toJSON(),
      msg: '创建成功'
    };
  }
  catch (err) {
    ctx.body = {
      code: -1,
      msg: err
    }
  }
})

// 修改用户信息
router.put('/', async (ctx, next) => {
  const { body } = ctx.request;
  const keys = ['userId', 'userName', 'password', 'email'];

  try {
    const num = await tableUsers.update({}, { where: { userId: body.userId } })

    if (num)
      ctx.body = {
        code: 0,
        msg: '更新成功'
      }
    else
      ctx.body = {
        code: -1,
        msg: '更新失败'
      }
  }
  catch (err) {
    ctx.body = {
      code: -1,
      msg: err
    }
  }
})

// 删除用户信息
router.delete('/', async (ctx, next) => {
  const { ids } = ctx.request.query

  const idArray = ids.split(',')

  try {
    await tableUsers.destroy({
      where: {
        userId: {
          [Op.in]: idArray
        }
      }
    })

    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
  }
  catch (err) {
    ctx.body = {
      code: -1,
      msg: '删除失败'
    }
  }
})

module.exports = router
