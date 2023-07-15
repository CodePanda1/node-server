const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const Result = require('./tools/result')


// 使用 Express 创建网络服务
const app = express()
app.use(cors())
app.use(express.json())
app.listen(9090, () => {
   console.log(Result.nowTime(),'服务启动，端口：9090')
})

// 连接 MySQL
const mysqlConfig = {
   host: '127.0.0.1',
   user: 'user',
   password: 'password',
   port: '3306',
   database: 'database-name',
   connectTimeout: 5000,
   multipleStatements: false,
}
const mysqlConn = mysql.createConnection(mysqlConfig)
mysqlConn.connect((err) => {
   if (err) {
      console.error(Result.nowTime(),'连接MySQL数据库错误: ', err)
      return
   }
   console.log(Result.nowTime(),'连接MySQL数据库成功')
})

// GET 查询列表
app.get('/get-list', (req, res) => {
   mysqlConn.query('SELECT * FROM data', (err, result) => {
      if (err) {
         res.status(500).json(Result.error('GET查询数据发生错误'))
         return
      }
      res.json(Result.ok('GET查询数据成功', result))
   })
})

// GET 查询分页列表
app.get('/get-page', (req, res) => {
   const page = parseInt(req.query.page) // 从查询参数中获取页码
   const pageSize = parseInt(req.query.pageSize) // 从查询参数中获取每页数据量
   const offset = (page - 1) * pageSize // 计算偏移量

   const query = 'SELECT * FROM data LIMIT ?, ?'
   mysqlConn.query(query, [offset, pageSize], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('分页查询数据发生错误'))
         return
      }
      res.json(Result.ok('分页查询数据成功', result))
   })
})

// GET 根据ID查询数据
app.get('/get-id/:id', (req, res) => {
   const id = req.params.id // 从请求的路径参数中获取 ID 值
   const query = 'SELECT * FROM data WHERE id = ?'
   mysqlConn.query(query, [id], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('根据ID查询数据时发生错误'))
         return
      }
      if (result.length === 0) {
         res.json(Result.ok('未找到匹配的数据', {}))
         return
      }
      res.json(Result.ok('根据ID查询成功', result[0]))
   })
})


// GET 将数据插入数据库
app.get('/get-insert', (req, res) => {
   const content = req.query.content // 从请求的查询参数中获取 content 值
   const query = 'INSERT INTO data (content) VALUES (?)'
   mysqlConn.query(query, [content], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('GET插入数据时发生错误'))
         return
      }
      res.json(Result.ok('GET插入数据成功'))
   })
})

// POST 将数据插入数据库
app.post('/post-insert', (req, res) => {
   const content = req.body.content.toString() // 从请求的 JSON 数据中获取 content 值

   // 将数据插入数据库
   const query = 'INSERT INTO data (content) VALUES (?)'
   mysqlConn.query(query, [content], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('POST插入数据时发生错误'))
         return
      }
      res.json(Result.ok('POST插入数据成功'))
   })
})

// GET 根据ID删除数据
app.get('/get-delete/:id', (req, res) => {
   const id = req.params.id // 从请求的路径参数中获取 ID 值
   const query = 'DELETE FROM data WHERE id = ?'
   mysqlConn.query(query, [id], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('根据ID删除数据时发生错误'))
         return
      }
      if (result.affectedRows === 0) {
         res.json(Result.ok('未找到匹配的数据', {}))
         return
      }
      res.json(Result.ok('根据ID删除成功'))
   })
})

// GET 根据ID修改数据
app.get('/get-update/:id/:content', (req, res) => {
   const id = req.params.id // 从请求的路径参数中获取 ID 值
   const content = req.params.content // 从请求的查询参数中获取 content 值
   const query = 'UPDATE data SET content = ? WHERE id = ?'
   mysqlConn.query(query, [content, id], (err, result) => {
      if (err) {
         res.status(500).json(Result.error('根据ID修改数据时发生错误'))
         return
      }
      if (result.affectedRows === 0) {
         res.json(Result.ok('未找到匹配的数据', {}))
         return
      }
      res.json(Result.ok('根据ID修改成功'))
   })
})
