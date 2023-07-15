function nowTime() {
   const date = new Date()
   const year = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')
   const day = String(date.getDate()).padStart(2, '0')
   const hours = String(date.getHours()).padStart(2, '0')
   const minutes = String(date.getMinutes()).padStart(2, '0')
   const seconds = String(date.getSeconds()).padStart(2, '0')

   return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}:`
}

function ok(message, data) {
   console.log(nowTime(), message)
   return {
      code: 200,
      message: message,
      data: data,
   }
}

function error(message) {
   console.log(nowTime(), message)
   return {
      code: 500,
      message: message,
   }
}

module.exports = {
   ok,
   error,
   nowTime,
}
