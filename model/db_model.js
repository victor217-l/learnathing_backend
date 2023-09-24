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

var insertinform = (email,userinformcategory1,userinformcategory2) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into userinformation(`email`,`userinformcategory`,`userinformcategory2`) values(?,?,?)", [email,userinformcategory1,userinformcategory2], async (err,rows) => {
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

var insertpost = (username,user,postname,title,category) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into post(`username`,`user_id`,`postname`,`title`,`category`) values(?,?,?,?,?)", [username,user,postname,title,category], async (err,rows) => {
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

var usereel = () => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from post order by date asc", async (err,rows) => {
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

var getcategory  = (email) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from userinformation where email = ?", [email], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data: rows})

                }
            })
        })
    })
}


var usehome = () => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from post order by date desc", async (err,rows) => {
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

var uservideostosee = (category) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err)  throw err;
            connection.query("select * from post where category = ?", [category], async (err, rows) => {
                connection.release()
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

var searchvideo = (key) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query('select * from post where title like "%' + key  +'%" ', async (err,rows) => {
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
            connection.query("insert into comment(`comment`,`username`,`person_uid`,`post_id`) values(?,?,?)", async (err,rows) => {
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

var seeallcomment = (postid) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("select * from comment where postid = ?",[postid], async (err,rows) => {
                connection.release();
                if(err){
                    return resolve({status: false})
                }else{
                    return resolve({status: true, data:rows})
                }

            } )
        })
    })
}

// const [rows] = await connection.query(
//     'SELECT * FROM user_likes WHERE user_id = ? AND liked_user_id = ?',
//     [user_id, liked_user_id]
//   );

//   if (rows.length === 0) {
//     // User hasn't liked the target user yet, insert a like record
//     await connection.query(
//       'INSERT INTO user_likes (user_id, liked_user_id, liked) VALUES (?, ?, true)',
//       [user_id, liked_user_id]
//     );
//     res.json({ message: 'Liked user successfully.' });
var toseeifalreadylike  = (user_id,liked_post_id) => {
    return new Promise(async(resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query('select * from `like` where user_id = ? AND  likee_post_id = ?', [user_id,liked_post_id], async (err,rows) => {
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

var insertintolike = (user_id,liked_post_id,like) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("insert into `likee`(`user_id`,`likee_post_id`,`likee`) values(?,?,?)", [user_id,liked_post_id,like], async (err,rows) => {
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
 
var removecolumn = (user_id,liked_post_id) => {
    return new Promise((resolve,reject) => {
        pool.getConnection(async(err,connection) => {
            if(err) throw err;
            connection.query("Delete from `likee` where user_id = ? and likee_post_id = ?", [user_id,liked_post_id,like], async (err,rows) => {
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
    uservideostosee,
    searchvideo,
    usereel,
    usehome,
    getcategory,
    toseeifalreadylike,
    insertintolike,
    removecolumn,

}