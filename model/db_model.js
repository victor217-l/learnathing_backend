var pool = require('../model/db_connect');

var signup = (username,email, password,emailstatus) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into signup(`username`,`email`,`password`,`email_status`) values(?,?,?,?)", [username,email,password,emailstatus], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status : true, data:rows})
                }
            })
        })
    })

}

var verifyemail = (username,email,token) =>{
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query('insert into verify(`username`,`email`,`token`) values (?,?,?)', [username,email,token], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })

}

var insertinform = (email,userinform) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into userinformation(`email`,`userinform`) values(?,?)", [email,userinform], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var matchtoken = (id,token) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from verify where id = ? and token = ?", [id,token], async (err,rows) => {
                connection.release()
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }

            })
        })
    })
}

var updatesignup = (email,emailstatus) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("update signup set email_status = ? where email = ?", [emailstatus,email], async (err,rows) => {
                connection.release();
                if(err){
                    console.log(err)
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var getuserid = (email) => {
    return new Promise((resolve,resject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from verify where email = ?", [email], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var getuserlogin = (email,password) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query('select * from signup where email = ? and password = ?', [email,password], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    }) 
}


// forpost 

var insertpost = (username,postname,title) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into post(`username`,`postname`,`title`) values(?,?,?)", [username,postname,title], async (err,rows) => {
                connection.release();
                if(err){
                    console.log(err)
                    return resolve({status: false})
                    
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var getallpost = () => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from post", async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var getuserpost = (username) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from post where username = ?", [username], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })

        })
    })
}

var userpostname = (usernamepost,username) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into usernamepost(`userpost`,`username`) values(?,?)", [usernamepost,username], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var seeuserpost = (user_id) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from post where user_id = ?", [user_id], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}



var sendcomment = (comment, post_id,person_id) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into comment(`comment`,`person_uid`,`post_id`) values(?,?,?)", async (err,rows) => {
                connection.release();
                if(err) {
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }
            })
        })
    })
}

var seeallcomment = () => {}

module.exports = {
    signup,
    insertinform,
    getuserlogin,
    verifyemail,
    getuserid,
    matchtoken,
    updatesignup,
    insertpost,
    getallpost,
    getuserpost,
    userpostname,
    sendcomment,
    seeallcomment,
    seeuserpost,

}